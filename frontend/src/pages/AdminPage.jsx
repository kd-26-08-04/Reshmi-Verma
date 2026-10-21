import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

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

  // Clinic Schedule & Slot Manager State
  const [scheduleData, setScheduleData] = useState({
    workingDays: [1, 2, 3, 4, 5, 6],
    defaultSlots: [
      '10:00 AM - Morning Slot',
      '11:30 AM - Morning Slot',
      '02:30 PM - Afternoon Slot',
      '04:00 PM - Afternoon Slot',
      '06:00 PM - Evening Slot'
    ],
    blockedDates: [],
    customBlockedSlots: {}
  });
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockDateReason, setBlockDateReason] = useState('Leave / Out of clinic');
  const [slotBlockDate, setSlotBlockDate] = useState('');
  const [slotBlockSlot, setSlotBlockSlot] = useState('');

  // Assessment Leads State
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState('all');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [updatingLeadId, setUpdatingLeadId] = useState(null);

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

      const res = await fetch(getApiUrl('/api/admin-bookings'), { headers });
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
      const res = await fetch(getApiUrl('/api/pricing-tiers'));
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
      const res = await fetch(getApiUrl('/api/reels'));
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

  // 4. Fetch Clinic Schedule & Slots
  const fetchSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const res = await fetch(getApiUrl('/api/admin-schedule'));
      const data = await res.json();
      if (res.ok && data.success && data.schedule) {
        setScheduleData(data.schedule);
      } else {
        showNotification('error', 'Failed to load clinic schedule.');
      }
    } catch (err) {
      console.error('Schedule fetch error:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // 5. Fetch Assessment Leads
  const fetchAdminLeads = async () => {
    setLoadingLeads(true);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/api/admin-leads'), { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setLeads(data.leads || []);
      } else {
        showNotification('error', data.error || 'Failed to load assessment leads.');
      }
    } catch (err) {
      console.error('Admin leads fetch error:', err);
      showNotification('error', 'Error connecting to assessment leads endpoint.');
    } finally {
      setLoadingLeads(false);
    }
  };

  // Update Assessment Lead Status / Notes
  const handleUpdateLeadStatus = async (leadId, updates) => {
    setUpdatingLeadId(leadId);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/api/admin-update-lead'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ leadId, updates })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, ...updates, ...(data.lead || {}) } : l))
        );
        showNotification('success', 'Lead record updated.');
      } else {
        showNotification('error', data.error || 'Failed to update lead status.');
      }
    } catch (err) {
      console.error('Update lead error:', err);
      showNotification('error', 'Error updating lead.');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  // Save Schedule Config
  const handleSaveScheduleConfig = async (patch) => {
    setSavingSchedule(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/api/admin-schedule'), {
        method: 'POST',
        headers,
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScheduleData(data.schedule);
        showNotification('success', data.message || 'Schedule configuration saved successfully!');
      } else {
        showNotification('error', data.error || 'Failed to update schedule.');
      }
    } catch (err) {
      console.error('Save schedule error:', err);
      showNotification('error', 'Error updating clinic schedule.');
    } finally {
      setSavingSchedule(false);
    }
  };

  // Toggle Working Day (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const handleToggleWorkingDay = (dayIndex) => {
    const current = scheduleData.workingDays || [];
    let updated;
    if (current.includes(dayIndex)) {
      if (current.length <= 1) {
        alert('You must have at least one active working day in the week.');
        return;
      }
      updated = current.filter(d => d !== dayIndex);
    } else {
      updated = [...current, dayIndex].sort();
    }
    const newSchedule = { ...scheduleData, workingDays: updated };
    setScheduleData(newSchedule);
    handleSaveScheduleConfig(newSchedule);
  };

  // Add Default Master Slot
  const handleAddDefaultSlot = () => {
    if (!newSlotInput.trim()) return;
    const slotText = newSlotInput.trim();
    if (scheduleData.defaultSlots?.includes(slotText)) {
      alert('This slot already exists.');
      return;
    }
    const updatedSlots = [...(scheduleData.defaultSlots || []), slotText];
    const newSchedule = { ...scheduleData, defaultSlots: updatedSlots };
    setScheduleData(newSchedule);
    setNewSlotInput('');
    handleSaveScheduleConfig(newSchedule);
  };

  // Remove Default Master Slot
  const handleRemoveDefaultSlot = (slot) => {
    if ((scheduleData.defaultSlots || []).length <= 1) {
      alert('You must keep at least one available slot.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove the slot "${slot}"?`)) {
      const updatedSlots = (scheduleData.defaultSlots || []).filter(s => s !== slot);
      const newSchedule = { ...scheduleData, defaultSlots: updatedSlots };
      setScheduleData(newSchedule);
      handleSaveScheduleConfig(newSchedule);
    }
  };

  // Block Date
  const handleBlockDate = () => {
    if (!blockDateInput) {
      alert('Please select a date to block.');
      return;
    }
    handleSaveScheduleConfig({
      action: 'block_date',
      date: blockDateInput,
      reason: blockDateReason || 'Clinic Closed / Personal Leave'
    });
    setBlockDateInput('');
  };

  // Unblock Date
  const handleUnblockDate = (date) => {
    handleSaveScheduleConfig({
      action: 'unblock_date',
      date
    });
  };

  // Block Specific Slot on a Specific Date
  const handleBlockSpecificSlot = () => {
    if (!slotBlockDate || !slotBlockSlot) {
      alert('Please select both a date and a slot to block.');
      return;
    }
    handleSaveScheduleConfig({
      action: 'block_slot',
      date: slotBlockDate,
      slot: slotBlockSlot
    });
  };

  // Unblock Specific Slot on a Specific Date
  const handleUnblockSpecificSlot = (date, slot) => {
    handleSaveScheduleConfig({
      action: 'unblock_slot',
      date,
      slot
    });
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
        fetchSchedule();
        fetchAdminLeads();
      }
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  // Update Booking Status
  const handleUpdateBooking = async (bookingId, updates) => {
    setUpdatingId(bookingId);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/api/admin-update-booking'), {
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

      const res = await fetch(getApiUrl('/api/admin-pricing-tiers'), {
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
      buttonText: 'Select Specialized Care',
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

      const res = await fetch(getApiUrl('/api/admin-reels'), {
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
      image: '/assets/images/reshmi-verma.jpg',
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
      <main className="admin-container" style={{ textAlign: 'center' }}>
        <div style={{ background: '#FFF1F2', padding: '32px 20px', borderRadius: '24px', border: '1px solid #BE123C' }}>
          <h2 style={{ color: '#BE123C', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>🔒 Administrative Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
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
      <main className="admin-container">
        
        {/* Admin Header Card */}
        <div className="admin-header-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#121214", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0 }}>HR</div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(194, 65, 12, 0.08)', borderRadius: '999px', color: 'var(--emerald-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-primary)' }}></span>
                Clinical Command Desk
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', margin: '0 0 6px', fontFamily: 'var(--font-serif)', color: 'var(--emerald-deep)' }}>
                Reshmi Verma Administration & Control
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, wordBreak: 'break-word' }}>
                Authorized Portal &bull; Logged in as: <strong>{user?.email}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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

            {activeTab === 'schedule' && (
              <button className="btn btn-secondary btn-sm" onClick={fetchSchedule} disabled={loadingSchedule}>
                {loadingSchedule ? 'Refreshing...' : '↻ Refresh Schedule'}
              </button>
            )}
            {activeTab === 'leads' && (
              <button className="btn btn-secondary btn-sm" onClick={fetchAdminLeads} disabled={loadingLeads}>
                {loadingLeads ? 'Refreshing...' : '↻ Refresh Leads'}
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
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span>📋 Patient Bookings</span>
            <span className="admin-tab-badge">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <span>💳 Session Fees</span>
            <span className="admin-tab-badge">
              {pricingTiers.length}
            </span>
          </button>


          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span>📅 Clinic Schedule</span>
            <span className="admin-tab-badge">
              {scheduleData.defaultSlots?.length || 5} Slots
            </span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <span>🎯 Assessment Leads</span>
            <span className="admin-tab-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
              {leads.length}
            </span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: BOOKINGS & INTAKES MANAGEMENT
            ========================================================================= */}
        {activeTab === 'bookings' && (
          <div>
            {/* Metrics Overview Cards */}
            <div className="admin-metrics-grid">
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
            <div className="admin-filter-bar">
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
                className="admin-search-input"
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
                      className="admin-booking-card"
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

                      <div className="admin-booking-details-grid">
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
              <div className="admin-pricing-grid">
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
            TAB 4: CLINIC SCHEDULE & SLOTS MANAGER
            ========================================================================= */}
        {activeTab === 'schedule' && (
          <div>
            {/* Schedule Header / Quick Info */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px 28px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', color: 'var(--emerald-deep)' }}>
                  📅 Doctor Availability &amp; Session Slot Control
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Set your working days, add or remove standard daily consultation slots, and block dates or specific hours when you are unavailable.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSaveScheduleConfig(scheduleData)}
                  disabled={savingSchedule}
                >
                  {savingSchedule ? 'Saving...' : '💾 Save All Schedule Changes'}
                </button>
              </div>
            </div>

            <div className="admin-schedule-grid" style={{ marginBottom: '24px' }}>
              
              {/* Card 1: Working Days of the Week */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🗓️ Weekly Working Days</span>
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Uncheck days when the clinic is closed (e.g. Sunday off). Patients cannot book on unchecked days.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Monday', idx: 1 },
                    { label: 'Tuesday', idx: 2 },
                    { label: 'Wednesday', idx: 3 },
                    { label: 'Thursday', idx: 4 },
                    { label: 'Friday', idx: 5 },
                    { label: 'Saturday', idx: 6 },
                    { label: 'Sunday', idx: 0 }
                  ].map(day => {
                    const isActive = (scheduleData.workingDays || []).includes(day.idx);
                    return (
                      <button
                        key={day.idx}
                        type="button"
                        onClick={() => handleToggleWorkingDay(day.idx)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: `1.5px solid ${isActive ? 'var(--emerald-primary)' : 'var(--border-subtle)'}`,
                          background: isActive ? 'var(--emerald-soft)' : '#F8FAFC',
                          color: isActive ? 'var(--emerald-deep)' : 'var(--text-muted)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{isActive ? '✓' : '✕'}</span>
                        <span>{day.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Master Daily Consultation Windows */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏰ Daily Consultation Time Slots</span>
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Standard slots offered to patients each working day. Only one patient can book each slot per day.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {(scheduleData.defaultSlots || []).map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#FAF8F5',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-primary)' }}></span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{slot}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDefaultSlot(slot)}
                        title="Remove slot"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#BE123C',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '4px 8px'
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new slot input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    placeholder="e.g. 05:00 PM - Evening Slot"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-subtle)',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDefaultSlot}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    + Add Slot
                  </button>
                </div>
              </div>

            </div>

            <div className="admin-schedule-grid" style={{ marginBottom: '24px' }}>
              
              {/* Card 3: Block Full Dates (Holidays, Leaves, Travel) */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚫 Block Entire Date (Leaves / Off Days)</span>
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  When Reshmi Mam is out of town or taking leave, block the whole date. Patients will see the date as unavailable.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', background: '#FAF8F5', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Date to Block</label>
                    <input
                      type="date"
                      value={blockDateInput}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reason / Public Note</label>
                    <input
                      type="text"
                      value={blockDateReason}
                      onChange={(e) => setBlockDateReason(e.target.value)}
                      placeholder="e.g. Clinical Conference / Doctor Leave"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', marginTop: '4px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBlockDate}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '4px' }}
                  >
                    🚫 Block Selected Date
                  </button>
                </div>

                {/* List of currently blocked dates */}
                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                    Currently Blocked Dates ({(scheduleData.blockedDates || []).length}):
                  </label>
                  {(scheduleData.blockedDates || []).length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No full dates are currently blocked.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                      {(scheduleData.blockedDates || []).map((bd, bIdx) => {
                        const bDate = typeof bd === 'string' ? bd : bd.date;
                        const bReason = typeof bd === 'string' ? 'Doctor Leave' : (bd.reason || 'Doctor Leave');
                        return (
                          <div
                            key={bIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: '#FEF2F2',
                              borderRadius: '8px',
                              border: '1px solid #FECDD3'
                            }}
                          >
                            <div>
                              <strong style={{ color: '#991B1B', fontSize: '0.88rem' }}>{bDate}</strong>
                              <span style={{ fontSize: '0.78rem', color: '#B91C1C', marginLeft: '8px' }}>({bReason})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUnblockDate(bDate)}
                              style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              Unblock
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Block a Specific Single Slot on a Specific Date */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--emerald-deep)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏳ Block Single Slot on Specific Date</span>
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Busy for just 1 hour on a specific date? Block only that specific time slot without disabling the entire day.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', background: '#FAF8F5', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Date</label>
                    <input
                      type="date"
                      value={slotBlockDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSlotBlockDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Slot to Block</label>
                    <select
                      value={slotBlockSlot}
                      onChange={(e) => setSlotBlockSlot(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', marginTop: '4px', background: 'white' }}
                    >
                      <option value="">-- Choose Slot to Block --</option>
                      {(scheduleData.defaultSlots || []).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleBlockSpecificSlot}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '4px' }}
                  >
                    🔒 Block Slot for this Date
                  </button>
                </div>

                {/* List of custom blocked slots */}
                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald-deep)', display: 'block', marginBottom: '8px' }}>
                    Custom Blocked Slots:
                  </label>
                  {Object.keys(scheduleData.customBlockedSlots || {}).length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No individual slots are currently blocked.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                      {Object.entries(scheduleData.customBlockedSlots || {}).flatMap(([dateKey, slotsArr]) => 
                        slotsArr.map(s => (
                          <div
                            key={`${dateKey}-${s}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: '#FFFBEB',
                              borderRadius: '8px',
                              border: '1px solid #FDE68A'
                            }}
                          >
                            <div>
                              <strong style={{ color: '#92400E', fontSize: '0.85rem' }}>{dateKey}</strong> &bull; <span style={{ fontSize: '0.82rem', color: '#B45309' }}>{s}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUnblockSpecificSlot(dateKey, s)}
                              style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              Unblock
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ASSESSMENT LEADS & DROP-OFF RECOVERY DESK
            ========================================================================= */}
        {activeTab === 'leads' && (
          <div>
            {/* Top Metrics Banner */}
            <div className="admin-metrics-grid" style={{ marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Leads Captured</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-deep)', marginTop: '4px' }}>
                  {leads.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>From welcome popup &amp; assessment</div>
              </div>

              <div style={{ background: '#FFFBEB', padding: '20px', borderRadius: '20px', border: '1px solid #FDE68A', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#92400E', textTransform: 'uppercase', fontWeight: 700 }}>Priority: Finished Quiz, Not Booked</span>
                  <span style={{ background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>Hot Leads</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
                  {leads.filter(l => l.status === 'completed_not_booked').length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '4px' }}>Know their health score; ready for 1-click WhatsApp</div>
              </div>

              <div style={{ background: '#FFF7ED', padding: '20px', borderRadius: '20px', border: '1px solid #FFEDD5', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#9A3412', textTransform: 'uppercase', fontWeight: 700 }}>Mid-Quiz Drop-Offs</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EA580C', marginTop: '4px' }}>
                  {leads.filter(l => l.status === 'in_progress').length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9A3412', marginTop: '4px' }}>Left midway through the assessment questions</div>
              </div>

              <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '20px', border: '1px solid #BBF7D0', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#166534', textTransform: 'uppercase', fontWeight: 700 }}>Booked 1:1 Consultations</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                  {leads.filter(l => l.status === 'booked').length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '4px' }}>Successfully converted into patient appointments</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ background: 'white', padding: '18px 24px', borderRadius: '18px', border: '1px solid var(--border-subtle)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${leadsFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setLeadsFilter('all')}
                >
                  All ({leads.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${leadsFilter === 'completed_not_booked' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setLeadsFilter('completed_not_booked')}
                  style={leadsFilter === 'completed_not_booked' ? { background: '#D97706', borderColor: '#D97706' } : {}}
                >
                  ⭐ Finished Quiz ({leads.filter(l => l.status === 'completed_not_booked').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${leadsFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setLeadsFilter('in_progress')}
                  style={leadsFilter === 'in_progress' ? { background: '#EA580C', borderColor: '#EA580C' } : {}}
                >
                  ⏳ Mid-Quiz Drop-offs ({leads.filter(l => l.status === 'in_progress').length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${leadsFilter === 'booked' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setLeadsFilter('booked')}
                  style={leadsFilter === 'booked' ? { background: '#16A34A', borderColor: '#16A34A' } : {}}
                >
                  ✅ Booked ({leads.filter(l => l.status === 'booked').length})
                </button>
              </div>

              <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
                <input
                  type="text"
                  placeholder="Search lead by name, phone or email..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Leads List / Cards */}
            {loadingLeads ? (
              <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--emerald-deep)', fontWeight: 600 }}>Loading Assessment Leads...</div>
              </div>
            ) : leads.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px dashed var(--border-medium)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
                <h3 style={{ color: 'var(--emerald-deep)', margin: '0 0 8px' }}>No Assessment Leads Yet</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', fontSize: '0.9rem' }}>
                  Whenever a visitor enters their Name and WhatsApp number on the welcome popup or begins the Health Assessment, their data is instantly tracked here for follow-up.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {leads
                  .filter(l => {
                    if (leadsFilter !== 'all' && l.status !== leadsFilter) return false;
                    if (leadsSearch) {
                      const q = leadsSearch.toLowerCase();
                      return (
                        l.name?.toLowerCase().includes(q) ||
                        l.phone?.toLowerCase().includes(q) ||
                        l.email?.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((lead) => {
                    const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                    const waText = encodeURIComponent(
                      `Hello ${lead.name || 'there'}! This is the clinical team at HealthwithReshmi™. We saw that you completed your Functional Health Assessment. Would you like to schedule your 1:1 Consultation with Reshmi Verma to review your personalized protocol?`
                    );
                    const waUrl = `https://wa.me/91${cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10)}?text=${waText}`;

                    return (
                      <div
                        key={lead.id}
                        style={{
                          background: 'white',
                          borderRadius: '18px',
                          padding: '20px 24px',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}
                      >
                        {/* Top Line: Patient Info & Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--emerald-deep)', fontWeight: 700 }}>
                                {lead.name || 'Anonymous Visitor'}
                              </h3>
                              {lead.status === 'completed_not_booked' && (
                                <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ⭐ Quiz Finished • Consultation Not Yet Booked
                                </span>
                              )}
                              {lead.status === 'in_progress' && (
                                <span style={{ background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ⏳ Dropped Off at Step {lead.lastStep || 1} of {lead.totalSteps || 8}
                                </span>
                              )}
                              {lead.status === 'booked' && (
                                <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ✅ Booked 1:1 Consultation
                                </span>
                              )}
                            </div>

                            {/* Contact Details */}
                            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                              <span>📱 <strong>{lead.phone || 'No phone'}</strong></span>
                              <span>✉️ <strong>{lead.email || 'No email'}</strong></span>
                              <span>🕒 {new Date(lead.updatedAt || lead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                          </div>

                          {/* Quick Contact Buttons */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {lead.phone && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                                style={{
                                  background: '#25D366',
                                  color: 'white',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 14px',
                                  borderRadius: '10px'
                                }}
                              >
                                <span>💬 WhatsApp Client</span>
                              </a>
                            )}
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="btn btn-secondary btn-sm"
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontWeight: 600
                                }}
                              >
                                <span>📞 Direct Call</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Mid Section: Assessment Insights & Progress Bar */}
                        <div style={{ background: '#FAF8F5', borderRadius: '12px', padding: '12px 16px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ flex: '1', minWidth: '220px' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                              Assessment Drop-off &amp; Completion Status
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: '1', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${lead.status === 'completed_not_booked' || lead.status === 'booked' ? 100 : Math.round(((lead.lastStep || 1) / (lead.totalSteps || 8)) * 100)}%`,
                                    background: lead.status === 'booked' ? '#16A34A' : lead.status === 'completed_not_booked' ? '#D97706' : '#EA580C',
                                    borderRadius: '4px'
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {lead.status === 'completed_not_booked' || lead.status === 'booked'
                                  ? '100% Completed'
                                  : `Step ${lead.lastStep || 1} / ${lead.totalSteps || 8}`}
                              </span>
                            </div>
                          </div>

                          {lead.assessmentScore && (
                            <div style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                                Calculated Score
                              </div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-deep)' }}>
                                {lead.assessmentScore}%
                              </div>
                            </div>
                          )}

                          {lead.conciseResults && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 12px' }}>
                              Score Level: <strong>{lead.conciseResults.title || 'Evaluated'}</strong>
                            </div>
                          )}
                        </div>

                        {/* Bottom Bar: Follow-up Status Dropdown & Notes */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              Follow-up Status:
                            </label>
                            <select
                              value={lead.followUpStatus || 'pending'}
                              disabled={updatingLeadId === lead.id}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, { followUpStatus: e.target.value })}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: lead.followUpStatus === 'converted' ? '#DCFCE7' : lead.followUpStatus === 'contacted' ? '#EFF6FF' : '#FFFBEB',
                                color: lead.followUpStatus === 'converted' ? '#15803D' : lead.followUpStatus === 'contacted' ? '#1D4ED8' : '#92400E'
                              }}
                            >
                              <option value="pending">⏳ Pending Follow-up</option>
                              <option value="contacted">💬 Contacted via WhatsApp</option>
                              <option value="called">📞 Called Client</option>
                              <option value="converted">✅ Converted to Consultation</option>
                              <option value="not_interested">❌ Not Interested</option>
                            </select>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Lead ID: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{lead.id}</code>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Comprehensive Modal: Clinical Patient Dossier & Report */}
        {selectedPatientReport && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card">
              
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
                <div className="admin-modal-profile-grid">
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
                <div className="admin-modal-session-grid">
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

                    <div className="admin-modal-scores-grid">
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
