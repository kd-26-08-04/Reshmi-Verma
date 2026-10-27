import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const DEFAULT_REELS = [
  {
    id: "reel-1",
    title: "Food Controlling You vs. You Controlling Food: Root Cause Healing",
    url: "https://www.instagram.com/reel/Dbt0IfST8hF/?xtok=c3ExNWwxN2pwd3hp",
    image: "/assets/images/reshmi-verma.jpg",
    views: "52.4K",
    duration: "0:59",
    topic: "Food Freedom"
  },
  {
    id: "reel-2",
    title: "How to Eat Seeds the Right Way: Chia, Flax, Sesame, Pumpkin & More",
    url: "https://www.instagram.com/reel/DeBgLUCzomt/?psln=aXkwYXExNWd5end2",
    image: "/assets/images/functional-nutrition.jpg",
    views: "68.1K",
    duration: "0:54",
    topic: "Seed Nutrition"
  },
  {
    id: "reel-3",
    title: "4-7-8 Breathing Technique: Calm Your Nervous System & Beat Stress",
    url: "https://www.instagram.com/reel/DaqrVQzz5No/?dlrf=MTh3Y29xaXIxdXFzbQ==",
    image: "/assets/images/reel-3-food-swaps.jpg",
    views: "81.6K",
    duration: "0:48",
    topic: "Breathwork & Stress Relief"
  },
  {
    id: "reel-4",
    title: "Mudras & Breathwork: How Hand Positions Change Your Nervous System",
    url: "https://www.instagram.com/reel/DZVtU4TTQbS/?cplk=cjRmeHA0aWE4ZzJr",
    image: "/assets/images/reel-4-gut-mucosa.jpg",
    views: "44.9K",
    duration: "0:56",
    topic: "Mudras & Breathwork"
  },
  {
    id: "reel-5",
    title: "Protein Won't Damage Your Kidneys: Busting the Biggest Indian Diet Myth",
    url: "https://www.instagram.com/reel/DY5Q--ATcKt/?vrfl=bWp5NGJvZjYydWZv",
    image: "/assets/images/clinic-sanctuary.jpg",
    views: "73.2K",
    duration: "0:51",
    topic: "Protein Myths"
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

const PATIENT_STORIES = [
  {
    name: "Vartika",
    location: "Bangalore",
    avatar: "/assets/images/real-patient-vartika.jpg",
    quote: '"For as long as I can remember, I had been suffering from Hashimoto\'s, extreme fatigue, and crazy PMS mood swings. Within 8 weeks on Reshmi\'s gut & breath protocol, my brain fog vanished and energy is at an all-time high!"'
  },
  {
    name: "Simrat",
    location: "Ludhiana",
    avatar: "/assets/images/real-patient-simrat.jpg",
    quote: '"This program has done wonders in my life. I had severe chronic constipation, low energy, and food sensitivities. Reshmi\'s diagnostic approach repaired my digestion without restrictive crash diets."'
  },
  {
    name: "Pranav",
    location: "New Delhi",
    avatar: "/assets/images/real-patient-pranav.jpg",
    quote: '"I was struggling with anxiety-induced shallow breathing, sleep apnea, and high stress. Oxygen Advantage breathwork with Reshmi boosted my BOLT score from 12s to 32s. Sleep quality is now phenomenal."'
  },
  {
    name: "Shoaib",
    location: "Ahmednagar",
    avatar: "/assets/images/real-patient-shoaib.jpg",
    quote: '"I had been suffering from severe gastritis, acidity, and post-meal sluggishness for years. Reshmi pinpointed the exact bacterial imbalance in my lab report and fixed it with whole food biochemistry."'
  }
];

const SAMYA_STEPS = [
  {
    letter: 'S',
    step: 'Step 01',
    title: 'See the Signs',
    desc: 'Notice what your body is whispering: erratic digestion, sudden energy drops, brain fog, chest breathing, or fragmented sleep architecture.',
    tag: 'Signal Awareness',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  },
  {
    letter: 'A',
    step: 'Step 02',
    title: 'Ask Right Questions',
    desc: 'We look beyond surface symptoms into your medical history, metabolic timeline, and environmental triggers to understand how patterns formed.',
    tag: 'Deep Root Inquiry',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    )
  },
  {
    letter: 'M',
    step: 'Step 03',
    title: 'Map the Patterns',
    desc: 'We connect the dots between blood chemistry, CO₂ breathing tolerance, microbiome ecology, and circadian cortisol curves.',
    tag: 'Pattern Synthesis',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    )
  },
  {
    letter: 'Y',
    step: 'Step 04',
    title: 'Your Custom Solution',
    desc: 'A science-backed protocol engineered for your biochemistry: targeted cellular nutrition, gut mucosal repair, and neuromodulation breathwork.',
    tag: 'Bespoke Protocol',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  },
  {
    letter: 'A',
    step: 'Step 05',
    title: 'Achieve Lasting Wellness',
    desc: 'Sustainable cellular vitality that holds for life, monitored through follow-up check-ins and objective biomarker improvements.',
    tag: 'Sustained Vitality',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  }
];

const CLINICAL_REVIEWS = [
  {
    initials: 'AP',
    name: 'Ananya Patel',
    program: 'GERD & SIBO Recovery • 3 Months',
    stars: '★★★★★',
    quote: '"Suffered from severe GERD and post-meal bloating for 3 years. Reshmi\'s gut mucosa protocol resolved the burning and reflux within 6 weeks. No more daily antacids."'
  },
  {
    initials: 'RK',
    name: 'Rahul Kapoor',
    program: 'Oxygen Advantage & Sleep Program',
    stars: '★★★★★',
    quote: '"My BOLT score was just 8 seconds with high anxiety and midnight awakenings. Reshmi\'s breathing pacing and autonomic reset brought my score to 26s. I finally sleep peacefully."'
  },
  {
    initials: 'SM',
    name: 'Sunita Mehta',
    program: 'Metabolic Health & Weight Reversal',
    stars: '★★★★★',
    quote: '"Knowing that Reshmi herself lost 38 kg gave me immense confidence. She customized my nutrition without starvation. Lost 15 kg and my HbA1c is completely normal."'
  },
  {
    initials: 'VS',
    name: 'Vikram Singhal',
    program: 'Circadian Metabolic Reset • 4 Months',
    stars: '★★★★★',
    quote: '"Constant post-meal lethargy and stubborn insulin resistance were draining me. Reshmi\'s precise food pairing and vagal breathing restored my stamina and metabolic agility."'
  }
];

export default function HomePage() {
  const [showScopeDisclaimer, setShowScopeDisclaimer] = useState(false);
  // SAMYA Method accordion state (starts with 2 steps shown, rest revealed on click)
  const [showAllSamya, setShowAllSamya] = useState(false);


  // Static Reels directly from code (no API / no database)
  const reelsList = DEFAULT_REELS;

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
                <span>Functional Nutritionist &bull; Somatic Breathwork Facilitator &bull; Biohacker</span>
              </div>

              <h1 style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a2a 35%, #00A99D 70%, #00E5D9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Don’t Wait to Feel Unwell to Start Living Well.</h1>

              <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 600, color: 'var(--emerald-deep)', margin: '-4px 0 16px', lineHeight: 1.45 }}>
                A More Proactive, Root-Cause Approach to Health, Built Around You.
              </p>

              <p className="lead" style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <strong>Reshmi Verma</strong> is the Director of Rainbow Medinova Diagnostic Services, Nagpur, with 18 years of experience in diagnostics. As a Functional Nutritionist, Breathwork Facilitator, Oxygen Advantage Coach, Breath Resilience Instructor, and Certified Biohacker, she brings together diagnostic insights, personalized nutrition, breathwork, breath resilience, and lifestyle strategies to help people understand their bodies, explore underlying imbalances, and make informed choices for long-term health and vitality.
              </p>

              <div className="hero-cta-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/assessment" className="btn btn-health btn-lg">
                  <span>Health Assessment</span>
                </Link>
                <Link to="/breathing-assessment" className="btn btn-breath btn-lg">
                  <span>Breath Assessment</span>
                </Link>
                <Link to="/booking" className="btn btn-primary btn-lg">
                  <span>Book Consultation</span>
                </Link>
              </div>

              {/* Consultation Micro-Trust Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', fontSize: '0.88rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-deep)', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#15803D' }}></span>
                  60-Min 1:1 Session with Reshmi Verma
                </span>
                <span>&bull;</span>
                <span>Direct Clinical Root-Cause Roadmap</span>
              </div>

              {/* Hero Clinical Highlights */}
              <div className="hero-stats-row">
                <div className="stat-item">
                  <div className="stat-num">20+ Yrs</div>
                  <div className="stat-label">Healthcare &amp; Diagnostics</div>
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
                  <div className="badge-text">
                    <strong>20+ Years</strong>
                    <span>Healthcare &amp; Diagnostics</span>
                  </div>
                </div>

                {/* Floating Bottom Identity Badge */}
                <div className="hero-floating-badge badge-bottom-left">
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

      {/* 1A. Post-Hero Clinical Pillars & Quick Actions (Consult Reshmi, 1:1 UltraWellness, Both Assessments) */}
      <section className="clinical-approach-section">
        <div className="container">
          <div className="clinical-approach-card">
            <p className="clinical-approach-lead">
              Her clinical approach unifies 20+ years of laboratory diagnostic expertise, gut microbiome testing, Oxygen Advantage® breathwork, and identifying the hidden biochemical root causes that trigger chronic inflammation, gut dysbiosis, and metabolic fatigue.
            </p>

            <div className="clinical-approach-buttons">
              <Link to="/booking" className="btn btn-primary">
                Consult Reshmi
              </Link>
              <Link to="/booking" className="btn btn-secondary">
                1:1 Health Reset Program
              </Link>
              <Link to="/assessment" className="btn btn-health">
                Health Assessment
              </Link>
              <Link to="/breathing-assessment" className="btn btn-breath">
                Breathing Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Lived Experience: The -38 kg Transformation Showcase (Immediate Visibility) */}
      <section
        className="section"
        id="lived-transformation-showcase"
        style={{
          padding: '50px 0 60px'
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
                  <div className="transformation-split-view combined-mode">
                    <span className="photo-phase-tag phase-before">BEFORE • Chronic Fatigue</span>
                    <div className="split-divider-line">
                      <span className="divider-badge">-38 KG</span>
                    </div>
                    <span className="photo-phase-tag phase-after">AFTER • Metabolic Reversal</span>
                    <img
                      src="/assets/images/reshmi-transformation-side-by-side.jpg"
                      alt="Reshmi Verma Before and After 38 kg Health Transformation"
                      className="transformation-combined-img"
                    />
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
                  <span>Book Session</span>
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

      {/* 2A. Conditions Addressed & Scope of Practice (Clinical Sage & Bone White Theme Card) */}
      <section className="conditions-scope-wrapper">
        <div className="container">
          <div className="conditions-scope-card">
            <p className="conditions-scope-text-primary">
              She addresses chronic and debilitating health challenges like <strong>Constant Fatigue, Severe Bloating, Breathing Pattern Disorders, Sinus &amp; Airway Blockages, Chronic Constipation, Acid Reflux, Indigestion, SIBO, Frequent Stomach Upsets, Hormonal Acne, Irregular or Absent Periods, Fibroids, Severe Period Pain, Mood Swings, PCOD / PCOS, Endometriosis, Insulin Resistance, Prediabetes &amp; Diabetes, Fatty Liver, Chronic Itching, Urticaria, Eczema, Psoriasis, Autoimmune Conditions, Hashimoto's Thyroiditis</strong>, and systemic cellular exhaustion using 100% natural, science-backed interventions like functional food biochemistry, Oxygen Advantage® respiratory pacing, and targeted lifestyle optimization.
            </p>
            {/* Clinical Advisory & Scope Dropdown Toggle */}
            <div style={{ marginTop: '12px', borderTop: '1px dashed rgba(18, 18, 20, 0.12)', paddingTop: '10px' }}>
              <button
                type="button"
                className={`scope-disclaimer-trigger-btn ${!showScopeDisclaimer ? 'pulse-attention' : ''}`}
                onClick={() => setShowScopeDisclaimer(!showScopeDisclaimer)}
                aria-expanded={showScopeDisclaimer}
              >
                <div className="scope-trigger-content">
                  <span style={{ fontSize: '1rem' }}>🩺</span>
                  <div className="scope-trigger-text">
                    <strong>Clinical Scope &amp; Medical Advisory</strong>
                  </div>
                  <span className="scope-trigger-badge">
                    {showScopeDisclaimer ? 'Hide Advisory ▲' : 'Read Scope ▼'}
                  </span>
                </div>
              </button>

              {showScopeDisclaimer && (
                <div style={{
                  marginTop: '12px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  border: '1px solid rgba(18, 18, 20, 0.08)'
                }}>
                  <p className="conditions-scope-disclaimer" style={{ margin: 0 }}>
                    Reshmi Verma is a functional health coach and certified biohacker with 20+ years in diagnostics, not a conventional medical doctor, and <u>does not prescribe pharmaceutical medicines</u>.<br />
                    Her <em>'Food &amp; Breath as Medicine'</em> clinical methodology complements the work of medical doctors, operating in full synergy with their guidance and clinical protocols.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. The SAMYA Framework Section (Positioned Above Success Stories) */}
      <section
        className="section"
        id="samya-methodology"
        style={{
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
            {SAMYA_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className={`samya-card ${idx >= 2 && !showAllSamya ? 'samya-card-collapsed' : ''}`}
              >
                <div className="samya-card-header">
                  <div className="samya-letter-hero">{step.letter}</div>
                  <span className="samya-step-badge">{step.step}</span>
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                <span className="samya-card-tag">
                  {step.icon}
                  {step.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Dropdown Action Trigger */}
          <div className="samya-dropdown-action-wrap" style={{ marginTop: '14px' }}>
            <button
              type="button"
              className={`samya-dropdown-trigger-btn ${!showAllSamya ? 'pulse-attention' : ''}`}
              onClick={() => setShowAllSamya(!showAllSamya)}
              aria-expanded={showAllSamya}
            >
              <span className="samya-trigger-icon-pill">
                {showAllSamya ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bounce-arrow">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </span>
              <div className="samya-trigger-text">
                <strong>{showAllSamya ? 'Collapse SAMYA™ Steps' : 'Explore All 5 Steps of SAMYA™'}</strong>
              </div>
              <span className="samya-trigger-badge">
                {showAllSamya ? '▲' : '+3 Steps ▼'}
              </span>
            </button>
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
                <span>Book Session</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/assessment" className="btn btn-on-dark btn-lg">
                <span>Take Free Assessment</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real People, Real Success Stories (Contained Luxury Noir Section) */}
      <section style={{ padding: '36px 0 44px', background: 'transparent' }} id="client-success-stories">
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(145deg, #121418 0%, #0D0F12 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '36px 28px 32px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
              color: '#FFFFFF'
            }}
          >
            {/* Centered Section Header */}
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 26px' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.78rem',
                  color: '#00E5D9',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                  background: 'rgba(0, 229, 217, 0.1)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0, 229, 217, 0.25)',
                  marginBottom: '10px'
                }}
              >
                Verified Patient Outcomes
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.8vw, 2.35rem)',
                  color: '#FFFFFF',
                  margin: '0 0 10px',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 800
                }}
              >
                Their Results, Their Words
              </h2>
              <p style={{ color: '#E2E8F0', fontSize: '0.94rem', lineHeight: 1.55, margin: 0 }}>
                Every health journey is different. Real experiences with personalised, root-cause-focused clinical care.
              </p>
            </div>

            {/* Continuous Sliding Infinite Marquee Track */}
            <div className="stories-marquee-container" style={{ marginBottom: '26px' }}>
              <div className="stories-marquee-track">
                {[...PATIENT_STORIES, ...PATIENT_STORIES].map((story, idx) => (
                  <div
                    key={`${story.name}-${idx}`}
                    className="story-client-compact-card"
                    style={{
                      flex: '0 0 320px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderTop: '2.5px solid #00E5D9',
                      borderRadius: '16px',
                      padding: '18px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <img
                        src={story.avatar}
                        alt={story.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid #00E5D9',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {story.name}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: '#00E5D9', fontWeight: 700 }}>
                          {story.location} &bull; Verified
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#F1F5F9', lineHeight: 1.55, margin: 0, fontStyle: 'italic', flex: 1 }}>
                      {story.quote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Centered Action Button */}
            <div style={{ textAlign: 'center' }}>
              <Link
                to="/booking"
                className="btn btn-white-solid btn-lg"
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontSize: '0.95rem'
                }}
              >
                <span>Book 1:1 Consultation</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 7. How We Work Together Section (No One-Size-Fits-All) */}
      <section className="section" id="how-we-work" style={{ padding: '64px 0' }}>
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
                A comprehensive 60-minute 1:1 session with Reshmi Verma exploring your health history, lab panels, breathing mechanics, and metabolic bottlenecks.
              </p>
              <span className="how-step-highlight" style={{ background: 'var(--emerald-soft)' }}>Step 2 • 60-Min 1:1</span>
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
              <span>Book Session</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>





      {/* 9. Instagram Reels & Daily Protocols Side-Scrolling Section */}
      <section className="reels-section" id="videos" data-section="reels-section">
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

            <div className="reels-nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/videos"
                className="btn btn-secondary btn-sm"
                style={{ padding: '7px 16px', fontSize: '0.82rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>🎥 All Videos</span>
                <span>&rarr;</span>
              </Link>
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

          {/* Social Channels Redirect Bar (Luxury Sleek Black Strip with Real Brand Icons) */}
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
                className="footer-social-btn"
                aria-label="Follow on Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="igFollowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igFollowGrad)" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#FFFFFF" />
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/in/reshmiverma/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Connect on LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#0A66C2" />
                  <path d="M19 19h-3v-4.5c0-1.08-.02-2.5-1.5-2.5-1.5 0-1.8 1.2-1.8 2.4V19H9.7V9.5h2.9v1.3h.04c.4-.76 1.4-1.56 2.8-1.56 3 0 3.56 2 3.56 4.56V19zM6.4 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM7.9 19H4.9V9.5h3V19z" fill="#FFFFFF" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Subscribe on YouTube"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000" />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust & Founder Spotlight Banner */}
      <section style={{ padding: '24px 0 36px' }}>
        <div className="container">
          <div
            style={{
              background: '#FFFFFF',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(18, 18, 20, 0.08)',
              borderRadius: '24px',
              padding: '36px 36px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px'
            }}
          >
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
                <span>Read Reshmi's Full Story</span>
              </Link>
              <Link to="/booking" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', padding: '12px 26px', fontSize: '0.95rem' }}>
                <span>Book 1:1 Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4A. More About Reshmi Section (3 Cards: About, Instagram, YouTube) */}
      <section className="more-about-section" id="more-about-reshmi">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Connect &bull; Learn &bull; Explore
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', color: 'var(--emerald-deep)', margin: '6px 0 0', fontFamily: 'var(--font-serif)' }}>
              More about Reshmi
            </h2>
          </div>

          <div className="more-about-grid">
            {/* Card 1: About */}
            <div className="more-about-card">
              <Link to="/about" style={{ display: 'block', textDecoration: 'none' }}>
                <div className="more-about-img-box">
                  <img src="/assets/images/reshmi-saree-hero.jpg" alt="About Reshmi Verma" />
                </div>
              </Link>
              <div className="more-about-content">
                <h3 className="more-about-title">About</h3>
                <Link to="/about" className="more-about-link">
                  <span>Explore Journey &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Instagram */}
            <div className="more-about-card">
              <a
                href="https://www.instagram.com/healthwithreshmi/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div className="more-about-img-box social-box">
                  <img src="/assets/images/reshmi-instagram-profile.png" alt="Reshmi Verma Instagram" />
                </div>
              </a>
              <div className="more-about-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="igCardGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igCardGrad)" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="#FFFFFF" />
                  </svg>
                  <h3 className="more-about-title" style={{ margin: 0 }}>Instagram</h3>
                </div>
                <a
                  href="https://www.instagram.com/healthwithreshmi/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="more-about-link"
                >
                  <span>Follow &rarr;</span>
                </a>
              </div>
            </div>

            {/* Card 3: YouTube */}
            <div className="more-about-card">
              <a
                href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div className="more-about-img-box social-box">
                  <img src="/assets/images/reshmi-youtube-channel.png" alt="Reshmi Verma YouTube" />
                </div>
              </a>
              <div className="more-about-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000" />
                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
                  </svg>
                  <h3 className="more-about-title" style={{ margin: 0 }}>YouTube</h3>
                </div>
                <a
                  href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="more-about-link"
                >
                  <span>Watch Videos &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CTA Banner Section (High Contrast Noir Strip) */}
      <section className="section" style={{ background: '#111111', color: '#FFFFFF' }}>
        <div className="container text-center">
          <span
            className="badge-pill"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}
          >
            <span className="pulse-dot" style={{ background: '#00E5D9' }}></span>
            <span>Begin Your Healing Journey</span>
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.45rem, 5.5vw, 2.75rem)', marginBottom: '14px', lineHeight: 1.25 }}>Ready for Clarity on Your Health?</h2>
          <p style={{ color: '#E5E7EB', maxWidth: '650px', margin: '0 auto 24px', fontSize: 'clamp(0.85rem, 2.5vw, 1.12rem)', lineHeight: 1.5 }}>
            Take our 5-minute Health Resilience Assessment or book a dedicated session with Reshmi Verma to decode your symptoms into an actionable recovery plan.
          </p>
          <div className="cta-dual-btn-row">
            <Link
              to="/booking"
              className="btn btn-white-solid cta-btn-side"
              style={{ padding: '13px 24px', borderRadius: '12px' }}
            >
              <span>Book Session</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              to="/assessment"
              className="btn btn-on-dark cta-btn-side"
              style={{ padding: '13px 22px', borderRadius: '12px' }}
            >
              <span>Free Assessment</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
