/**
 * Serverless Function: Get Authenticated Client's Bookings
 * Endpoint: GET /api/my-bookings
 */

import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const session = auth.getUserFromRequest(req);
    if (!session || !session.userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const bookings = await db.getBookingsByUser(session.userId, session.email);

    // Sanitize output for client (hide raw internal admin diagnostic calculations)
    const clientSafeBookings = (bookings || []).map(b => ({
      id: b.id || b._id,
      status: b.status || 'confirmed',
      service: b.service || b.serviceTitle || b.serviceName || 'Comprehensive Clinical Consultation (60 min)',
      serviceTier: b.serviceTier || b.serviceName || 'Comprehensive Consultation',
      amount: b.amount || b.servicePrice || 2999,
      date: b.date || b.bookingDate || 'Scheduled',
      timeSlot: b.timeSlot || b.time || b.bookingTime || '10:00 AM',
      bookingDate: b.date || b.bookingDate,
      bookingTime: b.timeSlot || b.time || b.bookingTime,
      paymentStatus: b.paymentStatus || 'paid',
      paymentId: b.paymentId,
      questionnaireStatus: b.questionnaireStatus || (b.questionnaireData ? 'completed' : 'pending'),
      questionnaireSubmitted: Boolean(b.questionnaireStatus === 'completed' || b.questionnaireData),
      questionnaireData: b.questionnaireData || null,
      clinicalStatus: b.clinicalStatus || (b.status === 'confirmed' ? 'confirmed' : 'pending'),
      meetingLink: b.meetingLink || null,
      adminNotes: b.publicAdvice || b.adminNotes || null,
      createdAt: b.createdAt
    }));

    return res.status(200).json({
      success: true,
      bookings: clientSafeBookings
    });
  } catch (error) {
    console.error('My bookings error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
