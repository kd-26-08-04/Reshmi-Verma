/**
 * Serverless Function: Create Razorpay Order
 * Endpoint: POST /api/create-order
 * 
 * Security features:
 * - Server-side price enforcement (prevents price tampering from client)
 * - Basic Auth with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
 * - No-store security headers (prevents caching of transaction tokens)
 * - Input sanitization & size truncation
 */

const PRICING_TIERS = {
  discovery: {
    id: 'discovery',
    name: 'Initial Discovery Call (20 min)',
    amount: 99900 // 999 INR in paise
  },
  comprehensive: {
    id: 'comprehensive',
    name: 'Comprehensive Consultation (60 min)',
    amount: 299900 // 2999 INR in paise
  },
  followup: {
    id: 'followup',
    name: 'Follow-Up Check-in (30 min)',
    amount: 149900 // 1499 INR in paise
  }
};

export default async function handler(req, res) {
  // Enforce security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
      }
    }

    const { serviceTier, clientName, clientEmail, clientPhone } = body || {};

    // Validate and enforce pricing on server side (Prevent amount tampering)
    const tier = PRICING_TIERS[serviceTier] || PRICING_TIERS.comprehensive;
    const amount = tier.amount;
    const currency = 'INR';
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live credentials configured
    const isConfigured = keyId && keySecret && !keyId.includes('51234567890abc') && !keySecret.includes('YOUR_RAZORPAY_KEY_SECRET');

    if (isConfigured) {
      // Call official Razorpay Orders API
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const orderPayload = {
        amount,
        currency,
        receipt,
        notes: {
          service: tier.name,
          client_name: (clientName || '').substring(0, 50),
          client_email: (clientEmail || '').substring(0, 50),
          client_phone: (clientPhone || '').substring(0, 20)
        }
      };

      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(orderPayload)
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json().catch(() => ({}));
        console.error('Razorpay Order Error:', errorData);
        return res.status(razorpayResponse.status).json({
          success: false,
          error: errorData.error?.description || 'Failed to create Razorpay order'
        });
      }

      const orderData = await razorpayResponse.json();
      return res.status(200).json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId,
        serviceName: tier.name
      });
    } else {
      // Development / Test Simulation Mode
      // Generates a test order ID for local sandbox testing
      const testOrderId = `order_test_${Date.now()}`;
      return res.status(200).json({
        success: true,
        orderId: testOrderId,
        amount,
        currency,
        keyId: keyId || 'rzp_test_51234567890abc',
        serviceName: tier.name,
        isTestMode: true,
        message: 'Running in development test mode. Replace credentials in .env for production.'
      });
    }
  } catch (error) {
    console.error('Server error creating order:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing consultation order'
    });
  }
}
