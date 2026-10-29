import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RAZORPAY_PAYMENT_URL } from '../utils/api';

export default function MobileBottomBar() {
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (path) => {
    setShowPicker(false);
    navigate(path);
  };

  return (
    <>
      {/* Assessment Picker Overlay */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'mbbFadeIn 0.2s ease'
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setShowPicker(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          />

          {/* Bottom Sheet */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '420px',
              background: '#FAF9F6',
              borderRadius: '22px 22px 0 0',
              padding: '20px 18px calc(18px + env(safe-area-inset-bottom))',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
              animation: 'mbbSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)'
            }}
          >
            {/* Handle bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '99px', background: '#D1D5DB' }} />
            </div>

            {/* Title */}
            <h3 style={{
              textAlign: 'center',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#121214',
              margin: '0 0 4px',
              fontFamily: 'var(--font-serif)'
            }}>
              Choose Your Assessment
            </h3>
            <p style={{
              textAlign: 'center',
              fontSize: '0.78rem',
              color: '#6B7280',
              margin: '0 0 16px'
            }}>
              Both are free & take under 5 minutes
            </p>

            {/* Option 1: Health Assessment */}
            <div
              onClick={() => handleSelect('/assessment')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('/assessment'); }}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid rgba(255, 0, 127, 0.35)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF6FA 100%)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: '#121214', fontWeight: 800 }}>
                  🩺 Health Assessment
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.3 }}>
                  Gut • Hormones • Fatigue • Metabolism
                </span>
              </div>
              <span style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgb(243, 1, 132)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.74rem',
                flexShrink: 0
              }}>
                Start →
              </span>
            </div>

            {/* Option 2: Breathing Assessment */}
            <div
              onClick={() => handleSelect('/breathing-assessment')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('/breathing-assessment'); }}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid rgba(0, 229, 217, 0.4)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F2FDFD 100%)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: '#121214', fontWeight: 800 }}>
                  🫁 Breathing Assessment
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.3 }}>
                  BOLT Score • Vagal Tone • Oxygen Advantage
                </span>
              </div>
              <span style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, rgb(0 229 226) 0%, #03e9d9ff 100%)',
                color: '#0A3B37',
                fontWeight: 800,
                fontSize: '0.74rem',
                flexShrink: 0
              }}>
                Start →
              </span>
            </div>

            {/* Cancel */}
            <button
              onClick={() => setShowPicker(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: 'transparent',
                color: '#6B7280',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes mbbSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes mbbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Bottom Bar */}
      <div className="mobile-bottom-bar">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowPicker(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span>Free Assessment</span>
        </button>
        <a
          href={RAZORPAY_PAYMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Book Consultation</span>
        </a>
      </div>
    </>
  );
}
