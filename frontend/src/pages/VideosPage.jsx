import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RAZORPAY_PAYMENT_URL } from '../utils/api';

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Curated YouTube videos - concise clinical summaries, zero external thumbnail required
  const videoLibrary = [
    // --- FULL CLINICAL MASTERCLASSES (16:9 Format) ---
    {
      id: 'video-478-breathing',
      type: 'masterclass',
      title: '4-7-8 Breathing Exercise for Stress & Sleep',
      category: 'breathwork',
      categoryLabel: 'Oxygen Advantage® & Breath',
      duration: '10:30',
      youtubeId: 'EQP9TE04bvQ',
      youtubeUrl: 'https://youtu.be/EQP9TE04bvQ?si=cAJWg2l1IxtDaAaC',
      summary: '4-7-8 breathing to activate the vagus nerve, lower cortisol, and trigger deep sleep.',
      badge: 'Masterclass',
      views: '478+ Views'
    },
    {
      id: 'video-432hz-sleep-music',
      type: 'masterclass',
      title: 'Sleep Music 432 Hz Frequency 🌙',
      category: 'sound-sleep',
      categoryLabel: 'Sound Therapy & Sleep',
      duration: '6:55',
      youtubeId: 'HC-ebB_xA0Y',
      youtubeUrl: 'https://youtu.be/HC-ebB_xA0Y?si=Qrg5qm2IsaySpfRK',
      summary: 'Tuned 432 Hz sound frequency to calm beta brainwaves and induce deep rest.',
      badge: 'Sound Healing',
      views: '11K+ Views'
    },

    // --- CLINICAL YOUTUBE SHORTS (9:16 Format) ---
    {
      id: 'short-box-breathing',
      type: 'short',
      title: '4-4-4-4 Box Breathing Drill',
      category: 'breathwork',
      categoryLabel: 'Oxygen Advantage® & Breath',
      duration: '1 min',
      youtubeId: 'V4ZTrkQEqrM',
      youtubeUrl: 'https://youtube.com/shorts/V4ZTrkQEqrM?si=lsj_O8Rr1khXiWlB',
      summary: 'Square breathing drill to halt acute panic and regain mental clarity in 60s.',
      badge: 'Vagal Reset',
      views: 'Viral'
    },
    {
      id: 'short-rajgira-ladoo',
      type: 'short',
      title: 'Viral Rajgira Motichoor Ladoo',
      category: 'nutrition',
      categoryLabel: 'Nutrition & Swaps',
      duration: '1 min',
      youtubeId: 'QwXDQP1slMw',
      youtubeUrl: 'https://youtube.com/shorts/QwXDQP1slMw?si=tjTUqNFnKCIWJuCt',
      summary: 'Guilt-free puffed Amaranth ladoo with plant protein and zero refined sugar.',
      badge: 'Healthy Swap',
      views: 'Recipe'
    },
    {
      id: 'short-best-cheese',
      type: 'short',
      title: 'Best Cheese In India for Gut',
      category: 'gut',
      categoryLabel: 'Gut & Microbiome',
      duration: '1 min',
      youtubeId: 'dz6K34QkZ-k',
      youtubeUrl: 'https://youtube.com/shorts/dz6K34QkZ-k?si=iakKSW1sZHE2rGzr',
      summary: 'Processed vs aged cheese: Choosing gut-friendly options without bloating.',
      badge: 'Gut Guide',
      views: 'Clinical'
    },
    {
      id: 'short-society-diet',
      type: 'short',
      title: 'Society vs Your Diet Boundaries',
      category: 'mindset',
      categoryLabel: 'Mindset & Habits',
      duration: '1 min',
      youtubeId: 'yJi6C0sUpro',
      youtubeUrl: 'https://youtube.com/shorts/yJi6C0sUpro?si=qE1zR1oYOzu7vNEi',
      summary: 'How to manage social peer pressure and protect your healing journey.',
      badge: 'Mindset',
      views: 'Insight'
    },
    {
      id: 'short-food-crisis',
      type: 'short',
      title: 'The Food Crisis & The 4F Threat',
      category: 'metabolism',
      categoryLabel: 'Metabolic Health',
      duration: '1 min',
      youtubeId: 'WO-7u7sgccU',
      youtubeUrl: 'https://youtube.com/shorts/WO-7u7sgccU?si=qmnGiFZdaZO2dFqg',
      summary: 'How ultra-processed factory foods trigger metabolic resistance and fatigue.',
      badge: 'Root Cause',
      views: '4F Threat'
    },
    {
      id: 'short-528hz-frequency',
      type: 'short',
      title: '528 Hz Healing Frequency',
      category: 'sound-sleep',
      categoryLabel: 'Sound Therapy & Sleep',
      duration: '1 min',
      youtubeId: 'QD2yfWdU9rA',
      youtubeUrl: 'https://youtube.com/shorts/QD2yfWdU9rA?si=_8fYB1T4HYP6O_C_',
      summary: 'Solfeggio 528 Hz frequency for cellular stress release and nervous calm.',
      badge: 'Solfeggio',
      views: 'Harmonic'
    },
    {
      id: 'short-seeds-benefits',
      type: 'short',
      title: 'How to Eat Seeds for Max Benefits',
      category: 'nutrition',
      categoryLabel: 'Nutrition & Swaps',
      duration: '1 min',
      youtubeId: 'joLFGimDqEs',
      youtubeUrl: 'https://youtube.com/shorts/joLFGimDqEs?si=wLW9cjtF03lc5swC',
      summary: 'Why soaking and roasting seeds is vital to prevent gut irritation.',
      badge: 'Bioavailable',
      views: 'Guide'
    },
    {
      id: 'short-soothing-music',
      type: 'short',
      title: 'Soothing Acoustic Music for Calm',
      category: 'sound-sleep',
      categoryLabel: 'Sound Therapy & Sleep',
      duration: '1 min',
      youtubeId: '6snR2Uj_fbM',
      youtubeUrl: 'https://youtube.com/shorts/6snR2Uj_fbM?si=iwuL7XbUEawmw3E9',
      summary: 'Gentle acoustic soundscape to soothe fight-or-flight and ease tension.',
      badge: 'Relaxation',
      views: 'Peaceful'
    },
    {
      id: 'short-healthy-hair',
      type: 'short',
      title: 'Root Secrets for Healthy Hair',
      category: 'metabolism',
      categoryLabel: 'Metabolic & Vitality',
      duration: '1 min',
      youtubeId: '-_lMmV1gIlM',
      youtubeUrl: 'https://youtube.com/shorts/-_lMmV1gIlM?si=BxnkYxR72aCy6Asc',
      summary: 'Targeting internal ferritin and scalp microcirculation for strong hair.',
      badge: 'Inside Out',
      views: 'Vitality'
    },
    {
      id: 'short-do-you-bloat',
      type: 'short',
      title: 'Do You Bloat? Real Root Causes',
      category: 'gut',
      categoryLabel: 'Gut & Microbiome',
      duration: '1 min',
      youtubeId: 'F5Ivcy_SACA',
      youtubeUrl: 'https://youtube.com/shorts/F5Ivcy_SACA?si=4Bd3vX7MpNjibSCO',
      summary: 'Why post-meal bloat points to low stomach acid or digestive motility issues.',
      badge: 'Gut Health',
      views: 'Clinical'
    }
  ];


  // Filtered List (Search-only, category filter pills removed)
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videoLibrary;
    const q = searchQuery.toLowerCase();
    return videoLibrary.filter((video) =>
      video.title.toLowerCase().includes(q) ||
      video.summary.toLowerCase().includes(q) ||
      video.categoryLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const masterclasses = filteredVideos.filter(v => v.type === 'masterclass');
  const shorts = filteredVideos.filter(v => v.type === 'short');

  return (
    <main className="section videos-page-main" style={{ minHeight: '100vh', background: '#FAFCFB' }}>
      {/* Mobile-Responsive Scoped Stylesheet */}
      <style>{`
        .videos-page-main {
          padding-top: 100px;
          padding-bottom: 70px;
        }
        .videos-hero-title {
          font-size: clamp(1.85rem, 4vw, 2.7rem);
        }
        .videos-filter-bar {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .masterclasses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
          gap: 22px;
        }
        .shorts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
          gap: 18px;
        }
        .videos-bottom-cta {
          padding: 34px 28px;
          border-radius: 20px;
        }
        .videos-bottom-cta-btns {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Mobile Phone Screens (≤ 768px) */
        @media (max-width: 768px) {
          .videos-page-main {
            padding-top: 80px !important;
            padding-bottom: 50px !important;
          }
          .videos-hero-badge {
            font-size: 0.74rem !important;
            padding: 4px 12px !important;
          }
          .videos-hero-title {
            font-size: 1.75rem !important;
            margin-bottom: 8px !important;
          }
          .videos-hero-desc {
            font-size: 0.90rem !important;
            line-height: 1.45 !important;
          }
          .videos-filter-wrapper {
            padding: 12px 14px !important;
            border-radius: 14px !important;
            margin-bottom: 22px !important;
          }
          /* Native Horizontal App-style Slider for Pills on Mobile */
          .videos-filter-bar {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            padding-bottom: 6px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .videos-filter-bar::-webkit-scrollbar {
            display: none;
          }
          .videos-filter-btn {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
            padding: 6px 12px !important;
            font-size: 0.76rem !important;
          }
          .masterclasses-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .shorts-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)) !important;
            gap: 14px !important;
          }
          .videos-bottom-cta {
            padding: 26px 18px !important;
            border-radius: 16px !important;
          }
          .videos-bottom-cta h2 {
            font-size: 1.4rem !important;
          }
          .videos-bottom-cta p {
            font-size: 0.88rem !important;
            margin-bottom: 16px !important;
          }
          .videos-bottom-cta-btns {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .videos-bottom-cta-btns a {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            text-align: center !important;
            padding: 10px 8px !important;
            font-size: 0.82rem !important;
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
            overflow: hidden !important;
            border-radius: 10px !important;
          }
        }

        /* Small Phones (≤ 480px) */
        @media (max-width: 480px) {
          .shorts-grid {
            grid-template-columns: 1fr !important;
          }
          .videos-card {
            border-radius: 14px !important;
          }
          .videos-modal-overlay {
            padding: 8px !important;
          }
          .videos-modal-content {
            border-radius: 16px !important;
            max-height: 94vh !important;
          }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* Hero Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 24px' }}>
          <div className="videos-hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '999px',
            background: '#121214',
            color: 'rgb(1, 183, 180)',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            <span>🎥</span>
            <span>Clinical Video Library &bull; Reshmi Verma</span>
          </div>

          <h1 className="videos-hero-title" style={{
            color: 'var(--emerald-deep)',
            fontFamily: 'var(--font-serif)',
            margin: '0 0 10px',
            lineHeight: 1.2,
            fontWeight: 800
          }}>
            Health <span style={{ color: '#0D9488', fontStyle: 'italic' }}>Masterclasses & Shorts</span>
          </h1>

          <p className="videos-hero-desc" style={{
            fontSize: '0.98rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: '0 auto'
          }}>
            Watch clinically guided breathwork sessions, sound frequencies, and gut protocols.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="videos-filter-wrapper" style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          marginBottom: '26px'
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos (e.g. breathing, sleep, bloat, ladoo)..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 40px',
                borderRadius: '999px',
                border: '1.5px solid var(--border-medium)',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#F8FAFC',
                color: 'var(--text-primary)'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>


        </div>

        {/* Results Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          padding: '0 4px',
          fontSize: '0.82rem'
        }}>
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-medium)',
            marginBottom: '32px'
          }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, margin: '0 0 6px' }}>
              No videos found
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Try searching for "breathing", "sleep", "bloating", or click All.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                background: '#121214',
                color: 'rgb(1, 183, 180)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* SECTION 1: MASTERCLASSES (16:9 Widescreen) */}
        {masterclasses.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '1.2rem',
              color: 'var(--emerald-deep)',
              margin: '0 0 14px',
              fontFamily: 'var(--font-serif)',
              fontWeight: 800
            }}>
              Masterclasses (Full Sessions)
            </h2>

            <div className="masterclasses-grid">
              {masterclasses.map((video) => (
                <div
                  key={video.id}
                  className="card videos-card"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* YouTube Embed Container (16:9) */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                    background: '#0F172A'
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&color=white`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.70rem', color: '#0D9488', fontWeight: 800, textTransform: 'uppercase' }}>
                        {video.badge}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                        ⏱ {video.duration}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', color: 'var(--emerald-deep)', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.3 }}>
                      {video.title}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 12px', flex: 1 }}>
                      {video.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--emerald-primary)',
                          fontWeight: 700,
                          fontSize: '0.80rem',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Theater View ⛶
                      </button>

                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.78rem',
                          color: '#0D9488',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        YouTube ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SHORTS (9:16 Portrait) */}
        {shorts.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.2rem',
              color: 'var(--emerald-deep)',
              margin: '0 0 14px',
              fontFamily: 'var(--font-serif)',
              fontWeight: 800
            }}>
              Clinical Shorts & Quick Protocols
            </h2>

            <div className="shorts-grid">
              {shorts.map((video) => (
                <div
                  key={video.id}
                  className="card videos-card"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* YouTube Shorts Player */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '135%', // Mobile-optimized vertical height
                    background: '#0F172A'
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&color=white`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#0D9488', fontWeight: 800, textTransform: 'uppercase' }}>
                        {video.badge}
                      </span>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0D9488', background: 'rgba(13, 148, 136, 0.1)', padding: '1px 5px', borderRadius: '4px' }}>
                        ⚡ Short
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.94rem', color: 'var(--emerald-deep)', fontWeight: 800, margin: '0 0 5px', lineHeight: 1.3 }}>
                      {video.title}
                    </h3>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px', flex: 1 }}>
                      {video.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--emerald-primary)',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Theater ⛶
                      </button>

                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          color: '#0D9488',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        Shorts ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Theater Modal (Optimized for Mobile Height & Touch) */}
        {selectedVideo && (
          <div
            className="videos-modal-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10, 14, 18, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              overflowY: 'auto'
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="videos-modal-content"
              style={{
                width: '100%',
                maxWidth: selectedVideo.type === 'short' ? '400px' : '820px',
                background: '#121214',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                position: 'relative',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.22)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                ✕
              </button>

              {/* Modal Header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.70rem', color: 'rgb(1, 183, 180)', fontWeight: 800, textTransform: 'uppercase' }}>
                  {selectedVideo.categoryLabel}
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, paddingRight: '36px', lineHeight: 1.3 }}>
                  {selectedVideo.title}
                </h3>
              </div>

              {/* Responsive Embed Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: selectedVideo.type === 'short' ? '135%' : '56.25%',
                background: '#000000',
                flexShrink: 0
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                background: '#16181D'
              }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '420px', lineHeight: 1.4 }}>
                  {selectedVideo.summary}
                </p>
                <a
                  href={RAZORPAY_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgb(1, 183, 180)',
                    color: '#121214',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    textDecoration: 'none'
                  }}
                >
                  Book 1:1 Session &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Consultation Roadblock */}
        <div className="videos-bottom-cta" style={{
          background: 'linear-gradient(135deg, #0A0E0C 0%, #17261E 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', margin: '0 0 8px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
            Have Questions About Your Symptoms?
          </h2>
          <p style={{ fontSize: '0.90rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '560px', margin: '0 auto 18px', lineHeight: 1.5 }}>
            Book a 1-on-1 Health Clarity Session with Reshmi Verma to analyze your blood biomarkers, gut symptoms, and breathing mechanics.
          </p>
          <div className="videos-bottom-cta-btns">
            <a
              href={RAZORPAY_PAYMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '11px 22px', background: 'rgb(1, 183, 180)', color: '#121214', fontWeight: 800, borderRadius: '10px', fontSize: '0.86rem' }}
            >
              Book 1:1 Consultation
            </a>
            <Link
              to="/assessment"
              style={{
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.84rem'
              }}
            >
              Free Assessment
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
