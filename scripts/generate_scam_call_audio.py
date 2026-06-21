#!/usr/bin/env python3
"""Generate phone-quality scam-call demo MP3s for cloak sting.

Uses edge-tts for phrase-level speech, explicit ffmpeg silence clips for pauses,
and a final phone-line filter chain for mono 128kbps output.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "site" / "public" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)

CALLS = [
    {
        "filename": "hostage-ransom.mp3",
        "voice": "en-US-GuyNeural",
        "rate": "-18%",
        "pitch": "-18Hz",
        "volume": "+0%",
        "noise": 0.018,
        "speech_tempo": 2.1,
        "segments": [
            ("We have your son.", 1.5),
            ("Do not call the police.", 2.0),
            ("Wire the money to this bitcoin wallet", 1.5),
            ("or he will be harmed.", 2.0),
            ("You have one hour.", 1.5),
            ("Send the ransom now.", 0.0),
        ],
    },
    {
        "filename": "bank-robocall.mp3",
        "voice": "en-US-AriaNeural",
        "rate": "-6%",
        "pitch": "+4Hz",
        "volume": "+0%",
        "noise": 0.012,
        "speech_tempo": 1.8,
        "segments": [
            ("This is the fraud department", 0.5),
            ("at Bank of America.", 1.0),
            ("Your account has been compromised.", 1.5),
            ("Press one to speak with a security specialist.", 1.5),
            ("Have your account number", 0.8),
            ("and social security number ready for verification.", 0.0),
        ],
    },
    {
        "filename": "chinese-embassy.mp3",
        "voice": "zh-CN-XiaoxiaoNeural",
        "rate": "-12%",
        "pitch": "-2Hz",
        "volume": "+0%",
        "noise": 0.014,
        "speech_tempo": 1.55,
        "segments": [
            ("您好，这里是中国大使馆。", 2.0),
            ("您有一个包裹涉嫌犯罪，", 2.0),
            ("警察已发出逮捕令。", 2.0),
            ("请配合调查，", 1.5),
            ("将您的资金转入安全账户", 2.0),
            ("以证明清白。", 0.0),
        ],
    },
]


def run(cmd: list[str], *, cwd: Path | None = None) -> None:
    print("$", " ".join(cmd))
    subprocess.run(cmd, cwd=str(cwd) if cwd else None, check=True)


def ffprobe_duration(path: Path) -> float:
    output = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)
    ], text=True)
    return float(json.loads(output)["format"]["duration"])


def synth_phrase(text: str, out: Path, voice: str, rate: str, pitch: str, volume: str, tempo: float) -> None:
    raw = out.with_name(f"{out.stem}-raw{out.suffix}")
    run([
        "edge-tts",
        "--voice", voice,
        f"--rate={rate}",
        f"--pitch={pitch}",
        f"--volume={volume}",
        "--text", text,
        "--write-media", str(raw),
    ])
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(raw),
        "-af", f"silenceremove=start_periods=1:start_duration=0.05:start_threshold=-50dB:stop_periods=1:stop_duration=0.08:stop_threshold=-50dB,atempo={tempo}",
        "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", str(out),
    ])


def make_silence(seconds: float, out: Path) -> None:
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "lavfi", "-i", "anullsrc=channel_layout=mono:sample_rate=24000",
        "-t", f"{seconds:.3f}",
        "-c:a", "libmp3lame", "-b:a", "128k", str(out),
    ])


def concat_parts(parts: list[Path], out: Path) -> None:
    list_file = out.with_suffix(".txt")
    list_file.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-c", "copy", str(out),
    ])


def phone_process(src: Path, out: Path, noise: float) -> None:
    # Bandlimit to telephone range, compress dynamics, add very low pink-noise bed,
    # then encode final deliverable as 128kbps mono mp3.
    filt = (
        "[0:a]aformat=channel_layouts=mono,highpass=f=280,lowpass=f=3400,"
        "acompressor=threshold=-22dB:ratio=3:attack=12:release=180,"
        "volume=1.55,aresample=44100[voice];"
        f"anoisesrc=color=pink:amplitude={noise}:sample_rate=44100[noise];"
        "[voice][noise]amix=inputs=2:duration=first:weights='1 0.18',"
        "alimiter=limit=0.92[out]"
    )
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(src),
        "-filter_complex", filt,
        "-map", "[out]",
        "-ac", "1", "-b:a", "128k", "-ar", "44100", str(out),
    ])


def main() -> None:
    if not shutil.which("edge-tts"):
        raise SystemExit("edge-tts not found on PATH")
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg not found on PATH")

    with tempfile.TemporaryDirectory(prefix="cloak-scam-audio-") as tmpdir_s:
        tmpdir = Path(tmpdir_s)
        for call in CALLS:
            print(f"\n=== Generating {call['filename']} ===")
            parts: list[Path] = []
            for idx, (text, pause_s) in enumerate(call["segments"], start=1):
                phrase_path = tmpdir / f"{Path(call['filename']).stem}-{idx:02d}.mp3"
                synth_phrase(text, phrase_path, call["voice"], call["rate"], call["pitch"], call["volume"], call["speech_tempo"])
                parts.append(phrase_path)
                if pause_s > 0:
                    silence_path = tmpdir / f"{Path(call['filename']).stem}-{idx:02d}-silence.mp3"
                    make_silence(pause_s, silence_path)
                    parts.append(silence_path)
            stitched = tmpdir / f"{Path(call['filename']).stem}-stitched.mp3"
            concat_parts(parts, stitched)
            final_path = OUT_DIR / call["filename"]
            phone_process(stitched, final_path, call["noise"])
            print(f"Wrote {final_path} ({ffprobe_duration(final_path):.2f}s)")

    print("\nGenerated files:")
    for call in CALLS:
        p = OUT_DIR / call["filename"]
        print(f"- {p} ({p.stat().st_size} bytes, {ffprobe_duration(p):.2f}s)")


if __name__ == "__main__":
    main()
