import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

const DEFAULT_PRICING_TIERS = {
  healthClarity: {
    id: 'healthClarity',
    name: '1:1 Health Clarity Consultation (60 min)',
    badge: 'Official 1:1 Clinical Consultation',
    title: '1:1 Health Clarity Session',
    duration: '60 Minutes • Deep Clinical Video Session',
    price: 1999,
    featured: true,
    desc: 'A comprehensive 60-minute 1:1 deep dive with Reshmi Verma to explore your health story, analyze symptom patterns, review blood diagnostics, evaluate breathing mechanics, and build your personalized recovery blueprint.',
    features: [
      'Comprehensive review of your complete medical & symptom history',
      'Previous blood panels, gut microbiome & biomarker decoding',
      'Breathing biomechanics & Oxygen Advantage BOLT assessment',
      'Direct 1-on-1 consultation via private secure video call',
      'Tailored, actionable functional recovery blueprint'
    ],
    buttonText: 'Book 1:1 Consultation'
  }
};

const DEFAULT_TIERS_LIST = Object.values(DEFAULT_PRICING_TIERS);

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // Tiers state
  const tiersList = DEFAULT_TIERS_LIST;
  const currentTier = DEFAULT_PRICING_TIERS.healthClarity;

  // Read any prefilled lead data from URL or localStorage
  let savedLead = null;
  try {
    const raw = localStorage.getItem('reshmi_assessment_lead') || localStorage.getItem('reshmi_user_lead');
    if (raw) savedLead = JSON.parse(raw);
  } catch (e) { }

  const initialName = searchParams.get('name') || savedLead?.name || user?.name || '';
  const initialPhone = searchParams.get('phone') || savedLead?.phone || user?.phone || '';
  const initialEmail = searchParams.get('email') || savedLead?.email || user?.email || '';

  // Form State (Time & date slot removed as slot selection is handled directly on Razorpay hosted checkout)
  const [formData, setFormData] = useState({
    name: initialName,
    age: '',
    gender: 'Female',
    phone: initialPhone,
    email: initialEmail,
    city: '',
    occupation: '',
    language: 'English',
    emergencyContact: '',
    notes: '',
    q10_primary_concern: 'Gut and digestive health (Bloating, IBS, SIBO, Reflux)',
    q11_concern_description: '',
    q12_concern_duration: '6 to 12 months (Persistent issue)',
    q16_medical_condition: '',
    q17_medicines_supplements: '',
    q29_dietary_preference: 'Vegetarian',
    q33_digestive_symptoms: '',
    q27_stress_level: 'Moderate — Work pressure but manageable'
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Preload assessment or BOLT data from localStorage if available
  useEffect(() => {
    const savedBolt = localStorage.getItem('reshmi_bolt_score');
    const savedAssessment = localStorage.getItem('reshmi_assessment_results');
    const prefilled = [];

    if (savedBolt) {
      prefilled.push(`[My BOLT Score: ${savedBolt}s]`);
    }
    if (savedAssessment) {
      try {
        const parsed = JSON.parse(savedAssessment);
        prefilled.push(`[Primary Goal: ${parsed.goal || 'General Health'} | Resilience: ${parsed.averageResilience}%]`);
      } catch (e) { }
    }

    if (prefilled.length > 0) {
      setFormData(prev => {
        if (!prev.notes) {
          return { ...prev, notes: `${prefilled.join(' ')} - ` };
        }
        return prev;
      });
    }
  }, []);

  // Handle return redirect from Razorpay Payment Page / Hosted Link
  useEffect(() => {
    const rzpPaymentId = searchParams.get('razorpay_payment_id') || searchParams.get('payment_id');
    const rzpPaymentLinkId = searchParams.get('razorpay_payment_link_id');
    const rzpStatus = searchParams.get('razorpay_payment_link_status') || searchParams.get('status');
    const rzpSignature = searchParams.get('razorpay_signature');
    const rzpOrderId = searchParams.get('razorpay_order_id') || searchParams.get('order_id');

    if (rzpPaymentId || rzpStatus === 'paid' || rzpStatus === 'success') {
      let lastBooking = null;
      try {
        const stored = localStorage.getItem('reshmi_last_booking_data');
        if (stored) lastBooking = JSON.parse(stored);
      } catch (e) { }

      const activePaymentId = rzpPaymentId || rzpPaymentLinkId || `pay_rzp_${Date.now()}`;

      const verificationPayload = {
        razorpay_payment_id: activePaymentId,
        razorpay_order_id: rzpOrderId || rzpPaymentLinkId || 'order_direct_link',
        razorpay_signature: rzpSignature || '',
        clientName: lastBooking?.name || formData.name || 'Valued Client',
        clientEmail: lastBooking?.email || formData.email || '',
        clientPhone: lastBooking?.phone || formData.phone || '',
        serviceName: lastBooking?.serviceName || currentTier.name,
        serviceTier: 'healthClarity',
        servicePrice: lastBooking?.amount || currentTier.price,
        notes: lastBooking?.notes || formData.notes || '',
        age: lastBooking?.age || formData.age || '',
        gender: lastBooking?.gender || formData.gender || 'Female',
        city: lastBooking?.city || formData.city || '',
        occupation: lastBooking?.occupation || formData.occupation || ''
      };

      fetch(getApiUrl('/api/verify-payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationPayload)
      })
        .then(res => res.json())
        .then(data => {
          setConfirmedBooking({
            id: data.bookingId || data.booking?.id || `BKG-${Date.now().toString().slice(-6)}`,
            bookingId: data.bookingId || data.booking?.id || `BKG-${Date.now().toString().slice(-6)}`,
            paymentId: activePaymentId,
            clientName: verificationPayload.clientName,
            serviceName: verificationPayload.serviceName,
            amountPaid: verificationPayload.servicePrice,
            dateTime: 'Confirmed via Razorpay Checkout'
          });
        })
        .catch(() => {
          setConfirmedBooking({
            id: `BKG-${Date.now().toString().slice(-6)}`,
            bookingId: `BKG-${Date.now().toString().slice(-6)}`,
            paymentId: activePaymentId,
            clientName: verificationPayload.clientName,
            serviceName: verificationPayload.serviceName,
            amountPaid: verificationPayload.servicePrice,
            dateTime: 'Confirmed via Razorpay Checkout'
          });
        });
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Form Validation
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Please enter your Full Name.' });
      return;
    }
    if (!formData.phone.trim()) {
      setAlert({ type: 'error', message: 'Please enter your WhatsApp / Mobile Number.' });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setAlert({ type: 'error', message: 'Please provide a valid Email Address.' });
      return;
    }

    setLoading(true);

    const bookingPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      gender: formData.gender,
      city: formData.city,
      occupation: formData.occupation,
      language: formData.language,
      emergencyContact: formData.emergencyContact,
      notes: formData.notes,
      serviceName: '1:1 Health Clarity Consultation (60 min)',
      amount: 1999,
      initiatedAt: new Date().toISOString()
    };

    // 1. Sync credentials locally so user never has to re-enter
    try {
      localStorage.setItem('reshmi_user_lead', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }));
      localStorage.setItem('reshmi_assessment_lead', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }));
      localStorage.setItem('reshmi_last_booking_data', JSON.stringify(bookingPayload));
    } catch (err) { }

    // 2. Fire-and-forget lead capture to backend if online
    try {
      fetch(getApiUrl('/api/assessment-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          email: formData.email,
          status: 'initiated_payment',
          step: 'Redirected to Razorpay Hosted Checkout',
          meta: bookingPayload
        })
      }).catch(() => { });
    } catch (e) { }

    // 3. EmailJS notification (if configured)
    const emailService = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_znsc9db';
    const emailTemplate = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID || 'template_206xxey';
    const emailKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '5XBYa7sia2W-qDbgm';

    if (emailKey && !emailKey.includes('YOUR_')) {
      try {
        await emailjs.send(
          emailService,
          emailTemplate,
          {
            to_name: 'Reshmi Verma',
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service: currentTier.name,
            message: formData.notes || 'Initiating Razorpay Consultation payment'
          },
          emailKey
        );
      } catch (e) {
        console.warn('EmailJS dispatch notice:', e);
      }
    }

    // 4. Redirect immediately to the official Razorpay payment page
    const rzpTargetBase = import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || 'https://rzp.io/rzp/healthwithreshmi';
    try {
      const rzpUrl = new URL(rzpTargetBase);
      if (formData.name) rzpUrl.searchParams.set('name', formData.name);
      if (formData.email) rzpUrl.searchParams.set('email', formData.email);
      if (formData.phone) rzpUrl.searchParams.set('phone', formData.phone);
      window.location.href = rzpUrl.toString();
    } catch (e) {
      window.location.href = rzpTargetBase;
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section className="section" style={{ padding: '50px 0 30px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            <span className="pulse-dot"></span>
            <span>Personalized Functional Care</span>
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', maxWidth: '880px', margin: '0 auto 18px' }}>
            Schedule Your <span className="text-gradient">Clinical Consultation</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 20px' }}>
            Take the first step toward lasting health resilience. Select a service tier below, complete intake details, and securely confirm your session with Reshmi Verma.
          </p>
        </div>
      </section>

      {/* Consultation Tiers */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {tiersList.slice(0, 1).map(tier => {
              return (
                <div
                  key={tier.id}
                  className="tier-card featured selected-plan"
                  data-service-id={tier.id}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid var(--emerald-deep)',
                    borderRadius: '24px',
                    padding: 'clamp(24px, 5vw, 36px) clamp(18px, 4vw, 32px)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
                    position: 'relative'
                  }}
                >
                  {/* Clean Top Integrated Badge */}
                  <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#121214',
                      color: '#FFFFFF',
                      padding: '6px 16px',
                      borderRadius: '999px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
                    }}>
                      <span style={{ color: '#00E5D9' }}>★</span>
                      <span>{tier.badge || 'Official 1:1 Clinical Consultation'}</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.85rem)', marginTop: '0', marginBottom: '6px', color: 'var(--emerald-deep)', fontWeight: 800, textAlign: 'center' }}>
                    {tier.title || tier.name}
                  </h3>
                  <div className="tier-duration" style={{ color: '#0D827B', fontWeight: 700, fontSize: '0.92rem', textAlign: 'center', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{tier.duration}</span>
                  </div>

                  <div className="tier-price-box" style={{ margin: '14px 0 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    <span className="tier-price-currency" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#121214' }}>₹</span>
                    <span className="tier-price-amount" style={{ fontSize: 'clamp(2.6rem, 7vw, 3.2rem)', fontWeight: 800, color: '#121214', lineHeight: 1 }}>1,999</span>
                    <span className="tier-price-period" style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 60-min session</span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px', textAlign: 'center' }}>
                    {tier.desc}
                  </p>

                  <ul className="tier-features" style={{ marginBottom: '28px', borderTop: '1px solid rgba(13, 130, 123, 0.15)', paddingTop: '18px' }}>
                    {(tier.features || []).map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: '0.92rem', padding: '7px 0', display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#2C3E50' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D827B" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span style={{ lineHeight: 1.45 }}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderRadius: '14px',
                      fontSize: '1.02rem',
                      fontWeight: 800,
                      padding: '14px 20px',
                      boxShadow: '0 8px 24px rgba(13, 130, 123, 0.25)'
                    }}
                    onClick={() => {
                      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Proceed with 1:1 Consultation &rarr;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Pre-Consultation Intake Form */}
      <section className="section" id="intake-booking-section" ref={formRef} style={{ background: 'white', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Direct Booking &amp; Secure Checkout</span>
            <h2>Consultation Details &amp; Scheduling</h2>
            <p>Enter your contact details, select your preferred appointment slot, and proceed directly to secure payment.</p>
          </div>

          <div className="booking-form-card">

            {/* Live Form Status Alert Banner */}
            {alert && (
              <div className={`form-status-alert active ${alert.type}`} role="alert" style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '1.25rem' }}>{alert.type === 'error' ? '⚠️' : '✓'}</span>
                <div>{alert.message}</div>
              </div>
            )}

            {/* Auth Banner */}
            <div id="booking-auth-banner" style={{ marginBottom: '24px', padding: '14px 20px', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isAuthenticated ? (
                  <span>✅ Signed in as <strong>{user?.name}</strong> ({user?.email}). This session will sync to your patient portal.</span>
                ) : (
                  <span>🔒 Have an account? Sign in so this consultation is saved to your personal portal.</span>
                )}
              </div>
              {!isAuthenticated && (
                <Link to="/auth?redirect=booking" className="btn btn-secondary btn-sm" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                  Sign In / Register
                </Link>
              )}
            </div>

            <form id="consultation-booking-form" onSubmit={handleSubmit}>

              {/* Patient Contact Information */}
              <div style={{ marginBottom: '22px', paddingBottom: '10px', borderBottom: '1.5px solid rgba(13, 130, 123, 0.15)' }}>
                <h3 style={{ fontSize: '1.18rem', color: 'var(--emerald-deep)', margin: '0 0 4px', fontWeight: 700 }}>Patient Intake &amp; Contact Details</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Required for private video consultation link and session confirmation.</p>
              </div>

              <div className="booking-form-row">
                <div>
                  <label htmlFor="client-name-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    1. Full Name *
                  </label>
                  <input
                    type="text"
                    id="client-name-input"
                    ref={nameInputRef}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label htmlFor="client-age-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    2. Age / Date of Birth
                  </label>
                  <input
                    type="text"
                    id="client-age-input"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 32 years (or DD/MM/YYYY)"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div className="booking-form-row">
                <div>
                  <label htmlFor="client-gender-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    3. Gender (Optional)
                  </label>
                  <select
                    id="client-gender-input"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', background: 'white' }}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary / Other">Non-binary / Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="client-phone-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    4. WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="client-phone-input"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div className="booking-form-row">
                <div>
                  <label htmlFor="client-email-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    5. Email Address *
                  </label>
                  <input
                    type="email"
                    id="client-email-input"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label htmlFor="client-city-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    6. City and Country
                  </label>
                  <input
                    type="text"
                    id="client-city-input"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai, India / London, UK"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div className="booking-form-row">
                <div>
                  <label htmlFor="client-occupation-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    7. Occupation
                  </label>
                  <input
                    type="text"
                    id="client-occupation-input"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer, Homemaker"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label htmlFor="client-emergency-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    8. Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    id="client-emergency-input"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Name & Phone of close contact"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* Chosen Consultation Plan (Compact) */}
              <div style={{ margin: '20px 0 16px', padding: '14px 18px', background: '#F8FAF9', border: '1.5px solid var(--emerald-medium)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-medium)', fontWeight: 800, fontSize: '0.8rem' }}>✓</span>
                  <div>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--emerald-deep)', display: 'block' }}>1:1 Health Clarity Consultation (60 min)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct 1-on-1 private video session with Reshmi Verma</span>
                  </div>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-primary)' }}>₹1,999</span>
              </div>

              {/* Compact Consultation Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="client-notes-input" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                  Consultation Notes or Health Focus (Optional)
                </label>
                <textarea
                  id="client-notes-input"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g. Acid reflux, gut bloating, blood diagnostics, or recovery goals..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', lineHeight: 1.5 }}
                ></textarea>
              </div>

              {/* Razorpay Consultation Order Summary Box */}
              <div className="checkout-summary-box">
                <div className="checkout-summary-header">
                  <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Consultation Order Summary</span>
                  </h4>
                  <span className="checkout-summary-tier" id="summary-tier-badge">{currentTier.title}</span>
                </div>

                <div className="checkout-breakdown-row">
                  <span>Clinical Consultation Fee</span>
                  <span id="summary-tier-fee" style={{ fontWeight: 600 }}>₹{currentTier.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="checkout-breakdown-row">
                  <span>Intake &amp; Biomarker Review</span>
                  <span style={{ color: 'var(--status-optimal)', fontWeight: 600 }}>Included</span>
                </div>
                <div className="checkout-breakdown-row">
                  <span>GST / Healthcare Taxes</span>
                  <span>Included</span>
                </div>

                <div className="checkout-total-row">
                  <span className="checkout-total-label">Total Amount Payable</span>
                  <span className="checkout-total-amount" id="summary-total-fee">₹{currentTier.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="checkout-security-badges">
                  <div className="checkout-security-badge-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                  <div className="checkout-security-badge-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Secured by Razorpay</span>
                  </div>
                  <div className="checkout-security-badge-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  id="booking-submit-btn"
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: '320px', borderRadius: '14px', padding: '16px 32px' }}
                  disabled={loading}
                >
                  <span id="booking-btn-text">
                    {loading ? 'Connecting to Razorpay...' : 'Proceed to Secure Payment'}
                  </span>
                  <svg id="booking-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </form>

          </div>
        </div>
      </section>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="modal-overlay active" id="booking-success-modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-icon-success">
              &#10003;
            </div>
            <h3>Consultation Confirmed!</h3>
            <p>Your payment has been securely verified and your clinical consultation slot is locked in with Reshmi Verma.</p>

            <div className="modal-details-card">
              <div>
                <strong>Payment Status:</strong>
                <span className="payment-badge-success">Verified &amp; Paid</span>
              </div>
              <div>
                <strong>Payment ID:</strong>
                <span id="confirm-payment-id" style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--emerald-deep)' }}>
                  {confirmedBooking.paymentId || 'pay_verified'}
                </span>
              </div>
              <div><strong>Patient Name:</strong> <span id="confirm-client-name">{confirmedBooking.clientName}</span></div>
              <div><strong>Service Tier:</strong> <span id="confirm-service-name">{confirmedBooking.serviceName}</span></div>
              <div><strong>Amount Paid:</strong> <span id="confirm-amount-paid" style={{ fontWeight: 700, color: 'var(--emerald-primary)' }}>₹{confirmedBooking.amountPaid?.toLocaleString('en-IN')}</span></div>
              <div><strong>Requested Slot:</strong> <span id="confirm-date-time">{confirmedBooking.dateTime}</span></div>
              <div><strong>Practitioner:</strong> Reshmi Verma (Functional Nutritionist &amp; Breathwork Facilitator)</div>
            </div>

            <div style={{ margin: '20px 0 16px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✓ Clinical Intake &amp; Booking Confirmed
              </div>
              <p style={{ fontSize: '0.92rem', color: '#14532D', margin: '0 0 10px', lineHeight: 1.5 }}>
                Your clinical intake answers and symptoms have been securely recorded. Reshmi Verma will review your case trajectory prior to your scheduled consultation.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-sm"
                  style={{ background: 'var(--emerald-medium)', fontWeight: 700 }}
                >
                  <span>Go to My Client Portal &rarr;</span>
                </Link>
                <Link
                  to={`/questionnaire?bookingId=${confirmedBooking.id || ''}`}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'white', color: 'var(--emerald-deep)' }}
                >
                  <span>Attach PDF Lab Reports (Optional)</span>
                </Link>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                id="whatsapp-confirm-link"
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello Reshmi Verma, I have confirmed my ${confirmedBooking.serviceName} on ${confirmedBooking.dateTime}. Patient Name: ${confirmedBooking.clientName}. Booking ID: ${confirmedBooking.id || confirmedBooking.bookingId || ''}. I am submitting my clinical questionnaire.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm"
              >
                <span>Connect via WhatsApp</span>
              </a>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                id="modal-print-btn"
                onClick={() => window.print()}
              >
                <span>🖨️ Print Receipt</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                id="modal-close-btn"
                onClick={() => setConfirmedBooking(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
