import React from 'react';
import { Link } from 'react-router-dom';

export default function NutritionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge-pill">
                <span className="pulse-dot"></span>
                <span>Functional & Cellular Nutrition</span>
              </div>

              <h1>Nutritional biochemistry as <span className="text-gradient">biological code</span>.</h1>

              <p className="lead">
                We move far beyond obsolete calorie counting. Reshmi Verma reads food as biochemical information—fueling mitochondrial ATP generation, sealing the gut mucosal barrier, and reprogramming cellular gene expression through targeted phyto-pharmacology.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/booking" className="btn btn-primary btn-lg">
                  <span>Book Diagnostic Consultation</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <a href="#mucosal-matrix" className="btn btn-secondary btn-lg">
                  <span>Explore Gut Matrix &darr;</span>
                </a>
              </div>
            </div>

            <div className="hero-media">
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-medium)', aspectRatio: '16/10' }}>
                <img src="/assets/images/functional-nutrition.jpg" alt="Functional Nutrition & Botanical Extracts" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Pillars / Frontiers of Cellular Botanical Nutrition */}
      <section className="section" id="mucosal-matrix" style={{ background: 'white', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Biological Regeneration Matrix</span>
            <h2>Six Core Frontiers of Cellular Nutrition</h2>
            <p>Every customized nutritional intervention is verified through rigorous before-and-after functional blood chemistry, organic acids, and stool microbiome sequencing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>

            {/* Frontier 1 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Gut Mucosal Regeneration</h3>
              <p>
                Cultivating the 100-trillion microbial collective. We nourish key protective species like <em>Akkermansia muciniphila</em> with targeted polyphenols to tighten claudin/occludin junctions and abolish systemic leaky gut.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Tight Junctions</span>
                <span className="pillar-tag">Akkermansia</span>
                <span className="pillar-tag">Endotoxemia Clearance</span>
              </div>
            </div>

            {/* Frontier 2 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3>Mitochondrial Bio-Energetics</h3>
              <p>
                Fueling the cellular powerhouses. We target electron transport chain efficiency, coenzyme Q10 synthesis, and PGC-1alpha transcription to stimulate fresh mitochondrial density and eliminate chronic 3 PM fatigue crashes.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">ATP Synthesis</span>
                <span className="pillar-tag">NAD+ Recycling</span>
                <span className="pillar-tag">CoQ10 Kinetics</span>
              </div>
            </div>

            {/* Frontier 3 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              </div>
              <h3>Phyto-Chemical Spectral Array</h3>
              <p>
                Leveraging raw botanical pigments (anthocyanins, quercetin, sulforaphane) to activate Nrf2 cellular antioxidant response elements and clear inflammatory reactive oxygen species (ROS).
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Nrf2 Activation</span>
                <span className="pillar-tag">Polyphenol Array</span>
                <span className="pillar-tag">ROS Scavenging</span>
              </div>
            </div>

            {/* Frontier 4 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path></svg>
              </div>
              <h3>Endocrine & Insulin Sensitivity</h3>
              <p>
                Restoring insulin receptor plasticity. By pairing nutrient timing with autonomic vagal breathing, we blunt glucose spikes, prevent reactive hypoglycemia, and optimize thyroid conversion (T4 to active T3).
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Glucose Kinetics</span>
                <span className="pillar-tag">Thyroid T3 Conversion</span>
                <span className="pillar-tag">Cortisol Buffer</span>
              </div>
            </div>

            {/* Frontier 5 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 0-7.07 17.07l1.41-1.41A8 8 0 1 1 12 20v2a10 10 0 0 0 0-20z"></path></svg>
              </div>
              <h3>Cellular Membrane Fluidity</h3>
              <p>
                Upgrading your cell walls. We evaluate the Omega-3 index, replacing oxidized industrial trans-fats with marine EPA/DHA and unadulterated phospholipids to optimize cellular nutrient transport.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">Omega-3 Index</span>
                <span className="pillar-tag">Phospholipid Matrix</span>
                <span className="pillar-tag">Membrane Signaling</span>
              </div>
            </div>

            {/* Frontier 6 */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h3>Autophagy & Senescence Clearance</h3>
              <p>
                Activating SIRT-1 longevity pathways and cellular housekeeping through structured meal cadence, intermittent caloric compression, and cellular botanical mimickers.
              </p>
              <div className="pillar-tags">
                <span className="pillar-tag">SIRT-1 Longevity</span>
                <span className="pillar-tag">Circadian Fasting</span>
                <span className="pillar-tag">Autophagy Pacing</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Diagnostic Mapping Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="sub-title">Diagnostics First</span>
              <h2>We Never Guess. We Measure.</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                Backed by Reshmi Verma's 20+ years directing <strong>Rainbow Medinova Diagnostic Services</strong>, every clinical protocol is rooted in objective biomarkers:
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', paddingLeft: 0 }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--emerald-primary)', flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span><strong>Comprehensive Metabolic Chemistry:</strong> Fasting Insulin, HOMA-IR, HbA1c, and advanced lipid subfractions.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--emerald-primary)', flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span><strong>Intestinal Permeability & Gut Sequencing:</strong> Zonulin levels, dysbiosis ratios, SIBO breath test analysis.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--emerald-primary)', flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span><strong>Four-Point Salivary Cortisol Rhythm:</strong> Tracking hypothalamic-pituitary-adrenal (HPA) axis balance from morning to bedtime.</span>
                </li>
              </ul>

              <Link to="/booking" className="btn btn-primary">Schedule Diagnostic Mapping Consultation</Link>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--status-optimal)' }}></div>
                <h4 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--emerald-deep)' }}>Clinical Protocol Blueprint Preview</h4>
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '14px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Phase 1: Mucosal Defense (Days 1–30)</strong><br />
                Abolish inflammatory seed oils, restore stomach acid (HCl), introduce L-Glutamine, zinc carnosine, and prebiotic polyphenols.
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '14px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Phase 2: Autonomic Gut-Brain Pairing (Days 31–60)</strong><br />
                Practice 5-5 Coherent Breathing before largest meals to stimulate vagal bile release and smooth intestinal peristalsis.
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '18px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Phase 3: Mitochondrial Resurgence (Days 61–90)</strong><br />
                Titrate targeted CoQ10, magnesium glycinate, and circadian time-restricted feeding for all-day steady energy.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
