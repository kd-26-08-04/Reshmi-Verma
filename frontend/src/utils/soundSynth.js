/**
 * Web Audio API Nature Ocean Waves & Tibetan Singing Bowl Sound Synth
 * Designed for HealthwithReshmi™ breathing visualizers & BOLT tests
 */
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

  // Modulate wave swelling dynamically
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
        this.waveFilter.frequency.exponentialRampToValueAtTime(750, now + rampTime);
        this.waveGain.gain.linearRampToValueAtTime(0.24, now + rampTime);
      } else if (action === 'hold') {
        this.waveFilter.frequency.linearRampToValueAtTime(460, now + rampTime);
        this.waveGain.gain.linearRampToValueAtTime(0.14, now + rampTime);
      } else if (action === 'exhale') {
        this.waveFilter.frequency.exponentialRampToValueAtTime(160, now + rampTime);
        this.waveGain.gain.linearRampToValueAtTime(0.05, now + rampTime);
      }
    } catch (e) {}
  }

  playBowlChime(freq = 432) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.3);
    } catch (e) {
      console.warn('Bowl chime error:', e);
    }
  }
}

export const soundSynth = new BreathSoundSynth();
