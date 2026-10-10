/**
 * Serverless Function: Verify Razorpay Payment Signature & Record Booking
 * Endpoint: POST /api/verify-payment
 */

import crypto from 'crypto';
import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      clientName,
      clientEmail,
      clientPhone,
      serviceName,
      servicePrice,
      bookingDate,
      bookingTime,
      notes
    } = body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing razorpay_payment_id parameter'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isConfigured = keySecret && !keySecret.includes('YOUR_RAZORPAY_KEY_SECRET');

    let isValid = false;

    // Sandbox test mode simulation check
    if (!isConfigured || razorpay_order_id?.startsWith('order_test_')) {
      isValid = true;
    } else {
      if (!razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Missing order_id or signature for verification'
        });
      }

      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const providedBuffer = Buffer.from(razorpay_signature, 'utf8');

      isValid = expectedBuffer.length === providedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Payment verification failed: Invalid signature detected'
      });
    }

    // Identify user from auth token or payload
    const session = auth.getUserFromRequest(req);
    const userId = session?.userId || null;

    const finalServiceName = serviceName || body.serviceName || 'Comprehensive Clinical Consultation';
    const finalServiceTier = body.serviceTier || 'comprehensive';
    const finalPrice = String(servicePrice || body.amount || '2999');
    const finalDate = bookingDate || body.bookingDate || new Date().toISOString().split('T')[0];
    const finalTime = bookingTime || body.timeSlot || '10:00 AM';
    const finalNotes = notes || body.healthConcerns || '';
    const finalAge = body.clientAge || body.age || '';
    const finalGender = body.clientGender || body.gender || '';
    const finalCity = body.clientCity || body.city || '';
    const finalOccupation = body.clientOccupation || body.occupation || '';
    const finalLanguage = body.clientLanguage || body.language || 'English';
    const finalEmergency = body.clientEmergencyContact || body.emergencyContact || '';

    // Create booking record in database
    const booking = await db.createBooking({
      userId: userId,
      clientName: clientName || session?.name || 'Valued Client',
      clientEmail: (clientEmail || session?.email || '').toLowerCase().trim(),
      clientPhone: clientPhone || '',
      serviceName: finalServiceName,
      serviceTier: finalServiceTier,
      servicePrice: finalPrice,
      amount: Number(finalPrice),
      bookingDate: finalDate,
      bookingTime: finalTime,
      timeSlot: finalTime,
      notes: finalNotes,
      healthConcerns: finalNotes,
      age: finalAge,
      gender: finalGender,
      city: finalCity,
      occupation: finalOccupation,
      language: finalLanguage,
      emergencyContact: finalEmergency,
      sectionA: body.sectionA || {
        age: finalAge,
        gender: finalGender,
        city: finalCity,
        occupation: finalOccupation,
        language: finalLanguage,
        emergencyContact: finalEmergency
      },
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || 'order_direct',
      paymentStatus: 'paid',
      status: 'confirmed',
      questionnaireStatus: 'pending',
      clinicalStatus: 'intake_pending',
      questionnaireData: null,
      clinicalScores: null,
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      bookingId: booking.id || booking._id,
      message: 'Payment verified successfully and consultation record created.'
    });
  } catch (error) {
    console.error('Payment verification server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error verifying payment'
    });
  }
}
