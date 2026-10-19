import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

export default function WelcomeAssessmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalStep, setModalStep] = useState('intro'); // 'intro' | 'form'
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Only show on home page and if not already dismissed in this session
    const isHome = location.pathname === '/';
    const isDismissed = sessionStorage.getItem('dismissed_welcome_assessment');

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

  const handleProceedToForm = () => {
    setModalStep('form');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid WhatsApp or Mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        source: 'welcome_modal',
        step: 'Started Assessment from Welcome Popup',
        status: 'in_progress'
      };

      const res = await fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const leadId = data?.lead?.id || `lead_${Date.now()}`;
      const leadInfo = {
        id: leadId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      };

      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(leadInfo));
      sessionStorage.setItem('dismissed_welcome_assessment', 'true');
      setIsOpen(false);
      navigate('/assessment');
    } catch (err) {
      console.warn('Lead capture notice:', err);
      // Fallback local persistence so user is never blocked
      const leadInfo = {
        id: `lead_${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      };
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify(leadInfo));
      sessionStorage.setItem('dismissed_welcome_assessment', 'true');
      setIsOpen(false);
      navigate('/assessment');
    } finally {
      setIsSubmitting(false);
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

      <div className="welcome-assessment-modal" style={{ maxWidth: '500px' }}>
        {/* Close 'X' Button */}
        <button 
          type="button" 
          className="welcome-modal-close"
          onClick={handleSkip}
          aria-label="Close welcome prompt"
        >
          ✕
        </button>

        {modalStep === 'intro' ? (
          <>
            {/* Header Icon / Luxury Brand Emblem */}
            <div className="welcome-modal-icon-wrap" style={{ width: '68px', height: '68px', margin: '0 auto 16px', background: '#000000', border: '2px solid rgba(212, 175, 55, 0.65)', padding: '6px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)' }}>
              <img
                src="/assets/images/rv-brand-logo.png"
                alt="HealthwithReshmi Luxury Brand Monogram"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.45))'
                }}
              />
            </div>

            <div className="welcome-modal-badge">
              <span className="pulse-dot"></span>
              <span>Free 2-Minute Health Check</span>
            </div>

            <h3 id="welcome-modal-title" className="welcome-modal-title">
              Welcome to <span className="text-gradient">HealthwithReshmi™</span>
            </h3>

            <p className="welcome-modal-hindi-text" style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', fontWeight: 600 }}>
              Kya aap apni <strong>Health, Gut &amp; Energy</strong> check karna chahte hain?
            </p>

            <p className="welcome-modal-desc" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Take our quick 2-minute functional health assessment to uncover your root-cause biological score across gut motility, respiration vagal tone, and metabolic vitality.
            </p>

            {/* Interactive Action Buttons */}
            <div className="welcome-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={handleProceedToForm}
                className="btn btn-primary welcome-btn-yes"
                id="welcome-yes-btn"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  minHeight: '48px', 
                  maxHeight: '52px',
                  padding: '12px 24px', 
                  borderRadius: '14px', 
                  justifyContent: 'center',
                  fontSize: '0.98rem',
                  fontWeight: 700
                }}
              >
                <span>Yes, Check My Health (Free)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button 
                type="button" 
                onClick={handleSkip}
                className="btn btn-outline welcome-btn-skip"
                id="welcome-skip-btn"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  minHeight: '42px',
                  padding: '10px 20px', 
                  borderRadius: '12px', 
                  justifyContent: 'center', 
                  borderColor: 'var(--border-subtle)',
                  fontSize: '0.9rem'
                }}
              >
                <span>Skip for Now</span>
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Quick Data Entry before Quiz */
          <form onSubmit={handleFormSubmit} style={{ textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span className="badge-pill" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                <span>Step 1 of 2 &bull; Contact Info</span>
              </span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--emerald-deep)', margin: '4px 0 6px 0' }}>
                Enter Details to Start Assessment
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                We will prepare your customized Health Resilience scorecard using these details.
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem', marginBottom: '14px' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  autoFocus
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                  WhatsApp / Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                  Email Address <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{isSubmitting ? 'Starting Assessment...' : 'Start Assessment Now &rarr;'}</span>
              </button>

              <button 
                type="button" 
                onClick={() => setModalStep('intro')}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border-subtle)', padding: '8px' }}
              >
                <span>&larr; Back</span>
              </button>
            </div>
          </form>
        )}

        <div className="welcome-modal-footer-note" style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          🔒 100% Free &bull; Zero spam &bull; Confidential clinical care
        </div>
      </div>
    </div>
  );
}
