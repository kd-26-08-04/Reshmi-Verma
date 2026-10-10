/**
 * API Endpoint: GET /api/pricing-tiers
 * Public endpoint to fetch active consultation tiers & fees
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
    const tiers = await db.getPricingTiers();
    return res.status(200).json({
      success: true,
      tiers: tiers || []
    });
  } catch (error) {
    console.error('Fetch pricing tiers error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
