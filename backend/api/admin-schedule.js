/**
 * API Endpoint: GET /api/admin-schedule and POST/PUT /api/admin-schedule
 * Clinical Administrator Schedule Management
 * - Set master consultation slots
 * - Set clinic working days (e.g. Mon-Sat)
 * - Block / unblock whole dates (holidays, personal off days)
 * - Block / unblock individual slots on specific dates
 */

import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  const method = req.method.toUpperCase();

  // GET: Public or admin can view the schedule structure
  if (method === 'GET') {
    try {
      const schedule = await db.getClinicSchedule();
      return res.status(200).json({
        success: true,
        schedule
      });
    } catch (err) {
      console.error('Error fetching clinic schedule:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // POST or PUT: Protected Admin updates
  if (method === 'POST' || method === 'PUT') {
    try {
      const session = auth.getUserFromRequest(req);
      if (!session || !auth.isAdmin(session)) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Clinical Administrator clearance required.'
        });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
        }
      }

      const currentSchedule = await db.getClinicSchedule();

      // We support either full schedule update or discrete actions:
      // action: 'block_date' | 'unblock_date' | 'block_slot' | 'unblock_slot' | 'update_full'
      const { action } = body || {};

      let updatedSchedule = { ...currentSchedule };

      if (action === 'block_date') {
        const { date, reason } = body;
        if (!date) return res.status(400).json({ success: false, error: 'Date is required' });
        const blockedList = (updatedSchedule.blockedDates || []).filter(bd => {
          const bDate = typeof bd === 'string' ? bd : bd.date;
          return bDate !== date;
        });
        blockedList.push({
          date: date.trim(),
          reason: (reason || 'Clinic closed / Doctor on leave').trim(),
          createdAt: new Date().toISOString()
        });
        updatedSchedule.blockedDates = blockedList;
      } else if (action === 'unblock_date') {
        const { date } = body;
        if (!date) return res.status(400).json({ success: false, error: 'Date is required' });
        updatedSchedule.blockedDates = (updatedSchedule.blockedDates || []).filter(bd => {
          const bDate = typeof bd === 'string' ? bd : bd.date;
          return bDate !== date.trim();
        });
      } else if (action === 'block_slot') {
        const { date, slot } = body;
        if (!date || !slot) return res.status(400).json({ success: false, error: 'Date and slot are required' });
        const dateKey = date.trim();
        const slotKey = slot.trim();
        const customBlocked = { ...(updatedSchedule.customBlockedSlots || {}) };
        const existingSlots = customBlocked[dateKey] || [];
        if (!existingSlots.includes(slotKey)) {
          customBlocked[dateKey] = [...existingSlots, slotKey];
        }
        updatedSchedule.customBlockedSlots = customBlocked;
      } else if (action === 'unblock_slot') {
        const { date, slot } = body;
        if (!date || !slot) return res.status(400).json({ success: false, error: 'Date and slot are required' });
        const dateKey = date.trim();
        const slotKey = slot.trim();
        const customBlocked = { ...(updatedSchedule.customBlockedSlots || {}) };
        if (customBlocked[dateKey]) {
          customBlocked[dateKey] = customBlocked[dateKey].filter(s => s !== slotKey);
          if (customBlocked[dateKey].length === 0) {
            delete customBlocked[dateKey];
          }
        }
        updatedSchedule.customBlockedSlots = customBlocked;
      } else {
        // Full update
        if (body.workingDays && Array.isArray(body.workingDays)) {
          updatedSchedule.workingDays = body.workingDays;
        }
        if (body.defaultSlots && Array.isArray(body.defaultSlots)) {
          updatedSchedule.defaultSlots = body.defaultSlots.filter(s => typeof s === 'string' && s.trim());
        }
        if (body.blockedDates && Array.isArray(body.blockedDates)) {
          updatedSchedule.blockedDates = body.blockedDates;
        }
        if (body.customBlockedSlots && typeof body.customBlockedSlots === 'object') {
          updatedSchedule.customBlockedSlots = body.customBlockedSlots;
        }
      }

      const saved = await db.updateClinicSchedule(updatedSchedule);

      return res.status(200).json({
        success: true,
        message: 'Clinic schedule and slot availability updated successfully.',
        schedule: saved
      });
    } catch (err) {
      console.error('Error updating clinic schedule:', err);
      return res.status(500).json({ success: false, error: 'Internal server error updating schedule' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
