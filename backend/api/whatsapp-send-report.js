import { db } from './lib/db.js';
import { whatsappService } from './lib/whatsapp.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { leadId, bookingId, phone, message, isTest } = req.body || {};

    // 1. Direct Test Message
    if (isTest) {
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone number is required for test message.' });
      }
      const config = await db.getWhatsappConfig();
      const testMsg = message || `🌿 *HealthwithReshmi™ Test Alert*\n\nWhatsApp Business connection verified successfully at ${new Date().toLocaleTimeString()}!\nYour automated assessment reports and clinic alerts are ready to send.`;

      const result = await whatsappService.sendRawWhatsAppMessage({
        toPhone: phone,
        message: testMsg,
        config
      });

      return res.status(200).json({
        success: result.success,
        simulated: result.simulated,
        provider: result.provider,
        waUrl: result.waUrl,
        message: result.simulated
          ? 'WhatsApp simulated successfully! (Add Instance ID & Token in Settings to send live)'
          : 'Live WhatsApp message dispatched successfully!',
        error: result.error
      });
    }

    // 2. Dispatch Report for Assessment Lead
    if (leadId) {
      const lead = await db.getAssessmentLeadById(leadId);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Assessment lead record not found.' });
      }

      const sendResult = await whatsappService.sendAssessmentReportToClient(lead);
      return res.status(200).json({
        success: sendResult.success,
        simulated: sendResult.simulated,
        waUrl: sendResult.waUrl,
        message: sendResult.simulated
          ? 'Assessment report preview generated!'
          : 'Assessment report sent to client WhatsApp!',
        error: sendResult.error
      });
    }

    // 3. Dispatch Report for Booking
    if (bookingId) {
      const booking = await db.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking record not found.' });
      }

      const sendResult = await whatsappService.sendAssessmentReportToClient(booking);
      return res.status(200).json({
        success: sendResult.success,
        simulated: sendResult.simulated,
        waUrl: sendResult.waUrl,
        message: sendResult.simulated
          ? 'Assessment report preview generated!'
          : 'Assessment report sent to client WhatsApp!',
        error: sendResult.error
      });
    }

    return res.status(400).json({ success: false, error: 'Please provide either leadId, bookingId, or isTest: true.' });
  } catch (err) {
    console.error('WhatsApp send report error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch WhatsApp message.' });
  }
}
