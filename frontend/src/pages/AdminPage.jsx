import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user, token, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'bookings' | 'pricing' | 'reels'
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [selectedPatientReport, setSelectedPatientReport] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [savingPricing, setSavingPricing] = useState(false);

  // Reels State
  const [reels, setReels] = useState([]);
  const [loadingReels, setLoadingReels] = useState(false);
  const [savingReels, setSavingReels] = useState(false);

  // Status Alerts
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success' | 'error', text: string }

  const showNotification = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // 1. Fetch Bookings
  const fetchAdminBookings = async () => {
    setLoadingBookings(true);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin-bookings', { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      } else {
        showNotification('error', data.error || 'Failed to load bookings.');
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
      showNotification('error', 'Error connecting to administrative endpoint.');
    } finally {
      setLoadingBookings(false);
    }
  };

  // 2. Fetch Pricing Tiers
  const fetchPricingTiers = async () => {
    setLoadingPricing(true);
    try {
      const res = await fetch('/api/pricing-tiers');
      const data = await res.json();
      if (res.ok && data.success) {
        setPricingTiers(data.tiers || []);
      } else {
        showNotification('error', 'Failed to load consultation tiers.');
      }
    } catch (err) {
      console.error('Pricing fetch error:', err);
    } finally {
      setLoadingPricing(false);
    }
  };

  // 3. Fetch Reels
  const fetchReels = async () => {
    setLoadingReels(true);
    try {
      const res = await fetch('/api/reels');
      const data = await res.json();
      if (res.ok && data.success) {
        setReels(data.reels || []);
      } else {
        showNotification('error', 'Failed to load Instagram reels.');
      }
    } catch (err) {
      console.error('Reels fetch error:', err);
    } finally {
      setLoadingReels(false);
    }
  };

  // Initialize data on auth load
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
      } else if (!isAdmin) {
        setLoadingBookings(false);
      } else {
        fetchAdminBookings();
        fetchPricingTiers();
        fetchReels();
      }
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  // Update Booking Status
  const handleUpdateBooking = async (bookingId, updates) => {
    setUpdatingId(bookingId);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin-update-booking', {
        method: 'POST',
        headers,
        body: JSON.stringify({ bookingId, updates })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, ...updates, ...(data.booking || {}) } : b))
        );
        showNotification('success', data.message || 'Booking status updated successfully.');
      } else {
        showNotification('error', data.error || 'Failed to update booking status.');
      }
    } catch (err) {
      console.error('Update booking error:', err);
      showNotification('error', 'Error updating booking.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Save Pricing Tiers
  const handleSavePricing = async () => {
    setSavingPricing(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin-pricing-tiers', {
        method: 'POST',
        headers,
        body: JSON.stringify({ tiers: pricingTiers })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPricingTiers(data.tiers || pricingTiers);
        showNotification('success', 'Consultation session fees updated and live on site!');
      } else {
        showNotification('error', data.error || 'Failed to update session pricing.');
      }
    } catch (err) {
      console.error('Save pricing error:', err);
      showNotification('error', 'Error saving pricing tiers.');
    } finally {
      setSavingPricing(false);
    }
  };

  // Add new tier
  const handleAddTier = () => {
    const newId = `tier_${Date.now()}`;
    const newTier = {
      id: newId,
      name: 'Specialized Clinical Session',
      title: 'Specialized Clinical Session',
      badge: 'Specialized Care',
      duration: '45 Minutes • Focused Care',
      price: 1999,
      desc: 'Focused 1-on-1 session to target specific health objectives and biomarker calibration.',
      features: [
        'Detailed symptom & diet assessment',
        'Specific targeted action blueprint',
        'Personalized follow-up guide'
      ],
      buttonText: 'Select Specialized Care (₹1,999)',
      featured: false,
      active: true
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  // Delete tier
  const handleDeleteTier = (id) => {
    if (pricingTiers.length <= 1) {
      alert('You must keep at least one active consultation tier.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this consultation tier?')) {
      setPricingTiers(pricingTiers.filter(t => t.id !== id));
    }
  };

  // Update specific tier field
  const handleTierChange = (index, field, value) => {
    const updated = [...pricingTiers];
    updated[index] = { ...updated[index], [field]: value };
    setPricingTiers(updated);
  };

  // Update tier features list
  const handleTierFeaturesChange = (index, text) => {
    const featuresArr = text.split('\n').filter(f => f.trim().length > 0);
    const updated = [...pricingTiers];
    updated[index] = { ...updated[index], features: featuresArr };
    setPricingTiers(updated);
  };

  // Save Reels
  const handleSaveReels = async () => {
    setSavingReels(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin-reels', {
        method: 'POST',
        headers,
        body: JSON.stringify({ reels })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReels(data.reels || reels);
        showNotification('success', 'Instagram Reels studio updated and live on site!');
      } else {
        showNotification('error', data.error || 'Failed to update reels.');
      }
    } catch (err) {
      console.error('Save reels error:', err);
      showNotification('error', 'Error saving Instagram reels.');
    } finally {
      setSavingReels(false);
    }
  };

  // Add new Reel
  const handleAddReel = () => {
    const newReel = {
      id: `reel_${Date.now()}`,
      title: 'New Clinical Health & Breathwork Reel',
      url: 'https://www.instagram.com/healthwithreshmi/',
      image: '/assets/images/founder.jpg',
      views: '50K',
      duration: '0:50',
      topic: 'Functional Health'
    };
    setReels([...reels, newReel]);
  };

  // Delete Reel
  const handleDeleteReel = (id) => {
    if (window.confirm('Are you sure you want to remove this Reel from the website?')) {
      setReels(reels.filter(r => r.id !== id));
    }
  };

  // Update Reel field
  const handleReelChange = (index, field, value) => {
    const updated = [...reels];
    updated[index] = { ...updated[index], [field]: value };
    setReels(updated);
  };

  // Metrics calculation
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingIntakeCount = bookings.filter((b) => !b.questionnaireSubmitted && !b.questionnaireData).length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  // Filter & Search Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filterStatus === 'all' || (b.status || 'pending').toLowerCase() === filterStatus.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      (b.clientName || '').toLowerCase().includes(query) ||
      (b.clientEmail || '').toLowerCase().includes(query) ||
      (b.id || '').toLowerCase().includes(query) ||
      (b.phone || b.clientPhone || '').toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  if (!isAdmin && !authLoading) {
    return (
      <main className="admin-container" style={{ maxWidth: '1240px', margin: '60px auto 90px', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ background: '#FFF1F2', padding: '40px', borderRadius: '24px', border: '1px solid #BE123C' }}>
          <h2 style={{ color: '#BE123C' }}>🔒 Administrative Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            This command desk requires administrator credentials. Please sign in with an authorized clinic account.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>
            Sign in as Administrator
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="admin-container" style={{ maxWidth: '1280px', margin: '50px auto 90px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        
        {/* Admin Header Card */}
        <div
          className="admin-header-card"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            borderRadius: '26px',
            padding: '30px 36px',
            border: '1px solid rgba(194, 65, 12, 0.16)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(194, 65, 12, 0.08)', borderRadius: '999px', color: 'var(--emerald-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-primary)' }}></span>
              Clinical Command Desk
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 6px', fontFamily: 'var(--font-serif)', color: 'var(--emerald-deep)' }}>
              Reshmi Verma Administration & Control
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              Authorized Portal &bull; Logged in as: <strong>{user?.email}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeTab === 'bookings' && (
              <button className="btn btn-secondary btn-sm" onClick={fetchAdminBookings} disabled={loadingBookings}>
                {loadingBookings ? 'Refreshing...' : '↻ Refresh Records'}
              </button>
            )}
            {activeTab === 'pricing' && (
              <button className="btn btn-primary btn-sm" onClick={handleSavePricing} disabled={savingPricing}>
                {savingPricing ? 'Saving Fees...' : '💾 Save All Consultation Fees'}
              </button>
            )}
            {activeTab === 'reels' && (
              <button className="btn btn-primary btn-sm" onClick={handleSaveReels} disabled={savingReels}>
                {savingReels ? 'Saving Reels...' : '💾 Save All Instagram Reels'}
              </button>
            )}
          </div>
        </div>

        {/* Global Notifications Alert Banner */}
        {alertMsg && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '14px',
              marginBottom: '20px',
              background: alertMsg.type === 'success' ? '#F0FDF4' : '#FFF1F2',
              color: alertMsg.type === 'success' ? '#15803D' : '#BE123C',
              border: `1px solid ${alertMsg.type === 'success' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(225, 29, 72, 0.25)'}`,
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{alertMsg.text}</span>
            <button
              onClick={() => setAlertMsg(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Clinical Desk Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'bookings' ? 'var(--emerald-deep)' : 'transparent',
              color: activeTab === 'bookings' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📋 Patient Bookings & Intakes</span>
            <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', background: activeTab === 'bookings' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)' }}>
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'pricing' ? 'var(--emerald-deep)' : 'transparent',
              color: activeTab === 'pricing' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>💳 Session Fees & Consultation Tiers</span>
            <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', background: activeTab === 'pricing' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)' }}>
              {pricingTiers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'reels' ? 'var(--emerald-deep)' : 'transparent',
              color: activeTab === 'reels' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🎬 Instagram Reels Studio</span>
            <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', background: activeTab === 'reels' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)' }}>
              {reels.length}
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: BOOKINGS & INTAKES MANAGEMENT
            ========================================================================= */}
        {activeTab === 'bookings' && (
          <div>
            {/* Metrics Overview Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '26px'
              }}
            >
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Bookings</span>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--emerald-deep)', fontWeight: 700, marginTop: '4px' }}>
                  {totalCount}
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Confirmed Sessions</span>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--status-optimal)', fontWeight: 700, marginTop: '4px' }}>
                  {confirmedCount}
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Questionnaires</span>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--emerald-primary)', fontWeight: 700, marginTop: '4px' }}>
                  {pendingIntakeCount}
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Session Revenue</span>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--emerald-deep)', fontWeight: 700, marginTop: '4px' }}>
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '14px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'confirmed', 'pending', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: '1px solid var(--border-subtle)',
                      background: filterStatus === st ? 'var(--emerald-primary)' : 'white',
                      color: filterStatus === st ? 'white' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search patient name, email, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'white',
                  minWidth: '280px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Bookings List */}
            {loadingBookings ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading consultation appointments...</div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No appointment records found matching your query.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredBookings.map((b) => {
                  const isConfirmed = b.status === 'confirmed';
                  const hasIntake = Boolean(b.questionnaireSubmitted || b.questionnaireData);
                  const qData = b.questionnaireData || {};

                  return (
                    <div
                      key={b.id}
                      style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '24px 28px',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--emerald-deep)' }}>
                              {b.clientName || 'Anonymous Client'}
                            </h3>
                            <span
                              style={{
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                background: isConfirmed ? '#F0FDF4' : '#FFFBEB',
                                color: isConfirmed ? '#16A34A' : '#D97706',
                                border: `1px solid ${isConfirmed ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`
                              }}
                            >
                              {b.status || 'Pending'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Booking ID: <code>{b.id}</code> &bull; Email: <strong>{b.clientEmail || 'N/A'}</strong> &bull; Phone: <strong>{b.phone || b.clientPhone || 'N/A'}</strong>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--emerald-deep)' }}>
                            ₹{Number(b.amount || b.servicePrice || 2999).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Payment ID: {b.paymentId ? <code>{b.paymentId}</code> : 'Pay on Clinic Arrival'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', padding: '16px', background: '#FAF8F5', borderRadius: '14px', fontSize: '0.88rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Service Tier & Fee:</span>
                          <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{b.serviceTier || b.serviceName || 'Comprehensive Consultation'} (₹{Number(b.amount || b.servicePrice || 2999).toLocaleString('en-IN')})</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Consultation Slot:</span>
                          <div style={{ fontWeight: 600 }}>{b.bookingDate} &bull; {b.bookingTime || b.timeSlot}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Patient Demographics:</span>
                          <div style={{ fontWeight: 600 }}>
                            {b.age || b.clientAge || b.sectionA?.age ? `${b.age || b.clientAge || b.sectionA?.age} yrs` : 'Age N/A'} &bull; {b.gender || b.clientGender || b.sectionA?.gender || 'N/A'} &bull; {b.city || b.clientCity || b.sectionA?.city || 'City N/A'}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Occupation & Lang:</span>
                          <div style={{ fontWeight: 500 }}>
                            {b.occupation || b.clientOccupation || b.sectionA?.occupation || 'N/A'} ({b.language || b.clientLanguage || b.sectionA?.language || 'English'})
                          </div>
                        </div>
                      </div>

                      {/* Notes Box */}
                      <div style={{ padding: '12px 16px', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                          Chief Health Concern & Notes:
                        </span>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {b.notes || b.healthConcerns || 'No preliminary notes provided.'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {isConfirmed ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  background: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1.5px solid #86EFAC',
                                  fontWeight: 700,
                                  padding: '5px 12px',
                                  fontSize: '0.8rem',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                ✓ Confirmed
                              </span>

                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'completed' })}
                                title="Mark session as successfully completed"
                              >
                                Mark Completed
                              </button>

                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#BE123C', borderColor: '#FECDD3' }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'cancelled' })}
                                title="Cancel appointment"
                              >
                                ✕
                              </button>
                            </div>
                          ) : b.status === 'completed' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  background: '#EFF6FF',
                                  color: '#1D4ED8',
                                  border: '1.5px solid #BFDBFE',
                                  fontWeight: 700,
                                  padding: '5px 12px',
                                  fontSize: '0.8rem',
                                  borderRadius: '8px'
                                }}
                              >
                                🌟 Completed
                              </span>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'confirmed' })}
                              >
                                Re-confirm
                              </button>
                            </div>
                          ) : b.status === 'cancelled' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  background: '#FFF1F2',
                                  color: '#BE123C',
                                  border: '1.5px solid #FECDD3',
                                  fontWeight: 700,
                                  padding: '5px 12px',
                                  fontSize: '0.8rem',
                                  borderRadius: '8px'
                                }}
                              >
                                ✕ Cancelled
                              </span>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'confirmed' })}
                              >
                                Restore & Confirm
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '0.82rem',
                                  background: 'linear-gradient(135deg, #15803D 0%, #16A34A 100%)',
                                  borderColor: '#15803D'
                                }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'confirmed' })}
                              >
                                {updatingId === b.id ? '⏳ Confirming...' : '✓ Confirm Appointment'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#BE123C', borderColor: '#FECDD3' }}
                                disabled={updatingId === b.id}
                                onClick={() => handleUpdateBooking(b.id, { status: 'cancelled' })}
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '7px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => setSelectedPatientReport(b)}
                          >
                            <span>📋 View Complete Clinical Report &amp; Dossier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: SESSION PRICING & CONSULTATION TIERS
            ========================================================================= */}
        {activeTab === 'pricing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--emerald-deep)', margin: '0 0 4px' }}>
                  Consultation Packages & Session Fees
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Modify session pricing in INR (₹), update consultation durations, or introduce brand-new clinical programs. Changes sync instantly to Razorpay and the booking calendar.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddTier}
                >
                  + Add New Consultation Tier
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSavePricing}
                  disabled={savingPricing}
                >
                  {savingPricing ? 'Saving...' : '💾 Save Fees'}
                </button>
              </div>
            </div>

            {loadingPricing ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading consultation tiers...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
                {pricingTiers.map((tier, idx) => (
                  <div
                    key={tier.id || idx}
                    style={{
                      background: 'white',
                      borderRadius: '22px',
                      padding: '28px',
                      border: tier.featured ? '2px solid var(--emerald-primary)' : '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: Tier Name & Delete */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Tier Title / Heading
                        </label>
                        <input
                          type="text"
                          value={tier.title || tier.name || ''}
                          onChange={(e) => {
                            handleTierChange(idx, 'title', e.target.value);
                            handleTierChange(idx, 'name', e.target.value);
                          }}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            color: 'var(--emerald-deep)',
                            marginTop: '4px'
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTier(tier.id)}
                        title="Remove Tier"
                        style={{
                          background: '#FFF1F2',
                          border: '1px solid #FECDD3',
                          color: '#BE123C',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          marginTop: '16px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Price & Duration Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Session Fee (₹ INR)
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ position: 'absolute', left: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>₹</span>
                          <input
                            type="number"
                            min="1"
                            value={tier.price || ''}
                            onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px 9px 28px',
                              borderRadius: '10px',
                              border: '1.5px solid var(--emerald-primary)',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              color: 'var(--emerald-deep)'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Session Duration
                        </label>
                        <input
                          type="text"
                          value={tier.duration || ''}
                          onChange={(e) => handleTierChange(idx, 'duration', e.target.value)}
                          placeholder="e.g. 60 Minutes • Deep Dive"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.9rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Badge and Button Text */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={tier.badge || ''}
                          onChange={(e) => handleTierChange(idx, 'badge', e.target.value)}
                          placeholder="e.g. Most Popular"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.88rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={tier.buttonText || ''}
                          onChange={(e) => handleTierChange(idx, 'buttonText', e.target.value)}
                          placeholder="Select Plan"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.88rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Clinical Description
                      </label>
                      <textarea
                        rows="2"
                        value={tier.desc || ''}
                        onChange={(e) => handleTierChange(idx, 'desc', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-subtle)',
                          fontSize: '0.88rem',
                          marginTop: '4px',
                          fontFamily: 'inherit',
                          lineHeight: 1.5
                        }}
                      />
                    </div>

                    {/* Key Features (One per line) */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Features Included (One bullet point per line)
                      </label>
                      <textarea
                        rows="4"
                        value={(tier.features || []).join('\n')}
                        onChange={(e) => handleTierFeaturesChange(idx, e.target.value)}
                        placeholder="Feature line 1&#10;Feature line 2&#10;Feature line 3"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-subtle)',
                          fontSize: '0.85rem',
                          marginTop: '4px',
                          fontFamily: 'inherit',
                          lineHeight: 1.5
                        }}
                      />
                    </div>

                    {/* Featured Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <input
                        type="checkbox"
                        id={`featured-${idx}`}
                        checked={Boolean(tier.featured)}
                        onChange={(e) => handleTierChange(idx, 'featured', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-primary)' }}
                      />
                      <label htmlFor={`featured-${idx}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        Highlight as "Most Popular" / Featured Tier
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: INSTAGRAM REELS STUDIO
            ========================================================================= */}
        {activeTab === 'reels' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--emerald-deep)', margin: '0 0 4px' }}>
                  Instagram Reels & Educational Video Hub
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Add or edit Instagram educational reels displayed on the homepage carousel. Visitors can click to watch directly on Instagram with full analytics.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddReel}
                >
                  + Add New Instagram Reel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveReels}
                  disabled={savingReels}
                >
                  {savingReels ? 'Saving...' : '💾 Save All Reels'}
                </button>
              </div>
            </div>

            {loadingReels ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading Instagram reels...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
                {reels.map((reel, idx) => (
                  <div
                    key={reel.id || idx}
                    style={{
                      background: 'white',
                      borderRadius: '22px',
                      padding: '24px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    {/* Thumbnail Preview & Delete */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '74px',
                          height: '110px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#1E293B',
                          flexShrink: 0,
                          position: 'relative'
                        }}
                      >
                        <img
                          src={reel.image || '/assets/images/founder.jpg'}
                          alt={reel.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/assets/images/founder.jpg'; }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 4px',
                            borderRadius: '4px'
                          }}
                        >
                          {reel.duration || '0:50'}
                        </span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Reel #{idx + 1}
                        </span>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--emerald-deep)', lineHeight: 1.3, marginTop: '2px' }}>
                          {reel.title || 'Untitled Reel'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Views: {reel.views || '45K'} &bull; Topic: {reel.topic || 'General'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteReel(reel.id)}
                        title="Delete Reel"
                        style={{
                          background: '#FFF1F2',
                          border: '1px solid #FECDD3',
                          color: '#BE123C',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          alignSelf: 'flex-start'
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Title */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Reel Title / Hook
                      </label>
                      <input
                        type="text"
                        value={reel.title || ''}
                        onChange={(e) => handleReelChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Why Morning Coffee Causes Acidity"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-subtle)',
                          fontSize: '0.9rem',
                          marginTop: '4px'
                        }}
                      />
                    </div>

                    {/* Instagram URL */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Instagram Link (Full URL)
                      </label>
                      <input
                        type="url"
                        value={reel.url || ''}
                        onChange={(e) => handleReelChange(idx, 'url', e.target.value)}
                        placeholder="https://www.instagram.com/reel/..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-subtle)',
                          fontSize: '0.88rem',
                          marginTop: '4px'
                        }}
                      />
                    </div>

                    {/* Image URL & Views */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Cover Image Path
                        </label>
                        <input
                          type="text"
                          value={reel.image || ''}
                          onChange={(e) => handleReelChange(idx, 'image', e.target.value)}
                          placeholder="/assets/images/founder.jpg"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.85rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Views Label
                        </label>
                        <input
                          type="text"
                          value={reel.views || ''}
                          onChange={(e) => handleReelChange(idx, 'views', e.target.value)}
                          placeholder="e.g. 52.4K views"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.85rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Topic & Duration */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Category / Topic
                        </label>
                        <input
                          type="text"
                          value={reel.topic || ''}
                          onChange={(e) => handleReelChange(idx, 'topic', e.target.value)}
                          placeholder="e.g. Gut Acidity"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.85rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Duration Badge
                        </label>
                        <input
                          type="text"
                          value={reel.duration || ''}
                          onChange={(e) => handleReelChange(idx, 'duration', e.target.value)}
                          placeholder="e.g. 0:58"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-subtle)',
                            fontSize: '0.85rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>
                    </div>

                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--emerald-primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Test Reel Link on Instagram</span> &rarr;
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comprehensive Modal: Clinical Patient Dossier & Report */}
        {selectedPatientReport && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', maxWidth: '820px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '2px solid var(--border-subtle)', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800 }}>
                      HEALTHWITHRESHMI™ CLINICAL DOSSIER
                    </span>
                    <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>
                      ID: {selectedPatientReport.id}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--emerald-deep)', margin: 0 }}>
                    {selectedPatientReport.clientName || 'Valued Patient'}
                  </h2>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Session Slot: <strong>{selectedPatientReport.bookingDate} at {selectedPatientReport.bookingTime || selectedPatientReport.timeSlot}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>🖨️ Print Dossier</span>
                  </button>
                  <button
                    onClick={() => setSelectedPatientReport(null)}
                    style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Section 1: Patient Demographics & Profile */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤 Patient Profile &amp; Demographics</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#FAF8F5', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.clientName || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>WhatsApp Number</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.clientPhone || selectedPatientReport.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.clientEmail || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Age / DOB</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.age || selectedPatientReport.clientAge || selectedPatientReport.sectionA?.age || 'Not provided'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Gender</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.gender || selectedPatientReport.clientGender || selectedPatientReport.sectionA?.gender || 'Not specified'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>City / Location</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.city || selectedPatientReport.clientCity || selectedPatientReport.sectionA?.city || 'Not provided'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Occupation</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.occupation || selectedPatientReport.clientOccupation || selectedPatientReport.sectionA?.occupation || 'Not provided'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Consultation Language</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.language || selectedPatientReport.clientLanguage || selectedPatientReport.sectionA?.language || 'English'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Emergency Contact</span>
                    <div style={{ fontWeight: 600 }}>{selectedPatientReport.emergencyContact || selectedPatientReport.clientEmergencyContact || selectedPatientReport.sectionA?.emergencyContact || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Session Plan & Financial Audit */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💳 Appointment &amp; Payment Audit</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: '#FAF8F5', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Plan Tier</span>
                    <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{selectedPatientReport.serviceTier || selectedPatientReport.serviceName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fee Paid</span>
                    <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '1.1rem' }}>₹{Number(selectedPatientReport.amount || selectedPatientReport.servicePrice || 2999).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Razorpay Payment ID</span>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}><code>{selectedPatientReport.paymentId || 'pay_direct'}</code></div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order Reference</span>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}><code>{selectedPatientReport.orderId || 'order_direct'}</code></div>
                  </div>
                </div>
              </div>

              {/* Section 3: Chief Health Concerns & Client Notes */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📝 Chief Health Concerns &amp; Symptoms</span>
                </h4>
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '18px', borderRadius: '14px', lineHeight: 1.6, color: '#92400E', fontSize: '0.95rem' }}>
                  {selectedPatientReport.notes || selectedPatientReport.healthConcerns || 'No special preliminary notes submitted during booking checkout.'}
                </div>
              </div>

              {/* Section 4: Clinical Questionnaire & Diagnostic Scores */}
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔬 Diagnostic Evaluation &amp; Intake Data</span>
                </h4>

                {selectedPatientReport.clinicalScores && (
                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-medium)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>Algorithmic Resilience Score:</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-medium)' }}>
                        {selectedPatientReport.clinicalScores.compositeResilience}%
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gut Mucosal</div>
                        <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{selectedPatientReport.clinicalScores.gutScore}/100</div>
                      </div>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Breath / CO₂</div>
                        <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{selectedPatientReport.clinicalScores.breathScore}/100</div>
                      </div>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Endocrine Axis</div>
                        <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{selectedPatientReport.clinicalScores.hormoneScore}/100</div>
                      </div>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sleep Debt</div>
                        <div style={{ fontWeight: 700, color: 'var(--emerald-deep)' }}>{selectedPatientReport.clinicalScores.sleepScore}/100</div>
                      </div>
                    </div>

                    {selectedPatientReport.clinicalScores.clinicalFlags && selectedPatientReport.clinicalScores.clinicalFlags.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#BE123C', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          Clinical Flags Identified:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedPatientReport.clinicalScores.clinicalFlags.map((flag, fIdx) => (
                            <span key={fIdx} style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FECDD3', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                              ⚠ {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedPatientReport.questionnaireData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '6px' }}>
                    {/* Patient Uploaded PDF Lab Report Card */}
                    {(selectedPatientReport.questionnaireData.labReportFileUrl || selectedPatientReport.questionnaireData.labReportFileName) && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '12px', marginBottom: '6px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ background: '#DC2626', color: 'white', fontWeight: 800, fontSize: '0.74rem', padding: '4px 8px', borderRadius: '6px' }}>PDF</span>
                          <div>
                            <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '0.92rem' }}>
                              {selectedPatientReport.questionnaireData.labReportFileName || 'Patient_Bloodwork_Report.pdf'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#B91C1C' }}>
                              {selectedPatientReport.questionnaireData.labReportFileSize || 'Medical Report'} &bull; Uploaded by Patient
                            </div>
                          </div>
                        </div>
                        <a
                          href={selectedPatientReport.questionnaireData.labReportFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#DC2626', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                        >
                          <span>📄 Open Patient PDF</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        </a>
                      </div>
                    )}

                    {Object.entries(selectedPatientReport.questionnaireData).map(([key, val]) => (
                      <div key={key} style={{ padding: '10px 14px', background: '#FAF8F5', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val || 'N/A')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--border-medium)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    ✓ Pre-booking clinical intake and patient demographics successfully recorded. Full 360° intake questionnaire link has been provided to the patient.
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Confirmed Clinical Record &bull; HealthwithReshmi™ Portal
                </span>
                <button className="btn btn-secondary" onClick={() => setSelectedPatientReport(null)}>
                  Close Review
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </>
  );
}
