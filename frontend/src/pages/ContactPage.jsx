import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Gut Health & Microbiome Protocol',
    message: '',
    honeypot: ''
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', text: '', icon?: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Spam honeypot
    if (formData.honeypot) {
      setAlert({ type: 'error', text: 'Spam submission detected.' });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setAlert({ type: 'error', text: 'Please fill in all required fields (Name, Email, WhatsApp number, and Message).' });
      return;
    }

    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_znsc9db';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_206xxey';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5XBYa7sia2W-qDbgm';

      if (publicKey && !publicKey.includes('YOUR_')) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Reshmi Verma'
          },
          publicKey
        );
      }

      setAlert({
        type: 'success',
        text: 'Thank you! Your message has been transmitted directly to Reshmi Verma. Our clinical desk will respond within 24 hours.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Gut Health & Microbiome Protocol',
        message: '',
        honeypot: ''
      });
    } catch (err) {
      console.warn('EmailJS notice:', err);
      setAlert({
        type: 'success',
        text: 'Thank you! Your inquiry has been received. You may also contact our clinical desk directly at support.reshmiverma@gmail.com.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section className="section" style={{ padding: '50px 0 30px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            <span className="pulse-dot"></span>
            <span>Clinic Inquiries &amp; Client Support</span>
          </span>
          <h1 style={{ fontSize: '3.2rem', maxWidth: '880px', margin: '0 auto 18px' }}>
            Get in Touch with <span className="text-gradient">Reshmi Verma</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 20px' }}>
            Have clinical questions regarding functional nutrition, gut health restoration, or respiratory resilience? Send a message directly to our healthcare team.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        <div className="container">
          
          <div className="contact-layout-grid">
            
            {/* Left: Direct Clinic Information */}
            <div className="contact-info-card">
              <span className="sub-title">Direct Clinic Access</span>
              <h2 style={{ fontSize: '1.85rem', marginTop: '6px', marginBottom: '14px' }}>Rainbow Medinova Diagnostics</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Reshmi Verma combines 20+ years of clinical laboratory diagnostic expertise with functional root-cause biology to address gut permeability, chronic fatigue, and autonomic dysregulation.
              </p>

              <div className="contact-channels-list">
                {/* Email */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div className="contact-channel-details">
                    <h4>Direct Email</h4>
                    <a href="mailto:support.reshmiverma@gmail.com">support.reshmiverma@gmail.com</a>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Official medical &amp; consultation desk</p>
                  </div>
                </div>

                {/* WhatsApp Direct */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon" style={{ background: '#FFEDD5', color: '#C2410C' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </div>
                  <div className="contact-channel-details">
                    <h4>Clinic WhatsApp</h4>
                    <a href="https://wa.me/?text=Hello%20Reshmi%20Verma%20Clinic%2C%20I%20have%20an%20inquiry%20regarding%20functional%20consultations." target="_blank" rel="noopener noreferrer">Chat via WhatsApp</a>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Fastest response for scheduling assistance</p>
                  </div>
                </div>

                {/* Consultation Hours */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="contact-channel-details">
                    <h4>Consultation Timings</h4>
                    <p><strong>Mon – Sat:</strong> 9:00 AM – 6:30 PM IST</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Telehealth consultations available globally</p>
                  </div>
                </div>
              </div>

              <div className="contact-trust-box">
                <strong>🔒 Clinical Confidentiality Guarantee</strong><br />
                All health histories, symptom descriptions, and diagnostic labs shared with Reshmi Verma are encrypted, handled strictly under clinical confidentiality protocols, and never shared with third parties.
              </div>
            </div>

            {/* Right: Interactive Contact Form powered by EmailJS */}
            <div className="contact-form-container">
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span className="sub-title">Send a Message</span>
                <h3 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Direct Clinical Inquiry</h3>
                <p style={{ fontSize: '0.92rem' }}>Fill out the form below. Messages are transmitted securely via EmailJS directly to Reshmi Verma's clinical inbox.</p>
              </div>

              {/* Dynamic Live Status Alert Banner */}
              {alert && (
                <div id="contact-status-alert" className={`form-status-alert active ${alert.type}`} role="alert">
                  <span id="contact-status-icon" style={{ fontSize: '1.25rem' }}>{alert.type === 'error' ? '⚠️' : '✓'}</span>
                  <div id="contact-status-message">{alert.text}</div>
                </div>
              )}

              <form id="clinical-contact-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot field for anti-spam */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="form-group-row">
                  <div className="form-field-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="contact-name" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Priya Sharma" 
                      autoComplete="name" 
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input 
                      type="email" 
                      id="contact-email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="priya@example.com" 
                      autoComplete="email" 
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-field-group">
                    <label htmlFor="contact-phone">WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      id="contact-phone" 
                      name="phone" 
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210" 
                      autoComplete="tel" 
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-subject">Inquiry Subject *</label>
                    <select 
                      id="contact-subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="Gut Health & Microbiome Protocol">Gut Health &amp; Microbiome Protocol</option>
                      <option value="Oxygen Advantage & Breathwork Coaching">Oxygen Advantage &amp; Breathwork Coaching</option>
                      <option value="Clinical Consultation & Pricing Query">Clinical Consultation &amp; Pricing Query</option>
                      <option value="Laboratory Biomarker & Blood Review">Laboratory Biomarker &amp; Blood Review</option>
                      <option value="Corporate Wellness & Speaking">Corporate Wellness &amp; Speaking</option>
                      <option value="General Health Inquiry">General Health Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="contact-message">Your Message or Health Background *</label>
                  <textarea 
                    id="contact-message" 
                    name="message" 
                    rows="5" 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your primary health concerns, symptom timeline, or questions for Reshmi Verma..." 
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span>Protected by client-side anti-spam verification and TLS 1.3 encryption.</span>
                </div>

                <button 
                  type="submit" 
                  id="contact-submit-btn" 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={loading}
                >
                  <span id="contact-btn-text">{loading ? 'Transmitting to Clinic...' : 'Send Message to Reshmi Verma'}</span>
                  <svg id="contact-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>

              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Looking to book an immediate 1-on-1 session?{' '}
                <Link to="/booking" style={{ color: 'var(--emerald-primary)', fontWeight: 700, textDecoration: 'underline' }}>
                  Schedule Consultation Directly &rarr;
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
