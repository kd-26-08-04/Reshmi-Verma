import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBookings = async () => {
    if (!token && !user) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/my-bookings', { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      } else {
        setErrorMsg(data.error || 'Failed to retrieve bookings.');
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setErrorMsg('Error connecting to medical records server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [authLoading, isAuthenticated]);

  return (
    <>
      <main className="dashboard-container" style={{ maxWidth: '1080px', margin: '60px auto 90px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        {/* Client Header Card */}
        <div
          className="client-header-card"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            borderRadius: '26px',
            padding: '36px 40px',
            border: '1px solid rgba(194, 65, 12, 0.16)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <span className="sub-title">Personalized Health Sanctuary</span>
            <h1 style={{ fontSize: '2rem', margin: '4px 0 6px', fontFamily: 'var(--font-serif)', color: 'var(--emerald-deep)' }}>
              Welcome, {user?.name || 'Patient'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              {user?.email} &bull; Clinical Client ID: {user?.id || 'RES-PATIENT'}
            </p>
          </div>
          <div>
            <Link to="/booking" className="btn btn-primary">
              <span>+ Book New Consultation</span>
            </Link>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--emerald-deep)', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Your Consultation Sessions & Intake Status
          </h2>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 14px' }}
            onClick={fetchBookings}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Records'}
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '14px 18px', background: '#FFF1F2', color: '#BE123C', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Loading your consultation sessions from secure database...
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '24px', border: '1.5px dashed rgba(194, 65, 12, 0.25)' }}>
            <h3 style={{ color: 'var(--emerald-deep)', marginBottom: '8px' }}>No Active Consultations Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 20px' }}>
              You don't have any booked consultation sessions yet. Choose a session tier to get started with Reshmi Verma.
            </p>
            <Link to="/booking" className="btn btn-primary">
              <span>Book Your First Session</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((b, idx) => {
              const isIntakeDone = b.questionnaireSubmitted || !!b.questionnaireData;
              return (
                <div
                  key={b.id || idx}
                  className="booking-history-card"
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    padding: '26px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '18px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Ref: {b.id || 'RES-' + idx}
                      </span>
                      <span
                        className="status-badge"
                        style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: b.status === 'confirmed' ? '#DCFCE7' : b.status === 'completed' ? '#EFF6FF' : '#FFFBEB',
                          color: b.status === 'confirmed' ? '#15803D' : b.status === 'completed' ? '#1D4ED8' : '#B45309',
                          border: `1.5px solid ${b.status === 'confirmed' ? '#86EFAC' : b.status === 'completed' ? '#BFDBFE' : '#FDE68A'}`
                        }}
                      >
                        {b.status === 'confirmed' ? '✓ Appointment Accepted' : b.status === 'completed' ? '🌟 Completed' : '⏳ Pending Review'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px', color: 'var(--emerald-deep)' }}>
                      {b.service || b.serviceTier || 'Comprehensive Consultation (60 min)'}
                    </h3>

                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      📅 <strong>{b.date || b.bookingDate || 'Scheduled'}</strong> at <strong>{b.timeSlot || '10:00 AM'}</strong>
                    </p>

                    {b.status === 'confirmed' ? (
                      <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600 }}>
                        <span>✓ Appointment Accepted & Confirmed</span>
                      </div>
                    ) : (
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Status: Awaiting clinic confirmation
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald-deep)', fontFamily: 'var(--font-serif)' }}>
                      ₹{b.amount ? Number(b.amount).toLocaleString('en-IN') : '2,999'}
                    </div>

                    {isIntakeDone ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700 }}>
                        ✓ Clinical Intake Complete
                      </span>
                    ) : (
                      <Link
                        to={`/questionnaire?bookingId=${b.id || ''}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '7px 15px', fontSize: '0.84rem', borderColor: 'var(--emerald-medium)', color: 'var(--emerald-deep)' }}
                      >
                        Fill Intake Form &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
