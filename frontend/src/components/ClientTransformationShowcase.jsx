import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ClientTransformationShowcase() {
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [currentTime, setCurrentTime] = useState({});
  const [duration, setDuration] = useState({});
  const audioRefs = useRef({});

  const transformations = [
    {
      id: 'dipika',
      name: 'Dipika',
      title: 'Thyroid & Weight Reversal',
      durationTag: '16 Weeks Protocol',
      image: '/assets/images/transformation-dipika.png',
      badge: 'Verified Client'
    },
    {
      id: 'dr-sandeep',
      name: 'Dr. Sandeep Kalra',
      title: 'Metabolic Health & Energy Reset',
      durationTag: '12 Weeks Protocol',
      image: '/assets/images/transformation-dr-sandeep.jpg',
      badge: 'Physician Transformation'
    },
    {
      id: 'kv-dogra',
      name: 'KV Dogra',
      title: 'Visceral Fat & Strength Recovery',
      durationTag: '14 Weeks Protocol',
      image: '/assets/images/transformation-kv-dogra.jpg',
      badge: 'Verified Client'
    },
    {
      id: 'minakshi',
      name: 'Minakshi Surjuse',
      title: 'Gut Motility & Hormonal Balance',
      durationTag: '10 Weeks Protocol',
      image: '/assets/images/transformation-minakshi.jpg',
      badge: 'Verified Client'
    },
    {
      id: 'sonika',
      name: 'Sonika',
      title: 'PCOS & Sustainable Weight Loss',
      durationTag: '18 Weeks Protocol',
      image: '/assets/images/transformation-sonika.jpg',
      badge: 'Verified Client'
    },
    {
      id: 'reshmi',
      name: 'Reshmi Verma (Founder)',
      title: 'Lost 38 kg • Reversed Metabolic Fatigue',
      durationTag: 'Sustained 5+ Years',
      image: '/assets/images/transformation-reshmi-personal.jpg',
      badge: 'Founder Story'
    }
  ];

  // Infinite Marquee needs duplicated items for continuous seamless loop
  const marqueeList = [...transformations, ...transformations];

  const audioTestimonials = [
    {
      id: 'voice-1',
      clientName: 'Client Audio Note 1',
      condition: 'Gut Relief & Chronic Acidity',
      file: '/assets/audio/client-voice-1.mp4',
      quote: '"Reshmi mam ke guidance se meri 3 saal purani acidity aur digestion issue completely heal ho gaya."',
      durationEst: '0:45'
    },
    {
      id: 'voice-2',
      clientName: 'Client Audio Note 2',
      condition: 'Thyroid, Energy & Sleep Quality',
      file: '/assets/audio/client-voice-2.mp4',
      quote: '"Afternoon exhaustion aur brain fog hat gaya. Main ab bina kisi caffeine ya medicines ke active rehti hu."',
      durationEst: '1:12'
    },
    {
      id: 'voice-3',
      clientName: 'Client Audio Note 3',
      condition: 'Sustained Weight & Metabolic Reversal',
      file: '/assets/audio/client-voice-3.mp4',
      quote: '"Bina kisi crash diet ya starvation ke mera weight naturally reduce hua aur inch loss bhi bohot acha mila."',
      durationEst: '1:30'
    },
    {
      id: 'voice-4',
      clientName: 'Client Audio Note 4',
      condition: 'Anxiety & Breathwork Recovery',
      file: '/assets/audio/client-voice-4.mp4',
      quote: '"Oxygen Advantage breathing drills ne meri breathing pattern aur raat ki sleep ko 100% stable kar diya."',
      durationEst: '0:58'
    }
  ];

  const togglePlayAudio = (id) => {
    const currentAudio = audioRefs.current[id];
    if (!currentAudio) return;

    if (playingAudioId === id) {
      currentAudio.pause();
      setPlayingAudioId(null);
    } else {
      // Pause any previously playing audio
      if (playingAudioId && audioRefs.current[playingAudioId]) {
        audioRefs.current[playingAudioId].pause();
      }
      currentAudio.play().catch((err) => console.log('Audio playback notice:', err));
      setPlayingAudioId(id);
    }
  };

  const handleTimeUpdate = (id) => {
    const el = audioRefs.current[id];
    if (el) {
      setCurrentTime((prev) => ({ ...prev, [id]: el.currentTime }));
    }
  };

  const handleLoadedMetadata = (id) => {
    const el = audioRefs.current[id];
    if (el) {
      setDuration((prev) => ({ ...prev, [id]: el.duration }));
    }
  };

  const handleAudioEnded = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="transformation-showcase-section" style={{ background: '#FAF9F6', padding: '80px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: '#EDF6EE',
            color: '#121214',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid #C6DFC9',
            marginBottom: '14px'
          }}>
            <span>Real Patient Breakthroughs</span>
            <span>&bull;</span>
            <span style={{ color: '#FF007F' }}>Before &amp; After Proof</span>
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4.2vw, 2.8rem)',
            color: '#121214',
            fontFamily: 'var(--font-serif)',
            margin: '0 0 16px',
            lineHeight: 1.2,
            fontWeight: 800
          }}>
            Real Transformations. <span style={{ color: '#FF007F', fontStyle: 'italic' }}>Real Stories.</span>
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#4B5563',
            lineHeight: 1.65,
            margin: '0 auto'
          }}>
            Witness the real outcomes of clients who reversed complex hormonal plateaus, stubborn weight, chronic gut inflammation, and metabolic fatigue under Reshmi Verma's clinical guidance.
          </p>
        </div>

      </div>

      {/* 1. Continuous Moving Before & After Infinite Carousel */}
      <div className="transformation-marquee-container">
        <div className="transformation-marquee-track">
          {marqueeList.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="transformation-card-item">
              <div className="transformation-image-wrap">
                <img
                  src={item.image}
                  alt={`${item.name} Before & After Transformation`}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(18, 18, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <span style={{ color: '#FF007F' }}>●</span>
                  <span>{item.badge}</span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0, 229, 217, 0.92)',
                  color: '#111111',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {item.durationTag}
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#121214' }}>
                  {item.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.4 }}>
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '50px' }}>
        <span style={{ fontSize: '0.82rem', color: '#9CA3AF', fontWeight: 600 }}>
          Hover over any card to pause • Continuous verified client transformations
        </span>
      </div>

      {/* 2. Real Client Voice Audio Notes Showcase */}
      <div className="container">
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px 32px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          maxWidth: '1080px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎙️</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#121214' }}>
                  Listen to Real Client Voice Notes
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#6B7280' }}>
                Hear unfiltered audio messages shared directly by clients after their recovery sessions.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F4F5F6', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: '#121214' }}>
              <span style={{ color: '#00E5D9', fontSize: '1rem' }}>🔊</span>
              <span>100% Genuine Audio Feedback</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {audioTestimonials.map((item) => {
              const isPlaying = playingAudioId === item.id;
              const current = currentTime[item.id] || 0;
              const total = duration[item.id] || 0;
              const progressPct = total > 0 ? (current / total) * 100 : 0;

              return (
                <div key={item.id} className="voice-audio-card">
                  {/* Hidden Native Audio Element */}
                  <audio
                    ref={(el) => (audioRefs.current[item.id] = el)}
                    src={item.file}
                    preload="metadata"
                    onTimeUpdate={() => handleTimeUpdate(item.id)}
                    onLoadedMetadata={() => handleLoadedMetadata(item.id)}
                    onEnded={() => handleAudioEnded(item.id)}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#121214' }}>
                        {item.clientName}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#0D827B', fontWeight: 700 }}>
                        {item.condition}
                      </span>
                    </div>

                    {/* Animated Sound Wave Indicator */}
                    {isPlaying ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px' }}>
                        <span className="soundwave-bar" style={{ animationDelay: '0.1s' }}></span>
                        <span className="soundwave-bar" style={{ animationDelay: '0.3s' }}></span>
                        <span className="soundwave-bar" style={{ animationDelay: '0.5s' }}></span>
                        <span className="soundwave-bar" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.74rem', background: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        {item.durationEst}
                      </span>
                    )}
                  </div>

                  {/* Client Quote Snippet */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#4B5563',
                    lineHeight: 1.5,
                    margin: '0 0 16px',
                    fontStyle: 'italic',
                    minHeight: '44px'
                  }}>
                    {item.quote}
                  </p>

                  {/* Audio Controls Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(item.id)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: isPlaying ? '2px solid #FF007F' : 'none',
                        background: isPlaying ? '#FF007F' : '#121214',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isPlaying ? '0 0 12px rgba(255, 0, 127, 0.4)' : 'none',
                        flexShrink: 0
                      }}
                      title={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const ratio = clickX / rect.width;
                          const el = audioRefs.current[item.id];
                          if (el && total > 0) {
                            el.currentTime = ratio * total;
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '6px',
                          background: '#E2E8F0',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPct}%`,
                            height: '100%',
                            background: isPlaying ? 'linear-gradient(90deg, #00E5D9, #FF007F)' : '#00E5D9',
                            borderRadius: '999px',
                            transition: 'width 0.1s linear'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                        <span>{formatSeconds(current)}</span>
                        <span>{total > 0 ? formatSeconds(total) : item.durationEst}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              to="/booking"
              className="btn btn-primary"
              style={{ padding: '12px 28px', borderRadius: '12px', background: '#121214', color: '#FFFFFF', fontWeight: 700 }}
            >
              <span>Begin Your Own Transformation (₹1,999) &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
