/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer for high-priority appointment alerts
class SoundAlertManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Alerta Sonoro Alto (Capacitor / Ionic style high priority alert)
   * Toca sequência marcante em duas repetições para garantir que o profissional ouça na bancada do salão.
   */
  public playHighPriorityAlert(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Haptic feedback if on physical mobile device
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([250, 100, 250, 100, 400]);
      }

      // 4-tone urgent ascending chime sequence, repeated twice
      const notes = [
        { freq: 659.25, time: 0.0, dur: 0.12 },  // E5
        { freq: 880.0,  time: 0.14, dur: 0.14 },  // A5
        { freq: 1108.73,time: 0.30, dur: 0.16 }, // C#6
        { freq: 1318.51,time: 0.48, dur: 0.35 }, // E6 (long ring)
        
        // Second burst for loud attention
        { freq: 880.0,  time: 0.95, dur: 0.12 },
        { freq: 1108.73,time: 1.10, dur: 0.14 },
        { freq: 1318.51,time: 1.26, dur: 0.16 },
        { freq: 1760.0, time: 1.44, dur: 0.45 }, // A6 bell
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Harmonically rich waveform for cutting through salon noise (hairdryers, music)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        // Volume curve with strong attack and gentle decay
        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.75, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch (err) {
      console.warn('AudioContext playback error (user gesture required):', err);
    }
  }

  /**
   * Som sutil de clique/ação concluída
   */
  public playSuccessTone(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundAlertManager();
