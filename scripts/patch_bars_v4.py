#!/usr/bin/env python3
"""
Patch bars.setting v4 — three-phase waveform animation.

Phase 1 (f5–f101):  Idle/normal — bars move slowly and gently, like a
                     voice AI waiting for input. No voiceover yet.
Phase 2 (f102–f230): Voice-reactive — bars respond to voiceover pitch.
                     f203–f228 is energetic (louder last line).
Phase 3 (f230+):     Post-voice — bars return to gentle idle movement,
                     NEVER drop to zero. Keeps moving naturally.
"""

import json
import math
import re
import random
from pathlib import Path

FRAME_H = 1080
FPS = 24

# Timeline
IDLE_START = 5
IDLE_VISIBLE = 57       # bars become visible (dots)
IDLE_GROW = 65           # dots grow to small bars
VOICE_START = 102
VOICE_END = 230
ENERGETIC_START = 203    # last line — louder
ENERGETIC_END = 228
POST_VOICE_END = 394     # keep going until near GlobalOut

MIN_HEIGHT = 0.009259

BAR_SAMPLE = list(range(0, 48, 2))

# User's peak heights at f68
BAR_PEAKS = {
    1: 0.01239, 2: 0.014278, 3: 0.021855, 4: 0.02758,
    5: 0.042619, 6: 0.052686, 7: 0.077668, 8: 0.089128,
    9: 0.115615, 10: 0.127898, 11: 0.142781, 12: 0.172286,
    13: 0.171476, 14: 0.165422, 15: 0.14177, 16: 0.122333,
    17: 0.097199, 18: 0.078193, 19: 0.060458, 20: 0.044273,
    21: 0.033577, 22: 0.02161, 23: 0.016726, 24: 0.013735,
}


def load_waveform_data():
    data_path = Path(__file__).parent.parent / "docs" / "waveform_keyframes.json"
    with open(data_path) as f:
        raw = json.load(f)
    data = {}
    for frame_str, heights in raw.items():
        frame = int(frame_str)
        data[frame] = [heights[i] for i in BAR_SAMPLE]
    return data


def get_height(waveform, frame, bar_idx):
    if frame in waveform:
        return waveform[frame][bar_idx]
    frames = sorted(waveform.keys())
    if frame <= frames[0]:
        return waveform[frames[0]][bar_idx]
    if frame >= frames[-1]:
        return waveform[frames[-1]][bar_idx]
    for i in range(len(frames) - 1):
        if frames[i] <= frame <= frames[i + 1]:
            t = (frame - frames[i]) / (frames[i + 1] - frames[i])
            return waveform[frames[i]][bar_idx] + t * (waveform[frames[i + 1]][bar_idx] - waveform[frames[i]][bar_idx])
    return 10.0


def compute_ripple_delay(bar_idx):
    center = 11.5
    return round(abs(bar_idx - center) / 6)


def idle_height(bar_idx, frame, peak):
    """Gentle idle movement — slow breathing, like waiting for voice."""
    random.seed(bar_idx * 7919)
    phase1 = random.uniform(0, math.pi * 2)
    phase2 = random.uniform(0, math.pi * 2)
    freq1 = random.uniform(0.03, 0.05)   # very slow
    freq2 = random.uniform(0.07, 0.11)   # gentle pulse

    wave = (
        0.4 * math.sin(freq1 * frame + phase1) +
        0.2 * math.sin(freq2 * frame + phase2)
    )
    # Normalize from [-0.6, 0.6] to [0, 1]
    norm = (wave + 0.6) / 1.2

    # Idle range: 20% to 45% of peak (gentle, not dramatic)
    floor = peak * 0.20
    ceiling = peak * 0.45
    h = floor + norm * (ceiling - floor)

    random.seed(bar_idx * 1000 + frame)
    jitter = 1.0 + random.uniform(-0.03, 0.03)
    return max(MIN_HEIGHT, h * jitter)


def voice_height(bar_idx, frame, peak, energetic=False):
    """Voice-reactive movement — more dynamic than idle."""
    random.seed(bar_idx * 7919)
    phase1 = random.uniform(0, math.pi * 2)
    phase2 = random.uniform(0, math.pi * 2)
    phase3 = random.uniform(0, math.pi * 2)
    freq1 = random.uniform(0.08, 0.12)
    freq2 = random.uniform(0.18, 0.28)
    freq3 = random.uniform(0.35, 0.55)

    wave = (
        0.35 * math.sin(freq1 * frame + phase1) +
        0.25 * math.sin(freq2 * frame + phase2) +
        0.12 * math.sin(freq3 * frame + phase3)
    )
    norm = (wave + 0.72) / 1.44

    if energetic:
        # Louder last line: 70% to 105% of peak
        floor = peak * 0.70
        ceiling = peak * 1.05
    else:
        # Normal voice: 50% to 95% of peak
        floor = peak * 0.50
        ceiling = peak * 0.95

    h = floor + norm * (ceiling - floor)

    random.seed(bar_idx * 1000 + frame)
    jitter = 1.0 + random.uniform(-0.04, 0.04)
    return max(MIN_HEIGHT, min(peak * 1.1, h * jitter))


def generate_all_keyframes(waveform, bar_num):
    bar_idx = bar_num - 1
    peak = BAR_PEAKS[bar_num]
    ripple = compute_ripple_delay(bar_idx)

    # Waveform data range for real-data sections
    rel_peak = peak / BAR_PEAKS[12]
    energy_threshold = 15.0 * rel_peak + 10.0
    energetic_heights = []
    for f in range(VOICE_START, VOICE_END + 1):
        h = get_height(waveform, f, bar_idx)
        if h > energy_threshold:
            energetic_heights.append(h)
    wf_max = max(energetic_heights) if energetic_heights else 50.0
    wf_min = min(energetic_heights) if energetic_heights else 10.0

    keyframes = []

    # === PHASE 1: IDLE (f5 to f101) ===

    # f5: invisible
    keyframes.append((IDLE_START, 0.0))

    # f57: still zero, about to appear
    keyframes.append((IDLE_VISIBLE, 0.0))

    # f62: dots appear
    keyframes.append((62, MIN_HEIGHT))

    # f65–f101: gentle idle movement, every 3 frames
    for f in range(65, VOICE_START, 3):
        h = idle_height(bar_idx, f, peak)
        keyframes.append((f, h))

    # === PHASE 2: VOICE (f102 to f230) ===

    # Get the last idle value for smooth transition
    last_idle_h = keyframes[-1][1]
    transition_frames = 9

    for f in range(VOICE_START, VOICE_END + 1, 3):
        # Check if real waveform data has energy
        raw_h = get_height(waveform, max(0, f - ripple), bar_idx)
        has_real_energy = raw_h > energy_threshold
        is_energetic = ENERGETIC_START <= f <= ENERGETIC_END

        if has_real_energy and not is_energetic:
            # Use real audio data
            random.seed(bar_idx * 1000 + f)
            jitter = 1.0 + random.uniform(-0.05, 0.05)
            raw_h *= jitter
            if wf_max > wf_min:
                norm = (raw_h - wf_min) / (wf_max - wf_min)
            else:
                norm = 0.5
            norm = max(0.0, min(1.0, norm))
            floor = peak * 0.50
            h_norm = floor + norm * (peak - floor)
        else:
            # Synthetic voice movement
            h_norm = voice_height(bar_idx, f, peak, energetic=is_energetic)

        h_norm = max(MIN_HEIGHT, h_norm)

        # Smooth transition from idle to voice
        frames_since_voice = f - VOICE_START
        if frames_since_voice < transition_frames:
            blend = frames_since_voice / transition_frames
            blend = blend * blend * (3 - 2 * blend)
            h_norm = last_idle_h + (h_norm - last_idle_h) * blend

        keyframes.append((f, h_norm))

    # === PHASE 3: POST-VOICE (f233+) — gentle idle again, never zero ===

    last_voice_h = keyframes[-1][1]
    # Transition from voice energy back to idle over ~18 frames
    post_transition = 18

    for f in range(VOICE_END + 3, POST_VOICE_END + 1, 3):
        h_idle = idle_height(bar_idx, f, peak)

        frames_since_end = f - VOICE_END
        if frames_since_end < post_transition:
            blend = frames_since_end / post_transition
            blend = blend * blend * (3 - 2 * blend)
            h = last_voice_h + (h_idle - last_voice_h) * blend
        else:
            h = h_idle

        keyframes.append((f, max(MIN_HEIGHT, h)))

    return keyframes


def format_keyframe(frame, value, prev_val=None, next_val=None):
    if prev_val is not None and next_val is not None:
        lh_val = value - (value - prev_val) * 0.15
        rh_val = value + (next_val - value) * 0.15
    elif prev_val is not None:
        lh_val = value - (value - prev_val) * 0.15
        rh_val = value
    elif next_val is not None:
        lh_val = value
        rh_val = value + (next_val - value) * 0.15
    else:
        lh_val = value
        rh_val = value

    lh_f = frame - 0.999899983406
    rh_f = frame + 0.999899983406

    return (f"\t\t\t\t[{frame}] = {{ {value:.6f}, "
            f"LH = {{ {lh_f:.12g}, {lh_val:.6f} }}, "
            f"RH = {{ {rh_f:.12g}, {rh_val:.6f} }}, "
            f"Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }}")


def find_spline_block(content, spline_name):
    header_pattern = re.compile(
        r'(\t\t' + re.escape(spline_name) + r'\s*=\s*BezierSpline\s*\{)'
    )
    header_match = header_pattern.search(content)
    if not header_match:
        return None
    pos = header_match.end()
    kf_start_pattern = re.compile(r'KeyFrames\s*=\s*\{')
    kf_match = kf_start_pattern.search(content, pos)
    if not kf_match:
        return None
    kf_content_start = kf_match.end()
    depth = 1
    i = kf_content_start
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
    return {
        'content_start': kf_content_start,
        'content_end': i - 1,
        'keyframes_text': content[kf_content_start:i - 1],
    }


def patch_setting(input_path, output_path):
    with open(input_path) as f:
        content = f.read()

    waveform = load_waveform_data()

    bar_positions = []
    for bar_num in range(1, 25):
        spline_name = f"BarMask{bar_num}Height"
        block = find_spline_block(content, spline_name)
        if block:
            bar_positions.append((bar_num, spline_name, block))
        else:
            print(f"  WARNING: Could not find {spline_name}")

    bar_positions.sort(key=lambda x: x[2]['content_start'], reverse=True)

    for bar_num, spline_name, block in bar_positions:
        all_kfs = generate_all_keyframes(waveform, bar_num)

        kf_lines = []
        for idx, (f, h) in enumerate(all_kfs):
            prev_h = all_kfs[idx - 1][1] if idx > 0 else 0
            next_h = all_kfs[idx + 1][1] if idx < len(all_kfs) - 1 else h
            kf_lines.append(format_keyframe(f, h, prev_h, next_h))

        formatted = []
        for i, line in enumerate(kf_lines):
            if i < len(kf_lines) - 1:
                formatted.append(line + ',')
            else:
                formatted.append(line)

        new_block = '\n' + '\n'.join(formatted) + '\n\t\t\t'

        content = (content[:block['content_start']] +
                   new_block +
                   content[block['content_end']:])

        print(f"  {spline_name}: {len(all_kfs)} keyframes")

    with open(output_path, 'w') as f:
        f.write(content)


def main():
    upload_path = Path("/root/.claude/uploads/80fe8fa1-8e8d-5c8d-b718-561b589b4897/f8886976-bars.setting")
    input_path = Path(__file__).parent.parent / "fusion" / "bars.setting"

    if upload_path.exists():
        src = upload_path
    elif input_path.exists():
        src = input_path
    else:
        print("ERROR: Cannot find bars.setting")
        return

    out_path = Path(__file__).parent.parent / "fusion" / "bars_voice_v4.setting"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Source: {src}")
    patch_setting(str(src), str(out_path))

    size_kb = out_path.stat().st_size / 1024
    print(f"\nOutput: {out_path} ({size_kb:.0f} KB)")
    print()
    print("Timeline:")
    print("  f5–f57:    Invisible")
    print("  f62:       Dots appear")
    print("  f65–f101:  Idle — slow gentle movement (no voice yet)")
    print("  f102–f202: Voice-reactive (50-95% of peak)")
    print("  f203–f228: ENERGETIC last line (70-105% of peak)")
    print("  f229–f230: Voice ends")
    print("  f233+:     Back to idle movement (NEVER drops to zero)")


if __name__ == "__main__":
    main()
