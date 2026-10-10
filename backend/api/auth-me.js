/**
 * Serverless Function: Get Current Authenticated User Profile
 * Endpoint: GET /api/auth-me
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
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const user = await db.findUserById(session.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
