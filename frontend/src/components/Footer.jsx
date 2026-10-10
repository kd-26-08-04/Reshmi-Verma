import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-logo" style={{ marginBottom: '16px' }}>
                <div className="brand-text">
                  <span className="name" style={{ color: 'var(--emerald-deep)' }}>HealthwithReshmi™</span>
                  <span className="tagline">Reshmi Verma &bull; Functional Nutritionist</span>
                </div>
              </div>
              <p>
                Science-led, human-centred functional nutrition, respiratory resilience, and cellular longevity protocols with Reshmi Verma.
              </p>
              <div className="footer-social-wrapper">
                <span className="footer-social-label">Follow & Connect</span>
                <div className="footer-social-buttons">
                  <a
                    href="https://www.instagram.com/healthwithreshmi/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn instagram"
                    aria-label="Instagram"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/reshmi-verma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn linkedin"
                    aria-label="LinkedIn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://youtube.com/@healthwithreshmi?si=J_-3JErcDWbGw6gj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn youtube"
                    aria-label="YouTube"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
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
                <li><Link to="/assessment">Health Assessment</Link></li>
                <li><a href="/#reels-section">Instagram Reels</a></li>
                <li><Link to="/booking">Book Consultation</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Consultations</h5>
              <ul className="footer-links">
                <li><Link to="/booking?tier=discovery">Discovery Call (₹999)</Link></li>
                <li><Link to="/booking?tier=comprehensive">Comprehensive Plan (₹2,999)</Link></li>
                <li><Link to="/booking?tier=followup">Follow-Up (₹1,499)</Link></li>
                <li><Link to="/breathe">BOLT Breath Test</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Direct Contact</h5>
              <ul className="footer-links">
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>
                  <strong>Rainbow Medinova Diagnostics</strong><br />
                  Functional Medicine Clinic
                </li>
                <li style={{ marginTop: '4px' }}>
                  <a href="mailto:support.reshmiverma@gmail.com">support.reshmiverma@gmail.com</a>
                </li>
                <li>
                  <Link to="/contact">Online Inquiry Form</Link>
                </li>
                <li>
                  <a href="https://reshmiverma.com" target="_blank" rel="noopener noreferrer">Official: reshmiverma.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; 2026 HealthwithReshmi™. All rights reserved. Dr. Reshmi Verma.
            </div>
            <div style={{ fontSize: '0.72rem', maxWidth: '480px', textAlign: 'right', color: 'var(--text-muted)', lineHeight: 1.35 }}>
              Medical Disclaimer: Educational and self-optimization purposes only; does not replace personalized medical diagnosis or treatment.
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Quick-Action Bar */}
      <div className="mobile-bottom-bar">
        <Link to="/assessment" className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span>Free Assessment</span>
        </Link>
        <Link to="/booking" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Book Session</span>
        </Link>
      </div>
    </>
  );
}
