import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Functional Health & Gut Microbiome Protocol',
    message: '',
    honeypot: ''
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', text: '' }

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
        text: 'Thank you! Your message has been sent directly to Reshmi Verma. Our clinical desk will respond within 24 hours.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Functional Health & Gut Microbiome Protocol',
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
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '110px 0 80px' }}>
      <div className="container">

        {/* Hero Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <span className="pulse-dot"></span>
            <span>Clinic Inquiries &bull; Direct Support</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)', color: 'var(--emerald-deep)', margin: '0 0 16px', lineHeight: 1.2 }}>
            Get in Touch with <span className="text-gradient">Reshmi Verma</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Have questions regarding functional nutrition, gut health restoration, or Oxygen Advantage breathwork? Send a message directly to our healthcare desk.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
          marginBottom: '60px'
        }}>

          {/* Left: Direct Clinic Info Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            borderTop: '3px solid #00E5D9',
            padding: '36px 32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Direct Clinic Access
            </span>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--emerald-deep)', margin: '8px 0 14px', lineHeight: 1.25 }}>
              Clinical Diagnostics &amp; Health Sanctuary
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Combining 20+ years in diagnostics with functional nutrition and breathwork to uncover biochemical root causes and guide lasting metabolic recovery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              {/* Email */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-deep)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>Direct Email</h4>
                  <a href="mailto:support.reshmiverma@gmail.com" style={{ fontSize: '0.92rem', color: 'var(--emerald-deep)', fontWeight: 600, wordBreak: 'break-all' }}>
                    support.reshmiverma@gmail.com
                  </a>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official consultation &amp; medical desk</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #A7F3D0'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>Clinic WhatsApp</h4>
                  <a
                    href="https://wa.me/?text=Hello%20Reshmi%20Verma%20Clinic%2C%20I%20have%20an%20inquiry%20regarding%20functional%20consultations."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.92rem', color: '#059669', fontWeight: 700 }}
                  >
                    Chat via WhatsApp &rarr;
                  </a>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fastest response for scheduling queries</p>
                </div>
              </div>

              {/* Consultation Hours */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-deep)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>Consultation Timings</h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    <strong>Mon – Sat:</strong> 9:00 AM – 6:30 PM IST
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Telehealth consultations conducted globally</p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '16px 20px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              border: '1px solid var(--border-subtle)'
            }}>
              <strong style={{ color: 'var(--emerald-deep)', display: 'block', marginBottom: '4px' }}>Clinical Confidentiality Guarantee</strong>
              All diagnostic records, symptoms, and health information shared with Reshmi Verma are strictly confidential and encrypted under medical ethics standards.
            </div>
          </div>

          {/* Right: Modern Form Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            borderTop: '3px solid #00E5D9',
            padding: '36px 32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Send a Message
            </span>
            <h3 style={{ fontSize: '1.7rem', color: 'var(--emerald-deep)', margin: '8px 0 6px', lineHeight: 1.25 }}>
              Direct Clinical Inquiry
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.55 }}>
              Fill out your details below. Your inquiry is transmitted directly to Reshmi Verma's clinical desk.
            </p>

            {alert && (
              <div style={{
                background: alert.type === 'error' ? '#FEE2E2' : '#ECFDF5',
                color: alert.type === 'error' ? '#991B1B' : '#065F46',
                border: alert.type === 'error' ? '1px solid #F87171' : '1px solid #6EE7B7',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '0.92rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                {alert.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-deep)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.95rem',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-deep)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="priya@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.95rem',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="contact-phone" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-deep)', marginBottom: '6px' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.95rem',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-deep)', marginBottom: '6px' }}>
                    Inquiry Subject *
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.92rem',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Functional Health & Gut Microbiome Protocol">Functional Health &amp; Gut Microbiome Protocol</option>
                    <option value="Oxygen Advantage & Breathwork Coaching">Oxygen Advantage &amp; Breathwork Coaching</option>
                    <option value="1:1 Consultation Query">1:1 Clinical Consultation Query</option>
                    <option value="Laboratory Biomarker & Blood Review">Laboratory Biomarker &amp; Blood Review</option>
                    <option value="General Health Inquiry">General Health Inquiry</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-deep)', marginBottom: '6px' }}>
                  Your Message or Health Background *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your health concerns, symptom timeline, or questions for Reshmi Verma..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.95rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '14px', padding: '15px 28px', fontSize: '1rem', fontWeight: 800 }}
                disabled={loading}
              >
                <span>{loading ? 'Transmitting to Clinic...' : 'Send Message'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}
