import React, { useEffect, useRef, useState } from 'react';

/**
 * Signature Dragonfly Animation for HealthwithReshmi™
 * 
 * Features:
 * - Enlarged, crisp vector anatomy (~40% larger wingspan for stunning visibility)
 * - 3 Breathtaking Natural Color Variations:
 *     1. Electric Sapphire Blue (Neelkamal / Emperor Dragonfly) - Default / Primary
 *     2. Radiant Golden Amber (Sonpari / Golden Chaser)
 *     3. Iridescent Emerald Jade (Marakata / Green Darner)
 * - Automatically rotates between vibrant colors across flights for a magical natural feel
 * - Shorter re-appearance interval (8-12 seconds after exit)
 * - 3D dual-wing fluttering (rapid 45ms during flight, gentle during hover)
 * - Smooth Catmull-Rom spline curves across viewport (Left-to-Right & Right-to-Left)
 * - Interactive mouse evasion: darts away if cursor approaches within 90px
 * - Non-intrusive (pointer-events: none, GPU-accelerated)
 */

const SPECIES_PALETTES = [
  {
    id: 'sapphire',
    name: 'Electric Sapphire Blue',
    bodyColors: ['#0C4A6E', '#0284C7', '#38BDF8', '#0369A1'],
    thoraxColors: ['#0369A1', '#38BDF8', '#075985'],
    wingGradients: [
      'rgba(255, 255, 255, 0.9)',
      'rgba(186, 230, 253, 0.65)',
      'rgba(224, 242, 254, 0.4)',
      'rgba(56, 189, 248, 0.25)'
    ],
    wingVein: 'rgba(56, 189, 248, 0.6)',
    eyeColor: '#0284C7',
    eyeStroke: '#38BDF8',
    eyeHighlight: '#E0F2FE',
    segmentColor: '#38BDF8',
    accentColor: '#BAE6FD',
    particleRGB: '56, 189, 248', // Electric Cyan Blue
    glowShadow: 'rgba(2, 132, 199, 0.38)'
  },
  {
    id: 'golden',
    name: 'Radiant Golden Amber',
    bodyColors: ['#78350F', '#D97706', '#FDE047', '#B45309'],
    thoraxColors: ['#B45309', '#FBBF24', '#78350F'],
    wingGradients: [
      'rgba(255, 255, 255, 0.9)',
      'rgba(254, 240, 138, 0.65)',
      'rgba(254, 215, 170, 0.45)',
      'rgba(245, 158, 11, 0.25)'
    ],
    wingVein: 'rgba(245, 158, 11, 0.65)',
    eyeColor: '#B45309',
    eyeStroke: '#F59E0B',
    eyeHighlight: '#FEF08A',
    segmentColor: '#FDE047',
    accentColor: '#FED7AA',
    particleRGB: '245, 158, 11', // Golden Honey Amber
    glowShadow: 'rgba(217, 119, 6, 0.38)'
  },
  {
    id: 'emerald',
    name: 'Iridescent Emerald Jade',
    bodyColors: ['#064E3B', '#059669', '#34D399', '#047857'],
    thoraxColors: ['#047857', '#10B981', '#064E3B'],
    wingGradients: [
      'rgba(255, 255, 255, 0.9)',
      'rgba(209, 250, 229, 0.65)',
      'rgba(254, 243, 199, 0.4)',
      'rgba(52, 211, 153, 0.25)'
    ],
    wingVein: 'rgba(16, 185, 129, 0.6)',
    eyeColor: '#047857',
    eyeStroke: '#10B981',
    eyeHighlight: '#A7F3D0',
    segmentColor: '#34D399',
    accentColor: '#FBBF24',
    particleRGB: '52, 211, 153', // Emerald Sparkle
    glowShadow: 'rgba(5, 150, 105, 0.38)'
  }
];

export default function DragonflyAnimation() {
  const containerRef = useRef(null);
  const dragonflyRef = useRef(null);
  const trailCanvasRef = useRef(null);

  const [activeSpeciesIndex, setActiveSpeciesIndex] = useState(0); // Starts with Electric Sapphire Blue
  const [isFlutteringFast, setIsFlutteringFast] = useState(true);

  // Flight state ref to prevent unnecessary React re-renders during 60fps animation
  const stateRef = useRef({
    isActive: false,
    flightStartTime: 0,
    flightDuration: 8500,
    waypoints: [],
    currentX: -100,
    currentY: -100,
    currentAngle: 0,
    isHovering: false,
    hoverUntil: 0,
    direction: 1, // 1: left to right, -1: right to left
    mousePos: { x: -9999, y: -9999 },
    particles: [],
    speciesIndex: 0,
    timerId: null,
    animFrameId: null
  });

  // Catmull-Rom spline interpolation helper
  const getSplinePoint = (points, t) => {
    const p = points;
    const n = p.length - 1;
    const scaledT = t * n;
    const i = Math.min(Math.floor(scaledT), n - 1);
    const localT = scaledT - i;

    const p0 = p[Math.max(i - 1, 0)];
    const p1 = p[i];
    const p2 = p[Math.min(i + 1, n)];
    const p3 = p[Math.min(i + 2, n)];

    const t2 = localT * localT;
    const t3 = t2 * localT;

    const x =
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * localT +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

    const y =
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * localT +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

    return { x, y };
  };

  // Launch a new organic flight across the screen
  const launchFlight = () => {
    if (document.hidden) {
      // Postpone if user is in background tab
      stateRef.current.timerId = setTimeout(launchFlight, 4000);
      return;
    }

    const state = stateRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Alternate or randomize direction (Left -> Right or Right -> Left)
    const fromLeft = Math.random() > 0.45 ? state.direction === -1 : Math.random() > 0.5;
    state.direction = fromLeft ? 1 : -1;

    // Cycle through stunning species palettes for variety
    const nextSpecies = (state.speciesIndex + 1) % SPECIES_PALETTES.length;
    state.speciesIndex = nextSpecies;
    setActiveSpeciesIndex(nextSpecies);

    // Random start & exit heights across comfortable viewing area
    const startY = Math.random() * (vh * 0.55) + vh * 0.18;
    const endY = Math.random() * (vh * 0.55) + vh * 0.15;

    const startX = fromLeft ? -90 : vw + 90;
    const exitX = fromLeft ? vw + 100 : -100;

    // Waypoints for natural swoop & hover
    const waypoints = [];
    waypoints.push({ x: startX, y: startY });

    // Midpoints with organic wave curves
    const midX1 = fromLeft ? vw * 0.28 : vw * 0.72;
    const midY1 = Math.max(70, Math.min(vh - 100, startY + (Math.random() * 260 - 130)));
    waypoints.push({ x: midX1, y: midY1 });

    // Hover waypoint near center or content
    const hoverX = fromLeft ? vw * 0.52 + (Math.random() * 100 - 50) : vw * 0.48 - (Math.random() * 100 - 50);
    const hoverY = Math.max(90, Math.min(vh - 140, (startY + endY) / 2 + (Math.random() * 150 - 75)));
    waypoints.push({ x: hoverX, y: hoverY, isHoverStop: true });

    // Swoop out point
    const midX2 = fromLeft ? vw * 0.76 : vw * 0.24;
    const midY2 = Math.max(70, Math.min(vh - 100, endY + (Math.random() * 220 - 110)));
    waypoints.push({ x: midX2, y: midY2 });

    waypoints.push({ x: exitX, y: endY });

    state.waypoints = waypoints;
    state.flightStartTime = performance.now();
    // Flight duration: 7.5 to 9.5 seconds
    state.flightDuration = 7800 + Math.random() * 1800;
    state.isActive = true;
    state.isHovering = false;
    state.hoverUntil = 0;
    state.hoverDone = false;
    setIsFlutteringFast(true);

    if (dragonflyRef.current) {
      dragonflyRef.current.style.opacity = '1';
    }
  };

  // Schedule next appearance (8 to 12 seconds after exiting)
  const scheduleNextFlight = () => {
    const state = stateRef.current;
    state.isActive = false;
    if (dragonflyRef.current) {
      dragonflyRef.current.style.opacity = '0';
    }
    // Quick, pleasant re-appearance interval: 8 to 12 seconds
    const delay = 8000 + Math.random() * 4000;
    clearTimeout(state.timerId);
    state.timerId = setTimeout(launchFlight, delay);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      stateRef.current.mousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // First appearance 1.5 seconds after page loads
    stateRef.current.timerId = setTimeout(launchFlight, 1500);

    let lastTime = performance.now();

    // 60FPS Animation Loop
    const animate = (currentTime) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      const state = stateRef.current;

      const currentPalette = SPECIES_PALETTES[state.speciesIndex] || SPECIES_PALETTES[0];

      // Render particle trail
      const canvas = trailCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update & draw glowing particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.life -= dt * 0.0013;
          p.y += p.vy;
          p.x += p.vx;
          p.size *= 0.985;

          if (p.life <= 0 || p.size <= 0.2) {
            state.particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${p.color}, 0.75)`;
          ctx.fill();
        }
      }

      if (state.isActive && dragonflyRef.current) {
        const elapsed = currentTime - state.flightStartTime;
        const normalizedTime = Math.min(1, Math.max(0, elapsed / state.flightDuration));

        // Trigger a 1.4s serene hover pause midway through flight
        if (normalizedTime >= 0.44 && normalizedTime <= 0.46 && !state.hoverDone && !state.isHovering) {
          state.isHovering = true;
          state.hoverUntil = currentTime + 1400;
          setIsFlutteringFast(false);
        }

        if (state.isHovering) {
          if (currentTime >= state.hoverUntil) {
            state.isHovering = false;
            state.hoverDone = true;
            setIsFlutteringFast(true);
            state.flightStartTime += 1400;
          } else {
            // Gentle hovering micro-drift
            const hoverSine = Math.sin((currentTime - state.flightStartTime) * 0.007) * 2;
            state.currentY += hoverSine * 0.25;
            dragonflyRef.current.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) rotate(${state.currentAngle}deg) scale(1.08)`;
          }
        }

        if (!state.isHovering) {
          if (normalizedTime >= 1) {
            scheduleNextFlight();
          } else {
            const pos = getSplinePoint(state.waypoints, normalizedTime);
            // Look ahead for tangent orientation
            const nextT = Math.min(1, normalizedTime + 0.015);
            const nextPos = getSplinePoint(state.waypoints, nextT);

            let dx = nextPos.x - pos.x;
            let dy = nextPos.y - pos.y;

            // Interactive mouse avoidance: dart away if cursor gets within 90px
            const mDist = Math.hypot(pos.x - state.mousePos.x, pos.y - state.mousePos.y);
            if (mDist < 90) {
              const repelAngle = Math.atan2(pos.y - state.mousePos.y, pos.x - state.mousePos.x);
              dx += Math.cos(repelAngle) * 40;
              dy += Math.sin(repelAngle) * 40;
              // Burst of evasive sparkles
              for (let k = 0; k < 3; k++) {
                state.particles.push({
                  x: pos.x,
                  y: pos.y,
                  vx: (Math.random() - 0.5) * 2.2,
                  vy: (Math.random() - 0.5) * 2.2,
                  size: Math.random() * 3 + 1.5,
                  life: 0.95,
                  color: '255, 255, 255'
                });
              }
            }

            // Target flight angle (pointing head-first toward direction of movement)
            const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            // Smooth angular banking
            let angleDiff = targetAngle - state.currentAngle;
            while (angleDiff > 180) angleDiff -= 360;
            while (angleDiff < -180) angleDiff += 360;
            state.currentAngle += angleDiff * 0.13;

            state.currentX = pos.x;
            state.currentY = pos.y;

            // Emit subtle bioluminescent sparkle particles matching species color
            if (Math.random() > 0.4) {
              state.particles.push({
                x: pos.x + (Math.random() * 10 - 5),
                y: pos.y + (Math.random() * 10 - 5),
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 0.35 + 0.1,
                size: Math.random() * 2.6 + 1.0,
                life: 0.9,
                color: currentPalette.particleRGB
              });
            }

            dragonflyRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${state.currentAngle}deg) scale(1.08)`;
          }
        }
      }

      state.animFrameId = requestAnimationFrame(animate);
    };

    stateRef.current.animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(stateRef.current.animFrameId);
      clearTimeout(stateRef.current.timerId);
    };
  }, []);

  const palette = SPECIES_PALETTES[activeSpeciesIndex] || SPECIES_PALETTES[0];

  return (
    <div
      ref={containerRef}
      className="dragonfly-portal-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9980,
        overflow: 'hidden'
      }}
    >
      {/* Bioluminescent soft dust canvas */}
      <canvas
        ref={trailCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Enlarged Vector Dragonfly Entity (~74px wingspan, prominent and realistic) */}
      <div
        ref={dragonflyRef}
        className={`dragonfly-entity ${isFlutteringFast ? 'flutter-fast' : 'flutter-hover'}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '74px',
          height: '74px',
          marginLeft: '-37px',
          marginTop: '-37px',
          opacity: 0,
          transition: 'opacity 0.5s ease',
          willChange: 'transform, opacity',
          filter: `drop-shadow(0 6px 14px ${palette.glowShadow})`
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Dynamic species body gradient */}
            <linearGradient id="dfBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.bodyColors[0]} />
              <stop offset="35%" stopColor={palette.bodyColors[1]} />
              <stop offset="70%" stopColor={palette.bodyColors[2]} />
              <stop offset="100%" stopColor={palette.bodyColors[3]} />
            </linearGradient>

            {/* Dynamic species thorax highlight */}
            <linearGradient id="dfThoraxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={palette.thoraxColors[0]} />
              <stop offset="50%" stopColor={palette.thoraxColors[1]} />
              <stop offset="100%" stopColor={palette.thoraxColors[2]} />
            </linearGradient>

            {/* Dynamic species translucent wing gradient */}
            <linearGradient id="dfWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.wingGradients[0]} />
              <stop offset="30%" stopColor={palette.wingGradients[1]} />
              <stop offset="70%" stopColor={palette.wingGradients[2]} />
              <stop offset="100%" stopColor={palette.wingGradients[3]} />
            </linearGradient>

            {/* Wing vein line filter */}
            <filter id="wingGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="0.9" floodColor={palette.wingVein} />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* DRAGONFLY WINGS (Independent 3D Flap Rotations)                 */}
          {/* ============================================================== */}
          
          {/* Left Forewing */}
          <g className="df-wing df-wing-fore-left" style={{ transformOrigin: '48px 38px' }}>
            <path
              d="M 48 38 C 30 24, 3 16, 1 23 C -1 27, 24 38, 48 39 Z"
              fill="url(#dfWingGrad)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.65"
              filter="url(#wingGlow)"
            />
            {/* Delicate wing venation lines */}
            <path d="M 12 24 Q 28 29 46 38" stroke={palette.wingVein} strokeWidth="0.45" fill="none" />
            <path d="M 22 22 Q 34 32 47 38.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="0.35" fill="none" />
            <path d="M 8 23 Q 20 28 36 34" stroke={palette.wingVein} strokeWidth="0.3" fill="none" opacity="0.6" />
          </g>

          {/* Right Forewing */}
          <g className="df-wing df-wing-fore-right" style={{ transformOrigin: '52px 38px' }}>
            <path
              d="M 52 38 C 70 24, 97 16, 99 23 C 101 27, 76 38, 52 39 Z"
              fill="url(#dfWingGrad)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.65"
              filter="url(#wingGlow)"
            />
            <path d="M 88 24 Q 72 29 54 38" stroke={palette.wingVein} strokeWidth="0.45" fill="none" />
            <path d="M 78 22 Q 66 32 53 38.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="0.35" fill="none" />
            <path d="M 92 23 Q 80 28 64 34" stroke={palette.wingVein} strokeWidth="0.3" fill="none" opacity="0.6" />
          </g>

          {/* Left Hindwing */}
          <g className="df-wing df-wing-hind-left" style={{ transformOrigin: '48px 43px' }}>
            <path
              d="M 48 43 C 32 34, 9 30, 7 37 C 5 42, 28 47, 48 44 Z"
              fill="url(#dfWingGrad)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.6"
              filter="url(#wingGlow)"
            />
            <path d="M 18 35 Q 32 40 46 43.5" stroke={palette.wingVein} strokeWidth="0.4" fill="none" />
            <path d="M 11 36 Q 26 41 42 44" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.3" fill="none" />
          </g>

          {/* Right Hindwing */}
          <g className="df-wing df-wing-hind-right" style={{ transformOrigin: '52px 43px' }}>
            <path
              d="M 52 43 C 68 34, 91 30, 93 37 C 95 42, 72 47, 52 44 Z"
              fill="url(#dfWingGrad)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.6"
              filter="url(#wingGlow)"
            />
            <path d="M 82 35 Q 68 40 54 43.5" stroke={palette.wingVein} strokeWidth="0.4" fill="none" />
            <path d="M 89 36 Q 74 41 58 44" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.3" fill="none" />
          </g>

          {/* ============================================================== */}
          {/* DRAGONFLY BODY                                                 */}
          {/* ============================================================== */}

          {/* Long Slender Segmented Abdomen / Tail */}
          <g className="df-abdomen">
            {/* Base tapering tail */}
            <path
              d="M 48.5 45 Q 49 68 49.5 86 L 50.5 86 Q 51 68 51.5 45 Z"
              fill="url(#dfBodyGrad)"
              stroke={palette.bodyColors[3]}
              strokeWidth="0.35"
            />
            {/* Abdomen segments rings for realism */}
            <ellipse cx="50" cy="50" rx="1.8" ry="0.65" fill={palette.segmentColor} opacity="0.9" />
            <ellipse cx="50" cy="55" rx="1.65" ry="0.65" fill={palette.accentColor} opacity="0.85" />
            <ellipse cx="50" cy="61" rx="1.5" ry="0.55" fill={palette.segmentColor} opacity="0.9" />
            <ellipse cx="50" cy="67" rx="1.35" ry="0.55" fill={palette.accentColor} opacity="0.85" />
            <ellipse cx="50" cy="73" rx="1.2" ry="0.45" fill={palette.segmentColor} opacity="0.9" />
            <ellipse cx="50" cy="79" rx="1.0" ry="0.45" fill={palette.accentColor} opacity="0.85" />
            {/* Tail tip clasp */}
            <polygon points="49,86 51,86 50,90" fill={palette.bodyColors[0]} />
          </g>

          {/* Thorax (Middle Body) */}
          <path
            d="M 47.3 31 C 46.2 35, 46.2 42, 47.8 45 L 52.2 45 C 53.8 42, 53.8 35, 52.7 31 Z"
            fill="url(#dfThoraxGrad)"
          />
          {/* Thorax dorsal shimmer line */}
          <line x1="50" y1="32" x2="50" y2="44" stroke={palette.accentColor} strokeWidth="0.75" opacity="0.95" />

          {/* Head & Compound Eyes */}
          <circle cx="50" cy="27" r="3.4" fill={palette.bodyColors[0]} />
          {/* Left Eye */}
          <ellipse cx="47.3" cy="25.8" rx="2.5" ry="2.9" fill={palette.eyeColor} stroke={palette.eyeStroke} strokeWidth="0.45" />
          <circle cx="46.6" cy="24.8" r="0.9" fill={palette.eyeHighlight} />
          {/* Right Eye */}
          <ellipse cx="52.7" cy="25.8" rx="2.5" ry="2.9" fill={palette.eyeColor} stroke={palette.eyeStroke} strokeWidth="0.45" />
          <circle cx="53.4" cy="24.8" r="0.9" fill={palette.eyeHighlight} />

          {/* Fine antennae */}
          <line x1="48.5" y1="24" x2="46.2" y2="19" stroke={palette.eyeColor} strokeWidth="0.45" />
          <line x1="51.5" y1="24" x2="53.8" y2="19" stroke={palette.eyeColor} strokeWidth="0.45" />
        </svg>
      </div>
    </div>
  );
}
