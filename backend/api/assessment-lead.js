import { db } from './lib/db.js';

export default async function handler(req, res) {
  // Allow CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { id, name, phone, email, source, step, answers, scores, status, bookingId } = req.body || {};

    if (!name && !phone && !email && !id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least a Name or WhatsApp/Phone number.'
      });
    }

    const lead = await db.createOrUpdateAssessmentLead({
      id,
      name,
      phone,
      email,
      source: source || 'welcome_modal',
      step: step || 'Started Assessment',
      answers: answers || {},
      scores: scores || null,
      status: status || 'in_progress',
      bookingId
    });

    return res.status(200).json({
      success: true,
      lead
    });
  } catch (err) {
    console.error('Assessment lead error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record assessment lead.'
    });
  }
}
