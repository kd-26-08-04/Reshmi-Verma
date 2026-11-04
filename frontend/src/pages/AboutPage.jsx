import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RAZORPAY_PAYMENT_URL } from '../utils/api';
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
      q: 'What can I expect from a 1:1 Health Clarity Consultation?',
      a: "A personalised 60-minute online session to explore your health concerns, lifestyle, and nutrition. Gain clarity on possible contributing factors, key health priorities, and practical next steps tailored to your needs."
    },
    {
      q: 'Who can benefit from a consultation?',
      a: "Anyone looking to take a more proactive approach to their health, particularly those experiencing digestive concerns, fatigue, weight changes, hormonal challenges, metabolic concerns, or difficulty achieving lasting results despite trying different approaches."
    },
    {
      q: 'Do I need to have a diagnosed health condition to book?',
      a: "Not at all. You can book even if you don't have a diagnosis. The consultation is also suitable for individuals who want to understand their health better and focus on prevention and long-term wellbeing."
    },
    {
      q: 'What if I have already tried multiple diets, supplements or wellness programmes without lasting results?',
      a: "That's exactly why individualisation matters. Instead of adding another generic protocol, we first explore what you've tried, what worked, what didn't, and what may be missing from your current approach."
    },
    {
      q: "Can I work with Reshmi if I live outside India?",
      a: "Yes. Consultations and eligible programmes are offered online, allowing us to work with clients internationally, subject to time-zone coordination and programme suitability."
    },
    {
      q: "Reshmi a medical doctor? Does she prescribe medication?",
      a: "Reshmi is a Biotechnologist and Functional & Integrative Nutritionist, with specialised training in breathwork, nervous system regulation, and health optimisation. She does not practise as a medical doctor or prescribe medication. Her approach brings together personalised nutrition, evidence-informed wellness protocols, lifestyle interventions, and breathwork, working in tandem with medical practitioners to complement conventional care and support a more comprehensive approach to health."
    }
  ];

  return (
    <>
      {/* 1. Hero Section */}
      <section className="section about-anim-fade-up" style={{ paddingTop: '120px', paddingBottom: '50px' }}>
        <div className="container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>

            <h1 style={{ lineHeight: 1.18, marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>
              <span className="about-heading-line-1">
                Transforming Health Through a Root-Cause Approach              </span>
            </h1>

            <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto 32px' }}>
              Meet <strong>Reshmi Verma</strong>  Functional & Integrative Nutritionist, Certified Biohacker, and Functional Breathwork Facilitator. Her approach integrates personalised nutrition, functional breathing, somatic practices and breath resilience to support nervous system regulation, metabolic health, gut harmony and overall well-being. By bringing together the science of nutrition, breath and mind-body connection, she helps individuals build greater physiological resilience, restore balance and create sustainable health from within.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={RAZORPAY_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', padding: '14px 22px' }}>
                <span>Book 1:1 Consultation</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                </svg>
              </a>
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
                <AnimatedNumber value={18} />
                <span>+ Yrs</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Director, Rainbow Medinova
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-medium)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={100} suffix="%" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Personalised Health Approach
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={3} suffix=" Pillars" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Nutrition, Breathwork & Longevity
              </div>
            </div>
            <div style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--emerald-medium)', fontFamily: 'var(--font-serif)' }}>
                <AnimatedNumber value={38} suffix="+Kg" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Personal Transformation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinical Diagnostics Leadership & Personal Transformation (Meet Reshmi Verma) */}
      <section className="section" id="about-reshmi" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="about-grid" style={{ alignItems: 'flex-start' }}>
            <div className="about-image-wrapper">
              <div className="about-main-image about-portrait-breathe" style={{ aspectRatio: '3/4', maxHeight: '580px', borderRadius: '24px', overflow: 'hidden' }}>
                <img
                  src="/assets/images/reshmi-verma.jpeg"
                  alt="Reshmi Verma - Healthcare Executive, Functional Nutritionist & Biohacker"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }}
                />
              </div>
            </div>

            <div className="about-content">
              <span className="sub-title">Functional & Integrative Perspective to Health</span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--emerald-deep)', margin: '4px 0 10px' }}>Meet Reshmi Verma</h2>
              <p className="lead" style={{ fontSize: '1rem', color: 'var(--emerald-deep)', fontWeight: 600, fontStyle: 'italic', marginBottom: '18px' }}>
                Don’t Wait to Feel Unwell to Start Living Well.
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.7, fontSize: '1.02rem' }}>
                Reshmi Verma is the <strong>Director of Rainbow Medinova Diagnostic Services, Nagpur</strong>, with <strong>18+ years of experience</strong> in diagnostics. A Functional Nutritionist, Breathwork Facilitator, Oxygen Advantage Coach, Certified Biohacker, and Breath Resilience Instructor, she brings together healthcare insights, root-cause nutrition, breathwork, and lifestyle strategies to help people take a more proactive, personalised approach to health.
              </p>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7, fontSize: '1.02rem' }}>
                Her work is deeply informed by her own transformation,losing <strong>38 kg, from 98 kg to 65 kg</strong> and learning that lasting health goes far beyond weight loss. She believes in understanding the body, looking beyond symptoms, and building sustainable habits that support metabolic health, energy, resilience, and healthy ageing.
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
                Her philosophy is simple: <strong style={{ fontStyle: 'normal' }}>Fitness is cheaper than illness.</strong> She empowers people to take charge of their health today, so they can live with greater vitality, confidence, and wellbeing tomorrow.
              </div>

            </div>
          </div>

          {/* 4 Credential Cards Spanning Full Width (Single Line Across Image & Content) */}
          <div className="credentials-list credentials-single-line">
            <div className="credential-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>18+ Yrs in Healthcare &amp; Diagnostics</span>
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
              <span>Functional & Integrative Nutritionist </span>
            </div>
            <div className="credential-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Breath Resilience &amp; Somatic Instructor</span>
            </div>
          </div>

          {/* Centered Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
            <a href={RAZORPAY_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', padding: '14px 32px' }}>
              <span>Book 1:1 Consultation</span>
            </a>
            <Link to="/assessment" className="btn btn-secondary btn-lg" style={{ borderRadius: '14px', padding: '14px 28px' }}>
              <span>Take Free Assessment</span>
            </Link>
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
                Beyond the Numbers: Understanding Your Health Better.
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.98rem', marginBottom: '14px' }}>
                Your reports provide important insights into your health. Functional bloodwork adds another perspective by looking at patterns, identifying potential imbalances, and understanding how different markers work together.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.98rem', margin: 0 }}>
                Because health is not just about being within range…it's about understanding the bigger picture and supporting long-term wellbeing.              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  border: '1px solid rgba(13, 148, 136, 0.12)',
                  maxWidth: '460px',
                  width: '100%',
                }}
              >
                <img
                  src="/assets/images/clinic.jpeg"
                  alt="Traditional vs Functional Bloodwork Reference Ranges"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '520px',
                    display: 'block',
                    objectFit: 'contain',
                    margin: '0 auto',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Client Before & After Transformations & Real Voice Notes */}
      <ClientTransformationShowcase />

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
          <h2 style={{ color: 'white', fontSize: 'clamp(1.45rem, 5vw, 2.6rem)', marginBottom: '12px', lineHeight: 1.25 }}>Ready to Uncover Your Health Blueprint?</h2>
          <p style={{ color: '#FED7AA', maxWidth: '640px', margin: '0 auto 20px', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', lineHeight: 1.5 }}>
            Book your 60-minute 1:1 Health Clarity Consultation with Reshmi Verma (₹1,999) to connect your symptoms, laboratory diagnostics, and recovery roadmap.
          </p>
          <div className="cta-dual-btn-row">
            <a
              href={RAZORPAY_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent cta-btn-side"
              style={{ background: 'white', color: 'var(--emerald-deep)', borderRadius: '12px', padding: '12px 24px', fontWeight: 700 }}
            >
              <span>Book Session</span>
            </a>
            <Link
              to="/assessment"
              className="btn btn-secondary cta-btn-side"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '12px', padding: '12px 20px' }}
            >
              <span>Free Assessment</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
