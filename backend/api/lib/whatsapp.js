/**
 * WhatsApp Business Automation Service for HealthwithReshmi™
 * 
 * Capabilities:
 * 1. Automatically dispatches Clinical Assessment Reports directly to client WhatsApp.
 * 2. Instant notification alerts to Clinic Admin (Reshmi Mam) on new intakes.
 * 3. Supports QR-based Web Gateways (UltraMsg, Green-API, Custom QR Nodes)
 *    and seamlessly works on persistent Node servers (Render/VPS) and serverless environments.
 * 4. Fallback simulator mode when API keys are not yet configured.
 */

import { db } from './db.js';

export function cleanPhoneNumber(raw) {
  if (!raw) return '';
  let cleaned = String(raw).replace(/\D/g, '');
  if (!cleaned) return '';

  // Standard Indian 10-digit mobile number format
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.slice(1);
  }
  return cleaned;
}

export function formatClientReportMessage(data) {
  const name = (data.name || data.clientName || 'Valued Client').trim();
  const scores = data.scores || data.clinicalScores || {};

  const gut = scores.gutScore ?? 65;
  const breath = scores.breathScore ?? 68;
  const metabolic = scores.metabolicScore ?? scores.hormoneScore ?? 70;
  const composite = scores.compositeResilience ?? Math.round((gut + breath + metabolic) / 3);

  // Status indicators
  const gutBadge = gut < 50 ? '⚠️ High Permeability / Priority' : gut < 75 ? '⚡ Moderate Dysbiosis' : '✅ Healthy Baseline';
  const breathBadge = breath < 50 ? '⚠️ Sympathetic Overdrive' : breath < 75 ? '⚡ Sub-optimal CO₂ Tolerance' : '✅ Balanced Vagal Flow';
  const metabolicBadge = metabolic < 50 ? '⚠️ Circadian / Insulin Friction' : metabolic < 75 ? '⚡ Metabolic Fatigue' : '✅ Resilient Energy Kinetics';

  // Key Clinical Insights
  const gutNote = scores.gutSummary?.insight || 'Gut mucosal barrier requires targeted repair. Avoid self-prescribing random probiotics until microbial balance is restored.';
  const breathNote = scores.breathSummary?.insight || 'Autonomic over-breathing detected. Diaphragmatic pacing & vagal nerve regulation recommended.';
  const metabolicNote = scores.metabolicSummary?.insight || 'Sleep and energy dips indicate HPA-axis stress. Fasting insulin and circadian rhythm calibration required.';

  return `🌿 *HEALTHWITHRESHMI™ — FUNCTIONAL HEALTH ASSESSMENT*
━━━━━━━━━━━━━━━━━━━━━━━━━
Namaste *${name}*,

Thank you for completing your 360° Health Assessment on our website. Your preliminary clinical matrix and biomarker scores have been decoded by our clinical diagnostic engine.

📊 *YOUR CLINICAL RESILIENCE MATRIX:*
• *Gut Mucosal Health:* ${gut}/100 (${gutBadge})
• *Breath & Vagal Dynamics:* ${breath}/100 (${breathBadge})
• *Metabolic & Circadian Rhythm:* ${metabolic}/100 (${metabolicBadge})
🌟 *Composite Vitality Index: ${composite}%*

🩺 *CLINICAL OBSERVATIONS:*
🌱 *Gut Health:* ${gutNote}
🫁 *Breathing Dynamics:* ${breathNote}
⚡ *Metabolic Flow:* ${metabolicNote}

━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *NEXT RECOMMENDED STEP:*
Automated scores provide a directional baseline, but reversing symptoms requires personalized root-cause clinical care.

Book your 1-on-1 Consultation Session with *Reshmi Verma* (MSc Clinical Nutrition, Certified Breath & Functional Health Practitioner):
👉 *https://healthwithreshmi.com/booking*

If you have questions or wish to share recent bloodwork, you can reply directly to this message.

Warm regards,
*Reshmi Verma & Clinical Team*
HealthwithReshmi™`;
}

export function formatAdminAlertMessage(data) {
  const name = (data.name || data.clientName || 'Anonymous Visitor').trim();
  const phone = data.phone || data.clientPhone || 'N/A';
  const email = data.email || data.clientEmail || 'N/A';
  const scores = data.scores || data.clinicalScores || {};
  const composite = scores.compositeResilience || 'N/A';

  const isCritical = scores.isCriticalOverall || (scores.gutScore && scores.gutScore < 50) || (composite !== 'N/A' && composite < 60);

  return `🚨 *NEW HEALTH ASSESSMENT LEAD RECEIVED!*
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Patient Name:* ${name}
📱 *WhatsApp Number:* ${phone}
✉️ *Email:* ${email}
📊 *Composite Score:* ${composite}%
⚠️ *Priority:* ${isCritical ? '🔴 CRITICAL (Immediate Follow-up)' : '🟡 Standard Clinical Review'}

🔗 *Open Admin Portal:* https://healthwithreshmi.com/admin
━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Low-level sender supporting UltraMsg, GreenAPI, and Custom QR Web Gateways
 */
export async function sendRawWhatsAppMessage({ toPhone, message, config }) {
  const cleanPhone = cleanPhoneNumber(toPhone);
  if (!cleanPhone) {
    return { success: false, error: 'Invalid or missing phone number' };
  }

  const provider = config?.provider || 'ultramsg';
  const instanceId = config?.instanceId?.trim();
  const token = config?.token?.trim();

  // If no credentials are configured, return simulation status with ready WhatsApp click-to-chat URL
  if (!instanceId || !token) {
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    console.log(`[WhatsApp Simulator] Sending to ${cleanPhone}: (No active API Token configured. Generated waUrl: ${waUrl})`);
    return {
      success: true,
      simulated: true,
      provider: 'simulation',
      phone: cleanPhone,
      message: 'WhatsApp message simulated successfully. (Enter UltraMsg/GreenAPI token in Admin to send real-time)',
      waUrl
    };
  }

  try {
    // 0. Official Meta WhatsApp Cloud API (https://graph.facebook.com)
    if (provider === 'meta') {
      const phoneNumberId = config?.phoneNumberId || instanceId;
      const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: true,
            body: message
          }
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `Meta Cloud API responded with status ${res.status}`);
      }
      return { success: true, provider: 'meta', data };
    }

    // 1. UltraMsg Gateway (https://api.ultramsg.com)
    if (provider === 'ultramsg') {
      const endpoint = `https://api.ultramsg.com/${instanceId}/messages/chat`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          to: cleanPhone,
          body: message
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || `UltraMsg responded with status ${res.status}`);
      }
      return { success: true, provider: 'ultramsg', data };
    }

    // 2. Green-API Gateway (https://api.green-api.com)
    if (provider === 'greenapi') {
      const endpoint = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${cleanPhone}@c.us`,
          message
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || `Green-API responded with status ${res.status}`);
      }
      return { success: true, provider: 'greenapi', data };
    }

    // 3. Custom Gateway URL
    if (provider === 'custom_gateway' && config.apiUrl) {
      const res = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          phone: cleanPhone,
          to: cleanPhone,
          message,
          token
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`Custom gateway error HTTP ${res.status}`);
      return { success: true, provider: 'custom_gateway', data };
    }

    throw new Error(`Unsupported WhatsApp provider: ${provider}`);
  } catch (err) {
    console.error(`[WhatsApp Error] Failed to send message to ${cleanPhone}:`, err.message);
    return {
      success: false,
      error: err.message,
      phone: cleanPhone
    };
  }
}

/**
 * High-level service method to dispatch report to client and alert to admin
 */
export async function sendAssessmentReportToClient(leadOrBooking) {
  if (!leadOrBooking) {
    return { success: false, error: 'No lead or booking provided' };
  }

  const phone = leadOrBooking.phone || leadOrBooking.clientPhone;
  if (!phone) {
    return { success: false, error: 'Client phone number is missing' };
  }

  const config = await db.getWhatsappConfig();
  if (config.enabled === false) {
    return { success: false, error: 'WhatsApp notifications are currently disabled in settings' };
  }

  const reportText = formatClientReportMessage(leadOrBooking);
  const clientResult = await sendRawWhatsAppMessage({
    toPhone: phone,
    message: reportText,
    config
  });

  // Mark lead or booking as notified
  const now = new Date().toISOString();
  if (leadOrBooking.id) {
    try {
      await db.updateAssessmentLeadStatus(leadOrBooking.id, {
        whatsappSent: clientResult.success,
        whatsappSentAt: now,
        whatsappSimulated: clientResult.simulated || false
      });
    } catch (e) { }
  }

  // Also dispatch instant alert to Reshmi Mam / Clinic Admin
  if (config.sendAlertToAdmin && config.adminPhone) {
    try {
      const alertText = formatAdminAlertMessage(leadOrBooking);
      await sendRawWhatsAppMessage({
        toPhone: config.adminPhone,
        message: alertText,
        config
      });
    } catch (adminErr) {
      console.warn('[WhatsApp Notice] Admin alert dispatch failed:', adminErr.message);
    }
  }

  return clientResult;
}

export const whatsappService = {
  cleanPhoneNumber,
  formatClientReportMessage,
  formatAdminAlertMessage,
  sendRawWhatsAppMessage,
  sendAssessmentReportToClient
};

export default whatsappService;
