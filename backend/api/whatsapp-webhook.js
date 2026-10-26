/**
 * Meta WhatsApp Webhook Endpoint for HealthwithReshmi™
 * 
 * Handles:
 * 1. GET: Webhook verification challenge from Meta
 * 2. POST: Incoming WhatsApp messages & message status receipts
 */

const META_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'reshmi_wellness_webhook_token_2026';

export default async function handler(req, res) {
  // 1. Meta Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      console.log('✅ Meta WhatsApp Webhook verified successfully!');
      return res.status(200).send(challenge);
    }
    console.warn('⚠️ Meta Webhook verification failed. Token mismatch.');
    return res.status(403).send('Verification token mismatch');
  }

  // 2. Incoming Messages & Delivery Receipts (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (body?.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        // Log incoming message for clinic records
        if (value?.messages?.length > 0) {
          const incomingMsg = value.messages[0];
          const fromPhone = incomingMsg.from;
          const textBody = incomingMsg.text?.body || '[Media/Interactive]';
          console.log(`📩 Incoming WhatsApp from ${fromPhone}: ${textBody}`);
        }

        return res.status(200).send('EVENT_RECEIVED');
      }
      return res.status(200).send('EVENT_IGNORED');
    } catch (err) {
      console.error('Meta Webhook error:', err);
      return res.status(200).send('OK');
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
