import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClientTransformationShowcase from '../components/ClientTransformationShowcase';

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'gut', label: 'Gut & Digestion' },
    { id: 'breath', label: 'Breathwork & Sleep' },
    { id: 'hormones', label: 'Thyroid & Hormones' },
    { id: 'weight', label: 'Metabolic & Weight' }
  ];

  const stories = [
    {
      id: 1,
      category: 'hormones',
      name: 'Vartika',
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
      name: 'Simrat',
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
      name: 'Pranav',
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
      name: 'Shoaib',
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
      avatar: '/assets/images/client-avatar-vartika.jpg',
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
      avatar: '/assets/images/client-avatar-simrat.jpg',
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
      avatar: '/assets/images/client-avatar-pranav.jpg',
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
      avatar: '/assets/images/client-avatar-shoaib.jpg',
      condition: 'Migraines & Constipation',
      recoveryTime: '5 Weeks',
      stars: 5,
      headline: 'No more weekly migraines or sluggish gut.',
      story: "My chronic constipation was triggering severe weekly migraines. Reshmi mam fixed my gut motility with hydration habits and wholesome foods. My gut feels light and head is completely clear.",
      protocolPillars: ['Hydration Routine', 'Motility Support', 'Clean Wholefoods']
    }
  ];

  const filteredStories = activeCategory === 'all'
    ? stories
    : stories.filter((s) => s.category === activeCategory);

  return (
    <main className="testimonials-page" style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '90px' }}>
      <div className="container">
        
        {/* Hero Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
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
            marginBottom: '16px'
          }}>
            <span>Verified Patient Outcomes</span>
            <span>&bull;</span>
            <span style={{ color: '#FF007F' }}>100% Root-Cause Recovery</span>
          </span>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
            color: '#121214',
            fontFamily: 'var(--font-serif)',
            margin: '0 0 16px',
            lineHeight: 1.15,
            fontWeight: 800
          }}>
            Real People. <span style={{ color: '#FF007F', fontStyle: 'italic' }}>Real Transformations.</span>
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

          {/* Key Metric Highlights Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '14px',
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#121214' }}>500+</div>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Lives Transformed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FF007F' }}>94%</div>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Symptom Reversal</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#00E5D9' }}>#13</div>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Oxygen Adv. Coach</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#121214' }}>5.0 Rating</div>
              <div style={{ fontSize: '0.76rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Client Trust</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: activeCategory === cat.id ? '1.5px solid #FF007F' : '1px solid var(--border-subtle)',
                background: activeCategory === cat.id ? '#121214' : '#FFFFFF',
                color: activeCategory === cat.id ? '#FFFFFF' : '#374151',
                boxShadow: activeCategory === cat.id ? '0 4px 14px rgba(255, 0, 127, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '1160px',
          margin: '0 auto 60px'
        }}>
          {filteredStories.map((item) => (
            <div
              key={item.id}
              className="review-glass-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '28px 26px',
                border: '1px solid var(--border-subtle)',
                borderTop: '3px solid #FF007F',
                boxShadow: '0 -2px 10px rgba(255, 0, 127, 0.18), 0 10px 28px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease'
              }}
            >
              {/* Header with Avatar & Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FF007F',
                    boxShadow: '0 0 10px rgba(255, 0, 127, 0.35)'
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#121214' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', background: '#FFF0F6', color: '#FF007F', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      Verified
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {item.city} &bull; <strong style={{ color: '#121214' }}>{item.condition}</strong>
                  </span>
                </div>
              </div>

              {/* Stars & Recovery Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ color: '#F59E0B', fontSize: '0.92rem', letterSpacing: '2px' }}>
                  {'★'.repeat(item.stars)}
                </div>
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
                margin: '0 0 18px',
                flex: 1
              }}>
                {item.story}
              </p>

              {/* Protocol Pillars Tags */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  Protocol Highlights
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {item.protocolPillars.map((pillar, pIdx) => (
                    <span
                      key={pIdx}
                      style={{
                        fontSize: '0.74rem',
                        background: '#FAF9F6',
                        border: '1px solid #E5E7EB',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#374151',
                        fontWeight: 600
                      }}
                    >
                      ✓ {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real Patient Before & After Transformations Continuous Showcase & Audio Notes */}
        <ClientTransformationShowcase />

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
              color: '#FF007F',
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
              "I didn't just study functional nutrition. <span style={{ color: '#00E5D9' }}>I lived the recovery.</span>"
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '22px' }}>
              Reshmi Verma personally lost 38 kg and reversed severe metabolic fatigue, chronic gut distress, and dysregulated breathing. She built the SAMYA™ Method so you never have to guess your way through confusing diets or band-aid prescriptions again.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary" style={{ padding: '12px 26px', background: '#FFFFFF', color: '#111111', fontWeight: 800 }}>
                Book 1:1 Consultation &rarr;
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '12px 24px', background: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                Read Reshmi's Full Journey &rarr;
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
            <Link to="/booking" className="btn btn-primary" style={{ padding: '14px 32px', fontWeight: 800 }}>
              Book 1:1 Consultation
            </Link>
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
