import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

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
  // Dynamic Reels from API
  const [reelsList, setReelsList] = useState(DEFAULT_REELS);

  useEffect(() => {
    fetch(getApiUrl('/api/reels'))
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data && data.success && Array.isArray(data.reels) && data.reels.length > 0) {
          setReelsList(data.reels);
        }
      })
      .catch(() => {});
  }, []);

  // Carousel ref
  const reelsCarouselRef = useRef(null);

  // Transformation Before/After Showcase state
  const [transformationTab, setTransformationTab] = useState('compare'); // 'compare' | 'before' | 'after'

  // --- Carousel Scroll ---
  const scrollReels = (direction) => {
    if (reelsCarouselRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      reelsCarouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge-pill">
                <span className="pulse-dot"></span>
                <span>🏅 Functional Nutritionist &bull; Somatic Breathwork Facilitator &bull; Biohacker</span>
              </div>

              <h1>Root-Cause <span className="text-gradient">Functional Nutrition</span> &amp; <span className="text-gradient-terracotta">Breathwork Facilitator</span>.</h1>

              <p className="lead">
                Led by <strong>Reshmi Verma</strong> — <strong>Functional Nutritionist</strong>, <strong>Breathwork Facilitator</strong> &amp; <strong>Certified Biohacker</strong>. With over 20 years in diagnostics and healthcare (Director of Rainbow Medinova &amp; Co-founder of Neofit Gym), combining personalized nutrition, breathwork, and autonomic resilience to rebuild lasting vitality.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/booking" className="btn btn-primary btn-lg">
                  <span>Book 1:1 Health Consultation</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link to="/assessment" className="btn btn-secondary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                  </svg>
                  <span>Take Free Health Assessment</span>
                </Link>
              </div>

              {/* Consultation Micro-Trust Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', fontSize: '0.88rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-deep)', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#15803D' }}></span>
                  60-Min 1:1 Session with Reshmi Verma (₹1,999)
                </span>
                <span>&bull;</span>
                <span>Direct Clinical Root-Cause Roadmap</span>
              </div>

              {/* Hero Clinical Highlights */}
              <div className="hero-stats-row">
                <div className="stat-item">
                  <div className="stat-num">20+</div>
                  <div className="stat-label">Years Healthcare &amp; Diagnostics</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Personalized 1:1 Care Pathway</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">6+</div>
                  <div className="stat-label">Global Functional &amp; Breath Certs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">38+<span style={{ fontSize: '1.25rem' }}>kg</span></div>
                  <div className="stat-label">Personal Transformation (98→60s kg)</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Column with Reshmi Verma Saree Portrait & Side Entrance Animation */}
            <div className="hero-visual-col animate-hero-slide-in">
              <div className="hero-portrait-card">
                <div className="hero-portrait-glow-ring"></div>
                <div className="hero-portrait-image-wrap">
                  <img
                    src="/assets/images/reshmi-saree-hero.jpg"
                    alt="Reshmi Verma — Functional Nutritionist & Breathwork Facilitator"
                    className="hero-portrait-img"
                    onError={(e) => { e.target.src = '/assets/images/reshmi-verma-executive.jpg'; }}
                  />
                  <div className="hero-portrait-overlay"></div>
                </div>

                {/* Floating Top Trust Badge */}
                <div className="hero-floating-badge badge-top-right">
                  <div className="badge-icon">🔬</div>
                  <div className="badge-text">
                    <strong>20+ Years</strong>
                    <span>Healthcare &amp; Diagnostics</span>
                  </div>
                </div>

                {/* Floating Bottom Identity Badge */}
                <div className="hero-floating-badge badge-bottom-left">
                  <img
                    src="/assets/images/rv-brand-logo.png"
                    alt="Reshmi Verma Brand Monogram"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                  />
                  <div className="badge-text">
                    <strong>Reshmi Verma</strong>
                    <span>Functional Nutritionist</span>
                  </div>
                </div>

                {/* Floating Breathwork Pill */}
                <div className="hero-floating-pill badge-bottom-right">
                  <span className="pill-dot"></span>
                  <span>Breathwork &amp; Resilience Coach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Lived Experience: The -38 kg Transformation Showcase (Immediate Visibility) */}
      <section 
        className="section" 
        id="lived-transformation-showcase" 
        style={{ 
          background: 'var(--sand-warm)', 
          borderTop: '1px solid var(--sand-border)', 
          borderBottom: '1px solid var(--sand-border)',
          padding: '70px 0'
        }}
      >
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="sub-title">Proof of Concept &bull; Walking The Talk</span>
            <h2>Real Transformation: Meet Your Guide</h2>
            <p>
              Why patient trust starts here: Before designing clinical protocols for others, Reshmi Verma reversed her own metabolic resistance and achieved a sustainable -38 kg transformation without crash diets.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-image-wrapper">
              {/* Transformation View Switcher */}
              <div className="transformation-tabs-nav">
                <button 
                  type="button" 
                  className={`trans-tab-btn ${transformationTab === 'compare' ? 'active' : ''}`}
                  onClick={() => setTransformationTab('compare')}
                >
                  ⚡ Side-by-Side
                </button>
                <button 
                  type="button" 
                  className={`trans-tab-btn ${transformationTab === 'before' ? 'active' : ''}`}
                  onClick={() => setTransformationTab('before')}
                >
                  Before
                </button>
                <button 
                  type="button" 
                  className={`trans-tab-btn ${transformationTab === 'after' ? 'active' : ''}`}
                  onClick={() => setTransformationTab('after')}
                >
                  After (-38 kg)
                </button>
              </div>

              {/* Main Visual Display */}
              <div className="transformation-visual-container">
                {transformationTab === 'compare' && (
                  <div className="transformation-split-view">
                    <div className="split-photo-card">
                      <span className="photo-phase-tag phase-before">BEFORE • Chronic Fatigue</span>
                      <img src="/assets/images/reshmi-transform-user.jpg" alt="Reshmi Verma Before Health Transformation" />
                    </div>
                    <div className="split-divider-line">
                      <span className="divider-badge">-38 KG</span>
                    </div>
                    <div className="split-photo-card">
                      <span className="photo-phase-tag phase-after">AFTER • Metabolic Reversal</span>
                      <img src="/assets/images/reshmi-after.jpg" alt="Reshmi Verma After Health Transformation" />
                    </div>
                  </div>
                )}

                {transformationTab === 'before' && (
                  <div className="transformation-single-view">
                    <span className="photo-phase-tag phase-before">BEFORE • Initial Metabolic Resistance</span>
                    <img src="/assets/images/reshmi-transform-user.jpg" alt="Reshmi Verma Before Transformation" />
                    <div className="single-phase-caption">
                      <strong>Earlier Phase:</strong> Battling systemic inflammation, sluggish metabolism, and persistent fatigue despite clinical healthcare background.
                    </div>
                  </div>
                )}

                {transformationTab === 'after' && (
                  <div className="transformation-single-view">
                    <span className="photo-phase-tag phase-after">AFTER • -38 kg Victory</span>
                    <img src="/assets/images/reshmi-after.jpg" alt="Reshmi Verma After Transformation" />
                    <div className="single-phase-caption">
                      <strong>Reversed Phase:</strong> Reclaimed energy, pristine metabolic biomarkers, Functional Nutritionist &amp; Certified Biohacker without crash dieting.
                    </div>
                  </div>
                )}
              </div>

              <div className="transformation-callout">
                <div className="metric">-38+ kg</div>
                <p>Personal transformation: 98 kg to 60s kg. Lived experience meets hard clinical science.</p>
              </div>
            </div>

            <div className="about-content">
              <span className="sub-title">Lived Experience Meets Clinical Science</span>
              <h2>"I Didn't Just Study Health — I Lived The Struggle."</h2>
              <p className="lead" style={{ fontSize: '1.1rem', color: 'var(--emerald-deep)', fontWeight: 600 }}>
                Reshmi Verma — Biotechnologist, Functional Nutritionist &amp; Breathwork Facilitator
              </p>

              <div style={{ background: 'white', padding: '20px 24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--emerald-medium)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                  "I don't just teach functional protocols — I lived through the exact same metabolic resistance, persistent fatigue, and weight struggles my clients face. Even with over 20 years in diagnostics and healthcare, conventional diet charts failed me. Only when I targeted cellular gut mucosa, mitochondrial energy, and autonomic breathwork did my body release 38+ kg (from 98 kg down to the 60s kg) effortlessly."
                </p>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.65 }}>
                When you work with Reshmi, you are guided by someone who understands the physical and mental hurdles firsthand, backed by over 20 years of diagnostics and healthcare leadership.
              </p>

              <div>
                <Link to="/booking" className="btn btn-primary btn-lg">
                  <span>Book a Health Clarity Session</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 3. The SAMYA Framework Section (Prominent High-Impact Redesign) */}
      <section 
        className="section" 
        id="samya-methodology"
        style={{ 
          background: 'linear-gradient(180deg, #FFFFFF 0%, var(--sand-warm) 50%, #FFFFFF 100%)', 
          borderTop: '1px solid var(--border-subtle)', 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '48px 0'
        }}
      >
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '780px', margin: '0 auto 16px' }}>
            <span 
              className="badge-pill"
              style={{
                background: 'var(--emerald-soft)',
                borderColor: 'var(--emerald-medium)',
                color: 'var(--emerald-deep)',
                marginBottom: '10px',
                fontWeight: 700,
                fontSize: '0.78rem'
              }}
            >
              <span className="pulse-dot" style={{ background: 'var(--emerald-medium)' }}></span>
              <span>Proprietary Methodology • A Different Way To Look At Health</span>
            </span>
            <h2 style={{ fontSize: '2.2rem', lineHeight: 1.2, marginBottom: '10px' }}>
              The <span className="text-gradient">SAMYA™</span> Method
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Connecting gut, breath, hormones, and sleep patterns into a unified clinical blueprint.
            </p>
          </div>

          {/* 5 Prominent Acronym Step Cards */}
          <div className="samya-track">
            {/* S */}
            <div className="samya-card">
              <div className="samya-card-header">
                <div className="samya-letter-hero">S</div>
                <span className="samya-step-badge">Step 01</span>
              </div>
              <h4>See the Signs</h4>
              <p>
                Notice what your body is whispering: erratic digestion, sudden energy drops, brain fog, chest breathing, or fragmented sleep architecture.
              </p>
              <span className="samya-card-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Signal Awareness
              </span>
            </div>

            {/* A */}
            <div className="samya-card">
              <div className="samya-card-header">
                <div className="samya-letter-hero">A</div>
                <span className="samya-step-badge">Step 02</span>
              </div>
              <h4>Ask Right Questions</h4>
              <p>
                We look beyond surface symptoms into your medical history, metabolic timeline, and environmental triggers to understand how patterns formed.
              </p>
              <span className="samya-card-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Deep Root Inquiry
              </span>
            </div>

            {/* M */}
            <div className="samya-card">
              <div className="samya-card-header">
                <div className="samya-letter-hero">M</div>
                <span className="samya-step-badge">Step 03</span>
              </div>
              <h4>Map the Patterns</h4>
              <p>
                We connect the dots between blood chemistry, CO₂ breathing tolerance, microbiome ecology, and circadian cortisol curves.
              </p>
              <span className="samya-card-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Pattern Synthesis
              </span>
            </div>

            {/* Y */}
            <div className="samya-card">
              <div className="samya-card-header">
                <div className="samya-letter-hero">Y</div>
                <span className="samya-step-badge">Step 04</span>
              </div>
              <h4>Your Custom Solution</h4>
              <p>
                A science-backed protocol engineered for your biochemistry: targeted cellular nutrition, gut mucosal repair, and neuromodulation breathwork.
              </p>
              <span className="samya-card-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Bespoke Protocol
              </span>
            </div>

            {/* A */}
            <div className="samya-card">
              <div className="samya-card-header">
                <div className="samya-letter-hero">A</div>
                <span className="samya-step-badge">Step 05</span>
              </div>
              <h4>Achieve Lasting Wellness</h4>
              <p>
                Sustainable cellular vitality that holds for life, monitored through follow-up check-ins and objective biomarker improvements.
              </p>
              <span className="samya-card-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Sustained Vitality
              </span>
            </div>
          </div>

          {/* Integrated SAMYA Bridge Action Banner */}
          <div className="samya-banner-bridge">
            <div className="samya-banner-content">
              <span 
                className="badge-pill" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  borderColor: 'rgba(255, 255, 255, 0.25)', 
                  color: '#FED7AA',
                  marginBottom: '14px' 
                }}
              >
                <span>From Insight To Clarity</span>
              </span>
              <h3>Your assessment highlights the patterns. Your Clarity Session explores your story.</h3>
              <p>
                Experience the SAMYA Method firsthand. In a 60-minute 1:1 Health Clarity Session, Reshmi Verma connects the dots across your health history, lab work, and breathing biomechanics.
              </p>
            </div>
            <div className="samya-banner-actions">
              <Link 
                to="/booking" 
                className="btn btn-accent btn-lg"
                style={{ background: '#FFFFFF', color: 'var(--emerald-deep)', fontWeight: 700 }}
              >
                <span>Book a Health Clarity Session</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link 
                to="/assessment" 
                className="btn btn-secondary btn-lg"
                style={{ background: 'rgba(255, 255, 255, 0.12)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <span>Take Free Assessment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. Targeted Clinical Focus Areas (Crisp & Direct) */}
      <section className="conditions-section" id="conditions-we-resolve">
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '680px', margin: '0 auto 28px' }}>
            <span className="badge-pill" style={{ marginBottom: '10px' }}>
              <span>Targeted Clinical Focus</span>
            </span>
            <h2>Which Chronic Challenge Is Your Body Struggling With?</h2>
            <p style={{ margin: 0 }}>
              Root-cause functional protocols targeting underlying biochemical drivers for lasting recovery.
            </p>
          </div>

          <div className="conditions-grid">
            {/* Condition 1: Gut */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">🫄</div>
                <div>
                  <h3>Gut Dysbiosis &amp; Reflux</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Chronic Bloating &amp; Post-Meal Distension</span></li>
                <li><span className="dot">•</span> <span>Acid Reflux, GERD &amp; SIBO Relapse</span></li>
                <li><span className="dot">•</span> <span>Food Reactivities &amp; Sluggish Motility</span></li>
              </ul>
              <Link to="/booking" className="condition-action-link">
                <span>Explore Gut Care &rarr;</span>
              </Link>
            </div>

            {/* Condition 2: Hormones */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">🌸</div>
                <div>
                  <h3>PCOS &amp; Hormonal Balance</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Irregular or Absent Menstrual Cycles</span></li>
                <li><span className="dot">•</span> <span>Hormonal Acne &amp; Stubborn Weight</span></li>
                <li><span className="dot">•</span> <span>Cellular Insulin Resistance</span></li>
              </ul>
              <Link to="/booking" className="condition-action-link">
                <span>Explore Hormonal Care &rarr;</span>
              </Link>
            </div>

            {/* Condition 3: Metabolic */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">📉</div>
                <div>
                  <h3>Fatty Liver &amp; Metabolism</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Grade-1 &amp; Grade-2 Hepatic Steatosis</span></li>
                <li><span className="dot">•</span> <span>Elevated Fasting Insulin &amp; HbA1c</span></li>
                <li><span className="dot">•</span> <span>Afternoon Fatigue &amp; Sugar Cravings</span></li>
              </ul>
              <Link to="/booking" className="condition-action-link">
                <span>Explore Metabolic Reset &rarr;</span>
              </Link>
            </div>

            {/* Condition 4: Thyroid */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">⚡</div>
                <div>
                  <h3>Hashimoto's &amp; Fatigue</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Elevated Thyroid Antibodies (Anti-TPO)</span></li>
                <li><span className="dot">•</span> <span>Persistent Exhaustion &amp; Brain Fog</span></li>
                <li><span className="dot">•</span> <span>Sluggish Digestion &amp; Joint Discomfort</span></li>
              </ul>
              <Link to="/booking" className="condition-action-link">
                <span>Explore Thyroid Care &rarr;</span>
              </Link>
            </div>

            {/* Condition 5: Breath */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">🫁</div>
                <div>
                  <h3>Breath &amp; Autonomic Stress</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Low BOLT Score (&lt; 15s) &amp; Air Hunger</span></li>
                <li><span className="dot">•</span> <span>Mouth Breathing &amp; 3 AM Awakening</span></li>
                <li><span className="dot">•</span> <span>Sympathetic Nervous System Overdrive</span></li>
              </ul>
              <Link to="/breathe" className="condition-action-link">
                <span>Test BOLT Score &rarr;</span>
              </Link>
            </div>

            {/* Condition 6: Histamine */}
            <div className="condition-card">
              <div className="condition-header">
                <div className="condition-icon-badge">🛡️</div>
                <div>
                  <h3>Histamine &amp; Inflammation</h3>
                </div>
              </div>
              <ul className="condition-symptoms-list">
                <li><span className="dot">•</span> <span>Skin Eczema, Hives &amp; Unexplained Itching</span></li>
                <li><span className="dot">•</span> <span>Sensitivities to Fermented Foods</span></li>
                <li><span className="dot">•</span> <span>Sinus Congestion &amp; Systemic Flare-ups</span></li>
              </ul>
              <Link to="/booking" className="condition-action-link">
                <span>Explore Immune Care &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clinical Respiration & Autonomic Regulation (Crisp & Direct) */}
      <section className="section" id="clinical-respiration-spotlight" style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-secondary) 100%)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '52px 0' }}>
        <div className="container">
          <div
            className="section-header text-center"
            style={{ maxWidth: '720px', margin: '0 auto 28px' }}
          >
            <span className="badge-pill" style={{ marginBottom: '10px' }}>
              <span className="pulse-dot"></span>
              <span>Oxygen Advantage® &bull; Autonomic Regulation</span>
            </span>
            <h2>Breath Mechanics &amp; Autonomic Balance</h2>
            <p style={{ margin: 0 }}>
              Incorporating respiration diagnostics (BOLT score &amp; vagal tone) directly into your personalized recovery protocol.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1020px', margin: '0 auto' }}>
            
            {/* Clinical Mechanism Card */}
            <div style={{ background: '#FFFFFF', padding: '26px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  🫁
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--emerald-deep)' }}>Respiration Diagnostics</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vagal Tone &amp; Nervous System Balance</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>✓</span>
                  <span><strong>Gut &amp; Motility:</strong> Vagal breath pacing activates the parasympathetic "rest &amp; digest" state.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>✓</span>
                  <span><strong>Cortisol &amp; Sleep:</strong> Nasal breathing drills stabilize nocturnal adrenaline and stop 3 AM awakenings.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>✓</span>
                  <span><strong>Cellular CO₂ Tolerance:</strong> Personalized BOLT testing measures true oxygen delivery efficiency.</span>
                </li>
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <Link to="/breathe" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                  <span>Test your BOLT score in the Breath Lab &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Direct 1:1 Consultation Bridge Card */}
            <div style={{ background: 'linear-gradient(135deg, var(--emerald-deep) 0%, #064E3B 100%)', color: '#FFFFFF', padding: '26px 24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '12px' }}>
                <span className="badge-pill" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#FED7AA', fontSize: '0.76rem' }}>
                  60-Minute 1:1 Video Deep Dive &bull; ₹1,999
                </span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginTop: '10px', marginBottom: '6px' }}>
                  Integrated Breath &amp; Functional Nutrition Roadmap
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  Reshmi Verma evaluates your breathing mechanics alongside blood diagnostics to build your customized 30-day recovery protocol.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.84rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                ✓ 60-min 1:1 with Reshmi Verma &bull; Lab biomarker review &bull; Written 30-day protocol
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link to="/booking" className="btn btn-accent btn-lg" style={{ background: '#FFFFFF', color: 'var(--emerald-deep)', fontWeight: 700, width: '100%', justifyContent: 'center' }}>
                  <span>Book 1:1 Consultation (₹1,999) &rarr;</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. 6 Core Interconnected Clinical Pillars (Your Health. Your Whole Story) */}
      <section className="section" id="pillars" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 40px' }}>
            <span className="sub-title">Your Health. Your Whole Story.</span>
            <h2>Six Interconnected Pillars of Lasting Vitality</h2>
            <p>
              Because energy, digestion, hormones, sleep, stress and longevity are not separate conversations. They’re connected.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1: Health Insights */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h3>Health Insights</h3>
              <p>
                Bring together your health story, history, and available clinical information to see the bigger picture and identify root patterns.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Health History</span>
                <span className="pillar-tag">Pattern Discovery</span>
                <span className="pillar-tag">Big Picture Care</span>
              </div>
            </div>

            {/* Pillar 2: Gut Health */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a9 9 0 0 1 9 9c0 5-4 9-9 9s-9-4-9-9a9 9 0 0 1 9-9z"></path>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <h3>Gut Health</h3>
              <p>
                Understand your digestion, gut patterns, microbiome fermentation, and the factors that may influence how you feel each day.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Mucosal Repair</span>
                <span className="pillar-tag">Digestion Patterns</span>
                <span className="pillar-tag">Microbiome Balance</span>
              </div>
            </div>

            {/* Pillar 3: Breathwork & Regulation */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12a4 4 0 0 1 8 0"></path>
                  <path d="M12 8v8"></path>
                </svg>
              </div>
              <h3>Breathwork &amp; Regulation</h3>
              <p>
                Breathe, regulate, and build greater resilience through functional breathing biomechanics, vagal stimulation, and CO₂ tolerance.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Oxygen Advantage</span>
                <span className="pillar-tag">Vagal Tone</span>
                <span className="pillar-tag">Stress Modulation</span>
              </div>
            </div>

            {/* Pillar 4: Personalised Nutrition */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </div>
              <h3>Personalised Nutrition</h3>
              <p>
                Build an approach to food and cellular nutrition that works for your unique body, metabolic speed, and daily schedule without starvation.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Nutrient Density</span>
                <span className="pillar-tag">Glycemic Stability</span>
                <span className="pillar-tag">Real Food First</span>
              </div>
            </div>

            {/* Pillar 5: Hormonal Health */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3>Hormonal Health</h3>
              <p>
                Support your body through changing needs, cortisol fluctuations, thyroid receptor sensitivity, and different life stages.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Cortisol Balance</span>
                <span className="pillar-tag">Metabolic Flow</span>
                <span className="pillar-tag">Life Stage Support</span>
              </div>
            </div>

            {/* Pillar 6: Longevity & Healthy Ageing */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3>Longevity &amp; Healthy Ageing</h3>
              <p>
                Build the foundations for a healthier, stronger future through mitochondrial energy repair, restful sleep cycles, and cellular resilience.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Mitochondrial ATP</span>
                <span className="pillar-tag">Deep Sleep</span>
                <span className="pillar-tag">Cellular Vitality</span>
              </div>
            </div>
          </div>

          {/* Post-Pillars Clinical Consultation Banner */}
          <div style={{ marginTop: '48px', background: '#FFFFFF', padding: '32px 36px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="badge-pill" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                <span>Interconnected Clinical Care</span>
              </span>
              <h3 style={{ fontSize: '1.45rem', color: 'var(--emerald-deep)', margin: '8px 0' }}>
                Which of these pillars is your body struggling with right now?
              </h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.96rem', lineHeight: 1.6 }}>
                In your 60-Minute 1:1 Health Clarity Session, Reshmi Verma connects the dots across your symptom patterns, blood chemistry, and nervous system to build your personalized recovery blueprint.
              </p>
            </div>
            <div>
              <Link to="/booking" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
                <span>Book 1:1 Health Consultation (₹1,999)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 7. How We Work Together Section (No One-Size-Fits-All) */}
      <section className="section" id="how-we-work" style={{ background: 'var(--sand-warm)', borderTop: '1px solid var(--sand-border)', borderBottom: '1px solid var(--sand-border)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 30px' }}>
            <span className="sub-title">A Tailored Health Pathway</span>
            <h2>How We Work Together</h2>
            <p>
              After your Health Clarity Session, the appropriate health pathway is determined based on your individual needs. There is no one-size-fits-all program.
            </p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="how-step-number">01</div>
              <h3>Free Health Assessment</h3>
              <p>
                Take our 5-minute Health Resilience Assessment to capture your health baseline, pinpoint gut patterns, and understand the signals your body is giving.
              </p>
              <span className="how-step-highlight">Step 1 • Signal Discovery</span>
            </div>

            <div className="how-step-card" style={{ borderColor: 'var(--emerald-medium)', boxShadow: 'var(--shadow-md)', background: '#FFFFFF' }}>
              <div className="how-step-number" style={{ color: 'var(--emerald-medium)' }}>02</div>
              <h3>Health Clarity Session</h3>
              <p>
                A comprehensive 60-minute 1:1 session with Reshmi Verma (₹1,999) exploring your health history, lab panels, breathing mechanics, and metabolic bottlenecks.
              </p>
              <span className="how-step-highlight" style={{ background: 'var(--emerald-soft)' }}>Step 2 • 60-Min 1:1 (₹1,999)</span>
            </div>

            <div className="how-step-card">
              <div className="how-step-number">03</div>
              <h3>Tailored Health Pathway</h3>
              <p>
                Receive an individualized protocol built around your unique biochemistry: targeted cellular nutrition, gut mucosal repair, and respiratory modulation.
              </p>
              <span className="how-step-highlight">Step 3 • Customized Protocol</span>
            </div>
          </div>

          <div className="how-manifesto-box">
            <div className="how-manifesto-text">
              <strong>There is no one-size-fits-all program.</strong>
              <p>
                Your personalized plan is built directly around your health story, goals, and biochemical assessment. That is vastly more powerful and sustainable than generic diet charts.
              </p>
            </div>
            <Link to="/booking" className="btn btn-primary btn-lg">
              <span>Book a Health Clarity Session</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
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

      {/* 8. Verified Patient Testimonials & Outcomes */}
      <section className="section" id="client-breakthroughs" style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '60px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '720px', margin: '0 auto 36px' }}>
            <span className="badge-pill" style={{ marginBottom: '10px' }}>
              <span>Verified Patient Outcomes</span>
            </span>
            <h2>Real Clinical Transformations</h2>
            <p style={{ margin: 0 }}>
              Genuine recovery stories from patients who addressed the root biochemical cause of their chronic challenges.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Review 1 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '12px', letterSpacing: '2px' }}>
                ★★★★★
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic', flex: 1 }}>
                "Suffered from severe GERD and post-meal bloating for 3 years. Reshmi's gut mucosa protocol resolved the burning and reflux within 6 weeks. No more daily antacids."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
                  AP
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>Ananya Patel</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GERD &amp; SIBO Recovery • 3 Months</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '12px', letterSpacing: '2px' }}>
                ★★★★★
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic', flex: 1 }}>
                "My BOLT score was just 8 seconds with high anxiety and midnight awakenings. Reshmi's breathing pacing and autonomic reset brought my score to 26s. I finally sleep peacefully."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
                  RK
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>Rahul Kapoor</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Oxygen Advantage &amp; Sleep Program</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#F59E0B', fontSize: '1.05rem', marginBottom: '12px', letterSpacing: '2px' }}>
                ★★★★★
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic', flex: 1 }}>
                "Knowing that Reshmi herself lost 38 kg gave me immense confidence. She customized my nutrition without starvation. Lost 15 kg and my HbA1c is completely normal."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
                  SM
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--emerald-deep)' }}>Sunita Mehta</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Metabolic Health &amp; Weight Reversal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Consultation CTA Card */}
          <div style={{ marginTop: '40px', background: 'var(--emerald-soft)', padding: '28px 32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--emerald-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--emerald-deep)', margin: '0 0 6px 0' }}>
                Ready to uncover the root cause of your symptoms?
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Book a 60-minute 1:1 Health Clarity Session with Reshmi Verma for a personalized roadmap.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary btn-lg">
                <span>Book Consultation (₹1,999)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '6px' }}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/assessment" className="btn btn-secondary btn-lg">
                <span>Take Free Assessment</span>
              </Link>
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
                    src={reel.image || '/assets/images/reshmi-verma.jpg'}
                    alt={reel.title}
                    className="reel-cover-img"
                    style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/reshmi-verma.jpg';
                    }}
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

      {/* 8. Trust & Founder Spotlight Banner */}
      <section style={{ background: '#FAF8F5', padding: '44px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-medium)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Led By Reshmi Verma &bull; 20+ Years Clinical Diagnostics Leadership
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--emerald-deep)', margin: '0 0 6px', fontFamily: 'var(--font-serif)' }}>
              Biotechnologist &bull; Functional Nutritionist &bull; Breathwork Facilitator
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Director of Rainbow Medinova Diagnostic Services and Co-founder of Neofit Gym. Read her journey from pathology diagnostics to personal 38 kg reversal.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/about" className="btn btn-secondary btn-lg" style={{ borderRadius: '14px', padding: '12px 24px', fontSize: '0.95rem' }}>
              <span>Read Reshmi's Full Story &rarr;</span>
            </Link>
            <Link to="/booking" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', padding: '12px 26px', fontSize: '0.95rem' }}>
              <span>Book 1:1 Consultation (₹1,999)</span>
            </Link>
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
              <span>Book a Health Clarity Session</span>
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
