/**
 * API Endpoint: POST/PUT /api/admin-reels
 * Protected endpoint for Admin to add, update, or remove Instagram reels
 */

import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST' && req.method !== 'PUT') {
    res.setHeader('Allow', ['POST', 'PUT']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

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

    const { reels } = body || {};
    if (!Array.isArray(reels) || reels.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "reels" array is required.'
      });
    }

    // Sanitize and validate reels
    const sanitizedReels = reels.map((r, idx) => ({
      id: (r.id || `reel_${Date.now()}_${idx}`).trim(),
      title: (r.title || 'Educational Reel').trim(),
      url: (r.url || 'https://www.instagram.com/healthwithreshmi/').trim(),
      image: (r.image || '/assets/images/founder.jpg').trim(),
      views: (r.views || '45K').trim(),
      duration: (r.duration || '0:45').trim(),
      topic: (r.topic || 'Clinical Education').trim()
    }));

    const saved = await db.updateReels(sanitizedReels);

    return res.status(200).json({
      success: true,
      message: 'Instagram Reels updated successfully.',
      reels: saved
    });
  } catch (error) {
    console.error('Update reels error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
