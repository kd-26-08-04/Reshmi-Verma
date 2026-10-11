/**
 * API Endpoint: GET /api/available-slots
 * Queries clinical slot availability for a specified appointment date.
 * Takes into account:
 * 1. Admin defined master slots
 * 2. Admin blocked dates (holidays, personal off days)
 * 3. Working days of week
 * 4. Specific slots blocked by Admin on this date
 * 5. Already booked & confirmed consultations (prevents double-booking)
 */

import { db } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const dateStr = (req.query.date || '').trim();

    if (!dateStr) {
      return res.status(400).json({
        success: false,
        error: 'Date query parameter (YYYY-MM-DD) is required.'
      });
    }

    // Retrieve clinic schedule configuration & active bookings
    const schedule = await db.getClinicSchedule();
    const existingBookings = await db.getBookingsByDate(dateStr);

    // 1. Check if date is specifically blocked by Admin
    const isDateBlockedByAdmin = (schedule.blockedDates || []).some(bd => {
      const bDate = typeof bd === 'string' ? bd : bd.date;
      return bDate === dateStr;
    });

    const blockReasonObj = (schedule.blockedDates || []).find(bd => {
      const bDate = typeof bd === 'string' ? bd : bd.date;
      return bDate === dateStr;
    });
    const blockReason = blockReasonObj && typeof blockReasonObj === 'object' 
      ? blockReasonObj.reason 
      : 'Clinician is unavailable on this selected date.';

    // 2. Check day of week (0 = Sunday, 1 = Monday, etc.)
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = isNaN(dateObj.getTime()) ? null : dateObj.getDay();
    const isDayOff = schedule.workingDays && Array.isArray(schedule.workingDays) && dayOfWeek !== null
      ? !schedule.workingDays.includes(dayOfWeek)
      : false;

    const isDateBlocked = isDateBlockedByAdmin || isDayOff;
    const finalDateReason = isDateBlockedByAdmin 
      ? blockReason 
      : (isDayOff ? 'The clinic is closed on this day of the week.' : null);

    // 3. Process each master slot
    const masterSlots = schedule.defaultSlots || [
      '10:00 AM - Morning Slot',
      '11:30 AM - Morning Slot',
      '02:30 PM - Afternoon Slot',
      '04:00 PM - Afternoon Slot',
      '06:00 PM - Evening Slot'
    ];

    const customBlockedForDate = schedule.customBlockedSlots?.[dateStr] || [];

    const slots = masterSlots.map(slot => {
      if (isDateBlocked) {
        return {
          slot,
          available: false,
          status: 'date_blocked',
          reason: finalDateReason
        };
      }

      // Check if slot specifically blocked on this date
      if (customBlockedForDate.includes(slot)) {
        return {
          slot,
          available: false,
          status: 'admin_blocked',
          reason: 'Slot blocked by clinician for this date.'
        };
      }

      // Check if already booked
      const booking = existingBookings.find(b => {
        const bookedSlot = (b.timeSlot || b.bookingTime || '').trim().toLowerCase();
        return bookedSlot === slot.trim().toLowerCase();
      });

      if (booking) {
        return {
          slot,
          available: false,
          status: 'booked',
          reason: 'This slot is already booked by another client.'
        };
      }

      return {
        slot,
        available: true,
        status: 'available',
        reason: null
      };
    });

    const hasAvailableSlot = slots.some(s => s.available);

    return res.status(200).json({
      success: true,
      date: dateStr,
      isDateBlocked,
      blockReason: finalDateReason,
      slots,
      hasAvailableSlot
    });
  } catch (error) {
    console.error('Available slots error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error calculating clinical slot availability.'
    });
  }
}
