import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RAZORPAY_PAYMENT_URL } from '../utils/api';

export default function ClientTransformationShowcase() {
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [currentTime, setCurrentTime] = useState({});
  const [duration, setDuration] = useState({});

  const audioRefs = useRef({});

  const transformations = [
    {
      id: 'transformation-1',
      name: 'Client Transformation',
      durationTag: '12 Weeks Protocol',
      image: '/assets/images/transformation-1.jpeg',

    },
    {
      id: 'dipika',
      name: 'Dipika',
      durationTag: '16 Weeks Protocol',
      image: '/assets/images/transformation-dipika.png',
    },
    {
      id: 'dr-sandeep',
      name: 'Dr. Sandeep Kalra',
      durationTag: '12 Weeks Protocol',
      image: '/assets/images/transformation-dr-sandeep.jpg',
    },
    {
      id: 'minakshi',
      name: 'Minakshi Surjuse',
      durationTag: '10 Weeks Protocol',
      image: '/assets/images/transformation-minakshi.jpg',
    },
    {
      id: 'sonika',
      name: 'Sonika',
      durationTag: '18 Weeks Protocol',
      image: '/assets/images/transformation-sonika.jpg',

    },
    {
      id: 'reshmi',
      name: 'Reshmi Verma (Founder)',
      durationTag: 'Sustained 5+ Years',
      image: '/assets/images/transformation-reshmi-personal.jpg',

    }
  ];

  // Infinite Marquee needs duplicated items for continuous seamless loop
  const marqueeList = [...transformations, ...transformations];

  const audioTestimonials = [
    {
      id: 'voice-1',
      condition: 'Acidity & Digestion Healing',
      file: '/assets/audio/client-voice-1.mp4',
    },
    {
      id: 'voice-2',
      condition: 'Sustainable Fat Loss Journey',
      file: '/assets/audio/client-voice-2.mp4',
    },
    {
      id: 'voice-3',
      condition: 'Thyroid & Blood-Work Driven Nutrition',
      file: '/assets/audio/client-voice-3.mp4',
    },
    {
      id: 'voice-4',
      condition: 'Skin & Acne Transformation',
      file: '/assets/audio/client-voice-4.mp4',
    },
    {
      id: 'voice-5',
      condition: 'Diabetes & Metabolic Recovery',
      file: '/assets/audio/client-voice-5.mp3',
    },
    {
      id: 'voice-8',
      condition: 'Weight Loss & Inch Loss Protocol',
      file: '/assets/audio/client-voice-8.mp3',
    },
    {
      id: 'voice-9',
      condition: 'Nutrition Consultation & Motivation',
      file: '/assets/audio/client-voice-9.mp3',
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
      {/* 1. Verified Client Before & After Transformations (Black Strip Theme - End to End) */}
      <section
        className="transformation-showcase-section"
        style={{
          background: '#0D0F12',
          padding: '56px 0 44px',
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden',
          borderTop: '3.5px solid rgb(1, 183, 180)'
        }}
      >
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
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
              Real Transformations. <span style={{ color: 'rgb(1, 183, 180)', fontStyle: 'italic' }}>Real Stories.</span>
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.65,
                margin: '0 auto'
              }}
            >
              Every before-and-after reflects a unique journey, consistent effort, and the progress clients have made towards their health and wellness goals.            </p>
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
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderTop: '3px solid rgb(1, 183, 180)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
                }}
              >
                <div className="transformation-image-wrap">
                  <img
                    src={item.image}
                    alt={`${item.name} Before & After Transformation`}
                    loading="lazy"
                  />
                </div>

                <div style={{ padding: '16px 18px', background: '#16191d17' }}>
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
      </section>

      {/* 2. Real Client Voice Audio Notes Showcase (Separate Clean Light Section) */}
      <section
        className="section client-voice-section"
        style={{
          padding: '60px 0'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto 36px'
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                  color: '#121214',
                  fontFamily: 'var(--font-serif)',
                  margin: '0 0 12px',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                <span style={{ color: 'rgb(1, 183, 180)', fontStyle: 'italic' }}>Hear It From Them..</span>
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#4B5563',
                  lineHeight: 1.6,
                  margin: '0 auto',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                Listen to our clients share their experiences with our programmes and personalised approach to health.
              </p>
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
                          {item.condition}
                        </h4>
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

                    {/* Audio Controls Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FAF8F5',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: '1px solid var(--border-subtle)',
                        marginTop: 'auto'
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

            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <a
                href={RAZORPAY_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{
                  padding: '14px 34px',
                  borderRadius: '14px'
                }}
              >
                <span>Book 1:1 Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
