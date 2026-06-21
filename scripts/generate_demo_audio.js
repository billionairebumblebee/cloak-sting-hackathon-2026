/**
 * Generate a tiny safe demo WAV file for Deepgram proof-of-path testing.
 *
 * Produces a short synthesized tone (1 second, 440 Hz sine wave) — no real
 * victim audio, no speech content. This file exists solely to prove the
 * Deepgram file-upload path works end-to-end.
 *
 * Usage:
 *   node scripts/generate_demo_audio.js [output-path]
 */

const fs = require('node:fs');
const path = require('node:path');

function generateWav(durationSec = 1, frequency = 440, sampleRate = 16000) {
  const numSamples = sampleRate * durationSec;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const sample = Math.round(16000 * Math.sin(2 * Math.PI * frequency * i / sampleRate));
    buffer.writeInt16LE(sample, 44 + i * 2);
  }

  return buffer;
}

const outputPath = process.argv[2] || path.join(process.cwd(), 'tests', 'fixtures', 'demo-tone.wav');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, generateWav());
console.log(`Generated demo audio: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
