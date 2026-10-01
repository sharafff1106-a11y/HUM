#!/usr/bin/env python3
"""
Patch bars.setting v3 — voice-reactive from f102 to f230.

- Preserves ALL user keyframes f5 through f101
- f102–f230: Voice-reactive bars (real audio data + synthetic organic movement)
- f233+: Wind down to dots
- Bars NEVER drop during voice section
"""

import json
import math
import re
import random
from pathlib import Path

FRAME_H = 1080
FPS = 24

VOICE_START_FRAME = 102
VOICE_END_FRAME = 230
USER_LAST_KF = 101
ANIM_END = 300
MIN_HEIGHT = 0.009259

BAR_SAMPLE = list(range(0, 48, 2))

# User's peak heights at f68 (defines each bar's max)
BAR_PEAKS = {
    1: 0.01239, 2: 0.014278, 3: 0.021855, 4: 0.02758,
    5: 0.042619, 6: 0.052686, 7: 0.077668, 8: 0.089128,
    9: 0.115615, 10: 0.127898, 11: 0.142781, 12: 0.172286,
    13: 0.171476, 14: 0.165422, 15: 0.14177, 16: 0.122333,
    17: 0.097199, 18: 0.078193, 19: 0.060458, 20: 0.044273,
    21: 0.033577, 22: 0.02161, 23: 0.016726, 24: 0.013735,
}

# User's last manual keyframe values at f101
BAR_F101 = {
    1: 0.01206, 2: 0.015414, 3: 0.017778, 4: 0.029128,
    5: 0.039068, 6: 0.052804, 7: 0.069738, 8: 0.0774,
    9: 0.09684, 10: 0.122308, 11: 0.142511, 12: 0.148399,
    13: 0.154792, 14: 0.141608, 15: 0.128237, 16: 0.126733,
    17: 0.102532, 18: 0.079547, 19: 0.053694, 20: 0.037925,
    21: 0.030115, 22: 0.02132, 23: 0.016491, 24: 0.013051,
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


def generate_organic_voice_height(bar_idx, frame, peak):
    """Generate natural voice-like bar movement using layered sine waves."""
    # Each bar gets unique phase offsets based on its index
    random.seed(bar_idx * 7919)
    phase1 = random.uniform(0, math.pi * 2)
    phase2 = random.uniform(0, math.pi * 2)
    phase3 = random.uniform(0, math.pi * 2)
    freq1 = random.uniform(0.08, 0.12)
    freq2 = random.uniform(0.18, 0.28)
    freq3 = random.uniform(0.35, 0.55)

    # Layered oscillation: slow breathing + medium pulse + fast jitter
    t = frame
    wave = (
        0.35 * math.sin(freq1 * t + phase1) +
        0.25 * math.sin(freq2 * t + phase2) +
        0.12 * math.sin(freq3 * t + phase3)
    )
    # Normalize wave from [-0.72, 0.72] to [0, 1]
    norm = (wave + 0.72) / 1.44

    # Voice floor is 55% of peak, ceiling is 100%
    floor = peak * 0.55
    h = floor + norm * (peak - floor)

    # Per-frame micro-jitter for organic feel
    random.seed(bar_idx * 1000 + frame)
    jitter = 1.0 + random.uniform(-0.04, 0.04)
    h *= jitter

    return max(MIN_HEIGHT, min(peak * 1.05, h))


def generate_voice_keyframes(waveform, bar_num):
    bar_idx = bar_num - 1
    peak = BAR_PEAKS[bar_num]
    ripple = compute_ripple_delay(bar_idx)
    user_last_val = BAR_F101[bar_num]

    # Find where real waveform data has actual energy (> 15px for center bars)
    # Scale threshold by bar's relative peak
    rel_peak = peak / BAR_PEAKS[12]  # relative to center bar
    energy_threshold = 15.0 * rel_peak + 10.0

    # Get waveform data range for this bar (only energetic frames)
    energetic_heights = []
    for f in range(VOICE_START_FRAME, VOICE_END_FRAME + 1):
        h = get_height(waveform, f, bar_idx)
        if h > energy_threshold:
            energetic_heights.append(h)

    if energetic_heights:
        wf_max = max(energetic_heights)
        wf_min = min(energetic_heights)
    else:
        wf_max = 50.0
        wf_min = 10.0

    keyframes = []
    transition_frames = 9  # blend over 9 frames at start

    for f in range(VOICE_START_FRAME, VOICE_END_FRAME + 1, 3):
        # Check if real waveform data has energy at this frame
        raw_h = get_height(waveform, max(0, f - ripple), bar_idx)

        has_real_energy = raw_h > energy_threshold

        if has_real_energy:
            # Use real audio data scaled to bar's range
            random.seed(bar_idx * 1000 + f)
            jitter = 1.0 + random.uniform(-0.05, 0.05)
            raw_h *= jitter

            if wf_max > wf_min:
                norm = (raw_h - wf_min) / (wf_max - wf_min)
            else:
                norm = 0.5
            norm = max(0.0, min(1.0, norm))

            floor = peak * 0.55
            h_norm = floor + norm * (peak - floor)
        else:
            # No real data — generate organic synthetic voice movement
            h_norm = generate_organic_voice_height(bar_idx, f, peak)

        h_norm = max(MIN_HEIGHT, h_norm)

        # Smooth transition from user's last manual keyframe
        frames_since_start = f - VOICE_START_FRAME
        if frames_since_start < transition_frames:
            blend = frames_since_start / transition_frames
            blend = blend * blend * (3 - 2 * blend)  # smoothstep
            h_norm = user_last_val + (h_norm - user_last_val) * blend

        keyframes.append((f, h_norm))

    # Wind-down after voice ends (f233 to f260)
    last_voice_h = keyframes[-1][1] if keyframes else peak * 0.5
    for f in range(VOICE_END_FRAME + 3, 263, 3):
        t = (f - VOICE_END_FRAME) / (260 - VOICE_END_FRAME)
        t = min(1.0, t)
        # Smooth ease-out to dot size
        ease = t * t * (3 - 2 * t)
        h = last_voice_h + (MIN_HEIGHT * 1.2 - last_voice_h) * ease
        random.seed(bar_idx * 2000 + f)
        wobble = 1.0 + random.uniform(-0.02, 0.02)
        h = max(MIN_HEIGHT, h * wobble)
        keyframes.append((f, h))

    # Hold at dots
    for f in range(263, ANIM_END + 1, 8):
        random.seed(bar_idx * 3000 + f)
        breath = MIN_HEIGHT * (1.0 + random.uniform(0, 0.06))
        keyframes.append((f, breath))

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
        existing_kfs = block['keyframes_text']

        preserved_lines = []
        for line in existing_kfs.strip().split('\n'):
            line_stripped = line.strip()
            if not line_stripped:
                continue
            frame_match = re.match(r'\[(\d+)\]\s*=', line_stripped)
            if frame_match:
                frame = int(frame_match.group(1))
                if frame <= USER_LAST_KF:
                    clean = line.rstrip().rstrip(',')
                    preserved_lines.append(clean)

        voice_kfs = generate_voice_keyframes(waveform, bar_num)

        new_kf_lines = []
        for idx, (f, h) in enumerate(voice_kfs):
            prev_h = voice_kfs[idx - 1][1] if idx > 0 else BAR_F101[bar_num]
            next_h = voice_kfs[idx + 1][1] if idx < len(voice_kfs) - 1 else MIN_HEIGHT
            new_kf_lines.append(format_keyframe(f, h, prev_h, next_h))

        all_lines = []
        for line in preserved_lines:
            all_lines.append(line + ',')
        for i, line in enumerate(new_kf_lines):
            if i < len(new_kf_lines) - 1:
                all_lines.append(line + ',')
            else:
                all_lines.append(line)

        new_block = '\n' + '\n'.join(all_lines) + '\n\t\t\t'

        content = (content[:block['content_start']] +
                   new_block +
                   content[block['content_end']:])

        print(f"  Patched {spline_name}: {len(preserved_lines)} preserved + {len(new_kf_lines)} voice")

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

    out_path = Path(__file__).parent.parent / "fusion" / "bars_voice_v3.setting"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Source: {src}")
    patch_setting(str(src), str(out_path))

    size_kb = out_path.stat().st_size / 1024
    print(f"\nOutput: {out_path} ({size_kb:.0f} KB)")
    print()
    print("Timeline:")
    print("  f5–f101:   Your manual keyframes (untouched)")
    print("  f102–f230: Voice-reactive (real audio + organic synthetic)")
    print("  f233–f260: Smooth wind-down to dots")
    print("  f263+:     Dots hold")
    print()
    print("Bars stay at 55%+ of peak during entire voice section.")
    print("No drops. Smooth transition at f102.")


if __name__ == "__main__":
    main()
