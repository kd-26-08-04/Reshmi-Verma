import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    domain: 'challenge',
    title: 'What health challenge are you currently facing?',
    subtitle: 'Select the one that resonates most with your day-to-day feeling.',
    options: [
      { label: 'Gut issues: Bloating, acid reflux, IBS, food sensitivities, or sluggish motility', scores: { gut: 40, breath: 65, hormones: 55, sleep: 60 } },
      { label: 'Respiratory & stress: Shallow chest breathing, anxiety surges, or low stamina', scores: { gut: 60, breath: 40, hormones: 50, sleep: 55 } },
      { label: 'Metabolism & fatigue: Stubborn weight retention, thyroid drag, or afternoon crashes', scores: { gut: 55, breath: 60, hormones: 40, sleep: 50 } },
      { label: 'Sleep & airway: Fragmented sleep, snoring, mouth breathing, or morning exhaustion', scores: { gut: 65, breath: 50, hormones: 55, sleep: 35 } },
      { label: 'Longevity & prevention: Want to optimize cellular biomarkers and biohack vitality', scores: { gut: 75, breath: 80, hormones: 75, sleep: 75 } }
    ]
  },
  {
    id: 2,
    domain: 'duration',
    title: 'How long have you been experiencing this?',
    subtitle: "There's no wrong answer — we just want to understand your timeline.",
    options: [
      { label: 'Less than 6 months (Acute / recent onset)', multiplier: 1.1 },
      { label: '6 months to 2 years (Establishing pattern)', multiplier: 0.95 },
      { label: '2 to 5 years (Chronic systemic compensation)', multiplier: 0.85 },
      { label: 'More than 5 years (Deeply ingrained cellular dysfunction)', multiplier: 0.75 }
    ]
  },
  {
    id: 3,
    domain: 'history',
    title: 'Have you tried any treatments or coaching before?',
    subtitle: 'It is okay if you have — this helps Reshmi Verma understand your clinical background.',
    options: [
      { label: 'Conventional medications, PPIs, or pharmaceutical pills from doctors', tag: 'conventional' },
      { label: 'Standard diet plans, calorie counting, or generic fitness programs', tag: 'diets' },
      { label: 'Alternative therapies, ayurveda, or sporadic supplements', tag: 'holistic' },
      { label: 'No, this is my first time seeking root-cause functional guidance', tag: 'first-time' }
    ]
  },
  {
    id: 4,
    domain: 'goals',
    title: 'What is your primary goal for the next 90 days?',
    subtitle: 'What would genuine transformation look like in your life?',
    options: [
      { label: 'Heal gut lining, abolish bloating, and digest meals with complete ease', focus: 'gut' },
      { label: 'Master autonomic breathwork to silence anxiety and boost aerobic stamina', focus: 'breath' },
      { label: 'Rebalance hormones, achieve effortless fat loss, and sustain all-day energy', focus: 'metabolism' },
      { label: 'Restore uninterrupted deep REM sleep and wake up feeling truly energized', focus: 'sleep' },
      { label: 'Comprehensive 360° functional overhaul: Gut, breath, and cellular longevity', focus: 'all' }
    ]
  },
  {
    id: 5,
    domain: 'readiness',
    title: 'How ready are you to start your healing journey?',
    subtitle: "Be honest — there's no pressure. Just absolute clarity.",
    options: [
      { label: '100% Committed — Ready to follow a personalized clinical roadmap', readiness: 'high' },
      { label: 'Interested & motivated — Want to consult with Reshmi Verma first', readiness: 'medium' },
      { label: 'Gathering information — Curious to see my baseline health report', readiness: 'exploring' }
    ]
  }
];

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const selectAnswer = (index) => {
    const q = questions[currentQuestionIndex];
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = q.options[index];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndShowResults(newAnswers);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateAndShowResults = (answers) => {
    let gutScore = 60;
    let breathScore = 60;
    let hormoneScore = 60;
    let sleepScore = 60;

    if (answers[0]?.scores) {
      gutScore = answers[0].scores.gut;
      breathScore = answers[0].scores.breath;
      hormoneScore = answers[0].scores.hormones;
      sleepScore = answers[0].scores.sleep;
    }

    const multiplier = answers[1]?.multiplier || 1.0;
    gutScore = Math.min(95, Math.max(30, Math.round(gutScore * multiplier)));
    breathScore = Math.min(95, Math.max(30, Math.round(breathScore * multiplier)));
    hormoneScore = Math.min(95, Math.max(30, Math.round(hormoneScore * multiplier)));
    sleepScore = Math.min(95, Math.max(30, Math.round(sleepScore * multiplier)));

    const averageResilience = Math.round((gutScore + breathScore + hormoneScore + sleepScore) / 4);

    const calculated = {
      averageResilience,
      gutScore,
      breathScore,
      hormoneScore,
      sleepScore,
      goal: answers[3]?.label || 'Comprehensive cellular metabolic reset',
      readiness: answers[4]?.readiness
    };

    setResults(calculated);

    // Save to localStorage so Booking Page can preload it
    try {
      localStorage.setItem('reshmi_assessment_results', JSON.stringify({
        averageResilience,
        gutScore,
        breathScore,
        hormoneScore,
        sleepScore,
        goal: answers[3]?.label,
        readiness: answers[4]?.readiness
      }));
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  };

  const restartAssessment = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResults(null);
  };

  const q = questions[currentQuestionIndex];
  const total = questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / total) * 100;

  return (
    <>
      <section className="section" style={{ padding: '40px 0 50px', background: 'transparent', position: 'relative', zIndex: 1 }}>
        <div className="container">
          
          <div className="assessment-card" id="assessment-quiz-container">
            
            {/* Active Quiz View */}
            {!results ? (
              <div id="quiz-active-view">
                <div className="assessment-progress">
                  {currentQuestionIndex > 0 ? (
                    <button 
                      type="button" 
                      id="assessment-prev-btn" 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '6px 14px' }}
                      onClick={previousQuestion}
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <div style={{ width: '60px' }}></div>
                  )}
                  
                  <div className="progress-track">
                    <div className="progress-fill" id="assessment-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  
                  <span id="assessment-step-num" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald-primary)' }}>
                    Question {currentQuestionIndex + 1} of {total}
                  </span>
                </div>

                <h2 className="question-title" id="assessment-q-title">{q.title}</h2>
                <p className="question-subtitle" id="assessment-q-subtitle">{q.subtitle}</p>

                <div className="options-list" id="assessment-options-box">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="option-button"
                      onClick={() => selectAnswer(idx)}
                    >
                      <span>{opt.label}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Results View */
              <div id="assessment-results-box" className="results-container" style={{ display: 'block' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--status-optimal-bg)', color: 'var(--status-optimal)', fontSize: '2rem', marginBottom: '16px' }}>
                    &#10003;
                  </div>
                  <span className="sub-title">Your Clinical Snapshot</span>
                  <h2 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>Health Resilience Evaluation</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Here is your multi-domain biological profile based on your symptoms and timeline.
                  </p>
                </div>

                {/* Overall Score Card */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid rgba(255, 255, 255, 0.8)', textAlign: 'center', marginBottom: '32px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                    Composite Resilience Index
                  </span>
                  <div id="result-overall-score" style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 700, color: 'var(--emerald-deep)', lineHeight: 1.1, margin: '8px 0' }}>
                    {results.averageResilience}%
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--emerald-primary)', fontWeight: 600 }}>
                    Primary Focus: <span id="result-primary-focus">{results.goal}</span>
                  </div>
                </div>

                {/* Domain Bars */}
                <div className="scores-radar-grid">
                  <div className="domain-score-box" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="domain-name">
                      <span>Gut Mucosal &amp; Digestive Health</span>
                      <span id="score-gut-val">{results.gutScore}/100</span>
                    </div>
                    <div className="domain-bar">
                      <div className="domain-bar-fill" id="bar-gut-fill" style={{ width: `${results.gutScore}%` }}></div>
                    </div>
                  </div>

                  <div className="domain-score-box" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="domain-name">
                      <span>Breath Resilience &amp; CO₂ Tolerance</span>
                      <span id="score-breath-val">{results.breathScore}/100</span>
                    </div>
                    <div className="domain-bar">
                      <div className="domain-bar-fill" id="bar-breath-fill" style={{ width: `${results.breathScore}%` }}></div>
                    </div>
                  </div>

                  <div className="domain-score-box" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="domain-name">
                      <span>Hormonal &amp; Circadian Balance</span>
                      <span id="score-hormone-val">{results.hormoneScore}/100</span>
                    </div>
                    <div className="domain-bar">
                      <div className="domain-bar-fill" id="bar-hormone-fill" style={{ width: `${results.hormoneScore}%` }}></div>
                    </div>
                  </div>

                  <div className="domain-score-box" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="domain-name">
                      <span>Sleep Architecture &amp; Airway Health</span>
                      <span id="score-sleep-val">{results.sleepScore}/100</span>
                    </div>
                    <div className="domain-bar">
                      <div className="domain-bar-fill" id="bar-sleep-fill" style={{ width: `${results.sleepScore}%` }}></div>
                    </div>
                  </div>
                </div>

                <div id="result-clinical-summary" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.8)', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Based on your answers, your baseline biological resilience is at <strong>{results.averageResilience}%</strong>. 
                  Your answers indicate that energy, digestion, autonomic breathing, and sleep are interconnected signals rather than isolated symptoms.
                  In a 1-on-1 <strong>Health Clarity Session</strong>, Reshmi Verma decodes these exact patterns using the SAMYA framework to create your individualized protocol.
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/booking" className="btn btn-primary btn-lg">
                    <span>Book Health Clarity Session With These Results</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                  <button type="button" className="btn btn-secondary btn-lg" id="assessment-restart-btn" onClick={restartAssessment}>
                    Retake Assessment
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>
    </>
  );
}
