// Web Audio API Synthesizer for gentle music box background music & sound effects
// Completely self-contained, no external MP3 dependencies, never autoplays

class SoundManager {
  private ctx: AudioContext | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private isMuted: boolean = false;
  private noteIndex: number = 0;

  // Gentle, romantic lullaby / music-box melody notes (frequencies in Hz)
  // Soft, sweet chord progression in F / C major
  private melodyNotes: { freq: number; dur: number; delay: number }[] = [
    // Phrase 1: Sweet gentle theme
    { freq: 392.00, dur: 0.6, delay: 0.4 }, // G4
    { freq: 440.00, dur: 0.6, delay: 0.4 }, // A4
    { freq: 523.25, dur: 0.8, delay: 0.5 }, // C5
    { freq: 440.00, dur: 0.6, delay: 0.4 }, // A4
    { freq: 392.00, dur: 1.0, delay: 0.7 }, // G4
    { freq: 329.63, dur: 0.8, delay: 0.5 }, // E4
    { freq: 349.23, dur: 1.0, delay: 0.6 }, // F4
    { freq: 392.00, dur: 1.2, delay: 0.8 }, // G4
    
    // Phrase 2: Tender continuation
    { freq: 523.25, dur: 0.8, delay: 0.5 }, // C5
    { freq: 587.33, dur: 0.8, delay: 0.5 }, // D5
    { freq: 659.25, dur: 1.2, delay: 0.8 }, // E5
    { freq: 587.33, dur: 0.8, delay: 0.5 }, // D5
    { freq: 523.25, dur: 1.0, delay: 0.6 }, // C5
    { freq: 440.00, dur: 1.2, delay: 0.7 }, // A4
    { freq: 392.00, dur: 1.4, delay: 0.9 }, // G4
    
    // Phrase 3: Warm resolution
    { freq: 349.23, dur: 0.8, delay: 0.5 }, // F4
    { freq: 392.00, dur: 0.8, delay: 0.5 }, // G4
    { freq: 440.00, dur: 1.0, delay: 0.6 }, // A4
    { freq: 523.25, dur: 1.4, delay: 0.8 }, // C5
    { freq: 493.88, dur: 0.8, delay: 0.5 }, // B4
    { freq: 440.00, dur: 0.8, delay: 0.5 }, // A4
    { freq: 392.00, dur: 1.5, delay: 1.0 }, // G4
    { freq: 329.63, dur: 1.2, delay: 0.8 }, // E4
    { freq: 261.63, dur: 1.8, delay: 1.2 }, // C4
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a single bell/music box note with warm harmonics
  private playBellNote(freq: number, duration: number = 0.8, volume: number = 0.12) {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;

      // Primary sine oscillator (fundamental)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Secondary sine oscillator (soft overtone for music box chime sparkle)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Master note gain with quick ping attack and slow gentle decay
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(volume * 0.25, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

      // Subtle lowpass filter to keep sound warm and cozy
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio playback failsafe
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.isBgmPlaying = true;
    this.isMuted = false;
    this.scheduleNextMelodyNote();
  }

  private scheduleNextMelodyNote = () => {
    if (!this.isBgmPlaying || this.isMuted) return;
    const note = this.melodyNotes[this.noteIndex];
    this.playBellNote(note.freq, note.dur, 0.08);

    this.noteIndex = (this.noteIndex + 1) % this.melodyNotes.length;
    this.bgmTimer = window.setTimeout(this.scheduleNextMelodyNote, note.delay * 1000);
  };

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // Playful dodge sound effect when "No" escapes (cute slide boing)
  public playDodgeSound() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch bend upwards (cute cartoon boing)
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.22);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Celebratory sparkle chime when YES is clicked
  public playYesCelebration() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major arpeggio
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    } catch {
      // ignore
    }
  }

  // Soft envelope open / paper sound
  public playPaperOpen() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  // Gentle heart pop sound
  public playHeartPop() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
