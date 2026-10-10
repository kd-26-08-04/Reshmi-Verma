/**
 * Serverless Function: Submit Pre-Consultation Clinical Intake Questionnaire
 * Endpoint: POST /api/submit-questionnaire
 * 
 * Requirement:
 * - Computes clinical score matrix and flags for the ADMIN dashboard.
 * - Result / score is NOT exposed to the client; client only gets a secure
 *   confirmation and dashboard view.
 * - Stores all dynamic question answers for Sections B, C, D, E, F.
 */

import { db } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

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

    const { bookingId, answers = {}, formData = {} } = body || {};

    // Merge answers from body, formData, and answers object
    const finalAnswers = { ...formData, ...answers };
    for (const [key, val] of Object.entries(body || {})) {
      if (key !== 'bookingId' && key !== 'answers' && key !== 'formData' && typeof val !== 'undefined') {
        if (!finalAnswers[key]) finalAnswers[key] = val;
      }
    }

    let targetBookingId = bookingId;
    let booking = null;

    if (targetBookingId) {
      booking = await db.getBookingById(targetBookingId);
    }

    // If no booking found by ID, attempt to find by client email
    const clientEmail = (finalAnswers.email || body.email || '').trim().toLowerCase();
    if (!booking && clientEmail) {
      const allBookings = await db.getAllBookings();
      booking = (allBookings || [])
        .filter(b => (b.email || b.clientEmail || '').toLowerCase() === clientEmail)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
      if (booking) {
        targetBookingId = booking.id;
      }
    }

    // If still no booking found, create a confirmed client record in the database
    if (!booking) {
      targetBookingId = 'intake_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      booking = await db.createBooking({
        id: targetBookingId,
        name: finalAnswers.fullName || finalAnswers.name || 'Client',
        email: clientEmail || 'client@healthwithreshmi.com',
        phone: finalAnswers.phone || '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        status: 'confirmed',
        consultationType: 'intake_assessment',
        serviceTitle: 'Clinical Nutrition & Breath Consultation',
        amount: 2499,
        isDemo: false
      });
    }

    // --- SERVER-SIDE CLINICAL ALGORITHM (ADMIN VISIBILITY ONLY) ---
    let gutScore = 75;
    let breathScore = 75;
    let hormoneScore = 75;
    let sleepScore = 75;
    const clinicalFlags = [];

    // 1. Primary Health Concern (Q10)
    const primaryConcern = (finalAnswers.q10_primary_concern || finalAnswers.primaryChallenge || '').toLowerCase();
    if (primaryConcern.includes('gut') || primaryConcern.includes('digest')) {
      gutScore -= 22;
      clinicalFlags.push('Active Gut Dysbiosis / Mucosal Barrier Compromise');
    }
    if (primaryConcern.includes('pcos') || primaryConcern.includes('hormon') || primaryConcern.includes('thyroid') || primaryConcern.includes('diabetes')) {
      hormoneScore -= 22;
      clinicalFlags.push('Endocrine / Metabolic Axis Stress');
    }
    if (primaryConcern.includes('fatigue') || primaryConcern.includes('energy')) {
      hormoneScore -= 15;
      breathScore -= 12;
      clinicalFlags.push('Mitochondrial Fatigue & Aerobic Energy Deficit');
    }
    if (primaryConcern.includes('weight')) {
      hormoneScore -= 15;
      clinicalFlags.push('Metabolic Adaptation / Weight Plateau');
    }

    // 2. Chronicity (Q12)
    const duration = (finalAnswers.q12_concern_duration || finalAnswers.duration || '').toLowerCase();
    if (duration.includes('year') || duration.includes('chronic')) {
      gutScore = Math.round(gutScore * 0.88);
      breathScore = Math.round(breathScore * 0.88);
      hormoneScore = Math.round(hormoneScore * 0.88);
      sleepScore = Math.round(sleepScore * 0.88);
      clinicalFlags.push('Long-standing Chronic Adaptation (> 1 Year)');
    }

    // 3. Digestive Symptoms (Q33)
    const digestiveSymptoms = (finalAnswers.q33_digestive_symptoms || finalAnswers.gutSymptoms || '').toLowerCase();
    if (digestiveSymptoms.includes('bloat') || digestiveSymptoms.includes('acidity') || digestiveSymptoms.includes('reflux')) {
      gutScore -= 15;
      if (!clinicalFlags.some(f => f.includes('Gut Dysbiosis'))) {
        clinicalFlags.push('Upper GI Fermentation / Hypochlorhydria Symptoms');
      }
    }
    if (digestiveSymptoms.includes('constipat') || digestiveSymptoms.includes('diarrh') || digestiveSymptoms.includes('ibs')) {
      gutScore -= 14;
      clinicalFlags.push('Altered Colonic Motility / Gut Transit Delay');
    }

    // 4. Medications & Antacids (Q17)
    const meds = (finalAnswers.q17_medicines_supplements || finalAnswers.medications || '').toLowerCase();
    if (meds.includes('antacid') || meds.includes('ppi') || meds.includes('pantop') || meds.includes('omeprazole') || meds.includes('rabeprazole')) {
      gutScore -= 12;
      clinicalFlags.push('Hypochlorhydria Risk (Long-term PPI / Acid Suppressor Use)');
    }
    if (meds.includes('thyronorm') || meds.includes('eltoxin') || meds.includes('levothyroxine')) {
      hormoneScore -= 10;
      clinicalFlags.push('Active Thyroid Hormone Replacement Therapy');
    }

    // 5. Stress Level (Q27)
    const stress = (finalAnswers.q27_stress_level || '').toLowerCase();
    if (stress === 'high') {
      breathScore -= 18;
      sleepScore -= 15;
      hormoneScore -= 12;
      clinicalFlags.push('Elevated Sympathetic Tone / HPA Axis Overdrive');
    } else if (stress === 'moderate') {
      breathScore -= 8;
      sleepScore -= 8;
    }

    // 6. Sleep Hours (Q26)
    const sleepText = (finalAnswers.q26_sleep_hours || finalAnswers.sleepPatterns || '').toLowerCase();
    if (sleepText.includes('4') || sleepText.includes('5') || sleepText.includes('fragment') || sleepText.includes('insomnia') || sleepText.includes('snoring')) {
      sleepScore -= 20;
      clinicalFlags.push('Nocturnal Recovery Debt / Fragmented REM Cycles');
    }

    // 7. Food Allergies & Intolerances (Q18)
    const allergies = (finalAnswers.q18_food_allergies || '').toLowerCase();
    if (allergies.length > 3 && !allergies.includes('none') && !allergies.includes('no')) {
      gutScore -= 10;
      clinicalFlags.push('Immunological Food Reactivity / Intolerance Profile');
    }

    // Clamp score values between 20 and 95
    gutScore = Math.min(95, Math.max(20, gutScore));
    breathScore = Math.min(95, Math.max(20, breathScore));
    hormoneScore = Math.min(95, Math.max(20, hormoneScore));
    sleepScore = Math.min(95, Math.max(20, sleepScore));

    const compositeResilience = Math.round((gutScore + breathScore + hormoneScore + sleepScore) / 4);

    const calculatedScores = {
      compositeResilience,
      gutScore,
      breathScore,
      hormoneScore,
      sleepScore,
      clinicalFlags,
      evaluatedAt: new Date().toISOString()
    };

    const questionnaireData = {
      ...finalAnswers,
      submittedAt: new Date().toISOString()
    };

    // Update the booking record in database
    await db.updateBooking(targetBookingId, {
      questionnaireStatus: 'completed',
      clinicalStatus: 'awaiting_clinical_review',
      questionnaireData,
      clinicalScores: calculatedScores
    });

    // Client response: Confirmation ONLY (No raw diagnostic scores exposed)
    return res.status(200).json({
      success: true,
      bookingId: targetBookingId,
      message: 'Your Pre-Consultation Clinical Intake has been securely received. Reshmi Verma and the diagnostic team are preparing your customized protocol ahead of your session.',
      status: 'awaiting_clinical_review'
    });
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving your questionnaire.'
    });
  }
}
