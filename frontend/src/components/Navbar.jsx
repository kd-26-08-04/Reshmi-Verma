import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'about' | 'assessment' | null
  const dropdownTimeoutRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleMouseEnter = (menuName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const toggleDropdown = (menuName) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  const handleVideoClick = () => {
    closeMenu();
    if (location.pathname === '/') {
      const el = document.getElementById('videos');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const isAboutActive = location.pathname === '/about' || location.hash === '#videos';
  const isAssessmentActive =
    location.pathname === '/assessment' ||
    location.pathname === '/breathing-assessment' ||
    location.pathname === '/functional-breathing-assessment';

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <img
            src="/assets/images/rv-brand-logo.png"
            alt="Reshmi Verma Luxury Gold RV Monogram"
            className="brand-logo-img"
          />
          <div className="brand-text">
            <span className="name">HealthwithReshmi™</span>
            <span className="tagline">Reshmi Verma &bull; Functional Nutritionist</span>
          </div>
        </Link>

        {/* Streamlined, high-converting navigation with interactive dropdowns */}
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

          {/* 1. About Us Dropdown (About Reshmi, Video) */}
          <li
            className={`nav-item-dropdown ${openDropdown === 'about' ? 'is-open' : ''}`}
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-link dropdown-toggle-btn ${isAboutActive ? 'active' : ''}`}
              onClick={() => toggleDropdown('about')}
              aria-expanded={openDropdown === 'about'}
              aria-haspopup="true"
            >
              <span>About Us</span>
              <svg
                className="dropdown-chevron-icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div className="nav-dropdown-menu">
              <Link
                to="/about"
                className={`dropdown-item ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="dropdown-item-icon doctor-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">About Reshmi</span>
                  {/* <span className="dropdown-item-subtitle">Story, 20+ Yrs Diagnostics & Reversal Journey</span> */}
                </div>
              </Link>

              <Link
                to="/#videos"
                className="dropdown-item"
                onClick={handleVideoClick}
              >
                <div className="dropdown-item-icon video-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div className="dropdown-item-text">
                  <div className="dropdown-title-row">
                    <span className="dropdown-item-title">Video</span>
                    {/* <span className="dropdown-tag-badge live">Watch</span> */}
                  </div>
                  {/* <span className="dropdown-item-subtitle">Clinical Masterclasses, Reels & YouTube</span> */}
                </div>
              </Link>
            </div>
          </li>

          {/* 2. Assessment Dropdown (Health Assessment, Breathing Assessment) */}
          <li
            className={`nav-item-dropdown ${openDropdown === 'assessment' ? 'is-open' : ''}`}
            onMouseEnter={() => handleMouseEnter('assessment')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`nav-link dropdown-toggle-btn ${isAssessmentActive ? 'active' : ''}`}
              onClick={() => toggleDropdown('assessment')}
              aria-expanded={openDropdown === 'assessment'}
              aria-haspopup="true"
            >
              <span>Assessment</span>
              <svg
                className="dropdown-chevron-icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div className="nav-dropdown-menu">
              <Link
                to="/assessment"
                className={`dropdown-item ${location.pathname === '/assessment' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="dropdown-item-icon health-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="dropdown-item-text">
                  <div className="dropdown-title-row">
                    <span className="dropdown-item-title">Health Assessment</span>
                    <span className="dropdown-tag-badge saffron">Gut &amp; Metabolism</span>
                  </div>
                </div>
              </Link>

              <Link
                to="/breathing-assessment"
                className={`dropdown-item ${location.pathname === '/breathing-assessment' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="dropdown-item-icon breath-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="dropdown-item-text">
                  <div className="dropdown-title-row">
                    <span className="dropdown-item-title">Breathing Assessment</span>
                    <span className="dropdown-tag-badge gold">Oxygen Advantage®</span>
                  </div>
                </div>
              </Link>
            </div>
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
                  <span>📅 Book Consultation</span>
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
                <span>Book Consultation</span>
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
