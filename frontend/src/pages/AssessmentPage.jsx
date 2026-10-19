import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

// 3 Clinical Sections for Focused Functional Health Evaluation
const ASSESSMENT_SECTIONS = [
  {
    id: 'section_gut',
    sectionNumber: 1,
    sectionTitle: 'Section 1 — Gut Mucosal & Digestive Health',
    sectionBadge: 'Gastrointestinal Ecosystem',
    sectionDesc: 'Decoding intestinal permeability, microbiome fermentation, and stomach acid kinetics.',
    questions: [
      {
        id: 'q1_bloat',
        title: 'When do you typically experience bloating, gas, or distension?',
        subtitle: 'The timing of post-meal bloating reveals which section of your digestive tract is struggling.',
        options: [
          {
            label: 'Severe distension within 30–45 mins of eating (Upper GI / Low Stomach Acid signal)',
            score: 35,
            tag: 'Hypochlorhydria / Upper GI'
          },
          {
            label: 'Lower abdominal bloating late evening or 2–3 hours after meals (Fermentation / Dysbiosis / SIBO)',
            score: 45,
            tag: 'Microbiome Fermentation / SIBO'
          },
          {
            label: 'Frequent acid reflux, heartburn, or persistent chest heaviness after meals',
            score: 40,
            tag: 'Gastroesophageal Reflux / LES Laxity'
          },
          {
            label: 'No visible distension, but chronic post-meal sluggishness and slow digestion',
            score: 65,
            tag: 'Sluggish Motility'
          },
          {
            label: 'Flat stomach, effortless digestion with zero post-meal discomfort (Optimal)',
            score: 95,
            tag: 'Optimal Digestive Ease'
          }
        ]
      },
      {
        id: 'q2_motility',
        title: 'How would you classify your bowel motility & stool consistency?',
        subtitle: 'Daily elimination is the primary exit pathway for metabolized hormones and cellular toxins.',
        options: [
          {
            label: 'Hard, pellet-like stools or skipping bowel movements for 1–2 days (Constipation / Slow Transit)',
            score: 35,
            tag: 'Constipation & Toxin Reabsorption'
          },
          {
            label: 'Urgent, loose, or undigested food particles in stool (Rapid Transit / Nutrient Malabsorption)',
            score: 40,
            tag: 'Malabsorption / Permeability'
          },
          {
            label: 'Alternating between constipation and loose stools (IBS-Mixed Pattern)',
            score: 45,
            tag: 'Enteric Nervous Irritability'
          },
          {
            label: 'Daily smooth, well-formed, effortless bowel movement (Optimal Bristol Type 4)',
            score: 95,
            tag: 'Balanced Intestinal Motility'
          }
        ]
      },
      {
        id: 'q3_reactivity',
        title: 'Do you experience food sensitivities or inflammatory reactions?',
        subtitle: 'Intestinal permeability (Leaky Gut) allows macromolecular antigens into systemic circulation.',
        options: [
          {
            label: 'React strongly to gluten, dairy, high-FODMAPs, or oily restaurant meals (Severe Leaky Gut)',
            score: 30,
            tag: 'Systemic Endotoxemia & Reactivity'
          },
          {
            label: 'Brain fog, joint aches, or skin flare-ups/acne within 24 hours of certain foods',
            score: 45,
            tag: 'Immune Complex Flare'
          },
          {
            label: 'Mild occasional discomfort, but can generally tolerate most whole foods',
            score: 70,
            tag: 'Moderate Tolerance'
          },
          {
            label: 'Can digest diverse whole, fermented, and fibrous foods with zero systemic flare-ups',
            score: 95,
            tag: 'High Immunological Tolerance'
          }
        ]
      }
    ]
  },
  {
    id: 'section_breath',
    sectionNumber: 2,
    sectionTitle: 'Section 2 — Autonomic Breath & Vagal Tone',
    sectionBadge: 'Respiratory & Nervous System',
    sectionDesc: 'Measuring CO₂ tolerance, diaphragmatic mechanics, and parasympathetic brake capacity.',
    questions: [
      {
        id: 'q4_breathing_pattern',
        title: 'What is your involuntary daytime breathing pattern?',
        subtitle: 'Over-breathing depletes CO₂, preventing hemoglobin from releasing oxygen to your brain via the Bohr Effect.',
        options: [
          {
            label: 'Frequent upper-chest breathing, sighing, yawning, or feeling of "air hunger"',
            score: 35,
            tag: 'Chronic Hyperventilation'
          },
          {
            label: 'Mouth breathing during focused desk work, speech, or light physical exertion',
            score: 45,
            tag: 'Airway Collapse & Mouth Breathing'
          },
          {
            label: 'Nasal breathing mostly, but chest moves instead of diaphragm when stressed',
            score: 65,
            tag: 'Dysfunctional Biomechanics'
          },
          {
            label: 'Silent, calm, diaphragmatic nasal breathing (Inhale & exhale through nose 24/7)',
            score: 95,
            tag: 'Optimal Respiration Mechanics'
          }
        ]
      },
      {
        id: 'q5_stress_vagal',
        title: 'How does your nervous system respond to acute daily stress?',
        subtitle: 'The vagus nerve regulates heart rate variability (HRV), bile flow, and emotional recovery.',
        options: [
          {
            label: 'Constant sympathetic overdrive: Racing heart, muscle tightness, anxiety surges, mental overwhelm',
            score: 30,
            tag: 'Low Vagal Tone / Sympathetic Overdrive'
          },
          {
            label: 'Afternoon energy slump paired with agitation, irritability, or brain fog under pressure',
            score: 50,
            tag: 'HPA-Axis Instability'
          },
          {
            label: 'Experience work stress, but can unwind after a few hours with conscious effort',
            score: 70,
            tag: 'Moderate Nervous Regulation'
          },
          {
            label: 'Resilient vagal brake: Quick emotional reset, calm pulse, high somatic composure',
            score: 95,
            tag: 'Elite Vagal Tone'
          }
        ]
      },
      {
        id: 'q6_stamina',
        title: 'How is your physical stamina and aerobic breath-hold capacity?',
        subtitle: 'Tolerance to carbon dioxide is the true bottleneck of aerobic performance and energy.',
        options: [
          {
            label: 'Get breathless climbing 1–2 flights of stairs; breath-hold capacity is under 15 seconds',
            score: 35,
            tag: 'Low CO₂ Tolerance'
          },
          {
            label: 'Moderate stamina, but experience intense physical exhaustion after normal gym or workday',
            score: 55,
            tag: 'Mitochondrial Aerobic Deficit'
          },
          {
            label: 'Decent stamina during exercise, but recovery takes 24–48 hours',
            score: 70,
            tag: 'Moderate Aerobic Buffer'
          },
          {
            label: 'High aerobic stamina, easy nasal workouts, effortless recovery, BOLT score 30s+',
            score: 95,
            tag: 'Optimal Cellular Respiration'
          }
        ]
      }
    ]
  },
  {
    id: 'section_metabolic',
    sectionNumber: 3,
    sectionTitle: 'Section 3 — Circadian Rhythm, Hormones & Cellular Energy',
    sectionBadge: 'Endocrine & Mitochondrial Vitality',
    sectionDesc: 'Analyzing cortisol rhythms, thyroid/insulin sensitivity, and deep sleep architecture.',
    questions: [
      {
        id: 'q7_sleep',
        title: 'How is your nighttime sleep architecture and morning wakefulness?',
        subtitle: 'Fragmented sleep triggers high morning fasting glucose and suppresses cellular repair.',
        options: [
          {
            label: 'Fragmented sleep, frequent waking around 2–4 AM, or waking up gasping with dry mouth',
            score: 30,
            tag: 'Circadian Disruption / Airway Instability'
          },
          {
            label: 'Take over 45 minutes to fall asleep due to racing thoughts; dependent on screens or pills',
            score: 45,
            tag: 'Delayed Melatonin Phase'
          },
          {
            label: 'Sleep 7–8 hours, but wake up feeling heavy, sluggish, and unrefreshed without caffeine',
            score: 60,
            tag: 'Mitochondrial Sleep Deficit'
          },
          {
            label: 'Deep, restorative, uninterrupted sleep; wake up refreshed before alarm (Optimal)',
            score: 95,
            tag: 'Synchronized Circadian Rhythm'
          }
        ]
      },
      {
        id: 'q8_metabolic_signals',
        title: 'Which metabolic or hormonal pattern resonates most with you?',
        subtitle: 'Hormones act as biochemical messengers—insulin and thyroid dictate cellular energy.',
        options: [
          {
            label: 'Stubborn belly fat, intense post-meal sweet cravings, or shaky feeling if meals are delayed',
            score: 35,
            tag: 'Insulin Resistance & Reactive Hypoglycemia'
          },
          {
            label: 'Cold hands/feet, hair thinning, sluggish metabolism, or irregular menstrual cycles / PCOS',
            score: 40,
            tag: 'Thyroid & Endocrine Imbalance'
          },
          {
            label: 'Energy drops drastically between 3 PM – 5 PM, but otherwise manageable',
            score: 65,
            tag: 'Cortisol Rhythm Dip'
          },
          {
            label: 'Stable all-day cellular energy, balanced body composition, zero urgent sugar cravings',
            score: 95,
            tag: 'High Metabolic Plasticity'
          }
        ]
      },
      {
        id: 'q9_duration',
        title: 'How long have you been navigating these health roadblocks?',
        subtitle: 'Understanding the chronic timeline helps calibrate the therapeutic mucosal regeneration phase.',
        options: [
          {
            label: 'Less than 6 months (Acute onset — quick cellular responsiveness expected)',
            score: 90,
            tag: 'Acute Phase'
          },
          {
            label: '6 months to 2 years (Establishing multi-system compensation pattern)',
            score: 70,
            tag: 'Sub-Chronic Phase'
          },
          {
            label: '2 to 5 years (Deeply ingrained cellular dysfunction and systemic adaptation)',
            score: 50,
            tag: 'Chronic Phase'
          },
          {
            label: 'More than 5 years (Multi-decade metabolic burnout — requires phased root-cause roadmap)',
            score: 35,
            tag: 'Deep Chronic Adaptation'
          }
        ]
      }
    ]
  }
];

export default function AssessmentPage() {
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndexInSection, setCurrentQuestionIndexInSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  // Lead Info State (retrieved from welcome popup or pre-assessment gate)
  const [leadInfo, setLeadInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('reshmi_assessment_lead');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  // Pre-Assessment Gate Form state (if user landed on /assessment directly)
  const [leadName, setLeadName] = useState(user?.name || '');
  const [leadPhone, setLeadPhone] = useState(user?.phone || '');
  const [leadEmail, setLeadEmail] = useState(user?.email || '');
  const [leadError, setLeadError] = useState('');
  const [leadSaving, setLeadSaving] = useState(false);

  useEffect(() => {
    if (user && !leadInfo) {
      if (user.name) setLeadName(user.name);
      if (user.phone) setLeadPhone(user.phone);
      if (user.email) setLeadEmail(user.email);
    }
  }, [user, leadInfo]);

  const currentSection = ASSESSMENT_SECTIONS[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndexInSection];

  const totalQuestions = ASSESSMENT_SECTIONS.reduce((acc, sec) => acc + sec.questions.length, 0);
  const currentAbsoluteQuestionIndex = ASSESSMENT_SECTIONS.slice(0, currentSectionIndex).reduce((acc, sec) => acc + sec.questions.length, 0) + currentQuestionIndexInSection;
  const progressPercent = Math.round(((currentAbsoluteQuestionIndex + 1) / totalQuestions) * 100);

  const handleStartFromGate = async (e) => {
    e.preventDefault();
    setLeadError('');
    if (!leadName.trim()) {
      setLeadError('Please enter your full name.');
      return;
    }
    if (!leadPhone.trim() || leadPhone.trim().length < 8) {
      setLeadError('Please enter a valid WhatsApp or Mobile number.');
      return;
    }

    setLeadSaving(true);
    try {
      const payload = {
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim().toLowerCase(),
        source: 'assessment_gate',
        step: 'Started Assessment (Section 1 - Gut)',
        status: 'in_progress'
      };

      const res = await fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const leadId = data?.lead?.id || `lead_${Date.now()}`;
      const info = {
        id: leadId,
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim()
      };
      setLeadInfo(info);
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(info));
    } catch (err) {
      const info = {
        id: `lead_${Date.now()}`,
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim()
      };
      setLeadInfo(info);
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(info));
    } finally {
      setLeadSaving(false);
    }
  };

  const selectAnswer = (option) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: option
    };
    setAnswers(updatedAnswers);

    // Background sync to backend so Admin knows in real-time which question user reached
    const currentLead = leadInfo || (function() {
      try {
        const stored = localStorage.getItem('reshmi_assessment_lead');
        return stored ? JSON.parse(stored) : null;
      } catch (e) { return null; }
    })();

    if (currentLead && currentLead.id) {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentLead.id,
          name: currentLead.name,
          phone: currentLead.phone,
          email: currentLead.email,
          step: `Part ${currentSection.sectionNumber}: Q${currentAbsoluteQuestionIndex + 1} (${currentQuestion.title})`,
          answers: updatedAnswers,
          status: 'in_progress'
        })
      }).catch(() => {});
    }

    if (currentQuestionIndexInSection < currentSection.questions.length - 1) {
      setCurrentQuestionIndexInSection(currentQuestionIndexInSection + 1);
    } else if (currentSectionIndex < ASSESSMENT_SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndexInSection(0);
    } else {
      computeConciseResults(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndexInSection > 0) {
      setCurrentQuestionIndexInSection(currentQuestionIndexInSection - 1);
    } else if (currentSectionIndex > 0) {
      const prevSecIdx = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSecIdx);
      setCurrentQuestionIndexInSection(ASSESSMENT_SECTIONS[prevSecIdx].questions.length - 1);
    }
  };

  const computeConciseResults = (allAnswers) => {
    // 1. Gut Mucosal Score
    const gutScores = [
      allAnswers['q1_bloat']?.score ?? 50,
      allAnswers['q2_motility']?.score ?? 50,
      allAnswers['q3_reactivity']?.score ?? 50
    ];
    const gutScore = Math.round(gutScores.reduce((a, b) => a + b, 0) / gutScores.length);

    // 2. Breath Score
    const breathScores = [
      allAnswers['q4_breathing_pattern']?.score ?? 50,
      allAnswers['q5_stress_vagal']?.score ?? 50,
      allAnswers['q6_stamina']?.score ?? 50
    ];
    const breathScore = Math.round(breathScores.reduce((a, b) => a + b, 0) / breathScores.length);

    // 3. Metabolic Score
    const metabolicScores = [
      allAnswers['q7_sleep']?.score ?? 50,
      allAnswers['q8_metabolic_signals']?.score ?? 50,
      allAnswers['q9_duration']?.score ?? 50
    ];
    const metabolicScore = Math.round(metabolicScores.reduce((a, b) => a + b, 0) / metabolicScores.length);

    // Composite Resilience
    const compositeResilience = Math.round((gutScore + breathScore + metabolicScore) / 3);

    // CONCISE, PUNCHY CLINICAL DIRECTIVES (No overwhelming essays)
    const gutSummary = gutScore < 60
      ? {
          status: 'High Mucosal Permeability & Dysbiosis',
          severity: 'Critical Priority',
          color: '#DC2626',
          insight: 'Tight junctions and stomach acid kinetics are compromised. Do not self-treat with random probiotics; phased mucosal repair is required.'
        }
      : {
          status: 'Stable Intestinal Mucosal Barrier',
          severity: 'Optimal Function',
          color: '#15803D',
          insight: 'Healthy digestive baseline. Maintain clean dietary fat sources and regular migrating motor complex (MMC) fasting intervals.'
        };

    const breathSummary = breathScore < 60
      ? {
          status: 'Sympathetic Overdrive & Low CO₂ Tolerance',
          severity: 'Critical Priority',
          color: '#DC2626',
          insight: 'Upper-chest over-breathing suppresses oxygen delivery via the Bohr Effect. Oxygen Advantage autonomic retraining is recommended.'
        }
      : {
          status: 'Balanced Autonomic & Vagal Regulation',
          severity: 'Optimal Function',
          color: '#15803D',
          insight: 'High parasympathetic resilience and healthy diaphragmatic pacing supporting cellular oxygen diffusion.'
        };

    const metabolicSummary = metabolicScore < 60
      ? {
          status: 'Cortisol-Insulin Rhythm Friction',
          severity: 'Action Required',
          color: '#D97706',
          insight: 'Nighttime waking and afternoon energy dips indicate HPA-axis stress. A clinical Fasting Insulin & Full Thyroid panel is strongly advised.'
        }
      : {
          status: 'Resilient Endocrine & Circadian Plasticity',
          severity: 'Optimal State',
          color: '#15803D',
          insight: 'Synchronized sleep architecture and stable cellular glucose kinetics maintaining steady all-day vitality.'
        };

    const isCriticalOverall = compositeResilience < 60 || gutScore < 50 || breathScore < 50;

    const calculated = {
      compositeResilience,
      gutScore,
      breathScore,
      metabolicScore,
      gutSummary,
      breathSummary,
      metabolicSummary,
      isCriticalOverall
    };

    setResults(calculated);

    // Save final scores to backend lead record
    const currentLead = leadInfo || (function() {
      try {
        const stored = localStorage.getItem('reshmi_assessment_lead');
        return stored ? JSON.parse(stored) : null;
      } catch (e) { return null; }
    })();

    if (currentLead && currentLead.id) {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentLead.id,
          name: currentLead.name,
          phone: currentLead.phone,
          email: currentLead.email,
          step: 'Completed Assessment - Ready for Consultation',
          answers: allAnswers,
          scores: calculated,
          status: 'completed_not_booked'
        })
      }).catch(() => {});
    }

    try {
      localStorage.setItem('reshmi_assessment_results', JSON.stringify({
        compositeResilience,
        averageResilience: compositeResilience,
        gutScore,
        breathScore,
        metabolicScore,
        goal: '360° Gut, Breath & Metabolic Restoration',
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
  };

  const restartAssessment = () => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndexInSection(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <>
      <section className="assessment-page-layout">
        <div className="container assessment-widescreen-container">
          
          {/* Dual Assessment Track Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <Link 
              to="/assessment"
              style={{ 
                padding: '8px 18px', 
                fontSize: '0.86rem', 
                borderRadius: '999px', 
                background: '#FDF1EB', 
                color: '#FF007F', 
                border: '1.5px solid #F7BA9E', 
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🌸 Functional Health Assessment
            </Link>
            <Link 
              to="/breathing-assessment"
              style={{ 
                padding: '8px 18px', 
                fontSize: '0.86rem', 
                borderRadius: '999px', 
                background: '#FFFFFF', 
                color: 'var(--text-secondary)', 
                border: '1.5px solid var(--border-subtle)', 
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🫁 Functional Breathing Assessment
            </Link>
          </div>

          {/* Step 0: Gate Card (if user arrived directly without popup info) */}
          {!results && !leadInfo ? (
            <div className="glass-assessment-card" style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '16px' }}>
                🌱
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span className="badge-pill">
                  <span className="pulse-dot"></span>
                  <span>Step 1 of 2 &bull; Contact Registration</span>
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--emerald-deep)', margin: '0 0 10px 0' }}>
                Where Should We Send Your Clinical Scorecard?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Please provide your contact information to begin your 2-minute functional health assessment. Reshmi Verma's clinical team will calibrate your report across gut mucosal, vagal breath, and circadian markers.
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
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    WhatsApp / Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input 
                    type="tel" 
                    value={leadPhone} 
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
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
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={leadSaving}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                >
                  <span>{leadSaving ? 'Initializing Assessment...' : 'Begin 2-Min Assessment Now &rarr;'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeadInfo({ id: `lead_${Date.now()}`, name: 'Guest Client', phone: '', email: '' })}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border-subtle)', fontSize: '0.86rem', padding: '10px' }}
                >
                  <span>Or start questions directly &rarr;</span>
                </button>
              </form>
              <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                🔒 100% Free &bull; Zero spam &bull; Confidential clinical diagnostics
              </div>
            </div>
          ) : !results ? (
            /* Active Quiz View */
            <div className="glass-assessment-card" id="assessment-quiz-container">
              
              {/* Top Progress & Section Indicator */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  {currentAbsoluteQuestionIndex > 0 ? (
                    <button 
                      type="button" 
                      onClick={handlePrevious}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '5px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.85)' }}
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <div style={{ width: '60px' }}></div>
                  )}

                  <span style={{ 
                    background: 'var(--status-optimal-bg)',
                    color: 'var(--emerald-primary)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {currentSection.sectionBadge} &bull; Part {currentSection.sectionNumber} of 3
                  </span>

                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>
                    Q{currentAbsoluteQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progressPercent}%`, 
                    background: 'linear-gradient(90deg, var(--emerald-medium) 0%, var(--emerald-primary) 100%)',
                    transition: 'width 0.35s ease'
                  }}></div>
                </div>
              </div>

              {/* Section Header Strip */}
              <div style={{ 
                background: 'rgba(255, 247, 237, 0.95)', 
                borderLeft: '4px solid var(--emerald-primary)', 
                padding: '12px 18px', 
                borderRadius: '10px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-deep)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {currentSection.sectionTitle}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {currentSection.sectionDesc}
                </div>
              </div>

              {/* Question Header - Centered */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--emerald-deep)', marginBottom: '8px', lineHeight: 1.35, textAlign: 'center' }}>
                  {currentQuestion.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: '0 auto', maxWidth: '620px', lineHeight: 1.55, textAlign: 'center' }}>
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectAnswer(option)}
                    className="glass-option-btn"
                  >
                    <span>{option.label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--emerald-primary)', flexShrink: 0, marginLeft: '12px' }}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                ))}
              </div>

            </div>
          ) : (
            /* ============================================================== */
            /* RESULTS VIEW: CONCISE GLASSMORPHIC TAKEAWAYS + DIRECT CALL-TO-ACTION */
            /* ============================================================== */
            <div id="assessment-results-box" className="glass-assessment-card" style={{ padding: '36px 30px' }}>
              
              {/* Snapshot Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span className="badge-pill" style={{ marginBottom: '10px' }}>
                  <span className="pulse-dot"></span>
                  <span>Clinical Snapshot Complete</span>
                </span>
                <h1 style={{ fontSize: '2.1rem', margin: '4px 0 8px', color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>
                  Your Biological Resilience Profile
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
                  Evaluated across Gut Permeability, Respiration Vagal Tone, and Circadian Endocrine Rhythms.
                </p>
              </div>

              {/* Composite Overall Index Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,237,213,0.7) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'center',
                border: '1px solid rgba(194,65,12,0.25)',
                marginBottom: '26px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                  Composite Health Resilience Index
                </span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3.8rem', fontWeight: 700, color: 'var(--emerald-deep)', lineHeight: 1.1, margin: '4px 0' }}>
                  {results.compositeResilience}%
                </div>
                <div style={{ fontSize: '0.92rem', color: results.isCriticalOverall ? '#DC2626' : 'var(--emerald-primary)', fontWeight: 700 }}>
                  {results.isCriticalOverall ? '⚠️ Action Required: Priority Multi-System Friction Detected' : 'Optimal Baseline Function'}
                </div>
              </div>

              {/* ========================================================== */}
              {/* 3 CONCISE SECTIONAL CARDS WITH CLEAR MARKS */}
              {/* ========================================================== */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                
                {/* 1. Gut Mucosal Card */}
                <div className="glass-section-summary-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🌿</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)' }}>Gut Mucosal &amp; Digestive Barrier</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>{results.gutScore}/100</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: results.gutSummary.color, background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${results.gutSummary.color}` }}>
                        {results.gutSummary.severity}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Pattern:</strong> {results.gutSummary.status}. {results.gutSummary.insight}
                  </div>
                </div>

                {/* 2. Breath Card */}
                <div className="glass-section-summary-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🫁</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)' }}>Respiration, Bohr Effect &amp; Vagal Tone</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>{results.breathScore}/100</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: results.breathSummary.color, background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${results.breathSummary.color}` }}>
                        {results.breathSummary.severity}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Pattern:</strong> {results.breathSummary.status}. {results.breathSummary.insight}
                  </div>
                </div>

                {/* 3. Metabolic Card */}
                <div className="glass-section-summary-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>⚡</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)' }}>Circadian Rhythm &amp; Metabolic Energy</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>{results.metabolicScore}/100</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: results.metabolicSummary.color, background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${results.metabolicSummary.color}` }}>
                        {results.metabolicSummary.severity}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Pattern:</strong> {results.metabolicSummary.status}. {results.metabolicSummary.insight}
                  </div>
                </div>

              </div>

              {/* ========================================================== */}
              {/* HIGH-IMPACT DIRECT CLINICAL ACTION CALLOUT */}
              {/* ========================================================== */}
              <div style={{ 
                background: 'linear-gradient(135deg, var(--emerald-deep) 0%, #1E293B 100%)', 
                borderRadius: '18px', 
                padding: '28px 24px', 
                color: 'white', 
                textAlign: 'center',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                marginBottom: '22px'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  background: 'rgba(251, 146, 60, 0.25)', 
                  color: '#FED7AA', 
                  padding: '3px 12px', 
                  borderRadius: '16px', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  Clinical Recommendation
                </div>
                <h3 style={{ color: '#FFEDD5', fontSize: '1.45rem', margin: '0 0 8px', fontFamily: 'var(--font-serif)' }}>
                  Do Not Self-Medicate. Get Your Phased 90-Day Protocol.
                </h3>
                <p style={{ color: '#E2E8F0', maxWidth: '580px', margin: '0 auto 20px', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Your scores indicate interconnected gastrointestinal and breathing friction. Reshmi Verma correlates your symptoms with laboratory biomarkers to construct your individual recovery roadmap.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link 
                    to={`/booking?tier=healthClarity&name=${encodeURIComponent(leadInfo?.name || '')}&phone=${encodeURIComponent(leadInfo?.phone || '')}&email=${encodeURIComponent(leadInfo?.email || '')}`}
                    className="btn btn-primary" 
                    style={{ background: 'var(--emerald-medium)', color: 'white', fontWeight: 700, padding: '14px 28px', fontSize: '1rem', borderRadius: '14px' }}
                  >
                    <span>Book 1-on-1 Consultation With These Scores (₹1,999) &rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Retake */}
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  onClick={restartAssessment}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.7)' }}
                >
                  &larr; Retake Assessment
                </button>
              </div>

            </div>
          )}

        </div>
      </section>
    </>
  );
}
