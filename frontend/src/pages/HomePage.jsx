import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { soundSynth } from '../utils/soundSynth';

const BREATH_PROTOCOLS = {
  '478': {
    name: '4-7-8 Somatic Relax',
    phases: [
      { name: 'INHALE', duration: 4, action: 'inhale', freq: 432 },
      { name: 'HOLD', duration: 7, action: 'hold', freq: 528 },
      { name: 'EXHALE', duration: 8, action: 'exhale', freq: 396 }
    ]
  },
  'box': {
    name: 'Box 4-4-4-4',
    phases: [
      { name: 'INHALE', duration: 4, action: 'inhale', freq: 432 },
      { name: 'HOLD', duration: 4, action: 'hold', freq: 528 },
      { name: 'EXHALE', duration: 4, action: 'exhale', freq: 396 },
      { name: 'HOLD', duration: 4, action: 'hold', freq: 432 }
    ]
  },
  'coherent': {
    name: 'Coherent 5-5',
    phases: [
      { name: 'INHALE', duration: 5, action: 'inhale', freq: 432 },
      { name: 'EXHALE', duration: 5, action: 'exhale', freq: 396 }
    ]
  }
};

const faqs = [
  {
    q: "What is the Body Oxygen Level Test (BOLT) and why does it matter?",
    a: "The BOLT test measures your carbon dioxide tolerance and physiological breathing efficiency. Carbon dioxide is not merely a waste gas—it triggers hemoglobin to release oxygen into your organs and brain cells via the Bohr Effect. A low BOLT score (< 20s) correlates strongly with airway collapse, anxiety, and fatigue."
  },
  {
    q: "How is functional nutrition different from standard dietitians?",
    a: "We move far beyond obsolete calorie counting. Reshmi Verma analyzes nutrition as biochemical information—fueling mitochondrial ATP synthesis, repairing the gut mucosal barrier, and balancing glycemic kinetics based on verified functional diagnostics."
  },
  {
    q: "What happens in an Initial Discovery Call vs a Comprehensive Consultation?",
    a: "The Initial Discovery Call (20 min) is a focused discussion to review your main health challenges, clarify questions, and determine the right clinical pathway. The Comprehensive Consultation (60 min) includes a deep dive into blood chemistry, gut history, circadian sleep mapping, and a full personalized protocol."
  },
  {
    q: "Can breathwork help with gut issues and acid reflux?",
    a: "Yes, significantly. The vagus nerve controls both parasympathetic breathing and digestive motility/gastric acid release. Slow diaphragmatic breathing stimulates vagal tone, physically lowering the diaphragm, stabilizing the lower esophageal sphincter, and encouraging digestive enzyme secretion."
  }
];

const DEFAULT_REELS = [
  {
    id: "reel-1",
    title: "The 4F Food Crisis: Building Metabolic Resilience Beyond the Pantry",
    url: "https://www.instagram.com/reel/DeFXQs5TaNs/?utm_source=ig_web_copy_link&stkn=NTc4MTIwNjQ2YQ==",
    image: "/assets/images/reshmi-verma.jpg",
    views: "52.4K",
    duration: "0:59",
    topic: "Metabolic Resilience"
  },
  {
    id: "reel-2",
    title: "Good, Better, Best: Everyday Nutrition Without Extreme Restrictions",
    url: "https://www.instagram.com/reel/Ddtm1wMTrRn/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/functional-nutrition.jpg",
    views: "68.1K",
    duration: "0:54",
    topic: "Nutrient Density"
  },
  {
    id: "reel-3",
    title: "Smart Everyday Food Swaps: Micronutrient & Antioxidant Density",
    url: "https://www.instagram.com/reel/Ddw9A1SzBKH/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reel-3-food-swaps.jpg",
    views: "81.6K",
    duration: "0:48",
    topic: "Functional Nutrition"
  },
  {
    id: "reel-4",
    title: "Gut Mucosal Repair: Addressing Root Leaky Gut & Food Reactivity",
    url: "https://www.instagram.com/reel/DdFEn_gzhbQ/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reel-4-gut-mucosa.jpg",
    views: "44.9K",
    duration: "0:56",
    topic: "Gut Restoration"
  },
  {
    id: "reel-5",
    title: "Autonomic Nervous System Reset: The 3-Minute Vagal Breathing Cue",
    url: "https://www.instagram.com/reel/DdW0ClVTnB7/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/clinic-sanctuary.jpg",
    views: "73.2K",
    duration: "0:51",
    topic: "Oxygen Advantage"
  },
  {
    id: "reel-6",
    title: "Root-Cause Longevity: Why Sustainable Habit Stacking Beats Crash Diets",
    url: "https://www.instagram.com/reel/DcVi6zjzhY9/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reshmi-verma.jpg",
    views: "95.7K",
    duration: "1:00",
    topic: "Longevity & Habits"
  }
];

export default function HomePage() {
  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // Dynamic Reels from API
  const [reelsList, setReelsList] = useState(DEFAULT_REELS);

  useEffect(() => {
    fetch('/api/reels')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.reels) && data.reels.length > 0) {
          setReelsList(data.reels);
        }
      })
      .catch(() => {});
  }, []);

  // Breathing Sanctuary State
  const [activeProtocolKey, setActiveProtocolKey] = useState('478');
  const [isBreathingPlaying, setIsBreathingPlaying] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const breathTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);

  // BOLT Test State
  const [boltState, setBoltState] = useState('idle'); // idle | running | completed
  const [boltSeconds, setBoltSeconds] = useState(0);
  const boltStartTimeRef = useRef(0);
  const boltIntervalRef = useRef(null);

  // Carousel ref
  const reelsCarouselRef = useRef(null);

  // --- Sound Sync ---
  useEffect(() => {
    soundSynth.isMuted = isSoundMuted;
  }, [isSoundMuted]);

  // --- Breathing Sanctuary Logic ---
  useEffect(() => {
    if (!isBreathingPlaying) {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      soundSynth.stopOceanWaves();
      return;
    }

    soundSynth.startOceanWaves();

    // Session timer
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    const protocol = BREATH_PROTOCOLS[activeProtocolKey];
    let pIdx = breathPhaseIndex;
    let secLeft = breathSecondsLeft;

    soundSynth.playBowlChime(protocol.phases[pIdx].freq);
    soundSynth.modulateWave(protocol.phases[pIdx].action, protocol.phases[pIdx].duration);

    breathTimerRef.current = setInterval(() => {
      secLeft -= 1;
      if (secLeft <= 0) {
        pIdx = (pIdx + 1) % protocol.phases.length;
        if (pIdx === 0) {
          setBreathCycles((prev) => prev + 1);
        }
        secLeft = protocol.phases[pIdx].duration;
        setBreathPhaseIndex(pIdx);
        soundSynth.playBowlChime(protocol.phases[pIdx].freq);
        soundSynth.modulateWave(protocol.phases[pIdx].action, protocol.phases[pIdx].duration);
      }
      setBreathSecondsLeft(secLeft);
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isBreathingPlaying, activeProtocolKey]);

  const toggleBreathingPlay = () => {
    if (isBreathingPlaying) {
      setIsBreathingPlaying(false);
    } else {
      const protocol = BREATH_PROTOCOLS[activeProtocolKey];
      setBreathPhaseIndex(0);
      setBreathSecondsLeft(protocol.phases[0].duration);
      setIsBreathingPlaying(true);
    }
  };

  const switchProtocol = (key) => {
    setActiveProtocolKey(key);
    const protocol = BREATH_PROTOCOLS[key];
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(protocol.phases[0].duration);
    if (isBreathingPlaying) {
      soundSynth.playBowlChime(protocol.phases[0].freq);
      soundSynth.modulateWave(protocol.phases[0].action, protocol.phases[0].duration);
    }
  };

  const formatSessionTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // --- BOLT Test Logic ---
  const startBoltHold = () => {
    setBoltState('running');
    setBoltSeconds(0);
    boltStartTimeRef.current = Date.now();
    boltIntervalRef.current = setInterval(() => {
      const elapsed = Number(((Date.now() - boltStartTimeRef.current) / 1000).toFixed(1));
      setBoltSeconds(elapsed);
    }, 100);
  };

  const stopBoltHold = () => {
    if (boltIntervalRef.current) clearInterval(boltIntervalRef.current);
    setBoltState('completed');
  };

  const resetBoltHold = () => {
    if (boltIntervalRef.current) clearInterval(boltIntervalRef.current);
    setBoltState('idle');
    setBoltSeconds(0);
  };

  const getBoltAnalysis = (score) => {
    if (score < 15) {
      return {
        tier: 'Significant Airway & CO₂ Sensitivity',
        bohr: 'Your red blood cells have a strong affinity for oxygen, holding onto it rather than releasing it freely to tissues (Bohr effect suppression). This strongly correlates with upper-chest breathing, sleep disturbances, fatigue, and frequent sighing.',
        protocol: 'Recommended Protocol: Oxygen Advantage Nose-Unblocking Drills, gentle nasal pacing, and restoring daytime diaphragmatic awareness before progressive exercise.'
      };
    }
    if (score < 25) {
      return {
        tier: 'Moderate Functional Respiration',
        bohr: 'Reasonable breathing mechanics, but autonomic resilience drops under acute physical exertion, digestive inflammation, or mental stress. CO₂ tolerance has substantial room for physiological growth.',
        protocol: 'Recommended Protocol: Incorporate 10 minutes of daily 4-7-8 or 5-5 Coherent Breathing, light-load walking with nasal breath-holds, and mealtime vagal breathing.'
      };
    }
    if (score < 35) {
      return {
        tier: 'Optimal Aerobic Efficiency',
        bohr: 'Healthy Bohr Effect efficiency! Carbon dioxide comfortably triggers robust oxygen diffusion across capillary beds into active brain and muscle tissue. High vagal tone and stable sleep architecture.',
        protocol: 'Recommended Protocol: Advanced Oxygen Advantage simulation of high-altitude conditioning and athletic carbon dioxide challenge drills.'
      };
    }
    return {
      tier: 'Elite Respiration & Autonomic Mastery',
      bohr: 'Exceptional cellular oxygen release, elite heart rate variability, and peak mitochondrial aerobic stamina. Superior parasympathetic tone.',
      protocol: 'Recommended Protocol: Maintenance and advanced circular connected breathwork for deep emotional and cellular integration.'
    };
  };

  // --- Carousel Scroll ---
  const scrollReels = (direction) => {
    if (reelsCarouselRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      reelsCarouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const currentProtocol = BREATH_PROTOCOLS[activeProtocolKey];
  const currentPhase = currentProtocol.phases[breathPhaseIndex] || currentProtocol.phases[0];
  const boltAnalysis = getBoltAnalysis(boltSeconds);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge-pill">
                <span className="pulse-dot"></span>
                <span>🏅 #13 in India &bull; Oxygen Advantage Certified | Certified Biohacker</span>
              </div>

              <h1>Science-led, <span className="text-gradient">human-centred</span> health.</h1>

              <p className="lead">
                Bridging metabolic biochemistry, autonomic regulation, and cellular biohacking. Led by <strong>Reshmi Verma</strong> — <strong>#13 Certified Oxygen Advantage Coach in India</strong>, <strong>Certified Biohacker</strong>, <strong>Circular Connected Breathwork Facilitator</strong>, and <strong>Breath Resilience Instructor</strong> with 20+ years of clinical laboratory diagnostic expertise.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/assessment" className="btn btn-primary btn-lg">
                  <span>Take Free Health Assessment</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <a href="#interactive-breath-lab" className="btn btn-secondary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  <span>Test BOLT Breath Score</span>
                </a>
              </div>

              {/* Hero Clinical Highlights */}
              <div className="hero-stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="stat-item">
                  <div className="stat-num">#13</div>
                  <div className="stat-label">In India &bull; Oxygen Advantage Certified</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">20+</div>
                  <div className="stat-label">Years Diagnostic Lab Leadership</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">6+</div>
                  <div className="stat-label">Elite Global Biohack & Breath Certs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">38<span style={{ fontSize: '1.25rem' }}>kg</span></div>
                  <div className="stat-label">Personal Health Transformation</div>
                </div>
              </div>
            </div>

            {/* Practitioner Portrait & Interactive Badges */}
            <div className="hero-media">
              <div className="doctor-portrait-card">
                <div className="portrait-inner">
                  <img
                    src="/assets/images/reshmi-verma.jpg"
                    alt="Reshmi Verma - #13 Oxygen Advantage Coach India, Certified Biohacker & Functional Nutritionist"
                  />
                </div>

                {/* Floating Certification Badge */}
                <div className="floating-cert-badge">
                  <div className="cert-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div className="cert-text">
                    <h5>#13 in India &bull; Oxygen Advantage</h5>
                    <p>Core Instructor &bull; Certified Biohacker</p>
                  </div>
                </div>

                {/* Floating Breath Badge */}
                <div className="floating-breath-badge">
                  <div className="circle-pulse"></div>
                  <div className="breath-text">
                    <h6>Breath Resilience</h6>
                    <p>Circular Connected Facilitator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Defining Clinical USPs & Credentials Section */}
      <section
        className="section"
        id="credentials-section"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-secondary) 100%)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Clinical Authority & Elite Credentials</span>
            <h2>Reshmi Verma’s Defining Clinical USPs</h2>
            <p>
              Recognized among India's foremost authorities in functional respiration, metabolic biochemistry, and cellular biohacking.
            </p>
          </div>

          <div className="usp-grid">
            {/* USP 1 */}
            <div className="usp-card">
              <span className="usp-badge-rank">Ranked #13 In India</span>
              <div className="usp-icon-box">🏅</div>
              <h3>#13 Certified Oxygen Advantage Coach</h3>
              <p>
                Ranked the 13th certified practitioner nationwide in Patrick McKeown’s globally acclaimed Oxygen Advantage science. Specializing in functional breathing biomechanics, hypercapnic conditioning, and cellular oxygen release via the Bohr effect.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Oxygen Advantage Core Certified
              </span>
            </div>

            {/* USP 2 */}
            <div className="usp-card">
              <span className="usp-badge-rank">Cellular Optimization</span>
              <div className="usp-icon-box">⚡</div>
              <h3>Certified Biohacker</h3>
              <p>
                Formally credentialed in human biohacking, mitochondrial resilience, photobiomodulation, and autonomic nervous system regulation. Merging quantifiable data tracking with lifestyle physiology.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Mitochondrial & Cellular Biohacking
              </span>
            </div>

            {/* USP 3 */}
            <div className="usp-card">
              <span className="usp-badge-rank">Diagnostic Leadership</span>
              <div className="usp-icon-box">🔬</div>
              <h3>20+ Years Pathology Leadership</h3>
              <p>
                Director at Rainbow Medinova Diagnostic Services with over two decades managing diagnostic blood laboratories. Reshmi analyzes clinical panels far deeper than superficial reference ranges.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Director, Rainbow Medinova Diagnostics
              </span>
            </div>

            {/* USP 4 */}
            <div className="usp-card">
              <span className="usp-badge-rank">Personal Victory</span>
              <div className="usp-icon-box">🌟</div>
              <h3>38 kg Personal Transformation</h3>
              <p>
                Her medical protocols are forged through lived experience. After struggling with metabolic dysfunction and systemic fatigue, Reshmi reversed her conditions and lost 38 kg without crash dieting.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Lived Clinical Empathy
              </span>
            </div>

            {/* USP 5 */}
            <div className="usp-card">
              <span className="usp-badge-rank">Conscious Respiration</span>
              <div className="usp-icon-box">💨</div>
              <h3>Circular Connected Breathwork</h3>
              <p>
                Certified facilitator in circular, connected breathwork techniques. Using therapeutic somatic respiration to release stored emotional trauma, calm autonomic fight-or-flight overdrive, and enhance vagal tone.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Certified Somatic Facilitator
              </span>
            </div>

            {/* USP 6 */}
            <div className="usp-card">
              <span className="usp-badge-rank">20+ Yrs Diagnostics</span>
              <div className="usp-icon-box">🔬</div>
              <h3>Functional Nutritionist & Laboratory Director</h3>
              <p>
                Over two decades directing Rainbow Medinova Diagnostic Services, integrating advanced blood biochemistry, gut microbiome dysbiosis, and food sensitivity panels with root-cause anti-inflammatory nutrition and tight-junction mucosal repair.
              </p>
              <span className="usp-credential-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Functional Medicine Practitioner
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The SAMYA Framework Section */}
      <section className="section" style={{ background: 'white', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">The SAMYA Methodology</span>
            <h2>How We Uncover Your Body's True Story</h2>
            <p>
              Most health advice treats symptoms in isolation. SAMYA starts with you: connecting gut, breath, hormones, and sleep patterns into a unified clinical blueprint.
            </p>
          </div>

          <div className="samya-track">
            <div className="samya-card">
              <div className="samya-step-num">Step 01</div>
              <h4>See the Signs</h4>
              <p>Notice what your body is whispering: erratic digestion, sudden energy drops, brain fog, chest breathing, or fragmented sleep architecture.</p>
            </div>

            <div className="samya-card">
              <div className="samya-step-num">Step 02</div>
              <h4>Ask Right Questions</h4>
              <p>We look beyond surface symptoms into your medical history, metabolic timeline, and environmental triggers to understand how patterns formed.</p>
            </div>

            <div className="samya-card">
              <div className="samya-step-num">Step 03</div>
              <h4>Map the Patterns</h4>
              <p>We connect the dots between blood chemistry, CO₂ breathing tolerance, microbiome ecology, and circadian cortisol curves.</p>
            </div>

            <div className="samya-card">
              <div className="samya-step-num">Step 04</div>
              <h4>Custom Solution</h4>
              <p>A science-backed protocol engineered for your biochemistry: targeted cellular nutrition, gut mucosal repair, and neuromodulation breathwork.</p>
            </div>

            <div className="samya-card">
              <div className="samya-step-num">Step 05</div>
              <h4>Lasting Wellness</h4>
              <p>Sustainable cellular vitality that holds for life, monitored through follow-up check-ins and objective biomarker improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Feature Spotlight: Interactive BOLT Test & Guided Breathing Player */}
      <section className="section" id="interactive-breath-lab" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div
            className="section-header"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              padding: '32px 36px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.06)',
              maxWidth: '860px',
              margin: '0 auto 36px'
            }}
          >
            <span className="sub-title">Interactive Respiration Laboratory</span>
            <h2>Experience Real-Time Autonomic Regulation</h2>
            <p>
              Breathing is the prime regulator of cellular energy efficiency, glycemic response, and mental poise. Test your CO₂ tolerance or enter our guided breathing sanctuary.
            </p>
          </div>

          <div className="studio-showcase">
            <div className="studio-grid">

              {/* Guided Breathing Orb Visualizer */}
              <div className="breath-visualizer-container">
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <span className="badge-pill" style={{ fontSize: '0.78rem' }}>
                    <span className="pulse-dot"></span>
                    <span>Neuromodulation Sanctuary</span>
                  </span>
                </div>

                <div className="breath-circle-wrapper">
                  <div className="breath-glow-ring"></div>
                  <div
                    className={`breath-orb ${isBreathingPlaying ? currentPhase.action : ''}`}
                    id="breath-interactive-orb"
                  >
                    <div className="breath-orb-status" id="breath-phase-label">
                      {isBreathingPlaying ? currentPhase.name : 'READY'}
                    </div>
                    <div className="breath-orb-counter" id="breath-phase-seconds">
                      {isBreathingPlaying ? `${breathSecondsLeft}s` : `${currentProtocol.phases[0].duration}s`}
                    </div>
                  </div>
                </div>

                <p id="breath-sub-hint" className="breath-hint-glass">
                  {isBreathingPlaying
                    ? `${currentPhase.action.toUpperCase()} in harmony with the visual pulsing orb`
                    : 'Tap button below to start guided breathing session'}
                </p>

                <div className="breath-controls-bar">
                  <button
                    className={`btn ${isBreathingPlaying ? 'btn-accent' : 'btn-primary'}`}
                    id="breath-sanctuary-toggle"
                    onClick={toggleBreathingPlay}
                  >
                    {isBreathingPlaying ? 'Stop Guided Session' : 'Start Guided Session'}
                  </button>
                  <button
                    className="btn-sound-toggle"
                    id="breath-sound-toggle-btn"
                    onClick={() => setIsSoundMuted(!isSoundMuted)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    <span>{isSoundMuted ? '🔇 Sound: Muted' : '🌊 Sound: Ocean & Zen Bowl ON'}</span>
                  </button>
                </div>

                <div className="breath-stats-glass">
                  <div className="breath-stat-pill">
                    Cycles Completed: <strong id="breath-cycle-count" style={{ color: 'var(--emerald-deep)', fontSize: '1rem' }}>{breathCycles}</strong>
                  </div>
                  <div className="breath-stat-pill">
                    Duration: <strong id="breath-session-timer" style={{ color: 'var(--emerald-deep)', fontSize: '1rem' }}>{formatSessionTime(sessionSeconds)}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    className={`btn btn-sm ${activeProtocolKey === '478' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => switchProtocol('478')}
                  >
                    4-7-8 Relax
                  </button>
                  <button
                    className={`btn btn-sm ${activeProtocolKey === 'box' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => switchProtocol('box')}
                  >
                    Box 4-4-4-4
                  </button>
                  <button
                    className={`btn btn-sm ${activeProtocolKey === 'coherent' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => switchProtocol('coherent')}
                  >
                    Coherent 5-5
                  </button>
                </div>
              </div>

              {/* Interactive BOLT Breath-Hold Counter */}
              <div className="bolt-test-card" id="bolt-tester">
                <span className="sub-title" style={{ fontSize: '0.8rem' }}>Clinical Breath-Hold Test</span>
                <h3>Body Oxygen Level Test (BOLT)</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  Measures functional carbon dioxide tolerance and true cellular oxygen delivery via the <strong>Bohr Effect</strong>.
                </p>

                <div className="bolt-instructions">
                  <strong>How to perform accurately:</strong>
                  <ol>
                    <li>Take a calm, normal breath in through your nose (2–3s).</li>
                    <li>Allow a gentle, normal breath out through your nose.</li>
                    <li>Pinch your nose, click <strong>"Start BOLT Hold"</strong> below, and stop at the <em>first definite urge to breathe</em>!</li>
                  </ol>
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>
                    &bull; The Golden Rule: This is NOT a breath-holding contest. Stop at the very first involuntary urge!
                  </div>
                </div>

                <div className="bolt-counter-display">
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                      Hold Duration
                    </span>
                    <div>
                      <span className="bolt-number-large" id="bolt-counter-val">{boltSeconds.toFixed(1)}</span>
                      <span className="bolt-number-unit">seconds</span>
                    </div>
                  </div>
                  <div>
                    {boltState === 'idle' && (
                      <button className="btn btn-primary" id="bolt-start-btn" onClick={startBoltHold}>
                        Start BOLT Hold Timer
                      </button>
                    )}
                    {boltState === 'running' && (
                      <button className="btn btn-accent" id="bolt-stop-btn" onClick={stopBoltHold} style={{ padding: '14px 24px' }}>
                        Tap At First Urge To Breathe
                      </button>
                    )}
                    {boltState === 'completed' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary btn-sm" onClick={startBoltHold}>
                          Retest BOLT
                        </button>
                        <button className="btn btn-secondary btn-sm" id="bolt-reset-btn" onClick={resetBoltHold}>
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p id="bolt-phase-hint" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {boltState === 'running'
                    ? 'Pinch nose and hold until first definite physical impulse or involuntary swallow...'
                    : 'Breathe normally. After a normal exhale, pinch your nose and start the timer.'}
                </p>

                {/* Instant Clinical Evaluation Result Box */}
                {boltState === 'completed' && (
                  <div
                    id="bolt-result-analysis"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      border: '1px solid var(--border-medium)',
                      marginTop: '20px',
                      display: 'block'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>Diagnostic Result:</span>
                      <span className="bolt-score-pill" id="bolt-score-tier">{boltAnalysis.tier}</span>
                    </div>
                    <div id="bolt-bohr-detail" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                      {boltAnalysis.bohr}
                    </div>
                    <div id="bolt-protocol-text" style={{ fontSize: '0.88rem', color: 'var(--emerald-deep)', lineHeight: 1.6, background: 'white', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      {boltAnalysis.protocol}
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Link to="/booking" className="btn btn-primary btn-sm">Discuss Score in Consultation</Link>
                      <Link to="/breathe" className="btn btn-secondary btn-sm">Full Breath Laboratory &rarr;</Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. 4 Core Clinical Domains / Pillars */}
      <section className="section" id="pillars" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Comprehensive Clinical Focus</span>
            <h2>Four Interconnected Pillars of Healing</h2>
            <p>
              Because energy, digestion, hormones, sleep, and longevity are never separate conversations. They communicate continuously at the cellular level.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a9 9 0 0 1 9 9c0 5-4 9-9 9s-9-4-9-9a9 9 0 0 1 9-9z"></path>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <h3>Gut Health & Microbiome</h3>
              <p>
                Repairing intestinal mucosal architecture, sealing tight junctions, cultivating Akkermansia, resolving SIBO, IBS, and chronic reflux through phyto-pharmacology.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Mucosal Repair</span>
                <span className="pillar-tag">Postbiotics</span>
                <span className="pillar-tag">SIBO / Dysbiosis</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12a4 4 0 0 1 8 0"></path>
                  <path d="M12 8v8"></path>
                </svg>
              </div>
              <h3>Breathwork & Vagal Tone</h3>
              <p>
                Neuromodulation via CO₂ tolerance recalibration, Bohr effect optimization, and restoring parasympathetic vagus nerve tone to lower resting heart rate.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">BOLT Testing</span>
                <span className="pillar-tag">Vagal Stimulation</span>
                <span className="pillar-tag">Oxygen Advantage</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3>Hormonal & Circadian Flow</h3>
              <p>
                Restoring thyroid receptor sensitivity, balancing cortisol rhythms, optimizing cellular insulin signaling, and breaking fatigue cycles naturally.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Cortisol Mapping</span>
                <span className="pillar-tag">Insulin Kinetics</span>
                <span className="pillar-tag">Thyroid Support</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Cellular Longevity & Sleep</h3>
              <p>
                Mitochondrial ATP synthesis, STOP-BANG airway evaluation, nighttime mouth-to-nasal conversion, and deep regenerative REM sleep stabilization.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Airway Health</span>
                <span className="pillar-tag">Mitochondrial ATP</span>
                <span className="pillar-tag">NAD+ Recycling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. About Reshmi Verma Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <div className="about-main-image">
                <img src="/assets/images/reshmi-verma.jpg" alt="Reshmi Verma Functional Health Specialist" />
              </div>
              <div className="transformation-callout">
                <div className="metric">-38 kg</div>
                <p>Personal weight loss & complete health reversal. Lived experience meets hard science.</p>
              </div>
            </div>

            <div className="about-content">
              <span className="sub-title">Meet Your Practitioner</span>
              <h2>Reshmi Verma</h2>
              <p className="lead" style={{ fontSize: '1.1rem', color: 'var(--emerald-deep)', fontWeight: 500 }}>
                Biotechnologist, Functional Nutritionist, Certified Oxygen Advantage Coach & Health Facilitator
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                "I'm a Biotechnologist and MBA in Marketing & HR, with a specialization in Medical Tourism, and I've spent over 20 years in the world of diagnostics and healthcare. I'm the Director of <strong>Rainbow Medinova Diagnostic Services</strong> and Co-founder of <strong>Neofit Gym</strong>."
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                "I've studied Functional Nutrition across India, the USA, and Australia, and trained as an <strong>Oxygen Advantage Coach</strong>, Breath Resilience Instructor, and Circular Connected Breathwork Facilitator. But perhaps my most personal qualification is my own transformation: losing more than 38 kg and completely changing my relationship with health."
              </p>

              <div className="credentials-list">
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>20+ Years Diagnostics Experience</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Certified Oxygen Advantage Coach</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Director, Rainbow Medinova</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Studied India, USA & Australia</span>
                </div>
              </div>

              <Link to="/booking" className="btn btn-primary">Schedule a Consultation with Reshmi</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Clinic Sanctuary Showcase */}
      <section className="section" style={{ paddingTop: 0, background: 'white' }}>
        <div className="container">
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', height: '380px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-medium)' }}>
            <img src="/assets/images/clinic-sanctuary.jpg" alt="Integrative Wellness Sanctuary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px', background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.92) 100%)', color: 'white' }}>
              <h3 style={{ color: 'white', fontSize: '1.85rem', marginBottom: '8px' }}>A Space Designed For Deep Biological Restoration</h3>
              <p style={{ color: '#FED7AA', maxWidth: '600px', fontSize: '0.95rem' }}>
                Clean, light-filled, nature-immersed clinical environment where advanced diagnostics converge with compassionate functional care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Client Case Studies & Transformation Stories */}
      <section className="section" style={{ background: 'var(--sand-warm)', borderTop: '1px solid var(--sand-border)', borderBottom: '1px solid var(--sand-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Lived Transformations</span>
            <h2>Stories of Real, Sustainable Recovery</h2>
            <p>From chronic acid reflux to crippling fatigue and anxiety, see how addressing the root cause changes everything.</p>
          </div>

          <div className="testimonials-grid">
            {/* Story 1 */}
            <div className="testimonial-card">
              <div className="quote-stars">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p className="testimonial-quote">
                "I suffered from severe acid reflux and gut bloat for 7 years. Reshmi didn't just give me another diet chart; she mapped my gut mucosal lining and taught me vagal breathing before meals. Within 6 weeks, my digestion normalized completely."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AP</div>
                <div className="author-info">
                  <h5>Ananya Patel</h5>
                  <span>Severe GERD & Dysbiosis &bull; 90-Day Protocol</span>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="testimonial-card">
              <div className="quote-stars">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p className="testimonial-quote">
                "My BOLT score was barely 8 seconds when I started. I had chronic brain fog, panic spikes, and mouth breathing at night. Following Reshmi's Oxygen Advantage routine brought my BOLT to 28s. My sleep and energy have skyrocketed."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">RK</div>
                <div className="author-info">
                  <h5>Rahul Kapoor</h5>
                  <span>Nocturnal Airway Stress & Anxiety &bull; Breath Program</span>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="testimonial-card">
              <div className="quote-stars">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p className="testimonial-quote">
                "Knowing that Reshmi herself lost 38 kg gave me unmatched trust. She tailored my cellular nutrition without starvation or deprivation. I lost 16 kg, normalized my HbA1c, and finally have effortless morning energy."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h5>Sunita Mehta</h5>
                  <span>Metabolic Syndrome & Hormonal Reset &bull; 6 Months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Instagram Reels & Daily Protocols Side-Scrolling Section */}
      <section className="reels-section" id="reels-section">
        <div className="container">
          <div className="reels-header-row">
            <div className="reels-header-content">
              <div className="badge-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram Reels & Video Bites</span>
              </div>
              <h2>Daily Protocols & Clinical Insights</h2>
              <p>Swipe or scroll sideways to watch Reshmi's latest short-form masterclasses on gut restoration, breathing biomechanics, and cellular energy.</p>
            </div>

            <div className="reels-nav-controls">
              <button
                className="reels-scroll-arrow"
                id="reels-prev-btn"
                aria-label="Previous reels"
                title="Scroll left"
                onClick={() => scrollReels('left')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                className="reels-scroll-arrow"
                id="reels-next-btn"
                aria-label="Next reels"
                title="Scroll right"
                onClick={() => scrollReels('right')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Side-Scrolling Carousel Container (Touch & Arrow Enabled) */}
          <div className="reels-carousel-container">
            <div className="reels-carousel" id="reels-carousel" ref={reelsCarouselRef}>
              {reelsList.map((reel, idx) => (
                <div className="reel-card" key={reel.id || idx}>
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reel-card-overlay-link"
                    aria-label={`Watch Reel on Instagram: ${reel.title}`}
                  ></a>
                  <img
                    src={reel.image || '/assets/images/founder.jpg'}
                    alt={reel.title}
                    className="reel-cover-img"
                    style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                    onError={(e) => { e.target.src = '/assets/images/founder.jpg'; }}
                  />
                  <div className="reel-gradient-overlay"></div>

                  <div className="reel-top-bar">
                    <span className="reel-badge-ig">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      </svg>
                      <span>Reel</span>
                    </span>
                    <span className="reel-duration-badge">{reel.duration || '0:50'}</span>
                  </div>

                  <div className="reel-play-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>

                  <div className="reel-content-bottom">
                    <span className="reel-category">{reel.topic || 'Clinical Education'}</span>
                    <h3 className="reel-title">{reel.title}</h3>
                    <div className="reel-meta-row">
                      <span>{reel.views || '50K'} views</span>
                      <span className="reel-redirect-cta">
                        <span>Watch</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Channels Redirect Bar */}
          <div className="reels-channels-bar">
            <div className="reels-channels-info">
              <img src="/assets/images/reshmi-verma.jpg" alt="Reshmi Verma" className="reels-channels-avatar" />
              <div className="reels-channels-text">
                <h4>Follow Reshmi Across Platforms</h4>
                <p>New evidence-based reels, video masterclasses, and functional health breakdowns published weekly.</p>
              </div>
            </div>

            <div className="reels-channels-links">
              <a
                href="https://www.instagram.com/healthwithreshmi/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn instagram"
                aria-label="Follow on Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/in/reshmi-verma/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn linkedin"
                aria-label="Connect on LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn youtube"
                aria-label="Subscribe on YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Interactive FAQ Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Frequently Asked Questions</span>
            <h2>Answers to Common Clinical Inquiries</h2>
            <p>Learn how our integrative consultations work and what you can expect.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? 'active' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  <div className="faq-icon">{openFaq === idx ? '−' : '+'}</div>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer" style={{ display: 'block' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CTA Banner Section */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--emerald-deep) 0%, var(--emerald-primary) 100%)', color: 'white' }}>
        <div className="container text-center">
          <span
            className="badge-pill"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              marginBottom: '24px'
            }}
          >
            <span className="pulse-dot" style={{ background: '#FB923C' }}></span>
            <span>Begin Your Healing Journey</span>
          </span>
          <h2 style={{ color: 'white', fontSize: '2.85rem', marginBottom: '20px' }}>Ready for Clarity on Your Health?</h2>
          <p style={{ color: '#FED7AA', maxWidth: '650px', margin: '0 auto 36px', fontSize: '1.15rem' }}>
            Take our 5-minute Health Resilience Assessment or book a dedicated session with Reshmi Verma to decode your symptoms into an actionable recovery plan.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/booking"
              className="btn btn-accent btn-lg"
              style={{ background: 'white', color: 'var(--emerald-deep)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            >
              <span>Schedule Clinical Consultation</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              to="/assessment"
              className="btn btn-secondary btn-lg"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              <span>Take Free Assessment</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
