import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PRICING_TIERS = {
  discovery: {
    id: 'discovery',
    name: 'Initial Discovery Call (20 min)',
    badge: 'Discovery Call',
    title: 'Initial Discovery Call',
    duration: '20 Minutes • Exploratory Session',
    price: 999,
    desc: 'A quick chat to discuss your health story, current roadblocks, and determine if our SAMYA functional method aligns with your goals.',
    features: [
      'Review your primary symptoms',
      'Evaluate your BOLT & breath baseline',
      'Identify the right next clinical step'
    ],
    buttonText: 'Select Discovery Call (₹999)'
  },
  comprehensive: {
    id: 'comprehensive',
    name: 'Comprehensive Consultation (60 min)',
    badge: 'Comprehensive Consultation',
    title: 'Comprehensive Consultation',
    duration: '60 Minutes • Full Root-Cause Roadmap',
    price: 2999,
    featured: true,
    desc: 'Deep dive into your blood diagnostics, gut health timeline, circadian sleep mapping, and custom metabolic architecture.',
    features: [
      'Full blood chemistry & biomarker review',
      'Customized gut mucosal healing protocol',
      'Individualized Oxygen Advantage breath prescription',
      'Written clinical action plan & supplement guide'
    ],
    buttonText: 'Select Comprehensive Plan (₹2,999)'
  },
  followup: {
    id: 'followup',
    name: 'Follow-Up Check-in (30 min)',
    badge: 'Follow-Up Session',
    title: 'Follow-Up Check-in',
    duration: '30 Minutes • Active Clients Only',
    price: 1499,
    desc: 'For existing clients to review progress, track repeat BOLT scores, review updated labs, and adjust protocols.',
    features: [
      'Biomarker progression audit',
      'Titrate nutraceuticals & botanical doses',
      'Advanced breathwork progression'
    ],
    buttonText: 'Select Follow-Up (₹1,499)'
  }
};

const DEFAULT_TIERS_LIST = Object.values(DEFAULT_PRICING_TIERS);

const TIME_SLOTS = [
  '10:00 AM - Morning Slot',
  '11:30 AM - Morning Slot',
  '02:30 PM - Afternoon Slot',
  '04:00 PM - Afternoon Slot',
  '06:00 PM - Evening Slot'
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // Dynamic Tiers state loaded from Admin API
  const [tiersList, setTiersList] = useState(DEFAULT_TIERS_LIST);

  // Initialize selected tier from URL or fallback
  const urlTier = searchParams.get('tier') || searchParams.get('plan') || 'comprehensive';
  const initialTierKey = DEFAULT_PRICING_TIERS[urlTier] ? urlTier : 'comprehensive';
  const [selectedTier, setSelectedTier] = useState(initialTierKey);

  // Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: '',
    occupation: '',
    language: 'English',
    emergencyContact: '',
    bookingDate: tomorrow,
    timeSlot: TIME_SLOTS[0],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string, icon?: string }
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
      } catch (e) {}
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

  // Ensure Razorpay SDK is loaded & fetch dynamic tiers
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Fetch dynamic pricing tiers configured by Admin
    fetch('/api/pricing-tiers')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.tiers) && data.tiers.length > 0) {
          setTiersList(data.tiers);
        }
      })
      .catch(() => {});
  }, []);

  const currentTier = tiersList.find(t => t.id === selectedTier) || tiersList[0] || DEFAULT_PRICING_TIERS.comprehensive;

  const handleSelectTier = (tierKey) => {
    setSelectedTier(tierKey);
    // Smooth scroll down to intake form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Validation
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

    try {
      // 1. Create order on backend Express server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceTier: selectedTier,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate booking order.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51234567890abc';

      const finalizeBooking = async (paymentDetails = {}) => {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: paymentDetails.razorpay_order_id || orderData.orderId,
            razorpay_payment_id: paymentDetails.razorpay_payment_id || `pay_sim_${Date.now()}`,
            razorpay_signature: paymentDetails.razorpay_signature || 'simulation_sig',
            serviceTier: selectedTier,
            serviceName: currentTier.name,
            servicePrice: String(currentTier.price),
            amount: currentTier.price,
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            clientAge: formData.age,
            age: formData.age,
            clientGender: formData.gender,
            gender: formData.gender,
            clientCity: formData.city,
            city: formData.city,
            clientOccupation: formData.occupation,
            occupation: formData.occupation,
            clientLanguage: formData.language,
            language: formData.language,
            emergencyContact: formData.emergencyContact,
            clientEmergencyContact: formData.emergencyContact,
            bookingDate: formData.bookingDate,
            bookingTime: formData.timeSlot,
            timeSlot: formData.timeSlot,
            notes: formData.notes,
            healthConcerns: formData.notes
          })
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || 'Failed to confirm booking.');
        }

        // EmailJS notification
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
                date: formData.bookingDate,
                time: formData.timeSlot,
                booking_ref: verifyData.booking?.id || 'RES-' + Date.now().toString().slice(-6),
                message: formData.notes || 'None'
              },
              emailKey
            );
          } catch (e) {
            console.warn('EmailJS dispatch notice:', e);
          }
        }

        setConfirmedBooking({
          ...verifyData.booking,
          paymentId: paymentDetails.razorpay_payment_id || `pay_verified_${Date.now().toString().slice(-6)}`,
          clientName: formData.name,
          serviceName: currentTier.name,
          amountPaid: currentTier.price,
          dateTime: `${formData.bookingDate} (${formData.timeSlot})`
        });
        setLoading(false);
      };

      // Real Razorpay gateway checkout
      if (window.Razorpay && razorpayKey && !razorpayKey.includes('test_51234567890abc')) {
        const rzp = new window.Razorpay({
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'HealthwithReshmi™',
          description: currentTier.name,
          order_id: orderData.orderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#15803D'
          },
          handler: async function (response) {
            await finalizeBooking(response);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setAlert({ type: 'error', message: 'Payment cancelled. You can retry anytime.' });
            }
          }
        });
        rzp.open();
      } else {
        // Direct simulation / dev mode
        await finalizeBooking({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_direct_${Date.now()}`,
          razorpay_signature: 'direct_simulation_valid'
        });
      }
    } catch (err) {
      console.error('Booking flow error:', err);
      setLoading(false);
      setAlert({ type: 'error', message: err.message || 'An error occurred during booking. Please try again.' });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Reshmi Verma, I have booked the ${currentTier.name} on ${formData.bookingDate} at ${formData.timeSlot}. Name: ${formData.name}.`
  );

  return (
    <>
      {/* Hero Header */}
      <section className="section" style={{ padding: '50px 0 30px', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge-pill" style={{ marginBottom: '16px' }}>
            <span className="pulse-dot"></span>
            <span>Personalized Functional Care</span>
          </span>
          <h1 style={{ fontSize: '3.2rem', maxWidth: '880px', margin: '0 auto 18px' }}>
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
          <div className="booking-tiers-grid">
            {tiersList.filter(t => t.active !== false).map(tier => {
              const isSelected = selectedTier === tier.id;
              return (
                <div 
                  key={tier.id}
                  className={`tier-card ${tier.featured ? 'featured' : ''} ${isSelected ? 'selected-plan' : ''}`}
                  data-service-id={tier.id}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {tier.featured && <div className="tier-badge">{tier.badge || 'Most Popular'}</div>}
                  <h3>{tier.title || tier.name}</h3>
                  <div className="tier-duration">{tier.duration}</div>
                  
                  <div className="tier-price-box">
                    <span className="tier-price-currency">₹</span>
                    <span className="tier-price-amount">{Number(tier.price).toLocaleString('en-IN')}</span>
                    <span className="tier-price-period">/ session</span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {tier.desc}
                  </p>

                  <ul className="tier-features">
                    {(tier.features || []).map((feat, fIdx) => (
                      <li key={fIdx}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    type="button" 
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-select-tier`} 
                    style={{ width: '100%', marginTop: 'auto' }}
                    onClick={(e) => { e.stopPropagation(); handleSelectTier(tier.id); }}
                  >
                    {tier.buttonText || `Select Plan (₹${Number(tier.price).toLocaleString('en-IN')})`}
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
            <span className="sub-title">Intake &amp; Secure Checkout</span>
            <h2>Consultation Details &amp; Scheduling</h2>
            <p>Answer a few quick questions so Reshmi Verma can prepare thoroughly before your session.</p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '48px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)' }}>
            
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
              
              {/* Section A — Basic Information */}
              <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid rgba(194, 65, 12, 0.12)' }}>
                <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-medium)', fontWeight: 700, fontSize: '0.85rem' }}>A</span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--emerald-deep)', margin: 0, fontWeight: 700 }}>Section A — Basic Information</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Verified prior to booking &amp; payment.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                    placeholder="e.g. Software Engineer, Architect, Homemaker" 
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }} 
                  />
                </div>

                <div>
                  <label htmlFor="client-language-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                    8. Preferred Consultation Language
                  </label>
                  <select 
                    id="client-language-input" 
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', background: 'white' }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English & Hindi (Bilingual)">English &amp; Hindi (Bilingual)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="client-emergency-input" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                  9. Emergency Contact (Optional)
                </label>
                <input 
                  type="text" 
                  id="client-emergency-input" 
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name & Phone number of close contact" 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem' }} 
                />
              </div>

              {/* Scheduling & Consultation Tier */}
              <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid rgba(194, 65, 12, 0.12)', marginTop: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--emerald-deep)', margin: 0, fontWeight: 700 }}>Consultation Plan &amp; Appointment Slot</h3>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="selected-service-select" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                  Price Category / Consultation Plan *
                </label>
                <select 
                  id="selected-service-select" 
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: 'white', border: '1.5px solid var(--emerald-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', fontWeight: 600, color: 'var(--emerald-deep)', cursor: 'pointer' }}
                >
                  <option value="discovery">Initial Discovery Call (20 min) — ₹999</option>
                  <option value="comprehensive">Comprehensive Consultation (60 min) — ₹2,999 (Most Popular)</option>
                  <option value="followup">Follow-Up Check-in (30 min) — ₹1,499</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label htmlFor="booking-date-picker" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                    Preferred Consultation Date *
                  </label>
                  <input 
                    type="date" 
                    id="booking-date-picker" 
                    name="bookingDate"
                    value={formData.bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    required 
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }} 
                  />
                </div>

                <div>
                  <label htmlFor="booking-time-picker" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                    Preferred Time Window
                  </label>
                  <select 
                    id="booking-time-picker" 
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="client-notes-input" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                  Primary Health Challenges &amp; Notes for Reshmi Verma *
                </label>
                <textarea 
                  id="client-notes-input" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4" 
                  placeholder="e.g. Chronic acid reflux, shallow breathing, afternoon brain fog. I want to build a sustainable nutrition & breath plan..." 
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', lineHeight: 1.6 }}
                ></textarea>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  (If you tested your BOLT score or completed the Health Assessment, your notes are automatically attached above)
                </span>
              </div>

              {/* Razorpay Consultation Order Summary Box */}
              <div className="checkout-summary-box">
                <div className="checkout-summary-header">
                  <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                  <div className="checkout-security-badge-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Secured by Razorpay</span>
                  </div>
                  <div className="checkout-security-badge-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  type="submit" 
                  id="booking-submit-btn" 
                  className="btn btn-primary btn-lg" 
                  style={{ minWidth: '320px' }}
                  disabled={loading}
                >
                  <span id="booking-btn-text">
                    {loading ? 'Processing...' : `Pay & Confirm Booking (₹${currentTier.price.toLocaleString('en-IN')})`}
                  </span>
                  <svg id="booking-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
              <div><strong>Practitioner:</strong> Reshmi Verma (Rainbow Medinova)</div>
            </div>

            <div style={{ margin: '20px 0 16px', background: '#fff8e1', border: '1px solid #fbc02d', borderRadius: '12px', padding: '14px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#856404', textTransform: 'uppercase', marginBottom: '4px' }}>CRITICAL NEXT STEP (Step 2 of 2)</div>
              <p style={{ fontSize: '0.88rem', color: '#533f03', margin: '0 0 10px' }}>
                Please complete the confidential pre-consultation health questionnaire so Reshmi Verma can analyze your metabolic biomarkers before your call.
              </p>
              <Link 
                id="proceed-questionnaire-btn" 
                to={`/questionnaire?bookingId=${confirmedBooking.id || ''}`} 
                className="btn btn-primary btn-sm" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--emerald-medium)', fontWeight: 700 }}
              >
                <span>Complete Clinical Intake Questionnaire &rarr;</span>
              </Link>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a 
                id="whatsapp-confirm-link" 
                href={`https://wa.me/919876543210?text=${whatsappMessage}`} 
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
