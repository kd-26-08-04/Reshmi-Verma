import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl, RAZORPAY_PAYMENT_URL } from '../utils/api';

/**
 * Oxygen Advantage® Functional Breathing Assessment
 * Developed according to Patrick McKeown's clinical methodology.
 * Certified by Reshmi Verma — #13 Certified Oxygen Advantage Coach in India.
 * 
 * 16 Questions across 3 Pillars:
 * 1. Body (Physical habits, airway mechanics, night breathing)
 * 2. Mind (Stress response, air hunger, anxiety, vagus nerve)
 * 3. Sport (Movement, athletic stamina, post-exercise recovery)
 */

const OA_SECTIONS = [
  {
    id: 'pillar_body',
    number: 1,
    title: 'Pillar 1 — Body (Physiology & Biomechanics)',
    badge: 'Airway & Resting Habits',
    desc: 'Evaluating your resting breathing mechanics, daytime nasal efficiency, and nighttime airway stability.',
    questions: [
      {
        id: 'oa_q1',
        title: '1. Do you breathe through your mouth during the day at rest?',
        subtitle: 'Mouth breathing bypasses nasal nitric oxide filtration, triggering chronic hyperventilation.',
        options: [
          { label: 'Never — strictly nasal breathing all day', score: 0, tag: 'Optimal Nasal Respiration' },
          { label: 'Occasionally when distracted or concentrating at a desk', score: 1, tag: 'Mild Daytime Airway Drift' },
          { label: 'Frequently breathe through mouth during work or conversations', score: 2, tag: 'Frequent Mouth Breathing' },
          { label: 'Constantly mouth breathing throughout the day', score: 3, tag: 'Chronic Mouth Breathing' }
        ]
      },
      {
        id: 'oa_q2',
        title: '2. Do you wake up in the morning with a dry mouth or thirst?',
        subtitle: 'A dry mouth upon waking is the most reliable clinical sign of nocturnal mouth breathing.',
        options: [
          { label: 'Never — mouth is moist and throat feels normal', score: 0, tag: 'Optimal Night Nasal Breathing' },
          { label: 'Rarely, perhaps once or twice a month', score: 1, tag: 'Infrequent Dry Mouth' },
          { label: 'Frequently — a few mornings every week', score: 2, tag: 'Nocturnal Hyperventilation' },
          { label: 'Every single morning — always reach for water immediately', score: 3, tag: 'Severe Nocturnal Airway Collapse' }
        ]
      },
      {
        id: 'oa_q3',
        title: '3. Do you snore, hold your breath, or wake up gasping during sleep?',
        subtitle: 'Snoring is acoustic evidence of turbulent airway resistance and upper respiratory collapse.',
        options: [
          { label: 'Never snore; silent, calm restorative sleep', score: 0, tag: 'Clear Nocturnal Airway' },
          { label: 'Mild occasional snoring only when exhausted or unwell', score: 1, tag: 'Mild Positional Snoring' },
          { label: 'Regular snoring reported by bed partner or light waking', score: 2, tag: 'Moderate Airway Obstruction' },
          { label: 'Loud chronic snoring, waking gasping, or suspected sleep apnea', score: 3, tag: 'Severe Airway Obstruction / Apnea' }
        ]
      },
      {
        id: 'oa_q4',
        title: '4. Do you frequently sigh, yawn, or take deep gulps of air?',
        subtitle: 'Frequent involuntary sighing depletes blood CO₂, triggering cellular hypoxia via the Bohr Effect.',
        options: [
          { label: 'Rarely or never; smooth and unnoticed rhythm', score: 0, tag: 'Stable CO₂ Homeostasis' },
          { label: 'A few sighs or yawns throughout the day', score: 1, tag: 'Mild Sighing Pattern' },
          { label: 'Multiple times an hour — often feeling like taking a deep breath', score: 2, tag: 'Chronic Over-breathing' },
          { label: 'Constantly sighing, yawning, or gasping for air', score: 3, tag: 'Severe Hyperventilation Syndrome' }
        ]
      },
      {
        id: 'oa_q5',
        title: '5. When resting, do your upper chest or shoulders move rather than your ribs?',
        subtitle: 'Apical chest breathing recruits secondary neck muscles, keeping the nervous system in fight-or-flight.',
        options: [
          { label: 'Lower ribs and abdomen expand 360° smoothly; zero chest lifting', score: 0, tag: 'Optimal 3D Diaphragmatic Breath' },
          { label: 'Minimal upper chest motion; mostly low ribcage movement', score: 1, tag: 'Acceptable Biomechanics' },
          { label: 'Upper chest visibly rises and falls with each breath', score: 2, tag: 'Apical / Chest Breathing' },
          { label: 'Shoulders and clavicle actively elevate with every inhale', score: 3, tag: 'Dysfunctional Respiratory Mechanics' }
        ]
      },
      {
        id: 'oa_q6',
        title: '6. Is your breathing audible or heavy when sitting quietly?',
        subtitle: 'Normal resting breathing should be completely silent, imperceptible, and invisible.',
        options: [
          { label: 'Completely silent, subtle, and effortless', score: 0, tag: 'Optimal Sub-clinical Breath' },
          { label: 'Quiet, but occasionally audible in silent rooms', score: 1, tag: 'Mild Audible Rhythm' },
          { label: 'Frequently hear myself breathing or feel heaviness in chest', score: 2, tag: 'Heavy Resting Respiration' },
          { label: 'Loud, heavy breathing accompanied by frequent throat clearing', score: 3, tag: 'Severe Labored Respiration' }
        ]
      }
    ]
  },
  {
    id: 'pillar_mind',
    number: 2,
    title: 'Pillar 2 — Mind (Stress & Autonomic Regulation)',
    badge: 'Nervous System & Vagal Tone',
    desc: 'Assessing the bidirectional link between mental composure, air hunger, and CO₂ tolerance.',
    questions: [
      {
        id: 'oa_q7',
        title: '7. Under acute daily stress, does your breathing feel tight or shallow?',
        subtitle: 'Emotional stress triggers rapid respiratory rate, driving acute sympathetic overdrive.',
        options: [
          { label: 'Breathing remains low, slow, and rhythmic even during pressure', score: 0, tag: 'High Somatic Composure' },
          { label: 'Mild speeding of breath, but easy to self-regulate with intention', score: 1, tag: 'Moderate Nervous Regulation' },
          { label: 'Noticeable chest tightness, fast shallow breaths, and racing pulse', score: 2, tag: 'Sympathetic Hyper-reactivity' },
          { label: 'Feeling of panic, inability to catch breath, or hyperventilation', score: 3, tag: 'Acute Panic / Hyperventilation State' }
        ]
      },
      {
        id: 'oa_q8',
        title: '8. Do you experience sensations of "Air Hunger" (cannot get a full breath)?',
        subtitle: 'Air hunger is driven by hypersensitive respiratory chemoreceptors in the brainstem.',
        options: [
          { label: 'Never experience air hunger; breathing always feels sufficient', score: 0, tag: 'Normal Chemoreceptor Threshold' },
          { label: 'Very rarely, only during extreme exhaustion or stress', score: 1, tag: 'Infrequent Air Hunger' },
          { label: 'Several times a week — feel like lungs cannot get enough oxygen', score: 2, tag: 'Chemoreceptor Hypersensitivity' },
          { label: 'Daily persistent air hunger or urge to forcefully yawn/expand chest', score: 3, tag: 'Chronic Air Hunger' }
        ]
      },
      {
        id: 'oa_q9',
        title: '9. Do you experience brain fog, difficulty focusing, or an afternoon crash?',
        subtitle: 'Over-breathing reduces cerebral arterial blood flow by up to 40% through arterial constriction.',
        options: [
          { label: 'Sharp mental clarity and sustained cognitive stamina all day', score: 0, tag: 'Optimal Cerebral Perfusion' },
          { label: 'Mild afternoon fatigue, but easily restored with hydration/rest', score: 1, tag: 'Mild Circadian Dip' },
          { label: 'Frequent brain fog, scattered focus, or needing caffeine to think', score: 2, tag: 'Cerebral Vasoconstriction' },
          { label: 'Severe chronic brain fog, short-term memory lapses, and mental fatigue', score: 3, tag: 'Chronic Hypoxia / Brain Fatigue' }
        ]
      },
      {
        id: 'oa_q10',
        title: '10. Do your hands or feet tend to feel cold even in warm rooms?',
        subtitle: 'Low blood carbon dioxide causes peripheral vasoconstriction, chilling extremities.',
        options: [
          { label: 'Hands and feet are consistently warm and well-circulated', score: 0, tag: 'Healthy Microvascular Tone' },
          { label: 'Occasionally cool in winter, but generally comfortable', score: 1, tag: 'Normal Vasomotor Tone' },
          { label: 'Frequently cold hands and feet regardless of room temperature', score: 2, tag: 'Peripheral Vasoconstriction' },
          { label: 'Constantly freezing hands/feet (classic low CO₂ symptom)', score: 3, tag: 'Severe Microcirculatory Constriction' }
        ]
      },
      {
        id: 'oa_q11',
        title: '11. Do you experience internal restlessness or racing thoughts before sleep?',
        subtitle: 'Shallow breathing prevents acetylcholine release, keeping the brain awake in beta brainwaves.',
        options: [
          { label: 'Calm, tranquil mind; fall asleep within 10–15 minutes', score: 0, tag: 'Optimal Parasympathetic Onset' },
          { label: 'Occasional racing thoughts, but unwind naturally in 20 minutes', score: 1, tag: 'Mild Cognitive Arousal' },
          { label: 'Takes 30–60 minutes to fall asleep; frequent nighttime awakening', score: 2, tag: 'Nocturnal Sympathetic Tone' },
          { label: 'Severe sleep-onset insomnia, anxiety spikes, or mind refuses to stop', score: 3, tag: 'Severe Autonomic Dysregulation' }
        ]
      }
    ]
  },
  {
    id: 'pillar_sport',
    number: 3,
    title: 'Pillar 3 — Sport (Movement, Stamina & Performance)',
    badge: 'Cardiorespiratory Endurance',
    desc: 'Evaluating breathlessness thresholds, nasal athletic capacity, and recovery kinetics.',
    questions: [
      {
        id: 'oa_q12',
        title: '12. Do you switch to mouth breathing during brisk walking or climbing stairs?',
        subtitle: 'Switching to mouth breathing at low workloads indicates an early anaerobic threshold.',
        options: [
          { label: 'Easily maintain silent nasal breathing even on stairs and steep hills', score: 0, tag: 'High Aerobic Nasal Capacity' },
          { label: 'Breathe through nose mostly, but open mouth on fast inclines', score: 1, tag: 'Moderate Aerobic Buffer' },
          { label: 'Have to open mouth after climbing 1–2 flights of stairs', score: 2, tag: 'Early Ventilatory Threshold' },
          { label: 'Immediately gasping for air and mouth breathing on gentle walking', score: 3, tag: 'Severe Respiratory Deconditioning' }
        ]
      },
      {
        id: 'oa_q13',
        title: '13. During workouts or sports, does breathlessness limit you before muscle fatigue?',
        subtitle: 'When respiratory muscles fatigue early, they "steal" blood from working leg/arm muscles.',
        options: [
          { label: 'Legs and muscles fatigue first; breathing stays composed', score: 0, tag: 'Strong Respiratory Muscle Reserve' },
          { label: 'Balanced fatigue between cardiovascular breath and muscle effort', score: 1, tag: 'Balanced Cardiorespiratory Metre' },
          { label: 'Breathlessness frequently forces me to slow down or take breaks', score: 2, tag: 'Respiratory Metaboreflex Activation' },
          { label: 'Breathlessness is the absolute limiting factor in all physical exertion', score: 3, tag: 'Severe Respiratory Fatigue Limiter' }
        ]
      },
      {
        id: 'oa_q14',
        title: '14. How quickly does your breathing return to normal after exertion?',
        subtitle: 'Rapid heart-rate and breathing recovery indicates robust parasympathetic reactivation.',
        options: [
          { label: 'Returns to silent nasal rhythm in under 1–2 minutes', score: 0, tag: 'Elite Vagal Reactivation' },
          { label: 'Takes 3–5 minutes to settle completely', score: 1, tag: 'Normal Recovery Curve' },
          { label: 'Takes 5–15 minutes of heavy panting and elevated heart rate', score: 2, tag: 'Delayed Respiratory Clearance' },
          { label: 'Prolonged exhaustion, wheezing, or feeling drained for hours', score: 3, tag: 'Blunted Autonomic Recovery' }
        ]
      },
      {
        id: 'oa_q15',
        title: '15. Do you suffer from nasal congestion, blocked nostrils, or sinusitis?',
        subtitle: 'Nasal airway resistance forces mouth breathing, which further inflames nasal mucosa in a vicious cycle.',
        options: [
          { label: 'Nasal passages are completely clear, open, and effortless 24/7', score: 0, tag: 'Clear Nasal Airway' },
          { label: 'Mild occasional stuffiness with weather or allergies', score: 1, tag: 'Mild Seasonal Congestion' },
          { label: 'One nostril frequently blocked; wake up congested', score: 2, tag: 'Turbinate Hypertrophy / Rhinitis' },
          { label: 'Chronic nasal obstruction or mouth breathing due to sinus blockage', score: 3, tag: 'Severe Chronic Nasal Obstruction' }
        ]
      },
      {
        id: 'oa_q16',
        title: '16. What is your estimated or tested BOLT Score (Body Oxygen Level Test)?',
        subtitle: 'BOLT measures the time in seconds from normal exhale until the first definite urge to breathe.',
        options: [
          { label: '30+ Seconds (Optimal / Resilient / Elite oxygen delivery)', score: 0, tag: 'Optimal BOLT ≥ 30s' },
          { label: '20–29 Seconds (Moderate — breathing habits require refinement)', score: 1, tag: 'Moderate BOLT 20–29s' },
          { label: '10–19 Seconds (Sub-optimal — indicates chronic over-breathing)', score: 2, tag: 'Low BOLT 10–19s' },
          { label: 'Under 10 Seconds (Critical — severe hyperventilation / respiratory exhaustion)', score: 3, tag: 'Severe Low BOLT < 10s' }
        ]
      }
    ]
  }
];

export default function BreathingAssessmentPage() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [currentPillar, setCurrentPillar] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Interactive BOLT Timer Tool State
  const [boltSeconds, setBoltSeconds] = useState(0);
  const [isBoltRunning, setIsBoltRunning] = useState(false);
  const [boltRecorded, setBoltRecorded] = useState(null);

  // Lead Data & Pre-Assessment Gate
  const [leadInfo, setLeadInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('reshmi_assessment_lead') || localStorage.getItem('reshmi_user_lead');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null;
  });

  const [leadName, setLeadName] = useState(leadInfo?.name || user?.name || '');
  const [leadPhone, setLeadPhone] = useState(leadInfo?.phone || user?.phone || '');
  const [leadEmail, setLeadEmail] = useState(leadInfo?.email || user?.email || '');
  const [leadError, setLeadError] = useState('');
  const [leadSaving, setLeadSaving] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user && !leadInfo) {
      if (user.name) setLeadName(user.name);
      if (user.phone) setLeadPhone(user.phone);
      if (user.email) setLeadEmail(user.email);
    }
  }, [user, leadInfo]);

  const handleStartFromGate = async (e) => {
    e.preventDefault();
    setLeadError('');
    if (!leadName.trim()) {
      setLeadError('Please enter your full name.');
      return;
    }
    if (!leadPhone.trim() || leadPhone.trim().length < 8) {
      setLeadError('Please enter a valid mobile number.');
      return;
    }

    setLeadSaving(true);
    const storedLead = {
      id: `oa_lead_${Date.now()}`,
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim().toLowerCase()
    };

    try {
      const payload = {
        name: storedLead.name,
        phone: storedLead.phone,
        email: storedLead.email,
        source: 'breathing_assessment_gate',
        step: 'Started Oxygen Advantage Assessment (Pillar 1 - Body)',
        status: 'in_progress'
      };

      const res = await fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (data.id) storedLead.id = data.id;
    } catch (err) {
      // offline fallback
    } finally {
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(storedLead));
      setLeadInfo(storedLead);
      if (storedLead.email) setEmailInput(storedLead.email);
      setLeadSaving(false);
    }
  };

  // BOLT Timer effect
  useEffect(() => {
    let interval = null;
    if (isBoltRunning) {
      interval = setInterval(() => {
        setBoltSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBoltRunning]);

  const handleStartBolt = () => {
    setBoltSeconds(0);
    setIsBoltRunning(true);
  };

  const handleStopBolt = () => {
    setIsBoltRunning(false);
    setBoltRecorded(boltSeconds);
    // Auto map to question 16 if applicable
    let mappedScore = 3;
    let mappedTag = 'Severe Low BOLT < 10s';
    if (boltSeconds >= 30) {
      mappedScore = 0;
      mappedTag = 'Optimal BOLT ≥ 30s';
    } else if (boltSeconds >= 20) {
      mappedScore = 1;
      mappedTag = 'Moderate BOLT 20–29s';
    } else if (boltSeconds >= 10) {
      mappedScore = 2;
      mappedTag = 'Low BOLT 10–19s';
    }
    setAnswers((prev) => ({
      ...prev,
      oa_q16: { score: mappedScore, tag: mappedTag, seconds: boltSeconds }
    }));
  };

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Scoring logic (Total out of 48)
  const totalScore = Object.values(answers).reduce((sum, item) => sum + (item.score || 0), 0);
  const totalAnswered = Object.keys(answers).length;

  // Rating categories (Lower score is healthier, according to OA protocol)
  let ratingTitle = 'Optimal Functional Breathing';
  let ratingColor = '#059669';
  let ratingBadge = 'Resilient Respiratory Health';
  let ratingSummary = 'Your resting and active breathing mechanics are highly efficient. Cellular oxygen delivery via the Bohr Effect is functioning near peak capacity.';

  if (totalScore >= 35) {
    ratingTitle = 'Severe Breathing Pattern Disorder';
    ratingColor = '#0F766E';
    ratingBadge = 'High Respiratory Dysregulation';
    ratingSummary = 'Your breathing reflects chronic severe hyperventilation, airway restriction, and low CO₂ tolerance. This directly impacts your sleep, anxiety threshold, and cardiovascular endurance.';
  } else if (totalScore >= 24) {
    ratingTitle = 'Significant Dysfunctional Breathing';
    ratingColor = '#0D9488';
    ratingBadge = 'Over-Breathing Compensation';
    ratingSummary = 'Noticeable upper chest breathing, daytime sighing/mouth breathing, and suboptimal CO₂ tolerance. A structured Oxygen Advantage reset will deliver massive energy gains.';
  } else if (totalScore >= 13) {
    ratingTitle = 'Mild-to-Moderate Dysfunctional Breathing';
    ratingColor = '#0D9488';
    ratingBadge = 'Sub-Clinical Hyperventilation';
    ratingSummary = 'Good baseline mechanics, but chronic stress or postural desk work frequently disrupts your breathing rhythm, causing fatigue dips and intermittent air hunger.';
  }

  const handleFinish = async () => {
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Try saving assessment lead to backend
    const activeLead = leadInfo || {
      name: leadName,
      phone: leadPhone,
      email: leadEmail
    };

    if (activeLead.phone || activeLead.name) {
      setIsSavingLead(true);
      try {
        await fetch(getApiUrl('/api/assessment-lead'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeLead.id,
            name: activeLead.name,
            phone: activeLead.phone,
            email: activeLead.email,
            source: 'breathing_assessment_tool',
            step: 'Completed OA Breathing Assessment',
            status: 'completed',
            scores: {
              totalDysfunctionScore: totalScore,
              maxScore: 48,
              rating: ratingTitle,
              boltScore: boltRecorded || answers['oa_q16']?.seconds || 'Not tested'
            },
            answers
          })
        });
        setSavedSuccess(true);
      } catch (e) {
        console.warn('Lead save notice:', e);
      } finally {
        setIsSavingLead(false);
      }
    }
  };

  const handleDownloadBreathingScorecard = () => {
    const clientName = leadInfo?.name || leadName || 'Valued Client';
    const clientPhone = leadInfo?.phone || leadPhone || 'Not provided';
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Oxygen Advantage Breathing Scorecard — ${clientName} | Reshmi Verma</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #F4FBFB;
      color: #121214;
      line-height: 1.6;
      padding: 30px 20px;
    }
    .report-card {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 18px;
      border: 1px solid #CCFBF1;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .report-header {
      background: linear-gradient(135deg, #0A0E0C 0%, #17261E 100%);
      color: #FFFFFF;
      padding: 36px 32px;
      border-bottom: 4px solid rgb(1, 183, 180);
    }
    .brand-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .client-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      background: rgba(255, 255, 255, 0.08);
      padding: 16px;
      border-radius: 12px;
      margin-top: 20px;
      font-size: 13px;
    }
    .client-meta div strong { color: rgb(1, 183, 180); display: block; font-size: 11px; text-transform: uppercase; }
    .report-body { padding: 36px 32px; }
    .score-banner {
      background: #E6FCFB;
      border: 1.5px solid rgb(1, 183, 180);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin-bottom: 30px;
    }
    .score-value {
      font-size: 52px;
      font-weight: 800;
      color: #0D9488;
      line-height: 1;
      margin: 8px 0;
    }
    .score-tier {
      font-size: 20px;
      font-weight: 700;
      color: #121214;
    }
    .next-steps {
      background: #F0FDF4;
      border: 1px solid #86EFAC;
      border-radius: 14px;
      padding: 20px;
      margin-top: 24px;
    }
    .btn-booking {
      display: inline-block;
      margin-top: 14px;
      background: rgb(1, 183, 180);
      color: #121214 !important;
      text-decoration: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 14px;
    }
    .report-footer {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="report-header">
      <div style="display:inline-block;background:rgba(0,229,217,0.2);color:rgb(1, 183, 180);font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;margin-bottom:12px;">Oxygen Advantage® Clinical Assessment</div>
      <div class="brand-title">HealthwithReshmi™</div>
      <div style="font-size:13px;opacity:0.85;">Reshmi Verma &bull; Certified Oxygen Advantage® Coach (#13 India)</div>
      
      <div class="client-meta">
        <div><strong>Patient Name</strong>${clientName}</div>
        <div><strong>Date Generated</strong>${currentDate}</div>
        <div><strong>Recorded BOLT Score</strong>${boltRecorded ? `${boltRecorded} Seconds` : 'Not recorded'}</div>
        <div><strong>Phone</strong>${clientPhone}</div>
      </div>
    </div>

    <div class="report-body">
      <div class="score-banner">
        <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Dysfunctional Breathing Score</div>
        <div class="score-value">${totalScore} <span style="font-size: 24px; color: #64748B; font-weight: 500;">/ 48</span></div>
        <div class="score-tier">${ratingTitle}</div>
        <p style="font-size: 13px; color: #475569; margin-top: 8px; max-width: 580px; margin-left: auto; margin-right: auto;">
          ${ratingSummary}
        </p>
      </div>

      <div class="next-steps">
        <h4 style="color:#166534;font-size:16px;margin-bottom:6px;">Next Clinical Step: 1-on-1 Oxygen Advantage Reset</h4>
        <p style="color:#14532D;font-size:13px;">
          Dysfunctional breathing patterns and low CO₂ tolerance directly diminish cellular ATP and trigger nervous system tension. Work 1-on-1 with Reshmi Verma to reset your biomechanical, biochemical, and psychophysiological breathing rhythms.
        </p>
        <a href="https://rzp.io/rzp/healthwithreshmi" class="btn-booking" target="_blank">
          Book 1-on-1 Oxygen Advantage Consultation &rarr;
        </a>
      </div>
    </div>

    <div class="report-footer">
      <strong>HealthwithReshmi™ &bull; Oxygen Advantage Clinical Coaching</strong><br>
      Official Clinical Assessment Snapshot.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedName = clientName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `Reshmi_Verma_Oxygen_Advantage_Scorecard_${sanitizedName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container assessment-widescreen-container">

        {/* Header Clinical Credential Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)', margin: '0 0 10px', lineHeight: 1.2 }}>
            Oxygen Advantage® Functional Breathing Assessment
          </h1>


          {/* Progress Indicator */}
          {!isCompleted && leadInfo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              {OA_SECTIONS.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setCurrentPillar(idx)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: '1.5px solid',
                    borderColor: currentPillar === idx ? 'rgb(1, 183, 180)' : 'var(--border-subtle)',
                    background: currentPillar === idx ? '#EBF9F8' : 'white',
                    color: currentPillar === idx ? '#167A71' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {sec.number}. {sec.title.split('—')[1]?.trim() || sec.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            RESULTS VIEW (AFTER COMPLETION)
            ========================================================================= */}
        {isCompleted ? (
          <div className="card" style={{ padding: '36px 30px', borderRadius: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.08)', border: '1px solid var(--border-medium)', background: '#FFFFFF' }}>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '999px', background: `${ratingColor}15`, color: ratingColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                {ratingBadge}
              </span>
              <h2 style={{ fontSize: '2rem', color: ratingColor, margin: '0 0 8px' }}>
                {ratingTitle}
              </h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Total Dysfunction Score: <span style={{ fontSize: '1.6rem', color: ratingColor }}>{totalScore}</span> / 48
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '12px auto 0', lineHeight: 1.6 }}>
                {ratingSummary}
              </p>
            </div>

            {/* Score Metric Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>BOLT Score</span>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--emerald-deep)', margin: '6px 0 2px' }}>
                  {boltRecorded ? `${boltRecorded}s` : answers['oa_q16']?.tag?.split(' ')[2] || 'Checked'}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>CO₂ Tolerance Benchmark</span>
              </div>

              <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Questions Answered</span>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--emerald-deep)', margin: '6px 0 2px' }}>
                  {totalAnswered} / 16
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>100% Completed</span>
              </div>

              <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clinical Specialist</span>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--emerald-deep)', margin: '8px 0 2px' }}>
                  Reshmi Verma
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Oxygen Advantage India</span>
              </div>
            </div>

            {/* Direct Scorecard Download Action Card */}
            <div
              style={{
                background: '#F0FDFA',
                border: '1.5px solid rgb(1, 183, 180)',
                borderRadius: '20px',
                padding: '24px 28px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 8px 25px rgba(0, 229, 217, 0.12)'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#0F766E', fontWeight: 800 }}>
                  Download Your Oxygen Advantage® Scorecard
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                  Save your complete BOLT assessment, dysfunctional score breakdown, and custom vagal breathing drills directly to your device.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBreathingScorecard}
                className="btn btn-primary"
                style={{
                  background: '#0D9488',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <span>📥</span>
                <span>Download Scorecard Report</span>
              </button>
            </div>

            {/* Reshmi Clinical Roadmap CTA */}
            <div style={{ padding: '28px 24px', borderRadius: '20px', background: 'linear-gradient(135deg, #0A0E0C 0%, #17261E 100%)', color: '#FFFFFF', textAlign: 'center', marginBottom: '24px', boxShadow: '0 12px 30px rgba(0,0,0,0.18)' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'rgb(1, 183, 180)', margin: '0 0 8px', fontWeight: 800 }}>
                Restore Your Cellular Oxygen Delivery with Reshmi Verma
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', maxWidth: '620px', margin: '0 auto 20px', lineHeight: 1.55 }}>
                Dysfunctional breathing can be systematically reversed in 4–6 weeks through targeted nasal rehabilitation, diaphragmatic vagal pacing, and simulated high-altitude hypoxic breath holds.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={RAZORPAY_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '13px 28px',
                    background: 'rgb(1, 183, 180)',
                    color: '#121214',
                    fontWeight: 800,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 229, 217, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 229, 217, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 217, 0.35)';
                  }}
                >
                  <span>📅</span> Book 1-on-1 Oxygen Advantage Consultation
                </a>
                {/* <button
                  type="button"
                  onClick={handleDownloadBreathingScorecard}
                  style={{
                    padding: '12px 24px',
                    background: '#FFFFFF',
                    color: '#0D827B',
                    border: '1.5px solid rgb(1, 183, 180)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E6FCFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <span>📥</span> Direct Download Scorecard
                </button> */}
                <Link
                  to="/assessment"
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    border: '1.5px solid rgba(255, 255, 255, 0.45)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.borderColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                  }}
                >
                  Take Functional Gut Health Assessment
                </Link>
              </div>
            </div>

            {/* Restart button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setIsCompleted(false);
                  setCurrentPillar(0);
                  setBoltSeconds(0);
                  setBoltRecorded(null);
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.88rem' }}
              >
                🔄 Retake Breathing Assessment
              </button>
            </div>
          </div>
        ) : !leadInfo ? (
          /* =========================================================================
             PRE-ASSESSMENT LEAD GATE VIEW (DIRECT VISITOR LEAD CAPTURE)
             ========================================================================= */
          <div className="glass-assessment-card" style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ marginBottom: '12px' }}>
              <span className="badge-pill" style={{ background: '#EBF9F8', color: '#167A71', borderColor: '#9FE3DD' }}>
                <span className="pulse-dot" style={{ background: 'rgb(1, 183, 180)' }}></span>
                <span>Step 1 of 2 &bull; Oxygen Advantage® Intake</span>
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#121214', margin: '0 0 10px 0', fontFamily: 'var(--font-serif)' }}>
              Functional Breathing Assessment
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Please provide your contact information to begin your certified 16-question functional breathing assessment.
            </p>

            {leadError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', textAlign: 'left' }}>
                ⚠️ {leadError}
              </div>
            )}

            <form onSubmit={handleStartFromGate} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Email Address <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={leadSaving}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginTop: '8px',
                  borderRadius: '12px',
                  background: 'rgb(1, 183, 180)',
                  color: '#121214',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {leadSaving ? 'Initializing Assessment...' : 'Begin Oxygen Advantage® Breathing Assessment →'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                🔒 100% Confidential Clinical Evaluation &bull; Zero Spam Guarantee
              </div>
            </form>
          </div>
        ) : (
          /* =========================================================================
             ASSESSMENT ACTIVE VIEW (PILLARS + QUESTIONS)
             ========================================================================= */
          <div>

            {/* Interactive BOLT Timer Widget */}
            <div className="card" style={{ padding: '24px', borderRadius: '20px', background: '#EBF9F8', border: '1.5px solid #9FE3DD', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#167A71' }}>
                    Patrick McKeown's Signature Test
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: '#121214', margin: '4px 0 2px' }}>
                    Live BOLT Score Stopwatch
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '520px' }}>
                    Normal exhale through nose &rarr; pinch nose &rarr; start timer &rarr; stop at first natural urge to breathe.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: '#121214', minWidth: '70px', textAlign: 'center' }}>
                    {boltSeconds}s
                  </div>
                  {!isBoltRunning ? (
                    <button
                      type="button"
                      onClick={handleStartBolt}
                      className="btn"
                      style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'rgb(1, 183, 180)', color: '#121214', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      ▶️ Start BOLT Test
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopBolt}
                      className="btn"
                      style={{ padding: '10px 20px', fontSize: '0.9rem', background: '#DC2626', color: '#FFFFFF', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      ⏹️ Stop &amp; Record
                    </button>
                  )}
                </div>
              </div>
              {boltRecorded !== null && (
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#167A71', fontWeight: 700 }}>
                  ✅ Recorded BOLT: {boltRecorded} seconds &bull; Automatically applied to Question 16!
                </div>
              )}
            </div>

            {/* Current Pillar Questions */}
            {OA_SECTIONS.map((section, sIdx) => {
              if (sIdx !== currentPillar) return null;

              return (
                <div key={section.id}>
                  {/* Pillar Banner */}
                  <div style={{ marginBottom: '22px', padding: '16px 20px', borderRadius: '16px', background: '#FAF9F6', borderLeft: '4px solid rgb(1, 183, 180)', borderTop: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#167A71', textTransform: 'uppercase' }}>
                      {section.badge}
                    </div>
                    <h2 style={{ fontSize: '1.45rem', color: '#121214', margin: '4px 0 4px' }}>
                      {section.title}
                    </h2>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {section.desc}
                    </p>
                  </div>

                  {/* Question Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {section.questions.map((q) => {
                      const selected = answers[q.id];

                      return (
                        <div
                          key={q.id}
                          className="card"
                          style={{
                            padding: '24px',
                            borderRadius: '18px',
                            border: selected ? '1.5px solid rgb(1, 183, 180)' : '1px solid var(--border-subtle)',
                            background: '#FFFFFF',
                            boxShadow: selected ? '0 8px 24px rgba(0, 229, 217,0.12)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <h3 style={{ fontSize: '1.12rem', color: '#121214', margin: '0 0 6px', fontWeight: 700 }}>
                            {q.title}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 0 16px' }}>
                            {q.subtitle}
                          </p>

                          {/* Options grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                            {q.options.map((opt, oIdx) => {
                              const isOptSelected = selected?.score === opt.score && selected?.label === opt.label;

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, opt)}
                                  style={{
                                    textAlign: 'left',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    border: '1.5px solid',
                                    borderColor: isOptSelected ? 'rgb(1, 183, 180)' : 'var(--border-subtle)',
                                    background: isOptSelected ? '#EBF9F8' : '#FAF9F6',
                                    color: isOptSelected ? '#121214' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.88rem',
                                    lineHeight: 1.45,
                                    fontWeight: isOptSelected ? 600 : 400,
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px'
                                  }}
                                >
                                  <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: '2px solid',
                                    borderColor: isOptSelected ? 'rgb(1, 183, 180)' : '#CBD5E1',
                                    background: isOptSelected ? 'rgb(1, 183, 180)' : 'white',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                  }}></span>
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation between pillars */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', gap: '14px', flexWrap: 'wrap' }}>
                    {currentPillar > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPillar((prev) => prev - 1);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '10px 22px' }}
                      >
                        &larr; Previous Pillar
                      </button>
                    ) : <div />}

                    {currentPillar < OA_SECTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPillar((prev) => prev + 1);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className="btn btn-primary"
                        style={{ padding: '12px 28px', background: '#121214', color: '#FFFFFF' }}
                      >
                        Next Pillar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinish}
                        className="btn btn-primary btn-lg"
                        style={{ padding: '14px 36px', background: 'rgb(1, 183, 180)', color: '#121214', fontWeight: 800, border: 'none' }}
                      >
                        📊 View My Oxygen Advantage Scorecard &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
