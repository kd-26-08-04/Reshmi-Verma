/**
 * Serverless Function: Update Booking Status & Internal Clinical Notes (Admin Only)
 * Endpoint: POST /api/admin-update-booking
 */

import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const session = auth.getUserFromRequest(req);
    if (!session || !auth.isAdmin(session)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Clinical Admin clearance required.'
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

    const { bookingId, status, clinicalStatus, adminNotes, meetingLink, updates: nestedUpdates } = body || {};

    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'Missing bookingId' });
    }

    const updates = { ...(nestedUpdates || {}) };
    if (status) updates.status = status;
    if (clinicalStatus) updates.clinicalStatus = clinicalStatus;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    if (updates.status === 'confirmed' && !updates.clinicalStatus) {
      updates.clinicalStatus = 'confirmed';
    }

    const updated = await db.updateBooking(bookingId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Booking record not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Consultation appointment confirmed & synchronized with client portal.',
      booking: updated
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
