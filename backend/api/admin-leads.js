import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  // Allow CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const session = auth.getUserFromRequest(req);
    if (!session || !auth.isAdmin(session)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Clinical Admin clearance required.'
      });
    }

    if (req.method === 'GET') {
      const leads = await db.getAssessmentLeads();
      return res.status(200).json({
        success: true,
        count: leads.length,
        leads
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { id, followUpStatus, notes, status } = req.body || {};
      if (!id) {
        return res.status(400).json({ success: false, error: 'Lead ID is required.' });
      }

      const updateData = {};
      if (followUpStatus !== undefined) updateData.followUpStatus = followUpStatus;
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;

      const updated = await db.updateAssessmentLeadStatus(id, updateData);
      return res.status(200).json({
        success: true,
        lead: updated
      });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Admin leads API error:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
