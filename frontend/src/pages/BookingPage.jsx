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
    buttonText: 'Book 1:1 Consultation (₹1,999)'
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
  const rawTier = searchParams.get('tier') || searchParams.get('plan') || 'healthClarity';
  const urlTier = rawTier === 'comprehensive' ? 'healthClarity' : rawTier;
  const initialTierKey = DEFAULT_PRICING_TIERS[urlTier] ? urlTier : 'healthClarity';
  const [selectedTier, setSelectedTier] = useState(initialTierKey);

  // Read any prefilled lead data from URL or localStorage
  let savedLead = null;
  try {
    const raw = localStorage.getItem('reshmi_assessment_lead');
    if (raw) savedLead = JSON.parse(raw);
  } catch (e) {}

  const initialName = searchParams.get('name') || savedLead?.name || user?.name || '';
  const initialPhone = searchParams.get('phone') || savedLead?.phone || user?.phone || '';
  const initialEmail = searchParams.get('email') || savedLead?.email || user?.email || '';

  // Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
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
    bookingDate: tomorrow,
    timeSlot: TIME_SLOTS[0],
    notes: '',
    // Pre-Consultation Clinical Intake Questions (Pahale Questions, Phir Payment)
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
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string, icon?: string }
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Dynamic slot availability state
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsData, setSlotsData] = useState({
    isDateBlocked: false,
    blockReason: null,
    slots: TIME_SLOTS.map(s => ({ slot: s, available: true, status: 'available' })),
    hasAvailableSlot: true
  });

  // Fetch slot availability whenever bookingDate changes
  useEffect(() => {
    if (!formData.bookingDate) return;
    let isCancelled = false;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(getApiUrl(`/api/available-slots?date=${encodeURIComponent(formData.bookingDate)}`));
        const data = await res.json();
        if (!isCancelled && res.ok && data.success) {
          setSlotsData(data);
          // If current selected slot is unavailable or date is blocked, auto-select first available slot
          const currentSlotItem = (data.slots || []).find(s => s.slot === formData.timeSlot);
          if (!currentSlotItem || !currentSlotItem.available) {
            const firstAvailable = (data.slots || []).find(s => s.available);
            if (firstAvailable) {
              setFormData(prev => ({ ...prev, timeSlot: firstAvailable.slot }));
            }
          }
        }
      } catch (e) {
        console.warn('Slot availability fetch notice:', e);
      } finally {
        if (!isCancelled) setSlotsLoading(false);
      }
    };

    fetchSlots();

    return () => {
      isCancelled = true;
    };
  }, [formData.bookingDate]);

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
    fetch(getApiUrl('/api/pricing-tiers'))
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

    if (slotsData.isDateBlocked) {
      setAlert({
        type: 'error',
        message: slotsData.blockReason || 'The clinician is unavailable on the selected date. Please choose another date.'
      });
      return;
    }

    const currentSlotItem = (slotsData.slots || []).find(s => s.slot === formData.timeSlot);
    if (currentSlotItem && !currentSlotItem.available) {
      setAlert({
        type: 'error',
        message: `The slot "${formData.timeSlot}" is already booked or unavailable on this date. Please select an available slot.`
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend Express server
      const orderRes = await fetch(getApiUrl('/api/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceTier: selectedTier,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          bookingDate: formData.bookingDate,
          timeSlot: formData.timeSlot
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate booking order.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51234567890abc';

      const finalizeBooking = async (paymentDetails = {}) => {
        const verifyRes = await fetch(getApiUrl('/api/verify-payment'), {
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
            notes: formData.notes || '1:1 Health Clarity Session',
            healthConcerns: formData.notes || '1:1 Health Clarity Consultation'
          })
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.error || 'Failed to confirm booking.');
        }

        // Auto-submit Clinical Questionnaire Intake using created booking ID
        const assignedBookingId = verifyData.bookingId || verifyData.booking?.id || `bk_${Date.now()}`;
        try {
          fetch(getApiUrl('/api/submit-questionnaire'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: assignedBookingId,
              email: formData.email,
              formData: {
                fullName: formData.name,
                email: formData.email,
                phone: formData.phone,
                age: formData.age,
                gender: formData.gender,
                city: formData.city,
                occupation: formData.occupation,
                q10_primary_concern: formData.q10_primary_concern,
                q11_concern_description: formData.q11_concern_description,
                q12_concern_duration: formData.q12_concern_duration,
                q16_medical_condition: formData.q16_medical_condition,
                q17_medicines_supplements: formData.q17_medicines_supplements,
                q29_dietary_preference: formData.q29_dietary_preference,
                q33_digestive_symptoms: formData.q33_digestive_symptoms,
                q27_stress_level: formData.q27_stress_level,
                bookingId: assignedBookingId
              }
            })
          }).catch(() => {});
        } catch (e) {}

        // Update lead tracking status to 'booked'
        try {
          fetch(getApiUrl('/api/assessment-lead'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: savedLead?.id,
              phone: formData.phone,
              name: formData.name,
              email: formData.email,
              bookingId: assignedBookingId,
              status: 'booked',
              step: '1:1 Consultation Booked & Confirmed'
            })
          }).catch(() => {});
        } catch (e) {}

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
          id: assignedBookingId,
          bookingId: assignedBookingId,
          paymentId: paymentDetails.razorpay_payment_id || `pay_verified_${Date.now().toString().slice(-6)}`,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          serviceName: currentTier.name,
          amountPaid: currentTier.price,
          dateTime: `${formData.bookingDate} (${formData.timeSlot})`
        });

        try {
          localStorage.setItem('reshmi_last_booking_id', assignedBookingId);
          localStorage.setItem('reshmi_last_booking_data', JSON.stringify({
            id: assignedBookingId,
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            serviceName: currentTier.name,
            dateTime: `${formData.bookingDate} (${formData.timeSlot})`
          }));
        } catch (e) {}
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
    `Hello Reshmi Verma, I have booked the ${currentTier.name} on ${formData.bookingDate} at ${formData.timeSlot}. Name: ${formData.name}. Booking ID: ${confirmedBooking?.id || confirmedBooking?.bookingId || ''}`
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
                    padding: '36px 32px',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="tier-badge" style={{ background: '#121214', color: '#FFFFFF' }}>
                    {tier.badge || 'Official 1:1 Clinical Consultation'}
                  </div>
                  <h3 style={{ fontSize: '1.75rem', marginTop: '14px', marginBottom: '4px' }}>
                    {tier.title || tier.name}
                  </h3>
                  <div className="tier-duration" style={{ color: '#0D827B', fontWeight: 600 }}>
                    {tier.duration}
                  </div>
                  
                  <div className="tier-price-box" style={{ margin: '20px 0 16px' }}>
                    <span className="tier-price-currency" style={{ fontSize: '1.6rem' }}>₹</span>
                    <span className="tier-price-amount" style={{ fontSize: '3rem', fontWeight: 800 }}>1,999</span>
                    <span className="tier-price-period" style={{ fontSize: '0.95rem' }}>/ 60-min session</span>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    {tier.desc}
                  </p>

                  <ul className="tier-features" style={{ marginBottom: '28px' }}>
                    {(tier.features || []).map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: '0.93rem', padding: '6px 0' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D827B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg" 
                    style={{ width: '100%', justifyContent: 'center', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800 }}
                    onClick={() => {
                      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Proceed with 1:1 Consultation (₹1,999) &rarr;
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
              
              {/* Step 1: Contact Information */}
              <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid rgba(194, 65, 12, 0.12)' }}>
                <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-medium)', fontWeight: 700, fontSize: '0.85rem' }}>1</span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--emerald-deep)', margin: 0, fontWeight: 700 }}>Step 1: Your Contact Information</h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>Required for private video consultation link and confirmation.</p>
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

              {/* Step 2: Scheduling & Consultation Slot */}
              <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid rgba(194, 65, 12, 0.12)', marginTop: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald-medium)', fontWeight: 700, fontSize: '0.85rem' }}>2</span>
                  <h3 style={{ fontSize: '1.18rem', color: 'var(--emerald-deep)', margin: 0, fontWeight: 700 }}>
                    Step 2: Consultation Plan &amp; Appointment Slot
                  </h3>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="selected-service-select" style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '6px' }}>
                  Price Category / Consultation Plan *
                </label>
                <select 
                  id="selected-service-select" 
                  value="healthClarity"
                  disabled
                  style={{ width: '100%', padding: '12px 16px', background: '#F4F5F6', border: '1.5px solid var(--emerald-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', fontWeight: 600, color: 'var(--emerald-deep)', cursor: 'default' }}
                >
                  <option value="healthClarity">1:1 Health Clarity Consultation (60 min) — ₹1,999</option>
                </select>
              </div>

              <div className="booking-form-row">
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
                  {slotsLoading && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--emerald-medium)', display: 'block', marginTop: '4px' }}>
                      ⏳ Checking clinician availability...
                    </span>
                  )}
                  {slotsData.isDateBlocked && (
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', color: '#dc2626', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      ⚠️ <strong>Date Unavailable:</strong> {slotsData.blockReason || 'Reshmi Mam is not taking consultations on this date. Please pick another date.'}
                    </div>
                  )}
                  {!slotsData.isDateBlocked && !slotsData.hasAvailableSlot && !slotsLoading && (
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', color: '#b45309', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      ⚠️ <strong>All slots booked:</strong> All consultation slots for this date are full. Please choose another date.
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="booking-time-picker" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', margin: 0 }}>
                      Preferred Time Window *
                    </label>
                    {slotsData.hasAvailableSlot && !slotsData.isDateBlocked && (
                      <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                        ● Live Available
                      </span>
                    )}
                  </div>

                  <select 
                    id="booking-time-picker" 
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    disabled={slotsLoading || slotsData.isDateBlocked || !slotsData.hasAvailableSlot}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '1px solid var(--border-medium)', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.95rem',
                      background: slotsData.isDateBlocked || !slotsData.hasAvailableSlot ? '#f8fafc' : 'white',
                      cursor: slotsData.isDateBlocked || !slotsData.hasAvailableSlot ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {slotsData.isDateBlocked ? (
                      <option value="">No consultation slots on this date</option>
                    ) : !slotsData.hasAvailableSlot ? (
                      <option value="">All slots fully booked for this date</option>
                    ) : (
                      (slotsData.slots || []).map((item) => {
                        const isAvailable = item.available;
                        const label = isAvailable 
                          ? `${item.slot} — ✓ Available` 
                          : item.status === 'booked' 
                            ? `${item.slot} — ❌ [Already Booked]` 
                            : `${item.slot} — ⛔ [Doctor Unavailable]`;
                        return (
                          <option 
                            key={item.slot} 
                            value={item.slot}
                            disabled={!isAvailable}
                            style={{ color: isAvailable ? '#0f172a' : '#94a3b8' }}
                          >
                            {label}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="client-notes-input" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                  Consultation Notes or Health Focus (Optional)
                </label>
                <textarea 
                  id="client-notes-input" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3" 
                  placeholder="e.g. Acid reflux, thyroid pacing, energy fatigue, or specific health goals you wish to discuss..." 
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', lineHeight: 1.6 }}
                ></textarea>
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
