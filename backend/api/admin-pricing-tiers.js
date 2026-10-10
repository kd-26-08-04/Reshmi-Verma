/**
 * API Endpoint: POST/PUT /api/admin-pricing-tiers
 * Protected endpoint for Admin to add, update or configure session fees & tiers
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

    const { tiers } = body || {};
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "tiers" array is required.'
      });
    }

    // Sanitize and validate tiers
    const sanitizedTiers = tiers.map((t, idx) => ({
      id: (t.id || `tier_${Date.now()}_${idx}`).toLowerCase().trim(),
      name: (t.name || t.title || 'Consultation Session').trim(),
      title: (t.title || t.name || 'Consultation Session').trim(),
      badge: (t.badge || t.name || 'Clinical Session').trim(),
      duration: (t.duration || '45 Minutes').trim(),
      price: Math.max(1, Number(t.price) || 999),
      desc: (t.desc || '').trim(),
      features: Array.isArray(t.features) ? t.features.filter(f => typeof f === 'string' && f.trim()) : [],
      buttonText: (t.buttonText || `Select Plan (₹${t.price})`).trim(),
      featured: Boolean(t.featured),
      active: t.active !== undefined ? Boolean(t.active) : true
    }));

    const saved = await db.updatePricingTiers(sanitizedTiers);

    return res.status(200).json({
      success: true,
      message: 'Consultation tiers and session fees updated successfully.',
      tiers: saved
    });
  } catch (error) {
    console.error('Update pricing tiers error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
