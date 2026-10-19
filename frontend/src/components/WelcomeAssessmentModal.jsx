import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

/**
 * HealthwithReshmi™ 3-Step Assessment Welcome Modal
 * 
 * Step 1: Hook Screen (Catchy clinical question, 4 pills & "Start the Health Quiz →")
 * Step 2: Lead Data Capture (Name, WhatsApp/Phone, Email)
 * Step 3: 2 Clinical Assessment Tracks (Functional Health vs Functional Breathing)
 */

// Paste YouTube link here when provided by user (e.g. 'https://youtube.com/watch?v=...')
export const YOUTUBE_BREATHING_LINK = '';

export default function WelcomeAssessmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = Hook Screen, 2 = Lead Form, 3 = Assessment Options
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show on homepage if not dismissed in current session
    const isHome = location.pathname === '/';
    const isDismissed = sessionStorage.getItem('dismissed_welcome_assessment');

    // Pre-populate if lead already saved locally
    const savedLead = localStorage.getItem('reshmi_user_lead');
    if (savedLead) {
      try {
        const parsed = JSON.parse(savedLead);
        if (parsed?.name || parsed?.phone) {
          setFormData(prev => ({
            name: parsed.name || prev.name,
            phone: parsed.phone || prev.phone,
            email: parsed.email || prev.email
          }));
        }
      } catch (e) {
        // ignore
      }
    }

    if (isHome && !isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleSkip = () => {
    sessionStorage.setItem('dismissed_welcome_assessment', 'true');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email } = formData;

    if (!name.trim()) {
      setError('Kripya apna poora naam enter karein.');
      return;
    }
    if (!phone.trim() || phone.trim().replace(/\D/g, '').length < 10) {
      setError('Kripya 10-digit WhatsApp/Phone number enter karein.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Kripya valid email address enter karein.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Save lead in localStorage for pre-filling assessments & booking
    localStorage.setItem('reshmi_user_lead', JSON.stringify({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    }));

    // Send lead to backend API
    try {
      const res = await fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          source: 'welcome_modal_step2',
          step: 'Details Submitted • Selecting Assessment'
        })
      });
      const data = await res.json();
      if (data?.lead?.id) {
        setLeadId(data.lead.id);
      }
    } catch (err) {
      console.warn('Backend lead capture notice:', err);
    } finally {
      setSubmitting(false);
      setStep(3); // Proceed to 2 Assessment Choices
    }
  };

  const handleSelectFlow = async (flowType) => {
    sessionStorage.setItem('dismissed_welcome_assessment', 'true');
    setIsOpen(false);

    // Update backend with chosen flow
    try {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source: 'welcome_modal_step3',
          step: flowType === 'health' ? 'Chosen: Health Assessment' : 'Chosen: Breathing Assessment'
        })
      }).catch(() => {});
    } catch (e) {
      // ignore
    }

    if (flowType === 'health') {
      // Redirect to Functional Health Assessment
      navigate('/assessment');
    } else if (flowType === 'breathing') {
      // Redirect to YouTube link if user provided, otherwise to Breathing Assessment page
      if (YOUTUBE_BREATHING_LINK && YOUTUBE_BREATHING_LINK.trim().startsWith('http')) {
        window.open(YOUTUBE_BREATHING_LINK.trim(), '_blank');
      } else {
        navigate('/breathing-assessment');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="welcome-assessment-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="welcome-assessment-backdrop" onClick={handleSkip}></div>

      <div 
        className="welcome-assessment-modal" 
        style={{ 
          maxWidth: '560px', 
          padding: '36px 30px', 
          borderRadius: '24px', 
          background: '#FAF9F6',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
          border: '1px solid rgba(18, 18, 20, 0.08)'
        }}
      >
        {/* Dark Circular Close Button */}
        <button 
          type="button" 
          onClick={handleSkip}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#121214',
            color: '#FAF9F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            zIndex: 10,
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          ✕
        </button>

        {/* STEP 1: HOOK SCREEN */}
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '6px 4px 4px' }}>
            {/* Top Subtitle Pill */}
            <span style={{ 
              display: 'inline-block',
              color: '#FF007F', 
              fontSize: '0.78rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              Free Gut &amp; Breath Health Assessment
            </span>

            {/* Main Question Headline */}
            <h2 id="welcome-modal-title" style={{ 
              fontSize: 'clamp(2.1rem, 5vw, 2.75rem)', 
              color: '#121214', 
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.15,
              margin: '0 0 16px',
              fontWeight: 800
            }}>
              Is your body <br />
              <span style={{ color: '#FF007F', fontStyle: 'italic', fontWeight: 800 }}>talking to you?</span>
            </h2>

            {/* Description Paragraph */}
            <p style={{ 
              fontSize: '0.98rem', 
              color: '#2C2C30', 
              lineHeight: 1.6, 
              maxWidth: '470px', 
              margin: '0 auto 22px' 
            }}>
              Answer science-backed questions and discover your functional root-cause score out of 100 — with personalised insights from Reshmi Verma, Functional Nutritionist &amp; #13 Oxygen Advantage® Coach.
            </p>

            {/* 4 Feature Pills in Natural Sage Gray-Green */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '10px', 
              marginBottom: '28px' 
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #C6DFC9',
                background: '#EDF6EE',
                color: '#121214',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8EBE93' }}></span>
                Takes 3 minutes
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #C6DFC9',
                background: '#EDF6EE',
                color: '#121214',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8EBE93' }}></span>
                Clinically informed
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #C6DFC9',
                background: '#EDF6EE',
                color: '#121214',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8EBE93' }}></span>
                Personalised Results
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #C6DFC9',
                background: '#EDF6EE',
                color: '#121214',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8EBE93' }}></span>
                Root-cause focused
              </span>
            </div>

            {/* Vibrant Action Button in Saffron (#EB5E28) */}
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: '14px 28px',
                background: '#FF007F',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(255, 0, 127, 0.35)',
                margin: '0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 0, 127, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 0, 127, 0.35)';
              }}
            >
              <span>Start the Health Quiz</span>
              <span>&rarr;</span>
            </button>
          </div>
        )}

        {/* STEP 2: LEAD DATA ENTRY */}
        {step === 2 && (
          <div style={{ padding: '6px 4px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 14px', 
                borderRadius: '999px', 
                background: '#FDE2E8', 
                color: '#0A0E0C', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                letterSpacing: '0.04em' 
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E06D85' }}></span>
                <span>Step 2 of 3 • Enter Your Details</span>
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.55rem)', color: 'var(--emerald-deep)', textAlign: 'center', margin: '0 0 6px', fontFamily: 'var(--font-serif)', lineHeight: 1.25 }}>
              Where Should We Send Your Score?
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 auto 18px', maxWidth: '420px', lineHeight: 1.5 }}>
              Apna personalized root-cause breakdown paane ke liye apni details enter karein:
            </p>

            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FAFAF9'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FAFAF9'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. priya@gmail.com"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FAFAF9'
                  }}
                />
              </div>

              {error && (
                <div style={{ color: '#FF5A1F', fontSize: '0.82rem', fontWeight: 600, background: '#FFF2EB', border: '1px solid #FFB394', padding: '8px 12px', borderRadius: '8px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginTop: '4px',
                  justifyContent: 'center',
                  background: '#121214',
                  borderColor: '#121214',
                  color: '#FFFFFF'
                }}
              >
                <span>{submitting ? 'Verifying...' : 'Continue to Assessment Track →'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: 2 ASSESSMENT TRACK CHOICES */}
        {step === 3 && (
          <div style={{ padding: '6px 4px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 14px', 
                borderRadius: '999px', 
                background: '#EDF6EE', 
                color: '#3C6642', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                letterSpacing: '0.04em',
                border: '1px solid #C6DFC9'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8EBE93' }}></span>
                <span>Step 3 of 3 • Select Your Assessment Track</span>
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.55rem)', color: 'var(--emerald-deep)', textAlign: 'center', margin: '0 0 6px', fontFamily: 'var(--font-serif)', lineHeight: 1.25 }}>
              Choose Your Assessment Track
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 auto 18px', maxWidth: '420px', lineHeight: 1.5 }}>
              Welcome, <strong>{formData.name || 'there'}</strong>! Apni body ka root cause janne ke liye niche diye gaye dono options me se ek select karein:
            </p>

            {/* 2 Assessment Choices (Royal, Shiny, High-End Luxury Cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
              {/* Choice 1: Functional Health Assessment (#EB5E28 Track) */}
              <div
                onClick={() => handleSelectFlow('health')}
                className="welcome-choice-card"
                style={{
                  textAlign: 'left',
                  padding: '16px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 0, 127, 0.35)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF9 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 8px 24px rgba(255, 0, 127, 0.12)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#EB5E28';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 0, 127, 0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 0, 127, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 0, 127, 0.12)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFF0F6 0%, #FFE0ED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.45rem',
                  flexShrink: 0,
                  border: '1.5px solid #FF80BF',
                  boxShadow: '0 4px 12px rgba(255, 0, 127, 0.18)'
                }}>
                  </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1rem', color: '#121214', fontWeight: 800 }}>
                      Functional Health Assessment
                    </strong>
                    <span style={{ fontSize: '0.68rem', padding: '3px 9px', borderRadius: '999px', background: '#FF007F', color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: '0 2px 6px rgba(255, 0, 127, 0.28)' }}>
                      Gut &amp; Metabolism
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#404045', margin: 0, lineHeight: 1.4 }}>
                    Bloating, gut mucosa, food sensitivities, hormones, and energy crashes.
                  </p>
                </div>
                <div style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF007F 0%, #D9006C 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  boxShadow: '0 4px 14px rgba(255, 0, 127, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}>
                  <span>Start Quiz</span>
                  <span>&rarr;</span>
                </div>
              </div>

              {/* Choice 2: Functional Breathing Assessment (#00E5D9 Track) */}
              <div
                onClick={() => handleSelectFlow('breathing')}
                className="welcome-choice-card"
                style={{
                  textAlign: 'left',
                  padding: '16px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(0, 229, 217, 0.4)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F5FDFD 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 8px 24px rgba(0, 229, 217, 0.12)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00E5D9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 229, 217, 0.24)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 217, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 217, 0.12)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E6FCFB 0%, #D1F9F6 100%)',
                  color: '#00E5D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.45rem',
                  flexShrink: 0,
                  border: '1.5px solid #7AF5EE',
                  boxShadow: '0 4px 12px rgba(0, 229, 217, 0.18)'
                }}>
                  </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1rem', color: '#121214', fontWeight: 800 }}>
                      Functional Breathing Assessment
                    </strong>
                    <span style={{ fontSize: '0.68rem', padding: '3px 9px', borderRadius: '999px', background: '#00E5D9', color: '#121214', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', boxShadow: '0 2px 6px rgba(0, 229, 217, 0.28)' }}>
                      #13 Oxygen Advantage®
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#404045', margin: 0, lineHeight: 1.4 }}>
                    BOLT score, CO₂ tolerance, shallow breathing, sleep apnea &amp; nervous regulation.
                  </p>
                </div>
                <div style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00E5D9 0%, #20A699 100%)',
                  color: '#121214',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  boxShadow: '0 4px 14px rgba(0, 229, 217, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}>
                  <span>Start Quiz</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Edit My Name / Phone Number
              </button>
            </div>
          </div>
        )}

        {/* Skip Button at bottom */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button 
            type="button" 
            onClick={handleSkip}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#9CA3AF', 
              fontSize: '0.84rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Skip for now &times;
          </button>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          🔒 Reshmi Verma Functional Health &bull; 100% Free &bull; Zero spam guarantee
        </div>
      </div>
    </div>
  );
}
