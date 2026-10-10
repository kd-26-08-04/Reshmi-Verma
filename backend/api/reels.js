/**
 * API Endpoint: GET /api/reels
 * Public endpoint to fetch active Instagram reels
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
    const reels = await db.getReels();
    return res.status(200).json({
      success: true,
      reels: reels || []
    });
  } catch (error) {
    console.error('Fetch reels error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
