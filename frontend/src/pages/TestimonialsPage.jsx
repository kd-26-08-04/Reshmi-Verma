import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RAZORPAY_PAYMENT_URL } from '../utils/api';
import ClientTransformationShowcase from '../components/ClientTransformationShowcase';

// Helper function to extract clean YouTube Embed URL from any YouTube link format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();

  // If already an embed url
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Match youtube watch URL, youtu.be, shorts, or embed URL
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }

  // If pure 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?rel=0&modestbranding=1`;
  }

  return trimmed;
};

export default function TestimonialsPage() {

  // =========================================================================
  // 🎥 3 CLIENT VIDEO TESTIMONIALS (YOUTUBE VIDEOS)
  // 💡 Aap yahan niche apni YouTube video links (youtubeUrl) direct daal sakte hain!
  // Any YouTube link works: https://www.youtube.com/watch?v=..., https://youtu.be/..., https://youtube.com/shorts/...
  // =========================================================================
  const videoTestimonials = [
    {
      id: 1,
      youtubeUrl: 'https://youtube.com/shorts/-dU93I_ABaA?feature=share',
      title: 'Real Patient Recovery Journey',

    },
    {
      id: 2,
      youtubeUrl: 'https://youtube.com/shorts/EPUG9oP0S_Y?feature=share',
      title: 'Clinical Transformation Experience',

    },
    {
      id: 3,
      youtubeUrl: 'https://youtube.com/shorts/drNdbF5r_lc?feature=share',
      title: 'Root-Cause Healing Testimonial',

    }
  ];


  const stories = [
    {
      id: 1,
      category: 'hormones',
      name: 'Vartika Sharma',
      city: 'Bangalore',
      avatar: '/assets/images/real-patient-vartika.jpg',
      condition: "Hashimoto's & Low Energy",
      recoveryTime: '8 Weeks',
      stars: 5,
      headline: 'My brain fog is gone and energy is back.',
      story: "I used to feel completely exhausted by 3 PM every day because of thyroid issues. Reshmi mam adjusted my diet and guided me step-by-step. Within 8 weeks, my energy levels are back to normal and I feel active again.",
      protocolPillars: ['Gut-Thyroid Diet', 'Energy Routine', 'Breathwork']
    },
    {
      id: 2,
      category: 'gut',
      name: 'Simrat Kaur',
      city: 'Ludhiana',
      avatar: '/assets/images/real-patient-simrat.jpg',
      condition: 'Chronic Bloating & Digestion',
      recoveryTime: '6 Weeks',
      stars: 5,
      headline: 'Fixed my bloating without extreme diets.',
      story: "I was dealing with severe bloating and gas after almost every meal. Reshmi mam's simple food swaps and meal timings solved my issue in just 6 weeks. No crash diets, just realistic healthy eating.",
      protocolPillars: ['Digestive Timing', 'Natural Food Swaps', 'Gut Recovery']
    },
    {
      id: 3,
      category: 'breath',
      name: 'Pranav Nair',
      city: 'New Delhi',
      avatar: '/assets/images/real-patient-pranav.jpg',
      condition: 'Anxiety & Disturbed Sleep',
      recoveryTime: '4 Weeks',
      stars: 5,
      headline: 'Sleeping soundly through the night now.',
      story: "I used to wake up anxious with shallow chest breathing at night. Learning the Oxygen Advantage nasal breathing drills from Reshmi mam completely changed my sleep quality. I wake up fresh every single morning.",
      protocolPillars: ['Nasal Breathing', 'Sleep Routine', 'Stress Relief']
    },
    {
      id: 4,
      category: 'gut',
      name: 'Shoaib Ansari',
      city: 'Ahmednagar',
      avatar: '/assets/images/real-patient-shoaib.jpg',
      condition: 'Acidity & Severe Reflux',
      recoveryTime: '6 Weeks',
      stars: 5,
      headline: 'Off daily antacids after almost 3 years.',
      story: "Taking antacids was my daily routine for 3 years. Reshmi mam identified the root foods causing my acidity and helped heal my stomach. I have zero reflux now and eat comfortably without fear.",
      protocolPillars: ['Acidity Protocol', 'Food Triggers Plan', 'Gentle Digestion']
    },
    {
      id: 5,
      category: 'weight',
      name: 'Ananya Patel',
      city: 'Mumbai',
      avatar: null,
      initials: 'AP',
      avatarColor: '#DB2777',
      condition: 'PCOD & Stubborn Weight',
      recoveryTime: '10 Weeks',
      stars: 5,
      headline: 'Periods regularized and lost 6 kg naturally.',
      story: "I struggled with irregular cycles and stubborn weight for years. Reshmi mam's food plate structure was easy to follow even with my busy corporate job. My cycle is now on time and I feel so much lighter.",
      protocolPillars: ['Hormonal Balance', 'Plate Method', 'Cycle Care']
    },
    {
      id: 6,
      category: 'hormones',
      name: 'Sunita Mehta',
      city: 'Gurugram',
      avatar: null,
      initials: 'SM',
      avatarColor: '#059669',
      condition: 'Hot Flashes & Poor Sleep',
      recoveryTime: '8 Weeks',
      stars: 5,
      headline: 'Peaceful sleep after months of restless nights.',
      story: "Perimenopause hot flashes made it impossible to sleep properly. With Reshmi mam's dietary guidance and calming breathing drills, my hot flashes dropped drastically and I finally get uninterrupted rest.",
      protocolPillars: ['Hormone Support', 'Evening Routine', 'Vagal Calming']
    },
    {
      id: 7,
      category: 'weight',
      name: 'Rohit Malhotra',
      city: 'Pune',
      avatar: null,
      initials: 'RM',
      avatarColor: '#DC2626',
      condition: 'Fatty Liver & Afternoon Slump',
      recoveryTime: '8 Weeks',
      stars: 5,
      headline: 'Liver enzymes normal on recent test.',
      story: "I was diagnosed with grade 1 fatty liver and constant afternoon fatigue. Following Reshmi’s guidance on meal spacing and simple daily walking habits normalized my liver markers on my latest ultrasound.",
      protocolPillars: ['Liver Friendly Diet', 'Walking Drills', 'Metabolic Boost']
    },
    {
      id: 8,
      category: 'gut',
      name: 'Kavita Rao',
      city: 'Hyderabad',
      avatar: null,
      initials: 'KR',
      avatarColor: '#6D28D9',
      condition: 'Migraines & Constipation',
      recoveryTime: '5 Weeks',
      stars: 5,
      headline: 'No more weekly migraines or sluggish gut.',
      story: "My chronic constipation was triggering severe weekly migraines. Reshmi mam fixed my gut motility with hydration habits and wholesome foods. My gut feels light and head is completely clear.",
      protocolPillars: ['Hydration Routine', 'Motility Support', 'Clean Wholefoods']
    }
  ];


  return (
    <main className="testimonials-page" style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '90px' }}>
      <div className="container">

        {/* Hero Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>


          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
            color: '#121214',
            fontFamily: 'var(--font-serif)',
            margin: '0 0 16px',
            lineHeight: 1.15,
            fontWeight: 800
          }}>
            Voices of Healing. <span style={{ color: '#0D9488', fontStyle: 'italic' }}>Verified by Results.</span>
          </h1>

          <p style={{
            fontSize: '1.08rem',
            color: '#4B5563',
            lineHeight: 1.65,
            maxWidth: '680px',
            margin: '0 auto 28px'
          }}>
            See how hundreds of clients reversed complex digestive, respiratory, thyroid, and metabolic challenges through diagnostic biochemistry and Oxygen Advantage® breathwork.
          </p>

        </div>


      </div>

      {/* Real Patient Before & After Transformations Continuous Showcase & Audio Notes (End-to-End Full Bleed) */}
      <ClientTransformationShowcase />

      {/* 3. Real Client Video Testimonials (After Client Audio) */}
      <section
        className="client-video-testimonials-section"
        style={{
          padding: '60px 0 30px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FBFA 100%)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '50px'
        }}
      >
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '999px',
                background: '#EDF6EE',
                color: '#121214',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid #C6DFC9',
                marginBottom: '14px'
              }}
            >
              <span>🎥 Video Testimonials</span>
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                color: '#121214',
                fontFamily: 'var(--font-serif)',
                margin: '0 0 14px',
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              <span style={{ color: '#0D9488', fontStyle: 'italic' }}>Watch Their Stories.</span>
            </h2>

            <p
              style={{
                fontSize: '1.02rem',
                color: '#4B5563',
                lineHeight: 1.65,
                margin: '0 auto'
              }}
            >
              Watch direct video feedback and genuine recovery journeys of clients who transformed their digestion, thyroid, sleep, and metabolic health.
            </p>
          </div>

          {/* 3 Video Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              maxWidth: '1160px',
              margin: '0 auto'
            }}
          >
            {videoTestimonials.map((video) => {
              const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
              return (
                <div
                  key={video.id}
                  className="review-glass-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid rgb(1, 183, 180)',
                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                >
                  {/* YouTube Video Embed Container (16:9) */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '125%',
                      backgroundColor: '#0F172A'
                    }}
                  >
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`${video.name} - Testimonial Video`}
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
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9CA3AF',
                          fontSize: '0.85rem'
                        }}
                      >
                        YouTube Link Not Set
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0D827B', background: '#E6FCFB', padding: '3px 10px', borderRadius: '999px', border: '1px solid #7AF5EE' }}>
                        {video.tag || 'Patient Story'}
                      </span>
                    </div>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 700, color: '#121214', lineHeight: 1.4 }}>
                      {video.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '60px' }}>

        {/* Stories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '1160px',
          margin: '0 auto 60px'
        }}>
          {stories.map((item) => (
            <div
              key={item.id}
              className="review-glass-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '24px 22px',
                border: '1px solid var(--border-subtle)',
                borderTop: '3px solid rgb(1, 183, 180)',
                boxShadow: '0 -2px 10px rgba(0, 229, 217, 0.12), 0 10px 28px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease'
              }}
            >
              {/* Header with Avatar & Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgb(1, 183, 180)',
                      boxShadow: '0 0 10px rgba(0, 229, 217, 0.25)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: item.avatarColor || '#0D9488',
                    border: '2px solid rgb(1, 183, 180)',
                    boxShadow: '0 0 10px rgba(0, 229, 217, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    flexShrink: 0,
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {item.initials}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#121214' }}>
                      {item.name}
                    </h3>

                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {item.city} &bull; <strong style={{ color: '#121214' }}>{item.condition}</strong>
                  </span>
                </div>
              </div>

              {/* Recovery Badge */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0D827B', background: '#E6FCFB', padding: '3px 10px', borderRadius: '999px', border: '1px solid #7AF5EE' }}>
                  {item.recoveryTime}
                </span>
              </div>

              {/* Headline */}
              <h4 style={{
                fontSize: '1rem',
                color: '#121214',
                fontWeight: 700,
                lineHeight: 1.45,
                margin: '0 0 12px',
                fontFamily: 'var(--font-serif)'
              }}>
                "{item.headline}"
              </h4>

              {/* Story Paragraph */}
              <p style={{
                fontSize: '0.9rem',
                color: '#4B5563',
                lineHeight: 1.65,
                margin: '0',
                flex: 1
              }}>
                {item.story}
              </p>
            </div>
          ))}
        </div>

        {/* Reshmi's Personal 38 kg Transformation Feature */}
        <div style={{
          background: 'linear-gradient(135deg, #111111 0%, #1A1A1E 100%)',
          borderRadius: '26px',
          padding: '40px 32px',
          color: '#FFFFFF',
          maxWidth: '1060px',
          margin: '0 auto 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.25)'
        }}>
          <div>
            <span style={{
              fontSize: '0.8rem',
              color: 'rgb(1, 183, 180)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              The Founder's Personal Transformation
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-serif)',
              margin: '0 0 16px',
              lineHeight: 1.2
            }}>
              "I didn't just study functional nutrition. <span style={{ color: 'rgb(1, 183, 180)' }}>I lived the recovery.</span>"
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '22px' }}>
              Reshmi Verma personally lost 38 kg and reversed severe metabolic fatigue, chronic gut distress, and dysregulated breathing. She built the SAMYA™ Method so you never have to guess your way through confusing diets or band-aid prescriptions again.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href={RAZORPAY_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-white-solid" style={{ padding: '12px 26px', borderRadius: '12px', fontSize: '0.95rem' }}>
                <span>Book 1:1 Consultation</span>
              </a>
              <Link to="/about" className="btn btn-on-dark" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '0.95rem' }}>
                <span>Read Reshmi's Full Journey &rarr;</span>
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/assets/images/reshmi-transformation-side-by-side.jpg"
              alt="Reshmi Verma 38 kg Transformation"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                borderRadius: '18px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
              }}
            />
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'block', marginTop: '8px' }}>
              Verified 38 kg Sustained Transformation • Reshmi Verma
            </span>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div style={{
          textAlign: 'center',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '44px 28px',
          maxWidth: '820px',
          margin: '0 auto',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.2rem)', color: '#121214', margin: '0 0 12px', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
            Ready for your own root-cause transformation?
          </h3>
          <p style={{ color: '#4B5563', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 26px', lineHeight: 1.6 }}>
            Take our 2-minute diagnostic assessment or schedule a comprehensive 1:1 clinical consultation directly with Reshmi Verma.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href={RAZORPAY_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '14px 32px', fontWeight: 800 }}>
              Book 1:1 Consultation
            </a>
            <Link to="/assessment" className="btn btn-health" style={{ padding: '14px 28px' }}>
              Take Free Health Assessment
            </Link>
            <Link to="/breathing-assessment" className="btn btn-breath" style={{ padding: '14px 28px' }}>
              Breathing Assessment
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
