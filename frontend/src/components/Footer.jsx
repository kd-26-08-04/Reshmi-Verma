import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-logo" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="brand-text">
                  <span className="name" style={{ color: 'var(--emerald-deep)' }}>HealthwithReshmi™</span>
                  <span className="tagline">Reshmi Verma &bull; Functional Nutritionist</span>
                </div>
              </div>
              <p>
                Science-led, human-centred functional nutrition, respiratory resilience, and cellular longevity protocols with Reshmi Verma.
              </p>
              <div className="footer-social-wrapper">
                <span className="footer-social-label">Follow &amp; Connect</span>
                <div className="footer-social-buttons">
                  <a
                    href="https://www.instagram.com/healthwithreshmi/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label="Instagram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="igFooterGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433"/>
                          <stop offset="25%" stopColor="#e6683c"/>
                          <stop offset="50%" stopColor="#dc2743"/>
                          <stop offset="75%" stopColor="#cc2366"/>
                          <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igFooterGrad)"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#FFFFFF" strokeWidth="1.8" fill="none"/>
                      <circle cx="17.5" cy="6.5" r="1.2" fill="#FFFFFF"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/reshmiverma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label="LinkedIn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="4" fill="#0A66C2"/>
                      <path d="M19 19h-3v-4.5c0-1.08-.02-2.5-1.5-2.5-1.5 0-1.8 1.2-1.8 2.4V19H9.7V9.5h2.9v1.3h.04c.4-.76 1.4-1.56 2.8-1.56 3 0 3.56 2 3.56 4.56V19zM6.4 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM7.9 19H4.9V9.5h3V19z" fill="#FFFFFF"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label="YouTube"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
                      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-col footer-col-nav">
              <h5>Navigation</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Reshmi Verma</Link></li>
                <li><Link to="/testimonials">Patient Testimonials</Link></li>
                <li><Link to="/assessment">Health Assessment</Link></li>
                <li><Link to="/breathing-assessment">Breathing Assessment</Link></li>
                <li><Link to="/booking">Book Consultation</Link></li>
                <li><Link to="/videos">Clinical Video Library</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Consultations</h5>
              <ul className="footer-links">
                <li><Link to="/booking">1:1 Health Clarity Session</Link></li>
                <li><Link to="/assessment">Functional Health Assessment</Link></li>
                <li><Link to="/breathing-assessment">Functional Breathing Assessment</Link></li>
                <li><Link to="/breathe">BOLT Breath Test</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Direct Contact</h5>
              <ul className="footer-links">
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>
                  <strong>Clinical Diagnostics &amp; Health Sanctuary</strong><br />
                  Rainbow Medinova, 4B, Dr. Rajendra Prasad Sarani, Terita Bazar, Kolkata, West Bengal 700001
                </li>
                <li>
                  <a href="mailto:support.reshmiverma@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    support.reshmiverma@gmail.com
                  </a>
                </li>
                <li style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Mon – Sat: 9:00 AM – 6:30 PM IST
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} HealthwithReshmi™. All rights reserved. Clinical nutrition, somatic breathwork &amp; biohacking protocols.</p>
            <div className="footer-legal-links">
              <span>Medical Disclaimer</span>
              <span>&bull;</span>
              <span>Privacy Policy</span>
              <span>&bull;</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
