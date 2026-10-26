import { db } from './lib/db.js';
import { whatsappService } from './lib/whatsapp.js';

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

    // Auto-dispatch assessment report to client WhatsApp if completed and not already sent
    let whatsappResult = null;
    if (scores && (status === 'completed_not_booked' || step?.includes('Completed Assessment'))) {
      try {
        whatsappResult = await whatsappService.sendAssessmentReportToClient(lead);
      } catch (waErr) {
        console.warn('Auto-WhatsApp dispatch notice:', waErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      lead,
      whatsapp: whatsappResult
    });
  } catch (err) {
    console.error('Assessment lead error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record assessment lead.'
    });
  }
}
