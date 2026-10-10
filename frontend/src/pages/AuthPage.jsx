import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleAdminQuickFill = () => {
    setLoginForm({
      email: 'support.reshmiverma@gmail.com',
      password: 'Reshmi@2026'
    });
    setErrorMsg('');
  };

  const redirectParam = searchParams.get('redirect');
  const redirectTarget = redirectParam ? decodeURIComponent(redirectParam) : '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await login(loginForm.email, loginForm.password);
      setSuccessMsg('Authentication verified. Accessing portal...');
      setTimeout(() => {
        if (data.user?.role === 'admin' || data.user?.email?.toLowerCase().includes('admin') || data.user?.email === 'support.reshmiverma@gmail.com') {
          navigate('/admin');
        } else {
          navigate(redirectTarget);
        }
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (registerForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register(registerForm.name, registerForm.email, registerForm.password, registerForm.phone);
      setSuccessMsg('Account created successfully! Loading your dashboard...');
      setTimeout(() => {
        navigate(redirectTarget === '/' ? '/dashboard' : redirectTarget);
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="auth-viewport">
        {/* Ambient Animated Floating Orbs matching auth.html */}
        <div className="auth-ambient-sphere auth-orb-1" aria-hidden="true"></div>
        <div className="auth-ambient-sphere auth-orb-2" aria-hidden="true"></div>

        <div className="auth-luxury-card">
          <div style={{ textAlign: 'center' }}>
            <div className="auth-security-pill">
              <span className="pulse-dot"></span>
              <span>Confidential Clinical Portal</span>
            </div>
            <h1 id="auth-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--emerald-deep)', margin: '0 0 6px', lineHeight: 1.15 }}>
              {mode === 'login' ? 'Client Sign In' : 'Create Account'}
            </h1>
            <p id="auth-desc" style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {mode === 'login' 
                ? 'Access your personalized consultation records, intake diagnostics, and clinical health blueprint.'
                : 'Register for your secure patient portal, health intake history, and 1-on-1 consultation scheduling.'}
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="auth-segmented-nav" role="tablist">
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'login' ? 'active' : ''}`}
              id="tab-login"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'register' ? 'active' : ''}`}
              id="tab-register"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Live Feedback Alerts */}
          {errorMsg && (
            <div id="auth-error-box" className="auth-feedback-box error" role="alert" style={{ display: 'block', marginBottom: '18px' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div id="auth-success-box" className="auth-feedback-box success" role="alert" style={{ display: 'block', marginBottom: '18px' }}>
              {successMsg}
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'login' && (
            <form id="form-login" onSubmit={handleLoginSubmit} noValidate>
              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="login-email">Email Address</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type="email"
                    id="login-email"
                    className="auth-field-input"
                    placeholder="you@domain.com"
                    required
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="login-password">Password</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    className="auth-field-input"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" id="btn-login-submit" className="auth-btn-luxury" disabled={loading}>
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              {/* Quick Fill Admin Demo Chip */}
              <div className="auth-quick-fill-chip">
                <span>Clinic Admin: <strong>support.reshmiverma@gmail.com</strong></span>
                <button
                  type="button"
                  className="auth-quick-fill-btn"
                  onClick={handleAdminQuickFill}
                >
                  Quick Fill
                </button>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form id="form-register" onSubmit={handleRegisterSubmit} noValidate>
              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="reg-name">Full Name</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type="text"
                    id="reg-name"
                    className="auth-field-input"
                    placeholder="e.g. Priya Sharma"
                    required
                    autoComplete="name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="reg-email">Email Address</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type="email"
                    id="reg-email"
                    className="auth-field-input"
                    placeholder="you@domain.com"
                    required
                    autoComplete="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="reg-phone">WhatsApp / Phone Number</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type="tel"
                    id="reg-phone"
                    className="auth-field-input"
                    placeholder="+91 98765 43210"
                    required
                    autoComplete="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field-wrapper">
                <div className="auth-field-header">
                  <label className="auth-field-title" htmlFor="reg-password">Create Password</label>
                </div>
                <div className="auth-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="reg-password"
                    className="auth-field-input"
                    placeholder="At least 6 characters"
                    required
                    autoComplete="new-password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" id="btn-register-submit" className="auth-btn-luxury" disabled={loading}>
                <span>{loading ? 'Creating Account...' : 'Create Account & Continue'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          )}

          {/* Trust Badges */}
          <div className="auth-trust-strip">
            <div className="auth-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>256-Bit Encrypted</span>
            </div>
            <div className="auth-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Telehealth Safe</span>
            </div>
            <div className="auth-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
              <span>20+ Yrs Diagnostics</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
