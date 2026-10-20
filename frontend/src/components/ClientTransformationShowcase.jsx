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
    <>
      {/* 1. Verified Client Before & After Transformations (Black Strip Theme) */}
      <section
        className="transformation-showcase-section"
        style={{
          background: '#0D0F12',
          padding: '70px 0 55px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                marginBottom: '14px'
              }}
            >
              <span>Real Patient Breakthroughs</span>
              <span>&bull;</span>
              <span style={{ color: '#00E5D9' }}>Before &amp; After Proof</span>
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 2.7rem)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                margin: '0 0 14px',
                lineHeight: 1.2,
                fontWeight: 800
              }}
            >
              Real Transformations. <span style={{ color: '#00E5D9', fontStyle: 'italic' }}>Real Stories.</span>
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.65,
                margin: '0 auto'
              }}
            >
              Witness the real outcomes of clients who reversed complex hormonal plateaus, stubborn weight, chronic gut inflammation, and metabolic fatigue under Reshmi Verma's clinical guidance.
            </p>
          </div>
        </div>

        {/* Continuous Moving Before & After Infinite Carousel */}
        <div className="transformation-marquee-container">
          <div className="transformation-marquee-track">
            {marqueeList.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="transformation-card-item"
                style={{
                  background: '#16191D',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
                }}
              >
                <div className="transformation-image-wrap">
                  <img
                    src={item.image}
                    alt={`${item.name} Before & After Transformation`}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(10, 14, 18, 0.88)',
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
                      border: '1px solid rgba(255, 255, 255, 0.22)'
                    }}
                  >
                    <span style={{ color: '#FF007F' }}>●</span>
                    <span>{item.badge}</span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(0, 229, 217, 0.95)',
                      color: '#0A0E0C',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(0, 229, 217, 0.35)'
                    }}
                  >
                    {item.durationTag}
                  </div>
                </div>

                <div style={{ padding: '16px 18px', background: '#16191D' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {item.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
            Hover over any card to pause • Continuous verified client transformations
          </span>
        </div>
      </section>

      {/* 2. Real Client Voice Audio Notes Showcase (Separate Clean Light Section) */}
      <section
        className="section client-voice-section"
        style={{
          background: '#FAF8F5',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '70px 0'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '32px'
              }}
            >
              <div>
                <span
                  className="badge-pill"
                  style={{
                    marginBottom: '10px',
                    fontSize: '0.78rem',
                    background: 'var(--emerald-soft)',
                    color: 'var(--emerald-deep)',
                    borderColor: 'rgba(46, 196, 182, 0.3)'
                  }}
                >
                  <span>🎙️ Verified Client Audio Notes</span>
                </span>
                <h3
                  style={{
                    margin: '6px 0 8px',
                    fontSize: '2.1rem',
                    fontWeight: 800,
                    color: 'var(--emerald-deep)',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  Hear Directly From Our Clients
                </h3>
                <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-secondary)' }}>
                  Unfiltered voice feedback shared after finishing their personalized health protocols.
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(46, 196, 182, 0.4)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--emerald-deep)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span style={{ color: '#00BFA5' }}>🔊</span>
                <span>100% Genuine Recorded Feedback</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}
            >
              {audioTestimonials.map((item) => {
                const isPlaying = playingAudioId === item.id;
                const current = currentTime[item.id] || 0;
                const total = duration[item.id] || 0;
                const progressPct = total > 0 ? (current / total) * 100 : 0;

                return (
                  <div
                    key={item.id}
                    className="voice-audio-card"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: '4px solid #00BFA5',
                      padding: '24px 22px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Hidden Native Audio Element */}
                    <audio
                      ref={(el) => (audioRefs.current[item.id] = el)}
                      src={item.file}
                      preload="metadata"
                      onTimeUpdate={() => handleTimeUpdate(item.id)}
                      onLoadedMetadata={() => handleLoadedMetadata(item.id)}
                      onEnded={() => handleAudioEnded(item.id)}
                    />

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '1.02rem',
                            fontWeight: 800,
                            color: 'var(--emerald-deep)'
                          }}
                        >
                          {item.clientName}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: '#008B82', fontWeight: 700 }}>
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
                        <span
                          style={{
                            fontSize: '0.74rem',
                            background: 'var(--sand-cream)',
                            color: 'var(--text-secondary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {item.durationEst}
                        </span>
                      )}
                    </div>

                    {/* Client Quote Snippet */}
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.55,
                        margin: '0 0 18px',
                        fontStyle: 'italic',
                        flexGrow: 1
                      }}
                    >
                      {item.quote}
                    </p>

                    {/* Audio Controls Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FAF8F5',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => togglePlayAudio(item.id)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#00E5D0',
                          color: '#0A0E0C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(0, 229, 208, 0.35)',
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
                            background: 'rgba(0, 0, 0, 0.1)',
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
                              background: '#00BFA5',
                              borderRadius: '999px',
                              transition: 'width 0.1s linear'
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '4px',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600
                          }}
                        >
                          <span>{formatSeconds(current)}</span>
                          <span>{total > 0 ? formatSeconds(total) : item.durationEst}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <Link
                to="/booking"
                className="btn btn-primary btn-lg"
                style={{
                  padding: '14px 34px',
                  borderRadius: '14px'
                }}
              >
                <span>Book 1:1 Consultation &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
