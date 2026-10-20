import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Initial curated video masterclasses - user can provide their own links to easily replace or append
  const videoLibrary = [
    {
      id: 'gut-sibo-masterclass',
      title: 'How Leaky Gut & SIBO Trigger Chronic Fatigue & Brain Fog',
      category: 'gut',
      categoryLabel: 'Gut & Microbiome',
      duration: '18:45',
      youtubeId: 'dQw4w9WgXcQ', // Placeholder until user provides exact link
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/mucosal-barrier.png',
      summary: 'Explore the biological link between mucosal breakdown, systemic LPS endotoxemia, and why normal blood tests fail to identify chronic bloating and lethargy.',
      views: '12K Views',
      badge: 'Featured Masterclass'
    },
    {
      id: 'bolt-score-reversal',
      title: 'Oxygen Advantage®: How Low BOLT Score Starves Your Organs of Oxygen',
      category: 'breathwork',
      categoryLabel: 'Oxygen Advantage®',
      duration: '14:20',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/breathing-lungs.png',
      summary: 'Clinical explanation of the Bohr Effect, why chronic chest breathing dumps essential CO₂, and how nasal rehabilitation reverses afternoon crashes.',
      views: '9.4K Views',
      badge: 'Clinical Protocol'
    },
    {
      id: 'thyroid-metabolism-guide',
      title: 'Hypothyroidism, PCOS & Weight Plateaus: Beyond Calorie Deficits',
      category: 'metabolism',
      categoryLabel: 'Hormonal & Thyroid',
      duration: '22:15',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/transformation-reshmi-personal.jpg',
      summary: 'Why starvation diets backfire on thyroid conversion (T4 to T3) and how targeted cellular micronutrition restored Reshmi’s personal 38 kg metabolic reversal.',
      views: '15K Views',
      badge: 'Founder Insight'
    },
    {
      id: 'gut-brain-vagus-nerve',
      title: 'The Vagus Nerve Reset: Calming Anxiety, Acid Reflux & Gut Spasms',
      category: 'breathwork',
      categoryLabel: 'Oxygen Advantage®',
      duration: '12:30',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/transformation-kv-dogra.jpg',
      summary: 'Learn diaphragmatic vagal pacing to shift from sympathetic fight-or-flight into restorative parasympathetic rest-and-digest within 3 minutes.',
      views: '8.1K Views',
      badge: 'Interactive Drills'
    },
    {
      id: 'fatty-liver-insulin',
      title: 'Reversing Fatty Liver & Insulin Resistance Without Extreme Starvation',
      category: 'metabolism',
      categoryLabel: 'Metabolic Reversal',
      duration: '16:50',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/transformation-dr-sandeep.jpg',
      summary: 'A look at visceral fat deposition, lipid markers beyond cholesterol, and evidence-based clinical protocols that physician clients followed.',
      views: '11K Views',
      badge: 'Physician Case Study'
    },
    {
      id: 'food-sensitivities-elimination',
      title: 'Food Sensitivities vs Real Root Cause: Why Eliminating Foods Isn’t Enough',
      category: 'gut',
      categoryLabel: 'Gut & Microbiome',
      duration: '15:10',
      youtubeId: 'dQw4w9WgXcQ',
      youtubeUrl: 'https://www.youtube.com/',
      thumbnail: '/assets/images/transformation-minakshi.jpg',
      summary: 'Why cutting dairy, gluten, and histamines only suppresses symptoms temporarily without resolving secretor status and epithelial junction integrity.',
      views: '7.8K Views',
      badge: 'Root-Cause Science'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Videos' },
    { key: 'gut', label: 'Gut & Microbiome' },
    { key: 'breathwork', label: 'Oxygen Advantage® & Breath' },
    { key: 'metabolism', label: 'Metabolism & Hormones' }
  ];

  const filteredVideos = activeCategory === 'all'
    ? videoLibrary
    : videoLibrary.filter(v => v.category === activeCategory);

  return (
    <main className="section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '90px', background: '#FAF9F6' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>

        {/* Hero Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: '#121214',
            color: '#00E5D9',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
          }}>
            <span>🎥</span>
            <span>Clinical Video Masterclasses &bull; Reshmi Verma</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
            color: 'var(--emerald-deep)',
            fontFamily: 'var(--font-serif)',
            margin: '0 0 16px',
            lineHeight: 1.15,
            fontWeight: 800
          }}>
            Evidence-Based Health <span style={{ color: '#FF007F', fontStyle: 'italic' }}>Masterclasses</span>
          </h1>

          <p style={{
            fontSize: '1.08rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 auto'
          }}>
            Deep dives into functional biochemistry, gut mucosa regeneration, Oxygen Advantage® breathing mechanics, and real metabolic transformation protocols by Reshmi Verma.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '38px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '9px 20px',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                border: activeCategory === cat.key ? '1.5px solid #121214' : '1.5px solid var(--border-medium)',
                background: activeCategory === cat.key ? '#121214' : '#FFFFFF',
                color: activeCategory === cat.key ? '#00E5D9' : 'var(--text-secondary)',
                boxShadow: activeCategory === cat.key ? '0 6px 18px rgba(18, 18, 20, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px',
          marginBottom: '60px'
        }}>
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Video Thumbnail Wrapper */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
                  background: '#0F172A',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.85) contrast(1.05)',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />

                {/* Dark Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)'
                }}></div>

                {/* Top Badges */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: 'rgba(18, 18, 20, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#00E5D9',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    border: '1px solid rgba(0, 229, 217, 0.3)'
                  }}>
                    {video.badge}
                  </span>

                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {video.duration}
                  </span>
                </div>

                {/* Centered Circular Play Button */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FF0000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255, 0, 0, 0.45)',
                  transition: 'transform 0.2s ease'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>

                {/* Bottom View Counter */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  <span>▶ {video.views}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '0.78rem',
                  color: '#0D9488',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  {video.categoryLabel}
                </span>

                <h3 style={{
                  fontSize: '1.15rem',
                  color: 'var(--emerald-deep)',
                  fontWeight: 800,
                  margin: '0 0 10px',
                  lineHeight: 1.35
                }}>
                  {video.title}
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  margin: '0 0 18px',
                  flex: 1
                }}>
                  {video.summary}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  marginTop: 'auto'
                }}>
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(video)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--emerald-primary)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: 0
                    }}
                  >
                    <span>Watch Masterclass</span>
                    <span>&rarr;</span>
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      color: '#DC2626',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal (When clicked, plays right on the site) */}
        {selectedVideo && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10, 14, 18, 0.88)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '860px',
                background: '#121214',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ✕
              </button>

              {/* Video Embed Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.78rem', color: '#00E5D9', fontWeight: 800, textTransform: 'uppercase' }}>
                  {selectedVideo.categoryLabel}
                </span>
                <h3 style={{ margin: '4px 0 0', color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>
                  {selectedVideo.title}
                </h3>
              </div>

              {/* Video Player Container */}
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000000' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
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

              {/* Video Modal Footer */}
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '580px' }}>
                  {selectedVideo.summary}
                </p>
                <Link
                  to="/booking"
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: '#00E5D9',
                    color: '#121214',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    textDecoration: 'none'
                  }}
                >
                  Book 1:1 Consultation &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Consultation Roadblock */}
        <div style={{
          padding: '40px 32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0A0E0C 0%, #17261E 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', margin: '0 0 10px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
            Have Questions About Your Symptoms?
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '620px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Connect with Reshmi Verma in a dedicated 60-minute 1-on-1 Health Clarity Session to analyze your blood biomarkers, gut symptoms, and breathing mechanics.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/booking"
              className="btn btn-primary"
              style={{ padding: '13px 28px', background: '#00E5D9', color: '#121214', fontWeight: 800, borderRadius: '12px' }}
            >
              Book 1:1 Health Clarity Consultation &rarr;
            </Link>
            <Link
              to="/assessment"
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Take Free Health Assessment
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
