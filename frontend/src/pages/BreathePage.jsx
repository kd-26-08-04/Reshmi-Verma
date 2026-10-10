import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { soundSynth } from '../utils/soundSynth';

const BREATH_PROTOCOLS = {
  '478': {
    name: '4-7-8 Somatic Relaxation',
    desc: 'Flagship somatic autonomic regulation. 4s nasal inhalation, 7s full oxygen retention, 8s slow exhalation to trigger immediate parasympathetic baroreflex slowing.',
    phases: [
      { name: 'INHALE', duration: 4, action: 'inhale', freq: 432 },
      { name: 'HOLD', duration: 7, action: 'hold', freq: 528 },
      { name: 'EXHALE', duration: 8, action: 'exhale', freq: 396 }
    ]
  },
  'box': {
    name: 'Box Breathing (4-4-4-4)',
    desc: 'Navy SEAL combat tactical poise. Equal ratios of inhalation, retention, exhalation, and empty pause to stabilize alpha brain waves under acute cognitive pressure.',
    phases: [
      { name: 'INHALE', duration: 4, action: 'inhale', freq: 432 },
      { name: 'HOLD', duration: 4, action: 'hold', freq: 528 },
      { name: 'EXHALE', duration: 4, action: 'exhale', freq: 396 },
      { name: 'HOLD', duration: 4, action: 'hold', freq: 432 }
    ]
  },
  'coherent': {
    name: 'Coherent Heart-Brain (5-5)',
    desc: 'Heart rate variability (HRV) resonant frequency. Exactly 6 breaths per minute producing optimal heart-brain coherence, arterial baroreflex sensitivity, and parasympathetic tone.',
    phases: [
      { name: 'INHALE', duration: 5, action: 'inhale', freq: 432 },
      { name: 'EXHALE', duration: 5, action: 'exhale', freq: 396 }
    ]
  },
  'energizer': {
    name: 'Soma Energizer (2-2)',
    desc: 'Mild hypercapnic aerobic stimulant. Short active diaphragmatic breaths to enhance oxygen release to muscle cells and clear brain fog without sympathetic panic.',
    phases: [
      { name: 'INHALE', duration: 2, action: 'inhale', freq: 528 },
      { name: 'EXHALE', duration: 2, action: 'exhale', freq: 432 }
    ]
  }
};

export default function BreathePage() {
  // 1. BOLT Timer State
  const [boltState, setBoltState] = useState('idle'); // idle | running | completed
  const [boltSeconds, setBoltSeconds] = useState(0);
  const boltStartTimeRef = useRef(0);
  const boltIntervalRef = useRef(null);

  // 2. Guided Sanctuary State
  const [activeProtocolKey, setActiveProtocolKey] = useState('478');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const sanctuaryTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);

  // 3. 60-Second Live Breath Counter State
  const [counterState, setCounterState] = useState('idle'); // idle | running | done
  const [counterSecondsLeft, setCounterSecondsLeft] = useState(60);
  const [breathTally, setBreathTally] = useState(0);
  const counterIntervalRef = useRef(null);

  // 4. Vagal Index State
  const [vagalBolt, setVagalBolt] = useState('');
  const [vagalBpm, setVagalBpm] = useState('');
  const [vagalGut, setVagalGut] = useState(6);
  const [vagalStress, setVagalStress] = useState(6);
  const [vagalResult, setVagalResult] = useState(null);

  // Sync mute state
  useEffect(() => {
    soundSynth.isMuted = isAudioMuted;
  }, [isAudioMuted]);

  // BOLT Logic
  const startBolt = () => {
    setBoltState('running');
    setBoltSeconds(0);
    boltStartTimeRef.current = Date.now();
    boltIntervalRef.current = setInterval(() => {
      const elapsed = Number(((Date.now() - boltStartTimeRef.current) / 1000).toFixed(1));
      setBoltSeconds(elapsed);
    }, 100);
  };

  const stopBolt = () => {
    if (boltIntervalRef.current) clearInterval(boltIntervalRef.current);
    setBoltState('completed');
  };

  const resetBolt = () => {
    if (boltIntervalRef.current) clearInterval(boltIntervalRef.current);
    setBoltState('idle');
    setBoltSeconds(0);
  };

  const getBoltAnalysis = (score) => {
    const rawMarks = Math.round((score / 40) * 100);
    const marks = Math.min(100, Math.max(8, rawMarks));

    if (score < 15) {
      return {
        marks,
        grade: 'High Physiological Risk',
        tier: 'Critically Compromised (Severe Oxygen Deficit)',
        urgency: 'critical',
        badgeColor: '#E11D48',
        badgeBg: '#FFF1F2',
        title: '🚨 CRITICAL CLINICAL ALERT: Severe Cellular Oxygen Starvation',
        summary: `Your BOLT score is critically low at ${score.toFixed(1)}s (${marks}/100 Marks). This confirms that your cells, brain, and gut lining are chronically starved of functional oxygen due to rapid carbon dioxide depletion and silent mouth-breathing.`,
        recommendation: 'URGENT CONSULTATION ADVISED: Leaving this unaddressed leads to chronic gut inflammation, refractory brain fog, and autonomic exhaustion. Reshmi Verma (India #13 Oxygen Advantage Coach) strongly advises booking an immediate 1-on-1 priority clinical consultation to restore your Bohr-effect oxygen delivery and repair your gut-mucosal barrier.',
        buttonText: '🚨 Book Priority Emergency Consultation (₹999 / ₹2,999)',
        buttonClass: 'btn btn-primary btn-lg pulse-anim',
        bohr: 'Your red blood cells possess an excessively tight hemoglobin-oxygen bond. Due to chronic over-breathing and depleted CO₂, oxygen is trapped in the bloodstream and cannot discharge into digestive organs or muscle tissue.',
        protocol: 'Immediate Clinical Steps: 100% strict daytime nasal breathing, nocturnal mouth-taping protocol, and immediate clinical breathwork titration with Reshmi Verma.'
      };
    }
    if (score < 25) {
      return {
        marks,
        grade: 'Moderate Autonomic Strain',
        tier: 'Sub-Optimal Respiration (Compromised Reserve)',
        urgency: 'warning',
        badgeColor: '#D97706',
        badgeBg: '#FFFBEB',
        title: '⚠️ CLINICAL RECOMMENDATION: Consultation Strongly Recommended',
        summary: `Good attempt! Your score is ${score.toFixed(1)}s (${marks}/100 Marks). While you manage day-to-day tasks, your breathing pattern is silently burning 30% to 40% excess cellular energy, causing afternoon fatigue crashes and digestive acidity.`,
        recommendation: 'HIGHLY RECOMMENDED FOR SESSION BOOKING: You are prime for rapid turnaround. A targeted consultation with Reshmi Verma will reset your respiratory chemoreceptors, double your stamina, and eliminate digestive bloating within 21 days.',
        buttonText: '📅 Book Clinical Consultation (₹999 / ₹2,999)',
        buttonClass: 'btn btn-primary btn-lg',
        bohr: 'Sub-conscious hyperventilation and upper-chest breathing cause intermittent cellular hypoxia. Stress spikes accelerate CO₂ loss, triggering anxiety surges and digestive spasms.',
        protocol: 'Recommended Protocol: Daily 4-7-8 somatic autonomic regulation, 5-5 Coherent Breathing before main meals, and personalized clinical guidance.'
      };
    }
    if (score < 35) {
      return {
        marks,
        grade: 'Good Functional Baseline',
        tier: 'Functional Respiration & Aerobic Stability',
        urgency: 'good',
        badgeColor: '#059669',
        badgeBg: '#ECFDF5',
        title: '✨ HEALTHY BASELINE: Session Recommended For Peak Optimization',
        summary: `Great job! You achieved ${score.toFixed(1)}s (${marks}/100 Marks). You have a solid respiratory baseline and respectable cellular oxygenation, with minimal airway collapse risk.`,
        recommendation: 'RECOMMENDED FOR ADVANCED MASTERY: To elevate this good baseline into elite athletic stamina, deep regenerative sleep, and longevity-focused biohacking, consult with Reshmi Verma to optimize your biochemical biomarkers.',
        buttonText: '⚡ Book Advanced Biohacking Consultation',
        buttonClass: 'btn btn-primary btn-lg',
        bohr: 'Hemoglobin releases oxygen moderately well. Your cells receive adequate baseline nutrition, but higher aerobic conditioning is needed to withstand high-stress environments without fatigue.',
        protocol: 'Recommended Protocol: Progressive altitude simulation drills, advanced circular connected breathwork, and targeted gut microbiome optimization.'
      };
    }
    return {
      marks,
      grade: 'Elite Autonomic Mastery',
      tier: 'Optimal Aerobic Resilience & Biohacker Peak',
      urgency: 'elite',
      badgeColor: '#4338CA',
      badgeBg: '#EEF2FF',
      title: '🏆 MASTER-LEVEL SCORE: Biological Excellence',
      summary: `Outstanding performance! You scored an impressive ${score.toFixed(1)}s (${marks}/100 Marks). You possess top-tier cellular CO₂ tolerance and optimal Bohr Effect efficiency!`,
      recommendation: 'BIOHACKING MASTERY: You have achieved the gold standard of respiratory resilience. Schedule a 1-on-1 session with Reshmi Verma to explore advanced circular connected breathwork and personalized clinical diagnostics.',
      buttonText: '🌟 Book Master Biohacking Consultation',
      buttonClass: 'btn btn-primary btn-lg',
      bohr: 'Master-level Bohr effect efficiency! Carbon dioxide effortlessly releases maximum oxygen into active mitochondria, supporting high metabolic output, deep sleep, and low systemic inflammation.',
      protocol: 'Recommended Protocol: Sustained nasal-only pacing during intensive workouts, advanced autonomic modulation, and preventative longevity biomarker tracking.'
    };
  };

  // Guided Sanctuary Logic
  useEffect(() => {
    if (!isPlaying) {
      if (sanctuaryTimerRef.current) clearInterval(sanctuaryTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      soundSynth.stopOceanWaves();
      return;
    }

    soundSynth.startOceanWaves();

    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    const protocol = BREATH_PROTOCOLS[activeProtocolKey];
    let pIdx = currentPhaseIndex;
    let secLeft = phaseSecondsLeft;

    soundSynth.playBowlChime(protocol.phases[pIdx].freq);
    soundSynth.modulateWave(protocol.phases[pIdx].action, protocol.phases[pIdx].duration);

    sanctuaryTimerRef.current = setInterval(() => {
      secLeft -= 1;
      if (secLeft <= 0) {
        pIdx = (pIdx + 1) % protocol.phases.length;
        if (pIdx === 0) {
          setCycleCount((prev) => prev + 1);
        }
        secLeft = protocol.phases[pIdx].duration;
        setCurrentPhaseIndex(pIdx);
        soundSynth.playBowlChime(protocol.phases[pIdx].freq);
        soundSynth.modulateWave(protocol.phases[pIdx].action, protocol.phases[pIdx].duration);
      }
      setPhaseSecondsLeft(secLeft);
    }, 1000);

    return () => {
      if (sanctuaryTimerRef.current) clearInterval(sanctuaryTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isPlaying, activeProtocolKey]);

  const toggleSanctuaryPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      const protocol = BREATH_PROTOCOLS[activeProtocolKey];
      setCurrentPhaseIndex(0);
      setPhaseSecondsLeft(protocol.phases[0].duration);
      setIsPlaying(true);
    }
  };

  const switchProtocol = (key) => {
    setActiveProtocolKey(key);
    const protocol = BREATH_PROTOCOLS[key];
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(protocol.phases[0].duration);
    if (isPlaying) {
      soundSynth.playBowlChime(protocol.phases[0].freq);
      soundSynth.modulateWave(protocol.phases[0].action, protocol.phases[0].duration);
    }
  };

  const formatSessionTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 60-Second Counter Logic
  const startBreathCounter = () => {
    setCounterState('running');
    setCounterSecondsLeft(60);
    setBreathTally(0);

    counterIntervalRef.current = setInterval(() => {
      setCounterSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(counterIntervalRef.current);
          setCounterState('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const tapBreath = () => {
    if (counterState === 'running') {
      setBreathTally((prev) => prev + 1);
    }
  };

  const resetBreathCounter = () => {
    if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
    setCounterState('idle');
    setCounterSecondsLeft(60);
    setBreathTally(0);
  };

  // Vagal Tone Calculator Logic
  const calculateVagalIndex = () => {
    const bolt = Number(vagalBolt) || 20;
    const bpm = Number(vagalBpm) || 14;
    const gut = Number(vagalGut) || 6;
    const stress = Number(vagalStress) || 6;

    // Weight formula
    const boltScore = Math.min(35, (bolt / 40) * 35);
    const bpmScore = Math.min(25, Math.max(0, (20 - bpm) * 2.5));
    const gutScore = (gut / 10) * 20;
    const stressScore = (stress / 10) * 20;

    const total = Math.round(boltScore + bpmScore + gutScore + stressScore);
    const finalScore = Math.min(100, Math.max(10, total));

    let label = 'Moderate Vagal Tone';
    let advice = 'Your parasympathetic brake functions during normal daily tasks, but depletes under acute digestive irritation, high cognitive demands, or poor sleep. Daily vagal stimulation is strongly recommended.';

    if (finalScore >= 80) {
      label = 'Elite Autonomic Resilience';
      advice = 'Superb parasympathetic vagal reserve! Deep resting heart rate variability, robust digestive enzyme motility, and rapid physiological rebound following stressful spikes.';
    } else if (finalScore < 50) {
      label = 'Sympathetic Fight-or-Flight Dominance';
      advice = 'Your autonomic nervous system is locked in chronic sympathetic arousal. This chronically reduces mesenteric blood flow to the gut (causing bloating/reflux) and elevates resting heart rate. Reshmi Verma recommends 4-7-8 breathing and gut mucosal repair.';
    }

    setVagalResult({ score: finalScore, label, advice });
  };

  const currentProtocol = BREATH_PROTOCOLS[activeProtocolKey];
  const currentPhase = currentProtocol.phases[currentPhaseIndex] || currentProtocol.phases[0];
  const boltAnalysis = getBoltAnalysis(boltSeconds);

  return (
    <>
      {/* Hero Header */}
      <section className="section" style={{ padding: '50px 0 30px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            <span className="pulse-dot"></span>
            <span>🏅 #13 Certified Oxygen Advantage Coach in India &bull; Circular Connected Breathwork Facilitator</span>
          </span>
          <h1 style={{ fontSize: '3.2rem', maxWidth: '880px', margin: '0 auto 18px' }}>
            Clinical Respiration & <span className="text-gradient">Vagal Neuromodulation</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 24px' }}>
            Guided by <strong>Reshmi Verma</strong> — <strong>#13 Certified in India for Oxygen Advantage</strong>, <strong>Oxygen Advantage Core Instructor</strong>, and <strong>Breath Resilience Instructor</strong>. Discover your cellular CO₂ tolerance with the BOLT test and recalibrate autonomic nervous system tone.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#bolt-station" className="btn btn-primary btn-sm">1. BOLT Breath-Hold Test</a>
            <a href="#sanctuary-station" className="btn btn-secondary btn-sm">2. Guided Breath Sanctuary</a>
            <a href="#counter-station" className="btn btn-secondary btn-sm">3. 60s Breath Counter</a>
            <a href="#vagal-station" className="btn btn-secondary btn-sm">4. Vagal Tone Calculator</a>
          </div>
        </div>
      </section>

      {/* Module 1: The BOLT Breath-Hold Station */}
      <section className="section" id="bolt-station">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Clinical Diagnostic Test</span>
            <h2>The Body Oxygen Level Test (BOLT)</h2>
            <p>Your BOLT score is the gold-standard measurement of functional carbon dioxide tolerance and physiological airway resilience developed by Patrick McKeown (Oxygen Advantage).</p>
          </div>

          <div className="bolt-test-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
              <div>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Standardized Testing Protocol:</h4>
                <div className="bolt-instructions" style={{ marginTop: 0 }}>
                  <ol>
                    <li>Sit comfortably upright in a quiet chair. Rest for 2 minutes.</li>
                    <li>Take a normal, silent, gentle breath in through your nose (2–3 seconds).</li>
                    <li>Allow a natural, silent breath out through your nose.</li>
                    <li><strong>Pinch your nose with your fingers</strong> and immediately tap <strong>"Start BOLT Hold"</strong> below.</li>
                    <li>Hold until you feel the <strong>first definite desire to breathe</strong> (an involuntary swallow or twitch of the diaphragm).</li>
                    <li>Tap <strong>"Tap At First Urge"</strong> immediately!</li>
                  </ol>
                </div>
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.82rem', color: '#92400E' }}>
                  <strong>CRITICAL CLINICAL RULE:</strong> This is NOT a breath-holding contest or endurance challenge. Your first breath after release MUST be completely calm, silent, and through your nose. If you gasp or take a deep gulp of air, you held too long and the score is invalid!
                </div>
              </div>

              <div>
                <div className="bolt-counter-display" style={{ flexDirection: 'column', textAlign: 'center', gap: '20px', padding: '36px 24px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                    Post-Exhale Breath Hold Timer
                  </span>
                  <div>
                    <span className="bolt-number-large" id="bolt-counter-val" style={{ fontSize: '4.8rem' }}>{boltSeconds.toFixed(1)}</span>
                    <span className="bolt-number-unit" style={{ fontSize: '1.25rem' }}>Seconds</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                    {boltState === 'idle' && (
                      <button className="btn btn-primary btn-lg" id="bolt-start-btn" style={{ width: '100%' }} onClick={startBolt}>
                        <span>Start BOLT Hold Timer</span>
                      </button>
                    )}
                    {boltState === 'running' && (
                      <button className="btn btn-accent btn-lg pulse-anim" id="bolt-stop-btn" style={{ width: '100%', fontSize: '1.05rem' }} onClick={stopBolt}>
                        Tap At First Urge To Breathe!
                      </button>
                    )}
                    {boltState === 'completed' && (
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={startBolt}>
                          Retest BOLT
                        </button>
                        <button className="btn btn-secondary btn-sm" id="bolt-reset-btn" onClick={resetBolt}>
                          Reset
                        </button>
                      </div>
                    )}
                  </div>

                  <p id="bolt-phase-hint" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {boltState === 'running'
                      ? 'Pinch nose and hold until first definite physical impulse or involuntary swallow...'
                      : 'Breathe normally. After a normal exhale, pinch your nose and tap start.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Result Box with Marks & Clinical Urgency */}
            {boltState === 'completed' && (
              <div id="bolt-result-analysis" style={{ display: 'block', background: 'white', borderRadius: 'var(--radius-lg)', padding: '36px', border: `2px solid ${boltAnalysis.badgeColor}`, boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)', marginTop: '36px', animation: 'fadeIn 0.4s ease' }}>
                
                {/* Header with Celebration & Marks Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>🎉 Test Completed Successfully!</span>
                    </div>
                    <h3 style={{ fontSize: '1.6rem', color: 'var(--emerald-deep)', margin: 0 }}>
                      Your Clinical Breath-Hold Evaluation
                    </h3>
                  </div>

                  {/* Marks Score Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: boltAnalysis.badgeBg, border: `1px solid ${boltAnalysis.badgeColor}`, padding: '12px 20px', borderRadius: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: boltAnalysis.badgeColor, fontWeight: 800, letterSpacing: '0.05em' }}>
                        Functional Marks
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: boltAnalysis.badgeColor, lineHeight: 1.1 }}>
                        {boltAnalysis.marks} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: boltAnalysis.badgeColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      {boltAnalysis.marks >= 80 ? 'A' : boltAnalysis.marks >= 60 ? 'B' : boltAnalysis.marks >= 40 ? 'C' : 'D'}
                    </div>
                  </div>
                </div>

                {/* Visual Marks Progress Bar */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>Hold Duration: <strong>{boltSeconds.toFixed(1)}s</strong></span>
                    <span>Status: <strong style={{ color: boltAnalysis.badgeColor }}>{boltAnalysis.tier}</strong></span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${boltAnalysis.marks}%`, height: '100%', background: `linear-gradient(90deg, ${boltAnalysis.badgeColor}, #EA580C)`, borderRadius: '999px', transition: 'width 1s ease' }}></div>
                  </div>
                </div>

                {/* Urgency / Clinical Suggestion Box */}
                <div style={{ background: boltAnalysis.badgeBg, borderLeft: `6px solid ${boltAnalysis.badgeColor}`, padding: '20px 24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1.15rem', color: boltAnalysis.badgeColor, margin: '0 0 10px', fontWeight: 700 }}>
                    {boltAnalysis.title}
                  </h4>
                  <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 12px' }}>
                    {boltAnalysis.summary}
                  </p>
                  <p style={{ fontSize: '0.98rem', color: 'var(--emerald-deep)', lineHeight: 1.7, fontWeight: 600, margin: 0 }}>
                    {boltAnalysis.recommendation}
                  </p>
                </div>

                {/* Physiological Mechanism (Bohr Effect) */}
                <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Cellular Biochemistry (The Bohr Effect):
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {boltAnalysis.bohr}
                  </div>
                </div>

                {/* Direct High-Conversion Call to Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.03) 0%, rgba(194, 65, 12, 0.06) 100%)', padding: '28px 24px', borderRadius: '16px', border: '1px dashed var(--border-medium)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald-medium)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Next Step with #13 Oxygen Advantage Coach Reshmi Verma
                  </div>
                  <h4 style={{ fontSize: '1.35rem', color: 'var(--emerald-deep)', margin: '0 0 16px' }}>
                    {boltAnalysis.urgency === 'critical' ? 'Urgent 1-on-1 Consultation Required' : 'Book Your Personalized Clinical Roadmap'}
                  </h4>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link 
                      to={`/booking?bolt=${boltSeconds.toFixed(1)}&score=${boltAnalysis.marks}&plan=discovery`}
                      className={boltAnalysis.buttonClass}
                      style={{ padding: '14px 32px', fontSize: '1.05rem', boxShadow: '0 10px 25px rgba(194, 65, 12, 0.25)' }}
                    >
                      {boltAnalysis.buttonText}
                    </Link>
                    <a href="#sanctuary-station" className="btn btn-secondary btn-lg">
                      Explore Guided Breathing Pacer &darr;
                    </a>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '14px 0 0' }}>
                    ✓ Your {boltSeconds.toFixed(1)}s test score will be automatically linked to your booking record.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* Module 2: Neuromodulation Guided Breathing Sanctuary */}
      <section className="section" id="sanctuary-station" style={{ background: 'white', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Interactive Autonomic Sanctuary</span>
            <h2>Live Guided Breathing Pacer</h2>
            <p>Synchronize your respiratory cadence with precision harmonic frequencies. Select a clinical protocol below to begin your somatic reset.</p>
          </div>

          <div className="studio-showcase" style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Protocol Tabs */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
              {Object.keys(BREATH_PROTOCOLS).map((key) => (
                <button
                  key={key}
                  className={`btn btn-sm ${activeProtocolKey === key ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => switchProtocol(key)}
                >
                  {BREATH_PROTOCOLS[key].name}
                </button>
              ))}
            </div>

            <p id="selected-protocol-desc" className="breath-hint-glass" style={{ maxWidth: '680px', margin: '0 auto 32px', display: 'block' }}>
              {currentProtocol.desc}
            </p>

            {/* Visualizer Circle */}
            <div className="breath-visualizer-container" style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 32px' }}>
              <div className="breath-circle-wrapper">
                <div className="breath-glow-ring"></div>
                <div className={`breath-orb ${isPlaying ? currentPhase.action : ''}`} id="breath-interactive-orb">
                  <div className="breath-orb-status" id="breath-phase-label">
                    {isPlaying ? currentPhase.name : 'READY'}
                  </div>
                  <div className="breath-orb-counter" id="breath-phase-seconds">
                    {isPlaying ? `${phaseSecondsLeft}s` : `${currentProtocol.phases[0].duration}s`}
                  </div>
                </div>
              </div>

              <p id="breath-sub-hint" className="breath-hint-glass">
                {isPlaying
                  ? `${currentPhase.action.toUpperCase()} in harmony with the audio soundscape`
                  : 'Click button below to initiate guided pacing'}
              </p>

              <div className="breath-controls-bar">
                <button className={`btn ${isPlaying ? 'btn-accent' : 'btn-primary'} btn-lg`} id="breath-sanctuary-toggle" onClick={toggleSanctuaryPlay}>
                  {isPlaying ? 'Pause Guided Session' : 'Start Guided Session'}
                </button>
                <button className="btn-sound-toggle" id="breath-sound-toggle-btn" onClick={() => setIsAudioMuted(!isAudioMuted)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <span>{isAudioMuted ? '🔇 Sound: Muted' : '🌊 Sound: Ocean & Zen Bowl ON'}</span>
                </button>
              </div>

              <div className="breath-stats-glass">
                <div className="breath-stat-pill">Cycles Completed: <strong id="breath-cycle-count" style={{ color: 'var(--emerald-deep)', fontSize: '1.05rem' }}>{cycleCount}</strong></div>
                <div className="breath-stat-pill">Elapsed Time: <strong id="breath-session-timer" style={{ color: 'var(--emerald-deep)', fontSize: '1.05rem' }}>{formatSessionTime(sessionSeconds)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 3: 60-Second Live Resting Breath Counter */}
      <section className="section" id="counter-station" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Resting Respiratory Rate</span>
            <h2>60-Second Live Breath Counter</h2>
            <p>Breathe naturally without trying to control your rhythm. Each time you finish a natural exhale, tap the button below. The tool calculates your resting breaths per minute.</p>
          </div>

          <div style={{ maxWidth: '680px', margin: '0 auto', background: 'white', borderRadius: 'var(--radius-xl)', padding: '40px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBotto: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Time Remaining</span>
                <div id="bpm-timer-val" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>
                  {counterSecondsLeft}s
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Exhales Recorded</span>
                <div id="bpm-taps-val" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--teal-accent)' }}>
                  {breathTally}
                </div>
              </div>
            </div>

            <div style={{ margin: '24px 0' }}>
              {counterState === 'idle' && (
                <button className="btn btn-primary btn-lg" id="bpm-start-btn" onClick={startBreathCounter}>
                  Start 60s Breath Count
                </button>
              )}
              {counterState === 'running' && (
                <button className="btn btn-accent btn-lg pulse-anim" id="bpm-tap-btn" onClick={tapBreath} style={{ padding: '18px 40px', fontSize: '1.15rem' }}>
                  TAP ON EACH EXHALE
                </button>
              )}
              {counterState === 'done' && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={startBreathCounter}>
                    Count Again
                  </button>
                  <button className="btn btn-secondary btn-sm" id="bpm-reset-btn" onClick={resetBreathCounter}>
                    Reset
                  </button>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Rest quietly at your desk. Tap immediately upon completing each breath cycle (Inhale + Exhale = 1 breath).
            </p>

            {/* Result Box */}
            {counterState === 'done' && (
              <div id="bpm-result-box" style={{ display: 'block', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-medium)', marginTop: '28px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--emerald-deep)' }}>Resting Respiratory Rate:</span>
                  <span id="bpm-score-val" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--emerald-primary)' }}>
                    {breathTally} Breaths / Min
                  </span>
                </div>
                <div id="bpm-diag-val" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {breathTally <= 12
                    ? 'Superb autonomic calm. Your resting rate indicates parasympathetic dominance and healthy carbon dioxide conservation.'
                    : breathTally <= 18
                    ? 'Normal baseline range. Incorporating daily 5-5 Coherent Breathing will further optimize resting heart rate variability.'
                    : 'Elevated resting frequency (>18 bpm). You are breathing faster than your metabolic requirements demand, blowing off CO₂ and triggering sympathetic fight-or-flight overdrive.'}
                </div>
                <a href="#vagal-station" className="btn btn-secondary btn-sm">Use in Vagal Tone Calculator &darr;</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Vagal Tone Multi-Factor Index Calculator */}
      <section className="section" id="vagal-station" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Autonomic Equilibrium</span>
            <h2>Vagal Tone Auto-Assessment Calculator</h2>
            <p>Combining your BOLT score, resting respiratory rate, digestive vitality, and stress rebound speed into a unified parasympathetic score.</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '44px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                  BOLT Score (Seconds)
                </label>
                <input
                  type="number"
                  id="vagal-bolt-input"
                  placeholder="e.g. 22"
                  value={vagalBolt}
                  onChange={(e) => setVagalBolt(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Tested via our BOLT timer above</span>
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                  Resting Breaths Per Minute (BPM)
                </label>
                <input
                  type="number"
                  id="vagal-bpm-input"
                  placeholder="e.g. 13"
                  value={vagalBpm}
                  onChange={(e) => setVagalBpm(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Normal adult baseline: 12–16 BPM</span>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>
                  Digestive Comfort & Motility (1 = Severe Reflux/Bloat, 10 = Effortless Digestion): {vagalGut}
                </label>
              </div>
              <input
                type="range"
                id="vagal-gut-slider"
                min="1"
                max="10"
                value={vagalGut}
                onChange={(e) => setVagalGut(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--emerald-primary)' }}
              />
            </div>

            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>
                  Stress Rebound Poise (1 = Chronic Anxiety Surges, 10 = Calm & Grounded): {vagalStress}
                </label>
              </div>
              <input
                type="range"
                id="vagal-stress-slider"
                min="1"
                max="10"
                value={vagalStress}
                onChange={(e) => setVagalStress(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--emerald-primary)' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-primary btn-lg" id="calc-vagal-btn" onClick={calculateVagalIndex}>
                Calculate Vagal Tone Index
              </button>
            </div>

            {/* Vagal Result Display */}
            {vagalResult && (
              <div id="vagal-calc-result" style={{ display: 'block', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '28px', border: '1px solid var(--border-medium)', marginTop: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Vagal Resilience Index</span>
                    <div id="vagal-score-number" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>
                      {vagalResult.score} / 100
                    </div>
                  </div>
                  <div id="vagal-status-label" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--emerald-primary)', background: 'white', padding: '10px 20px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                    {vagalResult.label}
                  </div>
                </div>

                <div id="vagal-prescribed-advice" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'white', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '16px' }}>
                  {vagalResult.advice}
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <Link to="/booking" className="btn btn-primary">Schedule Consultation to Discuss Recovery Blueprint &rarr;</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
