/**
 * Serverless Function: Get All Bookings with Clinical Diagnostics (Admin Only)
 * Endpoint: GET /api/admin-bookings
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
    if (!session || !auth.isAdmin(session)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Clinical Admin clearance required.'
      });
    }

    const bookings = await db.getAllBookings();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Admin bookings error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
