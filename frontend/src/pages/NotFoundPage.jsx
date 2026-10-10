import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 0 60px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          
          <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--emerald-primary)', lineHeight: 1, marginBottom: '12px', letterSpacing: '-0.04em' }}>
            404
          </div>

          <span className="badge-pill" style={{ marginBottom: '20px' }}>
            <span className="pulse-dot" style={{ background: 'var(--status-warning)' }}></span>
            <span>Page Not Found</span>
          </span>

          <h1 style={{ fontSize: '2.6rem', color: 'var(--emerald-deep)', marginBottom: '16px' }}>
            This Clinical Route is Unavailable
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            The link you followed may be outdated, renamed, or moved. Let's redirect you back to personalized functional health and respiratory resilience.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Return to Homepage</span>
            </Link>
            <Link to="/booking" className="btn btn-secondary btn-lg">
              <span>Book Consultation</span>
            </Link>
            <Link to="/assessment" className="btn btn-outline btn-lg">
              <span>Take Assessment</span>
            </Link>
          </div>

          {/* Quick Exploration Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', textAlign: 'left' }}>
            <Link to="/breathe" style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', textDecoration: 'none', transition: 'transform var(--transition-fast)' }} className="tier-card">
              <h4 style={{ fontSize: '0.95rem', color: 'var(--emerald-deep)', marginBottom: '4px' }}>🫁 Breathe &amp; BOLT</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Test CO₂ tolerance</p>
            </Link>
            <Link to="/nutrition" style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', textDecoration: 'none', transition: 'transform var(--transition-fast)' }} className="tier-card">
              <h4 style={{ fontSize: '0.95rem', color: 'var(--emerald-deep)', marginBottom: '4px' }}>🥗 Gut &amp; Nutrition</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Mucosal repair protocol</p>
            </Link>
            <Link to="/contact" style={{ background: 'white', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', textDecoration: 'none', transition: 'transform var(--transition-fast)' }} className="tier-card">
              <h4 style={{ fontSize: '0.95rem', color: 'var(--emerald-deep)', marginBottom: '4px' }}>✉️ Contact Clinic</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Direct practitioner desk</p>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
