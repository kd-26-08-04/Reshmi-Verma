import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-text">
            <span className="name">HealthwithReshmi™</span>
            <span className="tagline">Reshmi Verma &bull; Functional Nutritionist</span>
          </div>
        </Link>

        {/* Streamlined, high-converting navigation */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/assessment"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Health Assessment
            </NavLink>
          </li>
          <li>
            <a
              href="/#reels-section"
              className="nav-link"
              onClick={closeMenu}
            >
              Reels
            </a>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Contact Us
            </NavLink>
          </li>

          {/* User Account State Mobile Menu (Only visible on mobile viewport) */}
          {isAuthenticated ? (
            <li className="nav-menu-mobile-cta">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px' }}
                  onClick={closeMenu}
                >
                  {isAdmin ? '🛡️ Admin Desk' : '📋 My Portal'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                >
                  Sign Out
                </button>
              </div>
            </li>
          ) : (
            <li className="nav-menu-mobile-cta">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <Link
                  to="/auth"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '11px', justifyContent: 'center' }}
                  onClick={closeMenu}
                >
                  <span>🔐 Client Sign In</span>
                </Link>
                <Link
                  to="/booking"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                  onClick={closeMenu}
                >
                  <span>📅 Book Session</span>
                </Link>
              </div>
            </li>
          )}
        </ul>

          {/* Action Header Items */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  title={`Signed in as ${user?.name || user?.email}`}
                >
                  {isAdmin ? 'Admin Desk' : 'My Portal'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="nav-actions-group">
                <Link
                  to="/auth"
                  className="btn-header-signin"
                  id="header-signin-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link to="/booking" className="btn btn-primary btn-sm" id="header-book-btn">
                  <span>Book Session</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            )}

            <button
              className="mobile-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
      </div>
    </header>
  );
}
