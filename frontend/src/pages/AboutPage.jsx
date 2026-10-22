import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientTransformationShowcase from '../components/ClientTransformationShowcase';

function AnimatedNumber({ value, suffix = '', duration = 1600 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is a 1:1 Health Clarity Consultation with Reshmi Verma?',
      a: 'A dedicated 60-minute video session where Reshmi analyzes your complete medical history, lifestyle patterns, gut symptoms, and previous diagnostic blood tests. Instead of giving a generic diet chart, she uncovers the biochemical root-causes behind your symptoms and gives you a structured, actionable recovery blueprint.'
    },
    {
      q: 'How is Functional Medicine different from conventional medicine?',
      a: 'Conventional medicine often focuses on diagnosing acute diseases and suppressing symptoms with medication. Functional Medicine looks at the upstream causes — such as chronic low-grade gut inflammation, impaired CO₂ breathing tolerance, micronutrient deficiencies, and circadian disruption — to restore your body to self-healing equilibrium.'
    },
    {
      q: 'Do I need recent blood test reports before booking a session?',
      a: 'It is highly helpful but not mandatory. If you have tests from the last 3-6 months (CBC, Thyroid Panel, HbA1c, Vitamin D/B12, Lipid, Liver/Kidney), you can upload them during booking. During the session, Reshmi will analyze them functionally. If new tests are needed, she will recommend specific targeted panels.'
    },
    {
      q: 'What makes Reshmi Verma’s approach unique?',
      a: 'Reshmi brings rare dual authority: over 20 years of experience directing clinical diagnostic laboratories (Rainbow Medinova) combined with formal credentials in Functional Nutrition, Certified Breathwork, and Human Biohacking. Moreover, she personally reversed 38 kg of weight and chronic metabolic fatigue, so every protocol is forged through genuine lived experience and clinical empathy.'
    },
    {
      q: 'Can online consultations be effective for gut and hormonal issues?',
      a: 'Absolutely. Over 90% of chronic gut, hormonal, and metabolic challenges stem from daily lifestyle, nutrition, breath mechanics, and autonomic nervous system triggers. Through high-definition video calls and detailed pre-intake assessments, our clients worldwide achieve transformational symptom reversal.'
    },
    {
      q: 'What is the fee for the 1:1 Health Clarity Consultation?',
      a: 'The 1:1 Health Clarity Consultation is ₹1,999 for a full 60-minute in-depth video session. This includes pre-session review of your lab reports, interactive symptom decoding, and a tailored recovery roadmap.'
    }
  ];

  return (
    <>
      {/* 1. Hero Section */}
      <section className="section about-anim-fade-up" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            <span
              className="badge-pill"
              style={{
                background: 'var(--emerald-soft)',
                borderColor: 'var(--emerald-medium)',
                color: 'var(--emerald-deep)',
                marginBottom: '16px',
                fontWeight: 700
              }}
            >
              <span className="pulse-dot" style={{ background: 'var(--emerald-medium)' }}></span>
              <span>Clinical Diagnostics &bull; Functional Nutrition &bull; Somatic Breathwork</span>
            </span>

            <h1 style={{ lineHeight: 1.18, marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>
              <span className="about-heading-line-1">
                From Reading 100,000+ Blood Panels to
              </span>
              <span className="about-heading-line-2 text-gradient">
                Reversing Chronic Health Roadblocks
              </span>
            </h1>

            <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto 32px' }}>
              Meet <strong>Reshmi Verma</strong> — Functional Nutritionist, Certified Breathwork Facilitator, and Biohacker. Bridging two decades of laboratory diagnostic leadership with root-cause medicine to help you reclaim energy, gut harmony, and metabolic freedom.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', padding: '14px 22px' }}>
                <span>Book 1:1 Consultation</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                </svg>
              </Link>
              <Link to="/assessment" className="btn btn-secondary btn-lg" style={{ borderRadius: '14px', padding: '14px 24px' }}>
                <span>Take Free Health Check</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Authority Metrics Strip with Animated Counters */}
      <section style={{ padding: '10px 0 40px' }}>
        <div className="container">
          <div
            style={{
              background: '#FFFFFF',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(18, 18, 20, 0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              textAlign: 'center'
            }}
          >
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={20} suffix="+" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Years in Clinical Diagnostics
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-medium)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={38} suffix=" kg" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Personal Reversal &amp; Transformation
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={1000} suffix="+" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Patient Consultations Guided
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-medium)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={100} suffix="%" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Root-Cause, Drug-Free Focus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinical Diagnostics Leadership & Personal Transformation (Meet Reshmi Verma) */}
      <section className="section" id="about-reshmi" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <div className="about-main-image about-portrait-breathe" style={{ aspectRatio: '3/4', maxHeight: '580px', borderRadius: '24px', overflow: 'hidden' }}>
                <img
                  src="/assets/images/founder.jpg"
                  alt="Reshmi Verma - Healthcare Executive, Functional Nutritionist & Biohacker"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }}
                />
              </div>
              <div className="transformation-callout about-badge-float" style={{ bottom: '-16px', right: '-16px' }}>
                <div className="metric">20+ Yrs</div>
                <p>Healthcare &amp; Diagnostics Experience</p>
              </div>
            </div>

            <div className="about-content">
              <span className="sub-title">Integrative Perspective to Health</span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--emerald-deep)', margin: '4px 0 10px' }}>Meet Reshmi Verma</h2>
              <p className="lead" style={{ fontSize: '1.12rem', color: 'var(--emerald-deep)', fontWeight: 700, marginBottom: '18px' }}>
                Biotechnologist &bull; MBA &bull; Functional Nutritionist &bull; Breathwork Facilitator &bull; Biohacker
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.7, fontSize: '1.02rem' }}>
                I’m a <strong>Biotechnologist and MBA in Marketing &amp; HR</strong>, with a specialization in <strong>Medical Tourism</strong>, and have spent <strong>over 20 years</strong> in the world of diagnostics and healthcare. I’m the <strong>Director of Rainbow Medinova Diagnostic Services</strong> &amp; <strong>Co-founder of Neofit Gym</strong>.
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7, fontSize: '1.02rem' }}>
                As a Functional Nutritionist, Biohacker &amp; Gut Health Coach, I’ve studied Functional Nutrition across <strong>India, the USA and Australia</strong>, and trained as a Breath Resilience Instructor and Circular Connected Breathwork Facilitator, with a deep interest in Longevity.
              </p>

              {/* Philosophy Quote Callout */}
              <div
                className="quote-interactive-box"
                style={{
                  background: 'var(--sand-cream)',
                  borderLeft: '4px solid var(--emerald-medium)',
                  padding: '18px 22px',
                  borderRadius: '0 16px 16px 0',
                  margin: '18px 0 20px',
                  fontStyle: 'italic',
                  color: 'var(--emerald-primary)',
                  fontSize: '1.02rem',
                  lineHeight: 1.6
                }}
              >
                &ldquo;Perhaps my most personal qualification is my own transformation losing more than 38 kg (from 98 kg to the 60s kg) and completely changing my relationship with health. Today, I bring together science, healthcare experience and lived transformation to help people build better health, greater resilience and lasting change.&rdquo;
              </div>

              <div className="credentials-list">
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>20+ Years in Healthcare &amp; Diagnostics</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Director, Rainbow Medinova &amp; Co-founder, Neofit Gym</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Functional Nutritionist (India, USA &amp; Australia)</span>
                </div>
                <div className="credential-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Breath Resilience &amp; Somatic Instructor</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '22px' }}>
                <Link to="/booking" className="btn btn-primary" style={{ borderRadius: '12px', padding: '12px 24px' }}>
                  <span>Book 1:1 Consultation</span>
                </Link>
                <Link to="/assessment" className="btn btn-secondary" style={{ borderRadius: '12px', padding: '12px 20px' }}>
                  <span>Take Free Assessment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. Diagnostic Philosophy Deep-Dive */}
      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '44px', alignItems: 'center' }}>
            <div>
              <span className="badge-pill" style={{ marginBottom: '12px', fontSize: '0.78rem' }}>
                <span>The Diagnostic Lens</span>
              </span>
              <h3 style={{ fontSize: '2rem', color: 'var(--emerald-deep)', marginBottom: '14px', lineHeight: 1.3 }}>
                Why "Normal" Lab Reports Often Mask Real Illness.
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.98rem', marginBottom: '14px' }}>
                Standard pathology reference ranges are designed to detect end-stage pathological failure. They were never calibrated to flag sub-clinical inflammation, cellular gut permeability, or autonomic burnout.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.98rem', margin: 0 }}>
                In a 1:1 Consultation, Reshmi looks at functional biomarker patterns: correlating subtle shifts in your liver enzymes, fasting insulin, thyroid conversions, and respiratory CO₂ tolerance into a unified action plan.
              </p>
            </div>

            <div>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 36px rgba(0,0,0,0.08)' }}>
                <img
                  src="/assets/images/clinical-consultation.jpg"
                  alt="Clinical Consultation Review"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Client Before & After Transformations & Real Voice Notes */}
      <ClientTransformationShowcase />

      {/* 4. Patient Problems & Healing Solutions (With Generated Clinical Images) */}
      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 40px' }}>
            <span className="badge-pill" style={{ marginBottom: '12px', fontSize: '0.78rem' }}>
              <span>Clinical Focus Areas</span>
            </span>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--emerald-deep)' }}>
              Conditions We Help You Overcome
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Real clinical solutions targeting the three interconnected roots of chronic physical friction.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {/* Card 1: Gut Health & Diet */}
            <div className="clinical-card-interactive" style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              <div className="card-img-wrap" style={{ height: '220px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <img
                  src="/assets/images/diet-nutrition-plate.jpg"
                  alt="Personalized Functional Nutrition Meal Plate"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥗</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald-deep)', margin: 0 }}>Gut &amp; Digestive Dysbiosis</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  Persistent bloating, acid reflux, SIBO, leaky gut, and unexplained food sensitivities. We rebuild gut mucosal integrity using targeted foods, elimination timing, and microbiome repair.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--emerald-medium)', fontWeight: 700 }}>
                  ✓ Rebuilt mucosal barrier &bull; Zero crash starvation
                </div>
              </div>
            </div>

            {/* Card 2: Metabolic & Hormonal Vitality */}
            <div className="clinical-card-interactive" style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              <div className="card-img-wrap" style={{ height: '220px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <img
                  src="/assets/images/patient-vitality-energy.jpg"
                  alt="Hormonal and Energy Vitality"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald-deep)', margin: 0 }}>Metabolism &amp; Hormonal Balance</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  PCOS, thyroid sluggishness, afternoon exhaustion crashes, and stubborn abdominal fat. We balance cellular glucose kinetics, circadian insulin sensitivity, and cortisol curves.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--emerald-medium)', fontWeight: 700 }}>
                  ✓ Stable all-day energy &bull; Natural hormonal flow
                </div>
              </div>
            </div>

            {/* Card 3: Breath & Autonomic Nervous System */}
            <div className="clinical-card-interactive" style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              <div className="card-img-wrap" style={{ height: '220px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <img
                  src="/assets/images/breath-nervous-system.jpg"
                  alt="Nervous System & Breath Regulation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💨</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald-deep)', margin: 0 }}>Stress, Anxiety &amp; Breathing</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  Shallow chest breathing, rapid mouth breathing, fragmented sleep, and chronic autonomic fight-or-flight overdrive. Somatic breathwork resets CO₂ chemoreceptors and stimulates vagal tone.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--emerald-medium)', fontWeight: 700 }}>
                  ✓ Deep restorative sleep &bull; Nervous system calm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive Clinical FAQs */}
      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="section-header text-center" style={{ marginBottom: '32px' }}>
            <span className="badge-pill" style={{ marginBottom: '10px', fontSize: '0.78rem' }}>
              <span>Frequently Asked Questions</span>
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--emerald-deep)' }}>
              Everything You Need to Know
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Clear answers regarding our 1:1 consultations, protocols, and care process.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? 'active' : ''}`}>
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px' }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--emerald-deep)', fontSize: '0.98rem' }}>{faq.q}</span>
                  <div className="faq-icon" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald-medium)' }}>
                    {openFaq === idx ? '−' : '+'}
                  </div>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer" style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Direct Bottom Consultation CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--emerald-deep) 0%, var(--emerald-primary) 100%)', color: 'white' }}>
        <div className="container text-center">
          <span
            className="badge-pill"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              marginBottom: '20px'
            }}
          >
            <span className="pulse-dot" style={{ background: '#FB923C' }}></span>
            <span>Take The First Step</span>
          </span>
          <h2 style={{ color: 'white', fontSize: '2.6rem', marginBottom: '16px' }}>Ready to Uncover Your Health Blueprint?</h2>
          <p style={{ color: '#FED7AA', maxWidth: '640px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
            Book your 60-minute 1:1 Health Clarity Consultation with Reshmi Verma (₹1,999) to connect your symptoms, laboratory diagnostics, and recovery roadmap.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/booking"
              className="btn btn-accent btn-lg"
              style={{ background: 'white', color: 'var(--emerald-deep)', borderRadius: '14px', padding: '14px 28px', fontWeight: 700 }}
            >
              <span>Book Session</span>
            </Link>
            <Link
              to="/assessment"
              className="btn btn-secondary btn-lg"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '14px', padding: '14px 24px' }}
            >
              <span>Take Free Assessment First</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
