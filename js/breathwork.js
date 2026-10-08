/**
 * Reshmi Verma — Breathwork, Respiration & BOLT Testing Engine
 * Functional Nutritionist & Oxygen Advantage Breathwork Specialist
 * Includes:
 * 1. BOLT (Body Oxygen Level Test) Breath-Hold Timer & Clinical Analysis
 * 2. Neuromodulation Guided Breathing Player with Web Audio API Harmonic Synthesis
 * 3. 60-Second Live Breath Counter
 * 4. Vagal Tone Multi-Factor Index Calculator
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Web Audio API Nature Ocean Waves & Tibetan Singing Bowl Sound Synth
  // =========================================================================
  class BreathSoundSynth {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.noiseBuffer = null;
      this.waveSource = null;
      this.waveFilter = null;
      this.waveGain = null;
      this.isWaveRunning = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.ctx && !this.noiseBuffer) {
        this.noiseBuffer = this.buildBrownNoiseBuffer();
      }
    }

    // Generate warm organic brown noise for realistic sea waves & shore foam
    buildBrownNoiseBuffer() {
      if (!this.ctx) return null;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 5; // 5-second seamless loop
      const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.025 * white) / 1.025;
          data[i] = lastOut * 3.8;
        }
      }
      return buffer;
    }

    startOceanWaves() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx || this.isWaveRunning) return;

      try {
        if (!this.noiseBuffer) this.noiseBuffer = this.buildBrownNoiseBuffer();
        if (!this.noiseBuffer) return;

        this.waveSource = this.ctx.createBufferSource();
        this.waveSource.buffer = this.noiseBuffer;
        this.waveSource.loop = true;

        this.waveFilter = this.ctx.createBiquadFilter();
        this.waveFilter.type = 'lowpass';
        this.waveFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);
        this.waveFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

        this.waveGain = this.ctx.createGain();
        this.waveGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.waveGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.2);

        this.waveSource.connect(this.waveFilter);
        this.waveFilter.connect(this.waveGain);
        this.waveGain.connect(this.ctx.destination);

        this.waveSource.start();
        this.isWaveRunning = true;
      } catch (e) {
        console.warn('Ocean waves error:', e);
      }
    }

    stopOceanWaves() {
      if (this.waveGain && this.ctx && this.isWaveRunning) {
        try {
          const now = this.ctx.currentTime;
          this.waveGain.gain.cancelScheduledValues(now);
          this.waveGain.gain.setValueAtTime(this.waveGain.gain.value, now);
          this.waveGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
          setTimeout(() => {
            if (this.waveSource) {
              try {
                this.waveSource.stop();
                this.waveSource.disconnect();
              } catch (e) {}
              this.waveSource = null;
            }
            if (this.waveFilter) {
              this.waveFilter.disconnect();
              this.waveFilter = null;
            }
            if (this.waveGain) {
              this.waveGain.disconnect();
              this.waveGain = null;
            }
            this.isWaveRunning = false;
          }, 650);
        } catch (e) {
          this.isWaveRunning = false;
        }
      } else {
        this.isWaveRunning = false;
      }
    }

    // Dynamically modulate the ocean tide to breathe in sync with user
    modulateWave(action, duration = 4) {
      if (this.isMuted || !this.isWaveRunning || !this.waveFilter || !this.waveGain || !this.ctx) return;
      const now = this.ctx.currentTime;
      const rampTime = Math.max(0.5, duration);

      try {
        this.waveFilter.frequency.cancelScheduledValues(now);
        this.waveFilter.frequency.setValueAtTime(this.waveFilter.frequency.value, now);

        this.waveGain.gain.cancelScheduledValues(now);
        this.waveGain.gain.setValueAtTime(this.waveGain.gain.value, now);

        if (action === 'inhale') {
          // Ocean wave swells up onto shoreline
          this.waveFilter.frequency.exponentialRampToValueAtTime(750, now + rampTime);
          this.waveGain.gain.linearRampToValueAtTime(0.24, now + rampTime);
        } else if (action === 'hold') {
          // High-tide gentle ambient crest
          this.waveFilter.frequency.linearRampToValueAtTime(460, now + rampTime);
          this.waveGain.gain.linearRampToValueAtTime(0.14, now + rampTime);
        } else if (action === 'exhale') {
          // Water slowly recedes back into deep ocean
          this.waveFilter.frequency.exponentialRampToValueAtTime(160, now + rampTime);
          this.waveGain.gain.linearRampToValueAtTime(0.06, now + rampTime);
        }
      } catch (e) {
        console.warn('Wave modulation error:', e);
      }
    }

    // Authentic Tibetan Singing Bowl with Sacred Harmonics & Detuned Beating
    playTibetanBowl(phase = 'inhale') {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      let baseFreq = 216; // 432Hz sub-octave (warm grounding)
      let decay = 3.6;
      let bowlVol = 0.22;

      if (phase === 'hold') {
        baseFreq = 270; // 540Hz sub-octave (clarity & expansion)
        decay = 3.0;
        bowlVol = 0.18;
      } else if (phase === 'exhale') {
        baseFreq = 180; // 360Hz sub-octave (deep release)
        decay = 4.0;
        bowlVol = 0.24;
      }

      try {
        const now = this.ctx.currentTime;

        // Tibetan bowl partials: Fundamental + Detuned Beat + Metallic 2.76x + Shimmer 5.4x
        const harmonics = [
          { freq: baseFreq, gain: bowlVol * 1.0, decay: decay },
          { freq: baseFreq + 1.2, gain: bowlVol * 0.7, decay: decay }, // Meditative binaural beating
          { freq: baseFreq * 2.76, gain: bowlVol * 0.35, decay: decay * 0.7 }, // Bronze rim tone
          { freq: baseFreq * 5.4, gain: bowlVol * 0.12, decay: decay * 0.45 }  // Upper shimmer
        ];

        harmonics.forEach(h => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(h.freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(h.gain, now + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + h.decay + 0.1);
        });
      } catch (e) {
        console.warn('Tibetan bowl error:', e);
      }
    }

    // Universal Zen chime for tests (BOLT, breath counter)
    playChime(freq = 528, duration = 1.4) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(freq * 2.01, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + duration);
        oscHarmonic.stop(now + duration);
      } catch (e) {
        console.warn('Chime error:', e);
      }
    }

    // Backward-compatibility aliases
    startDrone() { this.startOceanWaves(); }
    stopDrone() { this.stopOceanWaves(); }

    toggleMute(isSanctuaryActive = false) {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopOceanWaves();
      } else if (isSanctuaryActive) {
        this.startOceanWaves();
      }
      return this.isMuted;
    }
  }

  const soundSynth = new BreathSoundSynth();

  // =========================================================================
  // 2. BOLT (Body Oxygen Level Test) Breath-Hold Timer
  // =========================================================================
  const boltState = {
    isRunning: false,
    startTime: 0,
    timerInterval: null,
    scoreSeconds: 0
  };

  const boltElements = {
    startBtn: document.getElementById('bolt-start-btn'),
    stopBtn: document.getElementById('bolt-stop-btn'),
    resetBtn: document.getElementById('bolt-reset-btn'),
    counterDisplay: document.getElementById('bolt-counter-val'),
    statusText: document.getElementById('bolt-phase-hint'),
    resultCard: document.getElementById('bolt-result-analysis'),
    scoreBracket: document.getElementById('bolt-score-tier'),
    protocolCard: document.getElementById('bolt-protocol-text'),
    bohrExplanation: document.getElementById('bolt-bohr-detail'),
    saveScoreBtn: document.getElementById('bolt-save-btn')
  };

  function updateBoltDisplay(elapsedSeconds) {
    if (boltElements.counterDisplay) {
      boltElements.counterDisplay.textContent = elapsedSeconds.toFixed(1);
    }
  }

  function startBoltTest() {
    soundSynth.init();
    boltState.isRunning = true;
    boltState.startTime = performance.now();
    boltState.scoreSeconds = 0;

    if (boltElements.startBtn) boltElements.startBtn.style.display = 'none';
    if (boltElements.stopBtn) {
      boltElements.stopBtn.style.display = 'inline-flex';
      boltElements.stopBtn.classList.add('pulse-anim');
    }
    if (boltElements.resetBtn) boltElements.resetBtn.style.display = 'inline-flex';
    if (boltElements.statusText) {
      boltElements.statusText.innerHTML = `<strong>Holding post-exhale...</strong> Pinch nose. Tap the button the instant you feel the <em>first definite desire</em> to breathe!`;
    }
    if (boltElements.resultCard) boltElements.resultCard.style.display = 'none';

    soundSynth.playChime(440, 0.4);

    clearInterval(boltState.timerInterval);
    boltState.timerInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - boltState.startTime) / 1000;
      boltState.scoreSeconds = elapsed;
      updateBoltDisplay(elapsed);
    }, 100);
  }

  function stopBoltTest() {
    if (!boltState.isRunning) return;
    boltState.isRunning = false;
    clearInterval(boltState.timerInterval);

    if (boltElements.stopBtn) {
      boltElements.stopBtn.style.display = 'none';
      boltElements.stopBtn.classList.remove('pulse-anim');
    }
    if (boltElements.startBtn) {
      boltElements.startBtn.style.display = 'inline-flex';
      boltElements.startBtn.textContent = 'Retest BOLT';
    }

    soundSynth.playChime(587.33, 0.6); // D5 chime

    evaluateBoltScore(boltState.scoreSeconds);
  }

  function resetBoltTest() {
    boltState.isRunning = false;
    clearInterval(boltState.timerInterval);
    boltState.scoreSeconds = 0;
    updateBoltDisplay(0);

    if (boltElements.startBtn) {
      boltElements.startBtn.style.display = 'inline-flex';
      boltElements.startBtn.textContent = 'Start BOLT Hold Timer';
    }
    if (boltElements.stopBtn) boltElements.stopBtn.style.display = 'none';
    if (boltElements.resetBtn) boltElements.resetBtn.style.display = 'none';
    if (boltElements.statusText) {
      boltElements.statusText.textContent = 'Breathe normally. After a normal exhale, pinch your nose and start the timer.';
    }
    if (boltElements.resultCard) boltElements.resultCard.style.display = 'none';
  }

  function evaluateBoltScore(score) {
    if (!boltElements.resultCard) return;

    let tier = '';
    let pillClass = '';
    let protocol = '';
    let bohr = '';

    if (score < 10) {
      tier = 'Critical Carbon Dioxide Hypersensitivity (< 10s)';
      pillClass = 'critical';
      protocol = `
        <strong>Prescribed Clinical Protocol:</strong> Gentle, continuous 100% nasal breathing 24/7. Avoid heavy sighing or mouth breathing. Practice 10 minutes of gentle Coherent Breathing (5-5 cadence) twice daily to recalibrate brainstem chemoreceptors.
      `;
      bohr = `
        <strong>Physiological Analysis:</strong> The brain triggers an emergency breath urge almost immediately, indicating chronic unconscious over-breathing. Over-breathing depletes arterial CO₂, causing blood vessels to constrict and hemoglobin to hold onto oxygen tightly (the Bohr Effect), starving tissues of cellular oxygen.
      `;
    } else if (score < 20) {
      tier = 'Suboptimal Respiratory Efficiency (10 - 19s)';
      pillClass = 'suboptimal';
      protocol = `
        <strong>Prescribed Clinical Protocol:</strong> Box Breathing (4-4-4-4) for 5–10 minutes before meals and high-focus work. Strictly tape or train nasal breathing at night to eliminate airway micro-collapses and sleep grogginess.
      `;
      bohr = `
        <strong>Physiological Analysis:</strong> Moderate CO₂ sensitivity. Tissues receive adequate oxygen at rest, but cognitive stress or brisk activity triggers rapid hyperventilation, causing early lactic acid fatigue and afternoon brain fog.
      `;
    } else if (score < 30) {
      tier = 'Functional Baseline Breathing (20 - 29s)';
      pillClass = 'functional';
      protocol = `
        <strong>Prescribed Clinical Protocol:</strong> Practice 4-7-8 Somatic Relaxation before bedtime to expand CO₂ reserve toward 35s. Maintain nasal-only breathing during zone 2 walking or jogging.
      `;
      bohr = `
        <strong>Physiological Analysis:</strong> Satisfactory arterial blood-gas exchange. Diaphragm engages naturally, and nasal nitric oxide is efficiently carried down into the lower lung lobes for balanced circulation.
      `;
    } else if (score < 40) {
      tier = 'Superior Physiological Efficiency (30 - 39s)';
      pillClass = 'optimal';
      protocol = `
        <strong>Prescribed Clinical Protocol:</strong> Sustain your pristine respiratory volume. Incorporate contrast breathwork or hypoxic breath-holds during structured warmups to challenge metabolic limits.
      `;
      bohr = `
        <strong>Physiological Analysis:</strong> High CO₂ tolerance and exceptional parasympathetic elasticity. Low resting heart rate, high Heart Rate Variability (HRV), and minimal exercise-induced fatigue.
      `;
    } else {
      tier = 'Elite / Gold-Standard Aerobic Economy (40s+)';
      pillClass = 'optimal';
      protocol = `
        <strong>Prescribed Clinical Protocol:</strong> Gold standard respiratory mechanics. Maintain with high-contrast breath training such as the Soma Quick Energizer.
      `;
      bohr = `
        <strong>Physiological Analysis:</strong> World-class oxygen economy matching conditioned endurance athletes. Maximal aerobic capacity, supreme mitochondrial efficiency, and robust vagal nerve signaling.
      `;
    }

    if (boltElements.scoreBracket) {
      boltElements.scoreBracket.textContent = tier;
      boltElements.scoreBracket.className = `bolt-score-pill ${pillClass}`;
    }
    if (boltElements.protocolCard) boltElements.protocolCard.innerHTML = protocol;
    if (boltElements.bohrExplanation) boltElements.bohrExplanation.innerHTML = bohr;
    boltElements.resultCard.style.display = 'block';

    // Store in localStorage for cross-page pre-filling
    try {
      localStorage.setItem('reshmi_bolt_score', score.toFixed(1));
    } catch (e) {}
  }

  // =========================================================================
  // 3. Neuromodulation Guided Breathing Sanctuary
  // =========================================================================
  const breathProtocols = {
    '478': {
      name: '4-7-8 Somatic Relaxation',
      desc: 'Flagship somatic autonomic regulation. 4s nasal inhalation, 7s full oxygen retention, 8s slow exhalation to trigger immediate parasympathetic baroreflex slowing.',
      phases: [
        { name: 'Inhale', duration: 4, action: 'inhale', hint: 'Inhale gently through nose' },
        { name: 'Hold', duration: 7, action: 'hold', hint: 'Hold breath peacefully' },
        { name: 'Exhale', duration: 8, action: 'exhale', hint: 'Slow, steady exhale through mouth' }
      ]
    },
    'box': {
      name: 'Box Breathing (Navy SEALs 4-4-4-4)',
      desc: 'Square wave autonomic stabilization for acute situational stress, cognitive poise and tactical composure.',
      phases: [
        { name: 'Inhale', duration: 4, action: 'inhale', hint: 'Inhale smoothly 4s' },
        { name: 'Hold', duration: 4, action: 'hold', hint: 'Retain breath 4s' },
        { name: 'Exhale', duration: 4, action: 'exhale', hint: 'Exhale smoothly 4s' },
        { name: 'Hold', duration: 4, action: 'hold', hint: 'Empty hold 4s' }
      ]
    },
    'coherent': {
      name: 'Coherent Breathing (5-5 Cadence)',
      desc: 'Aligns pulmonary blood-gas flow with metabolic cellular exchange for optimized heart rate variability and vagal tone.',
      phases: [
        { name: 'Inhale', duration: 5, action: 'inhale', hint: 'Gentle nasal inhale 5s' },
        { name: 'Exhale', duration: 5, action: 'exhale', hint: 'Gentle nasal exhale 5s' }
      ]
    },
    'energizer': {
      name: 'Soma Vitality Energizer (2-2)',
      desc: 'Rapid oxygen infusion designed to spark high cellular ATP and break afternoon brain fog.',
      phases: [
        { name: 'Inhale', duration: 2, action: 'inhale', hint: 'Brisk nasal inhalation' },
        { name: 'Exhale', duration: 2, action: 'exhale', hint: 'Active release exhalation' }
      ]
    }
  };

  const sanctuaryState = {
    currentKey: '478',
    isActive: false,
    phaseIndex: 0,
    countdownSec: 0,
    timer: null,
    totalCycles: 0,
    sessionSeconds: 0,
    sessionInterval: null
  };

  const sanctuaryElements = {
    orb: document.getElementById('breath-interactive-orb'),
    phaseLabel: document.getElementById('breath-phase-label'),
    phaseCounter: document.getElementById('breath-phase-seconds'),
    phaseHint: document.getElementById('breath-sub-hint'),
    startBtn: document.getElementById('breath-sanctuary-toggle'),
    cycleDisplay: document.getElementById('breath-cycle-count'),
    timeDisplay: document.getElementById('breath-session-timer'),
    protocolSelector: document.querySelectorAll('[data-breath-protocol]'),
    soundToggleBtn: document.getElementById('breath-sound-toggle-btn')
  };

  function selectProtocol(key) {
    if (!breathProtocols[key]) return;
    sanctuaryState.currentKey = key;
    sanctuaryElements.protocolSelector.forEach(btn => {
      if (btn.getAttribute('data-breath-protocol') === key) {
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-secondary');
      } else {
        btn.classList.remove('active', 'btn-primary');
        btn.classList.add('btn-secondary');
      }
    });

    const protocolDesc = document.getElementById('selected-protocol-desc');
    if (protocolDesc) {
      protocolDesc.textContent = breathProtocols[key].desc;
    }

    if (sanctuaryState.isActive) {
      stopSanctuary();
      startSanctuary();
    } else {
      resetOrbDisplay();
    }
  }

  function resetOrbDisplay() {
    const proto = breathProtocols[sanctuaryState.currentKey];
    if (sanctuaryElements.orb) {
      sanctuaryElements.orb.className = 'breath-orb';
    }
    if (sanctuaryElements.phaseLabel) {
      sanctuaryElements.phaseLabel.textContent = 'READY';
    }
    if (sanctuaryElements.phaseCounter) {
      sanctuaryElements.phaseCounter.textContent = `${proto.phases[0].duration}s`;
    }
    if (sanctuaryElements.phaseHint) {
      sanctuaryElements.phaseHint.textContent = 'Tap Start to begin guided breathing';
    }
  }

  function runPhase() {
    if (!sanctuaryState.isActive) return;

    const proto = breathProtocols[sanctuaryState.currentKey];
    const currentPhase = proto.phases[sanctuaryState.phaseIndex];

    sanctuaryState.countdownSec = currentPhase.duration;

    if (sanctuaryElements.phaseLabel) {
      sanctuaryElements.phaseLabel.textContent = currentPhase.name.toUpperCase();
    }
    if (sanctuaryElements.phaseHint) {
      sanctuaryElements.phaseHint.textContent = currentPhase.hint;
    }
    if (sanctuaryElements.phaseCounter) {
      sanctuaryElements.phaseCounter.textContent = `${sanctuaryState.countdownSec}s`;
    }

    // Update orb visual style & Sound Modulation
    if (sanctuaryElements.orb) {
      sanctuaryElements.orb.className = 'breath-orb';
      if (currentPhase.action === 'inhale') {
        sanctuaryElements.orb.classList.add('inhaling');
        sanctuaryElements.orb.style.transitionDuration = `${currentPhase.duration}s`;
        soundSynth.playTibetanBowl('inhale');
        soundSynth.modulateWave('inhale', currentPhase.duration);
      } else if (currentPhase.action === 'hold') {
        sanctuaryElements.orb.classList.add('holding');
        soundSynth.playTibetanBowl('hold');
        soundSynth.modulateWave('hold', currentPhase.duration);
      } else if (currentPhase.action === 'exhale') {
        sanctuaryElements.orb.classList.add('exhaling');
        sanctuaryElements.orb.style.transitionDuration = `${currentPhase.duration}s`;
        soundSynth.playTibetanBowl('exhale');
        soundSynth.modulateWave('exhale', currentPhase.duration);
      }
    }

    clearInterval(sanctuaryState.timer);
    sanctuaryState.timer = setInterval(() => {
      sanctuaryState.countdownSec--;
      if (sanctuaryElements.phaseCounter) {
        sanctuaryElements.phaseCounter.textContent = `${sanctuaryState.countdownSec}s`;
      }

      if (sanctuaryState.countdownSec <= 0) {
        clearInterval(sanctuaryState.timer);
        // Advance phase
        sanctuaryState.phaseIndex++;
        if (sanctuaryState.phaseIndex >= proto.phases.length) {
          sanctuaryState.phaseIndex = 0;
          sanctuaryState.totalCycles++;
          if (sanctuaryElements.cycleDisplay) {
            sanctuaryElements.cycleDisplay.textContent = sanctuaryState.totalCycles;
          }
        }
        runPhase();
      }
    }, 1000);
  }

  function startSanctuary() {
    soundSynth.init();
    sanctuaryState.isActive = true;
    sanctuaryState.phaseIndex = 0;
    sanctuaryState.totalCycles = 0;
    sanctuaryState.sessionSeconds = 0;

    if (sanctuaryElements.startBtn) {
      sanctuaryElements.startBtn.textContent = 'Pause Breathing';
      sanctuaryElements.startBtn.classList.remove('btn-primary');
      sanctuaryElements.startBtn.classList.add('btn-secondary');
    }

    soundSynth.startOceanWaves();

    clearInterval(sanctuaryState.sessionInterval);
    sanctuaryState.sessionInterval = setInterval(() => {
      sanctuaryState.sessionSeconds++;
      if (sanctuaryElements.timeDisplay) {
        const mins = Math.floor(sanctuaryState.sessionSeconds / 60);
        const secs = sanctuaryState.sessionSeconds % 60;
        sanctuaryElements.timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);

    runPhase();
  }

  function stopSanctuary() {
    sanctuaryState.isActive = false;
    clearInterval(sanctuaryState.timer);
    clearInterval(sanctuaryState.sessionInterval);
    soundSynth.stopOceanWaves();

    if (sanctuaryElements.startBtn) {
      sanctuaryElements.startBtn.textContent = 'Start Guided Session';
      sanctuaryElements.startBtn.classList.add('btn-primary');
      sanctuaryElements.startBtn.classList.remove('btn-secondary');
    }

    resetOrbDisplay();
  }

  function toggleSanctuary() {
    if (sanctuaryState.isActive) {
      stopSanctuary();
    } else {
      startSanctuary();
    }
  }

  // =========================================================================
  // 4. 60-Second Live Resting Breath Counter (Breaths per minute)
  // =========================================================================
  const breathCounterState = {
    isRunning: false,
    startTime: 0,
    taps: 0,
    interval: null,
    duration: 60
  };

  const counterElements = {
    startBtn: document.getElementById('bpm-start-btn'),
    tapBtn: document.getElementById('bpm-tap-btn'),
    resetBtn: document.getElementById('bpm-reset-btn'),
    timeRemaining: document.getElementById('bpm-timer-val'),
    tapCount: document.getElementById('bpm-taps-val'),
    bpmResult: document.getElementById('bpm-result-box'),
    bpmScore: document.getElementById('bpm-score-val'),
    bpmDiagnosis: document.getElementById('bpm-diag-val')
  };

  function startBreathCount() {
    breathCounterState.isRunning = true;
    breathCounterState.taps = 0;
    breathCounterState.duration = 60;

    if (counterElements.startBtn) counterElements.startBtn.style.display = 'none';
    if (counterElements.tapBtn) {
      counterElements.tapBtn.style.display = 'inline-flex';
      counterElements.tapBtn.disabled = false;
    }
    if (counterElements.resetBtn) counterElements.resetBtn.style.display = 'inline-flex';
    if (counterElements.bpmResult) counterElements.bpmResult.style.display = 'none';
    if (counterElements.tapCount) counterElements.tapCount.textContent = '0';
    if (counterElements.timeRemaining) counterElements.timeRemaining.textContent = '60s';

    clearInterval(breathCounterState.interval);
    breathCounterState.interval = setInterval(() => {
      breathCounterState.duration--;
      if (counterElements.timeRemaining) {
        counterElements.timeRemaining.textContent = `${breathCounterState.duration}s`;
      }

      if (breathCounterState.duration <= 0) {
        finishBreathCount();
      }
    }, 1000);
  }

  function recordBreathTap() {
    if (!breathCounterState.isRunning) return;
    breathCounterState.taps++;
    soundSynth.playChime(659.25, 0.2); // E5 tap tone
    if (counterElements.tapCount) {
      counterElements.tapCount.textContent = breathCounterState.taps;
    }
  }

  function finishBreathCount() {
    breathCounterState.isRunning = false;
    clearInterval(breathCounterState.interval);

    if (counterElements.tapBtn) counterElements.tapBtn.style.display = 'none';
    if (counterElements.startBtn) {
      counterElements.startBtn.style.display = 'inline-flex';
      counterElements.startBtn.textContent = 'Count Again';
    }

    const bpm = breathCounterState.taps;
    let diag = '';

    if (bpm < 10) {
      diag = 'Superior Vagal Resilience (< 10 BPM). Highly efficient parasympathetic recovery and natural diaphragmatic pacing.';
    } else if (bpm <= 14) {
      diag = 'Optimal Functional Baseline (10–14 BPM). Healthy autonomic equilibrium at rest.';
    } else if (bpm <= 18) {
      diag = 'Mild Over-Breathing (15–18 BPM). Subconscious sympathetic activation; common with prolonged screen time or desk work.';
    } else {
      diag = 'Chronic Hyperventilation Alert (> 18 BPM). Persistent fight-or-flight signaling depleting CO₂ and straining gut-adrenal rhythm.';
    }

    if (counterElements.bpmScore) counterElements.bpmScore.textContent = `${bpm} Breaths / Min`;
    if (counterElements.bpmDiagnosis) counterElements.bpmDiagnosis.textContent = diag;
    if (counterElements.bpmResult) counterElements.bpmResult.style.display = 'block';

    try {
      localStorage.setItem('reshmi_resting_bpm', bpm);
    } catch (e) {}
  }

  function resetBreathCount() {
    breathCounterState.isRunning = false;
    clearInterval(breathCounterState.interval);
    if (counterElements.startBtn) {
      counterElements.startBtn.style.display = 'inline-flex';
      counterElements.startBtn.textContent = 'Start 60s Breath Count';
    }
    if (counterElements.tapBtn) counterElements.tapBtn.style.display = 'none';
    if (counterElements.resetBtn) counterElements.resetBtn.style.display = 'none';
    if (counterElements.bpmResult) counterElements.bpmResult.style.display = 'none';
    if (counterElements.timeRemaining) counterElements.timeRemaining.textContent = '60s';
    if (counterElements.tapCount) counterElements.tapCount.textContent = '0';
  }

  // =========================================================================
  // 5. Vagal Tone Auto-Assessment Calculator
  // =========================================================================
  function initVagalCalculator() {
    const calcBtn = document.getElementById('calc-vagal-btn');
    if (!calcBtn) return;

    // Auto-fill from localStorage if available
    const savedBolt = localStorage.getItem('reshmi_bolt_score');
    const savedBpm = localStorage.getItem('reshmi_resting_bpm');
    const boltInput = document.getElementById('vagal-bolt-input');
    const bpmInput = document.getElementById('vagal-bpm-input');

    if (savedBolt && boltInput && !boltInput.value) {
      boltInput.value = Math.round(parseFloat(savedBolt));
    }
    if (savedBpm && bpmInput && !bpmInput.value) {
      bpmInput.value = savedBpm;
    }

    calcBtn.addEventListener('click', () => {
      const boltVal = parseFloat(boltInput ? boltInput.value : 20) || 20;
      const bpmVal = parseFloat(bpmInput ? bpmInput.value : 14) || 14;
      const digestiveVal = parseFloat(document.getElementById('vagal-gut-slider')?.value || 5);
      const stressVal = parseFloat(document.getElementById('vagal-stress-slider')?.value || 5);

      // Scoring algorithm (0 - 100)
      // BOLT contribution: 25 max (at 40s)
      const boltScore = Math.min(25, (boltVal / 40) * 25);
      // BPM contribution: 25 max (lower is better, optimal around 6-10)
      const bpmScore = Math.max(0, Math.min(25, 25 - ((bpmVal - 6) * 1.5)));
      // Gut ease: 25 max
      const gutScore = (digestiveVal / 10) * 25;
      // Stress resilience: 25 max (10 being calm, 1 being overwhelmed)
      const calmScore = (stressVal / 10) * 25;

      const totalScore = Math.round(boltScore + bpmScore + gutScore + calmScore);

      const resultBox = document.getElementById('vagal-calc-result');
      const scoreDisplay = document.getElementById('vagal-score-number');
      const statusDisplay = document.getElementById('vagal-status-label');
      const adviceDisplay = document.getElementById('vagal-prescribed-advice');

      let status = '';
      let advice = '';

      if (totalScore >= 75) {
        status = 'High Vagal Elasticity & Parasympathetic Dominance';
        advice = `
          <strong>Clinical Analysis:</strong> Your heart rate variability, diaphragm coordination, and gut-brain signaling are in superior balance.<br/>
          <strong>Reshmi's Prescription:</strong> Maintain tone with Box Breathing (4-4-4-4) before cognitive demands, and preserve gut integrity with polyphenol-rich berries and fermented prebiotics.
        `;
      } else if (totalScore >= 50) {
        status = 'Moderate Autonomic Resilience (Functional Baseline)';
        advice = `
          <strong>Clinical Analysis:</strong> Satisfactory baseline with occasional sympathetic vulnerability during emotional stress or post-meal sluggishness.<br/>
          <strong>Reshmi's Prescription:</strong> 10 minutes of Coherent Breathing (5-5) upon waking + Magnesium Glycinate (300-400mg) at night to reinforce GABA receptor synthesis.
        `;
      } else {
        status = 'Suppressed Vagal Tone & Sympathetic Overdrive';
        advice = `
          <strong>Clinical Analysis:</strong> Nervous system locked in fight-or-flight. Compromised digestive fire (poor stomach acid/motility) and shallow respiration.<br/>
          <strong>Reshmi's Prescription:</strong> Daily mandatory slow 4-7-8 breathing before meals. Eliminate refined seed oils; introduce bone broth with L-Glutamine to soothe mucosal nerve endings. Consider booking a 1-on-1 Comprehensive Consultation.
        `;
      }

      if (scoreDisplay) scoreDisplay.textContent = `${totalScore}/100`;
      if (statusDisplay) statusDisplay.textContent = status;
      if (adviceDisplay) adviceDisplay.innerHTML = advice;
      if (resultBox) resultBox.style.display = 'block';

      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // =========================================================================
  // Initialize Event Listeners on DOM Load
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // BOLT listeners
    if (boltElements.startBtn) boltElements.startBtn.addEventListener('click', startBoltTest);
    if (boltElements.stopBtn) boltElements.stopBtn.addEventListener('click', stopBoltTest);
    if (boltElements.resetBtn) boltElements.resetBtn.addEventListener('click', resetBoltTest);

    // Sanctuary Breathing listeners
    if (sanctuaryElements.startBtn) sanctuaryElements.startBtn.addEventListener('click', toggleSanctuary);
    if (sanctuaryElements.orb) sanctuaryElements.orb.addEventListener('click', toggleSanctuary);

    sanctuaryElements.protocolSelector.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-breath-protocol');
        selectProtocol(key);
      });
    });

    if (sanctuaryElements.soundToggleBtn) {
      sanctuaryElements.soundToggleBtn.addEventListener('click', () => {
        const isMuted = soundSynth.toggleMute(sanctuaryState.isActive);
        sanctuaryElements.soundToggleBtn.innerHTML = isMuted 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg> <span>Sound: Muted</span>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>🌊 Sound: Ocean &amp; Zen Bowl ON</span>`;
      });
    }

    // 60-second live breath counter listeners
    if (counterElements.startBtn) counterElements.startBtn.addEventListener('click', startBreathCount);
    if (counterElements.tapBtn) counterElements.tapBtn.addEventListener('click', recordBreathTap);
    if (counterElements.resetBtn) counterElements.resetBtn.addEventListener('click', resetBreathCount);

    // Vagal calculator
    initVagalCalculator();
  });

  // Export globally if needed
  window.BreathEngine = {
    startBoltTest,
    stopBoltTest,
    resetBoltTest,
    toggleSanctuary,
    selectProtocol,
    soundSynth
  };
})();
