#!/usr/bin/env python3
"""
retime.py — Re-time the HUM project from a real voice recording.

Usage:
    python3 retime.py <voice.wav>

Steps:
    1. Run Whisper on the WAV → word timestamps
    2. Export word_timings.csv
    3. Bake waveform bar keyframes (section 8 algorithm)
    4. Re-compute voice-dependent timing (🎙 rows in section 7)
    5. Output updated timing tables + waveform data

Requires: pip install openai-whisper numpy scipy soundfile
"""

import sys
import json
import csv
import math
import numpy as np
from pathlib import Path

FPS = 24
TOTAL_FRAMES = 480
SAMPLE_RATE = 48000
NUM_BARS = 48
BAR_MIN_H = 10
BAR_MAX_H = 280
BAR_RANGE = BAR_MAX_H - BAR_MIN_H  # 270
CENTRE_BAR = 23.5

# Expected words in order
EXPECTED_WORDS = [
    "Pitch", "deck", "by", "Friday", "call", "Sam",
    "and", "that", "new", "feature", "idea"
]

OUT_DIR = Path(__file__).parent.parent


def run_whisper(wav_path: str) -> list[dict]:
    """Run Whisper and return word-level timestamps."""
    try:
        import whisper
    except ImportError:
        print("Installing openai-whisper...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install",
                              "openai-whisper", "soundfile"],
                             stdout=subprocess.DEVNULL)
        import whisper

    print("Loading Whisper model (base)...")
    model = whisper.load_model("base")

    print(f"Transcribing {wav_path}...")
    result = model.transcribe(wav_path, word_timestamps=True, language="en")

    words = []
    for seg in result["segments"]:
        for w in seg.get("words", []):
            words.append({
                "word": w["word"].strip().rstrip(".,"),
                "start": w["start"],
                "end": w["end"],
                "start_frame": round(w["start"] * FPS),
                "end_frame": round(w["end"] * FPS),
            })

    return words


def match_words(whisper_words: list[dict]) -> list[dict]:
    """Match Whisper output to expected words, handling punctuation."""
    matched = []
    wi = 0
    for expected in EXPECTED_WORDS:
        found = False
        while wi < len(whisper_words):
            w = whisper_words[wi]
            # Normalise for comparison
            clean = w["word"].lower().rstrip(".,!?;:")
            if clean == expected.lower():
                matched.append({
                    "word": expected,
                    "start": w["start"],
                    "end": w["end"],
                    "start_frame": w["start_frame"],
                    "end_frame": w["end_frame"],
                })
                wi += 1
                found = True
                break
            wi += 1
        if not found:
            print(f"  ⚠ Could not match word '{expected}' — using estimate")
            # Fallback: interpolate
            if matched:
                last = matched[-1]
                est_start = last["end"] + 0.1
            else:
                est_start = 0.5
            matched.append({
                "word": expected,
                "start": est_start,
                "end": est_start + 0.3,
                "start_frame": round(est_start * FPS),
                "end_frame": round((est_start + 0.3) * FPS),
            })
    return matched


def export_word_timings(words: list[dict]):
    """Write word_timings.csv."""
    csv_path = OUT_DIR / "docs" / "word_timings.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["word", "start", "end", "start_frame", "end_frame"])
        writer.writeheader()
        writer.writerows(words)
    print(f"✓ Word timings → {csv_path}")


def bake_waveform(wav_path: str) -> dict:
    """Section 8 algorithm: bake waveform bar heights per frame."""
    try:
        import soundfile as sf
    except ImportError:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "soundfile"],
                             stdout=subprocess.DEVNULL)
        import soundfile as sf

    print("Baking waveform keyframes...")
    audio, sr = sf.read(wav_path, dtype='float32')
    if audio.ndim > 1:
        audio = audio.mean(axis=1)  # mono

    # Resample if needed (simple decimation for keyframe baking)
    if sr != SAMPLE_RATE:
        from scipy import signal
        audio = signal.resample(audio, int(len(audio) * SAMPLE_RATE / sr))
        sr = SAMPLE_RATE

    samples_per_frame = sr // FPS  # 2000 samples at 48kHz/24fps

    # Step 1: RMS per frame window
    rms_per_frame = []
    for f in range(TOTAL_FRAMES):
        centre_sample = int((f + 0.5) * samples_per_frame)
        start = max(0, centre_sample - samples_per_frame // 2)
        end = min(len(audio), centre_sample + samples_per_frame // 2)
        if start >= len(audio):
            rms_per_frame.append(0.0)
            continue
        window = audio[start:end]
        rms = np.sqrt(np.mean(window ** 2)) if len(window) > 0 else 0.0
        rms_per_frame.append(float(rms))

    # Step 2: Convert to dB, normalise
    rms_arr = np.array(rms_per_frame)
    rms_arr = np.maximum(rms_arr, 1e-10)
    db = 20 * np.log10(rms_arr)
    L = np.clip((db + 50) / 44, 0, 1)

    # Smooth: attack 2f, release 6f
    smoothed = np.zeros_like(L)
    smoothed[0] = L[0]
    for i in range(1, len(L)):
        if L[i] > smoothed[i-1]:
            alpha = 1.0 / 2  # attack
        else:
            alpha = 1.0 / 6  # release
        smoothed[i] = smoothed[i-1] + alpha * (L[i] - smoothed[i-1])
    L = smoothed

    # Step 3: Bell weight
    G = np.array([math.exp(-((i - CENTRE_BAR) / 12) ** 2) for i in range(NUM_BARS)])

    # Step 4: Ripple delay
    d = np.array([round(abs(i - CENTRE_BAR) / 6) for i in range(NUM_BARS)])

    # Step 5: Jitter (seeded, re-rolled every 2f, smoothed)
    rng = np.random.RandomState(42)
    jitter_raw = np.ones((TOTAL_FRAMES, NUM_BARS))
    for f in range(0, TOTAL_FRAMES, 2):
        j = rng.uniform(0.85, 1.15, NUM_BARS)
        jitter_raw[f] = j
        if f + 1 < TOTAL_FRAMES:
            jitter_raw[f + 1] = j
    # Smooth jitter over time
    jitter = np.zeros_like(jitter_raw)
    jitter[0] = jitter_raw[0]
    for f in range(1, TOTAL_FRAMES):
        jitter[f] = jitter[f-1] * 0.7 + jitter_raw[f] * 0.3

    # Step 6: Height per bar per frame
    heights = {}  # {frame: [bar0_h, bar1_h, ...]}
    for f in range(TOTAL_FRAMES):
        bar_heights = []
        for i in range(NUM_BARS):
            delayed_f = max(0, f - int(d[i]))
            h = BAR_MIN_H + BAR_RANGE * L[delayed_f] * G[i] * jitter[f, i]
            h = max(BAR_MIN_H, min(BAR_MAX_H, h))
            bar_heights.append(round(h, 1))
        heights[f] = bar_heights

    # Write compact JSON
    waveform_path = OUT_DIR / "docs" / "waveform_keyframes.json"
    with open(waveform_path, "w") as fout:
        json.dump(heights, fout, separators=(',', ':'))

    print(f"✓ Waveform keyframes ({TOTAL_FRAMES} frames × {NUM_BARS} bars) → {waveform_path}")
    return heights


def retime_section7(words: list[dict]) -> dict:
    """Re-compute voice-dependent timing from real word timestamps."""

    # Map word → spoken frame
    word_frames = {w["word"]: w["start_frame"] for w in words}
    voice_end_frame = max(w["end_frame"] for w in words)

    # Voice starts when first word begins
    voice_start = word_frames.get("Pitch", 62)

    # T1 adjustment: voice starts at the first word
    # Original estimate: f62. Shift = real - 62
    shift = voice_start - 62

    timing = {
        "voice_start_frame": voice_start,
        "voice_end_frame": voice_end_frame,
        "shift_from_estimate": shift,
        "word_spoken_frames": word_frames,
    }

    # Catch-up words: Pitch through Sam (spoken before T2 transition)
    # They spawn every 3f starting at f126 (adjusted by shift)
    catch_up = ["Pitch", "deck", "by", "Friday", "call", "Sam"]
    catch_up_spawn = {}
    for idx, w in enumerate(catch_up):
        catch_up_spawn[w] = 126 + shift + idx * 3
    timing["catch_up_spawn_frames"] = catch_up_spawn

    # Live words: and, that, new, feature, idea
    # Spawn = spoken frame + 12f lag
    live_words = ["and", "that", "new", "feature", "idea"]
    live_spawn = {}
    for w in live_words:
        if w in word_frames:
            live_spawn[w] = word_frames[w] + 12
    timing["live_word_spawn_frames"] = live_spawn

    # T3 underline timing — driven by word groups
    # Card 1 "Pitch deck by Friday" — underline starts when last catch-up lands
    # Card 2 "Call Sam" — after card 1 settles
    # Card 3 "New feature idea" — after card 2 settles
    # Keep relative spacing from spec, shift by voice offset
    timing["card_underline_frames"] = {
        "card_1": 152 + shift,
        "card_2": 180 + shift,
        "card_3": 210 + shift,
    }

    # Waveform parks when voice ends
    timing["waveform_park_start"] = voice_end_frame
    timing["waveform_park_end"] = voice_end_frame + 12

    # Absorb timing difference into holds
    # Total must stay 480 frames
    # Row hold (between T3 end and T4 start) absorbs the difference
    t3_end_est = 248 + shift
    t4_start = 276  # fixed
    row_hold = t4_start - t3_end_est
    timing["row_hold_frames"] = max(12, row_hold)  # minimum 12f hold
    timing["row_hold_range"] = [t3_end_est, t4_start]

    # Write
    timing_path = OUT_DIR / "docs" / "retimed_section7.json"
    with open(timing_path, "w") as f:
        json.dump(timing, f, indent=2)
    print(f"✓ Re-timed section 7 → {timing_path}")

    return timing


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 retime.py <voice.wav>")
        print("\nThis script:")
        print("  1. Runs Whisper on the voice recording")
        print("  2. Exports word_timings.csv")
        print("  3. Bakes waveform keyframes (48 bars × 480 frames)")
        print("  4. Re-times all voice-dependent animation")
        print("\nRequires: pip install openai-whisper numpy scipy soundfile")
        sys.exit(1)

    wav_path = sys.argv[1]
    if not Path(wav_path).exists():
        print(f"Error: {wav_path} not found")
        sys.exit(1)

    print(f"=== HUM Retime: {wav_path} ===\n")

    # 1. Whisper
    whisper_words = run_whisper(wav_path)
    print(f"  Whisper found {len(whisper_words)} words")

    # 2. Match to expected
    words = match_words(whisper_words)
    print(f"  Matched {len(words)}/{len(EXPECTED_WORDS)} words")
    for w in words:
        print(f"    {w['word']:12s}  {w['start']:.3f}s  (f{w['start_frame']})")

    # 3. Export CSV
    export_word_timings(words)

    # 4. Bake waveform
    bake_waveform(wav_path)

    # 5. Re-time
    timing = retime_section7(words)

    print(f"\n=== Done ===")
    print(f"Voice shift from estimate: {timing['shift_from_estimate']:+d} frames")
    print(f"Row hold absorbs {timing['row_hold_frames']} frames")
    print(f"\nNext: rebuild Fusion comps with updated timing.")


if __name__ == "__main__":
    main()
