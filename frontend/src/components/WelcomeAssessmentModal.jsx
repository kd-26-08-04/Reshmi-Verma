import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

/**
 * HealthwithReshmi™ Welcome Assessment Modal
 * - Desktop: Spacious, elegant, high-converting original design
 * - Mobile: Compact, space-saving design without extra empty space
 */

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
      setError('Kripya 10-digit Phone number enter karein.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Kripya valid email address enter karein.');
      return;
    }

    setSubmitting(true);
    setError('');

    const leadObj = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    };
    localStorage.setItem('reshmi_user_lead', JSON.stringify(leadObj));
    localStorage.setItem('reshmi_assessment_lead', JSON.stringify(leadObj));

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
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.lead?.id) {
          setLeadId(data.lead.id);
        }
      }
    } catch (err) {
      // Offline fallback
    } finally {
      setSubmitting(false);
      setStep(3);
    }
  };

  const handleSelectFlow = async (flowType) => {
    sessionStorage.setItem('dismissed_welcome_assessment', 'true');
    setIsOpen(false);

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
      }).catch(() => { });
    } catch (e) {
      // ignore
    }

    if (flowType === 'health') {
      navigate('/assessment');
    } else if (flowType === 'breathing') {
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

      {/* Scoped Responsive Styles: Preserves perfect desktop while making mobile compact */}
      <style>{`
        .welcome-modal-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: ${step === 2 ? '440px' : '540px'};
          background: #FAF9F6;
          border-radius: 26px;
          border: 1px solid rgba(18, 18, 20, 0.08);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
          padding: ${step === 2 ? '28px 24px 20px' : '36px 32px 28px'};
          text-align: center;
          box-sizing: border-box;
          transition: max-width 0.25s ease, padding 0.25s ease;
        }

        .welcome-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #121214;
          color: #FAF9F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          z-index: 10;
          transition: transform 0.2s ease;
        }

        .welcome-sub-pill {
          display: inline-block;
          color: #0D9488;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .welcome-main-title {
          font-size: clamp(2rem, 4.5vw, 2.6rem);
          color: #121214;
          font-family: var(--font-serif);
          line-height: 1.15;
          margin: 0 0 16px;
          font-weight: 800;
        }

        .welcome-desc-text {
          font-size: 0.98rem;
          color: #2C2C30;
          line-height: 1.6;
          max-width: 470px;
          margin: 0 auto 22px;
        }

        .welcome-pills-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 26px;
        }

        .welcome-feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 9999px;
          border: 1px solid #C6DFC9;
          background: #EDF6EE;
          color: #121214;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .welcome-cta-btn {
          width: 100%;
          max-width: 380px;
          padding: 14px 28px;
          background: #0D9488;
          color: #FFFFFF;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(13, 148, 136, 0.25);
          margin: 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .welcome-footer-tag {
          margin-top: 14px;
          text-align: center;
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        /* MOBILE OVERRIDES (≤ 640px): Compact, eliminate extra space, fit phone screen */
        @media (max-width: 640px) {
          .welcome-modal-wrapper {
            max-width: 370px !important;
            padding: 20px 18px 16px !important;
            border-radius: 20px !important;
          }

          .welcome-close-btn {
            top: 12px !important;
            right: 12px !important;
            width: 28px !important;
            height: 28px !important;
            font-size: 0.75rem !important;
          }

          .welcome-sub-pill {
            font-size: 0.68rem !important;
            letter-spacing: 0.08em !important;
            margin-bottom: 6px !important;
          }

          .welcome-main-title {
            font-size: 1.45rem !important;
            line-height: 1.2 !important;
            margin-bottom: 8px !important;
          }

          .welcome-desc-text {
            font-size: 0.85rem !important;
            line-height: 1.4 !important;
            margin-bottom: 12px !important;
          }

          .welcome-pills-row {
            gap: 6px !important;
            margin-bottom: 14px !important;
          }

          .welcome-feature-pill {
            padding: 4px 10px !important;
            font-size: 0.72rem !important;
          }

          .welcome-cta-btn {
            padding: 11px 20px !important;
            font-size: 0.94rem !important;
            border-radius: 10px !important;
          }

          .welcome-footer-tag {
            margin-top: 8px !important;
            font-size: 0.70rem !important;
          }
        }
      `}</style>

      <div className="welcome-modal-wrapper">
        {/* Dark Circular Close Button */}
        <button
          type="button"
          className="welcome-close-btn"
          onClick={handleSkip}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* STEP 1: HOOK SCREEN */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            {/* Top Subtitle Pill */}
            <span className="welcome-sub-pill">
              Free Gut &amp; Breath Health Assessment
            </span>

            <h2 id="welcome-modal-title" className="welcome-main-title">
              Your health has a story. <br />
              <span style={{ color: '#0D9488', fontStyle: 'italic', fontWeight: 800 }}>Let's Understand It.</span>
            </h2>

            {/* Description Paragraph */}
            <p className="welcome-desc-text">
              Your body communicates through the way you feel,digest,breathe, sleep and respond to everyday life.Understanding these patterns is a meaningful first step towards more personalised health. </p>

            {/* Action Button */}
            <button
              type="button"
              className="welcome-cta-btn"
              onClick={() => setStep(2)}
            >
              <span>Start the Health Quiz</span>
              <span>&rarr;</span>
            </button>

            <div className="welcome-footer-tag">
              <p style={{ margin: 0 }}>A starting point for self-awareness, not a diagnosis. Your results will help you identify areas you may wish to explore further.</p>
            </div>
          </div>
        )}

        {/* STEP 2: LEAD DATA ENTRY */}
        {step === 2 && (
          <div style={{ padding: '0 4px', textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 12px',
                borderRadius: '999px',
                background: '#FDE2E8',
                color: '#0A0E0C',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E06D85' }}></span>
                <span>Step 2 of 3 • Enter Your Details</span>
              </span>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald-deep)', margin: '4px 0 2px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                Score &amp; Report Send On Mail.
              </h3>
            </div>

            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '2px' }}>
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
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: '1.5px solid #D1D5DB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '2px' }}>
                  Phone Number *
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
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: '1.5px solid #D1D5DB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#374151', marginBottom: '2px' }}>
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
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: '1.5px solid #D1D5DB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && (
                <div style={{ color: '#FF5A1F', fontSize: '0.78rem', fontWeight: 600, background: '#FFF2EB', border: '1px solid #FFB394', padding: '5px 8px', borderRadius: '6px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.90rem',
                  marginTop: '4px',
                  background: '#121214',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>{submitting ? 'Verifying...' : 'Continue to Assessment Track →'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    padding: '2px 0'
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
          <div style={{ padding: '0 4px', textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 12px',
                borderRadius: '999px',
                background: '#EDF6EE',
                color: '#3C6642',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                border: '1px solid #C6DFC9'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8EBE93' }}></span>
                <span>Step 3 of 3 • Select Track</span>
              </span>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--emerald-deep)', margin: '4px 0 2px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                Where Would You Like To Begin?
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              {/* Choice 1: Functional Health Assessment */}
              <div
                onClick={() => handleSelectFlow('health')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectFlow('health'); }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid hsla(177, 92%, 63%, 0.09)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F5 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.94rem', color: '#121214', fontWeight: 800 }}>
                    Functional Health Assessment
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    Gut &bull; Hormones &bull; Fatigue &bull; Metabolism
                  </span>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#FF1493',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  flexShrink: 0
                }}>
                  Start &rarr;
                </span>
              </div>

              {/* Choice 2: Functional Breathing Assessment */}
              <div
                onClick={() => handleSelectFlow('breathing')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectFlow('breathing'); }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(0, 229, 217, 0.45)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F2FDFD 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.94rem', color: '#121214', fontWeight: 800 }}>
                    Functional Breathing Assessment
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    BOLT Score &bull; Vagal Tone &bull; Oxygen Advantage
                  </span>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #00E5D9 0%, #00B4A8 100%)',
                  color: '#0A3B37',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  flexShrink: 0
                }}>
                  Start &rarr;
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Edit My Name / Phone Number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
