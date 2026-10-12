import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function WelcomeAssessmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleYes = () => {
    sessionStorage.setItem('dismissed_welcome_assessment', 'true');
    setIsOpen(false);
    navigate('/assessment');
  };

  const handleSkip = () => {
    sessionStorage.setItem('dismissed_welcome_assessment', 'true');
    setIsOpen(false);
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

      <div className="welcome-assessment-modal">
        {/* Close 'X' Button */}
        <button 
          type="button" 
          className="welcome-modal-close"
          onClick={handleSkip}
          aria-label="Close welcome prompt"
        >
          ✕
        </button>

        {/* Header Icon / Badge */}
        <div className="welcome-modal-icon-wrap">
          <div className="welcome-modal-icon-glow"></div>
          <span className="welcome-modal-icon">🌱</span>
        </div>

        <div className="welcome-modal-badge">
          <span className="pulse-dot"></span>
          <span>Personalized Functional Evaluation</span>
        </div>

        <h3 id="welcome-modal-title" className="welcome-modal-title">
          Welcome to <span className="text-gradient">HealthwithReshmi™</span>
        </h3>

        <p className="welcome-modal-hindi-text">
          Kya aap apni <strong>Health, Gut &amp; Metabolic Vitality</strong> check karna chahte hain?
        </p>

        <p className="welcome-modal-desc">
          Take our quick 2-minute root-cause functional health assessment to uncover your biological resilience score across gut permeability, respiration vagal tone, and circadian metabolism.
        </p>

        {/* Interactive Action Buttons */}
        <div className="welcome-modal-actions">
          <button 
            type="button" 
            onClick={handleYes}
            className="btn btn-primary btn-lg welcome-btn-yes"
            id="welcome-yes-btn"
          >
            <span>Yes, Check My Health</span>
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
          >
            <span>Skip for Now</span>
          </button>
        </div>

        <div className="welcome-modal-footer-note">
          🔒 100% Free &bull; Confidential &bull; Designed by Functional Nutritionist Reshmi Verma
        </div>
      </div>
    </div>
  );
}
