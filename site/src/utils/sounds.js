/**
 * Sound effects for the sting site using Web Audio API.
 * No external audio files — all sounds are synthesized.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Short click/tap sound */
export function playClick() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

/** Scan initiation — rising sweep */
export function playScanStart() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

/** Threat detected — ominous low pulse */
export function playThreatDetected() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Low bass hit
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.frequency.setValueAtTime(80, t);
  osc1.frequency.exponentialRampToValueAtTime(40, t + 0.4);
  gain1.gain.setValueAtTime(0.2, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  osc1.start(t);
  osc1.stop(t + 0.5);

  // High alert tone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.frequency.setValueAtTime(880, t);
  osc2.frequency.setValueAtTime(660, t + 0.1);
  osc2.frequency.setValueAtTime(880, t + 0.2);
  gain2.gain.setValueAtTime(0.08, t);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc2.start(t);
  osc2.stop(t + 0.3);
}

/** Verdict slam — impact sound */
export function playVerdictSlam() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Impact
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.start(t);
  osc.stop(t + 0.4);

  // Noise burst for impact
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  noise.buffer = buffer;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(0.1, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  noise.start(t);
}

/** Phone ring — two-tone ring pulse */
export function playPhoneRing() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  for (let i = 0; i < 2; i++) {
    const offset = i * 0.15;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(440, t + offset);
    osc.frequency.setValueAtTime(480, t + offset + 0.05);
    gain.gain.setValueAtTime(0.12, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12);
    osc.start(t + offset);
    osc.stop(t + offset + 0.12);
  }
}

/** Success / safe — pleasant ascending chime */
export function playSafe() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const notes = [523, 659, 784]; // C5, E5, G5

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq, t + i * 0.1);
    gain.gain.setValueAtTime(0.1, t + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.3);
    osc.start(t + i * 0.1);
    osc.stop(t + i * 0.1 + 0.3);
  });
}

/** Typing / transcription tick */
export function playTranscribeTick() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.03);
}

/** Warning beep — two quick high beeps */
export function playWarningBeep() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(1000, t + i * 0.12);
    gain.gain.setValueAtTime(0.08, t + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.08);
    osc.start(t + i * 0.12);
    osc.stop(t + i * 0.12 + 0.08);
  }
}
