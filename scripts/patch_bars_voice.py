#!/usr/bin/env python3
"""
Patch the user's bars.setting to add voice-reactive animation.

Preserves all manually-adjusted keyframes (f5, f57, f65, f68, f71).
Replaces f74+ with voice-reactive heights from waveform_keyframes.json.
Bars never drop below a baseline — they keep gentle movement even in silence.
"""

import json
import re
import random
from pathlib import Path

FRAME_H = 1080
FPS = 24

VOICE_START = 62
USER_LAST_KF = 101
VOICE_REACT_START = 104
VOICE_END = 188
ANIM_END = 255
MIN_HEIGHT = 0.009259

BAR_SAMPLE = list(range(0, 48, 2))

BAR_PEAKS = {
    1: 0.01239,
    2: 0.014278,
    3: 0.021855,
    4: 0.02758,
    5: 0.042619,
    6: 0.052686,
    7: 0.077668,
    8: 0.089128,
    9: 0.115615,
    10: 0.127898,
    11: 0.142781,
    12: 0.172286,
    13: 0.171476,
    14: 0.165422,
    15: 0.14177,
    16: 0.122333,
    17: 0.097199,
    18: 0.078193,
    19: 0.060458,
    20: 0.044273,
    21: 0.033577,
    22: 0.02161,
    23: 0.016726,
    24: 0.013735,
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
            h1 = waveform[frames[i]][bar_idx]
            h2 = waveform[frames[i + 1]][bar_idx]
            return h1 + t * (h2 - h1)
    return 10.0


def compute_ripple_delay(bar_idx):
    center = 11.5
    dist = abs(bar_idx - center)
    return round(dist / 6)


def add_jitter(height, bar_idx, frame, strength=0.06):
    random.seed(bar_idx * 1000 + frame)
    jitter = 1.0 + random.uniform(-strength, strength)
    return max(10.0, height * jitter)


def generate_voice_keyframes(waveform, bar_num):
    bar_idx = bar_num - 1
    peak = BAR_PEAKS[bar_num]
    ripple = compute_ripple_delay(bar_idx)

    all_heights = []
    for f in range(VOICE_START, VOICE_END + 1):
        h = get_height(waveform, f, bar_idx)
        all_heights.append(h)
    wf_max = max(all_heights) if all_heights else 50.0
    wf_min = min(all_heights) if all_heights else 10.0

    keyframes = []

    for f in range(VOICE_REACT_START, VOICE_END + 1, 3):
        raw_h = get_height(waveform, max(0, f - ripple), bar_idx)
        raw_h = add_jitter(raw_h, bar_idx, f)

        if wf_max > wf_min:
            norm = (raw_h - wf_min) / (wf_max - wf_min)
        else:
            norm = 0.5
        norm = max(0.0, min(1.0, norm))

        baseline = max(MIN_HEIGHT, peak * 0.35)
        h_norm = baseline + norm * (peak - baseline)
        h_norm = max(MIN_HEIGHT, h_norm)
        keyframes.append((f, h_norm))

    last_voice_h = keyframes[-1][1] if keyframes else peak * 0.3
    for f in range(VOICE_END + 3, 213, 3):
        t = (f - VOICE_END) / (210 - VOICE_END)
        t = min(1.0, t)
        h = last_voice_h + (MIN_HEIGHT * 1.5 - last_voice_h) * (t * t)
        random.seed(bar_idx * 2000 + f)
        wobble = 1.0 + random.uniform(-0.03, 0.03)
        h = max(MIN_HEIGHT, h * wobble)
        keyframes.append((f, h))

    for f in range(213, ANIM_END + 1, 6):
        random.seed(bar_idx * 3000 + f)
        breath = MIN_HEIGHT * (1.0 + random.uniform(0, 0.08))
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
    """Find the exact start/end of a BezierSpline's KeyFrames block."""
    # Use word boundary to avoid BarMask1 matching BarMask10
    # The name in the file is like: \t\tBarMask24Height = BezierSpline {
    header_pattern = re.compile(
        r'(\t\t' + re.escape(spline_name) + r'\s*=\s*BezierSpline\s*\{)'
    )
    header_match = header_pattern.search(content)
    if not header_match:
        return None

    # Find KeyFrames = { after the header
    pos = header_match.end()
    kf_start_pattern = re.compile(r'KeyFrames\s*=\s*\{')
    kf_match = kf_start_pattern.search(content, pos)
    if not kf_match:
        return None

    kf_content_start = kf_match.end()

    # Find the matching closing brace — count braces
    depth = 1
    i = kf_content_start
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1

    kf_content_end = i - 1  # position of the closing }

    return {
        'content_start': kf_content_start,
        'content_end': kf_content_end,
        'keyframes_text': content[kf_content_start:kf_content_end],
    }


def patch_setting(input_path, output_path):
    with open(input_path) as f:
        content = f.read()

    waveform = load_waveform_data()

    # Process bars in reverse order of their position in the file
    # so that replacements don't shift positions of later matches
    bar_positions = []
    for bar_num in range(1, 25):
        spline_name = f"BarMask{bar_num}Height"
        block = find_spline_block(content, spline_name)
        if block:
            bar_positions.append((bar_num, spline_name, block))
        else:
            print(f"  WARNING: Could not find {spline_name}")

    # Sort by position in file, process from end to start
    bar_positions.sort(key=lambda x: x[2]['content_start'], reverse=True)

    for bar_num, spline_name, block in bar_positions:
        existing_kfs = block['keyframes_text']

        # Parse and preserve keyframes up to f71
        preserved_lines = []
        for line in existing_kfs.strip().split('\n'):
            line_stripped = line.strip()
            if not line_stripped:
                continue
            frame_match = re.match(r'\[(\d+)\]\s*=', line_stripped)
            if frame_match:
                frame = int(frame_match.group(1))
                if frame <= USER_LAST_KF:
                    # Keep the original line with its exact formatting
                    clean = line.rstrip().rstrip(',')
                    preserved_lines.append(clean)

        # Generate voice-reactive keyframes
        voice_kfs = generate_voice_keyframes(waveform, bar_num)

        # Format new keyframes
        new_kf_lines = []
        for idx, (f, h) in enumerate(voice_kfs):
            prev_h = voice_kfs[idx - 1][1] if idx > 0 else BAR_PEAKS[bar_num]
            next_h = voice_kfs[idx + 1][1] if idx < len(voice_kfs) - 1 else MIN_HEIGHT
            new_kf_lines.append(format_keyframe(f, h, prev_h, next_h))

        # Combine
        all_lines = []
        for line in preserved_lines:
            all_lines.append(line + ',')
        for i, line in enumerate(new_kf_lines):
            if i < len(new_kf_lines) - 1:
                all_lines.append(line + ',')
            else:
                all_lines.append(line)

        new_block = '\n' + '\n'.join(all_lines) + '\n\t\t\t'

        # Replace the keyframes content
        content = (content[:block['content_start']] +
                   new_block +
                   content[block['content_end']:])

        print(f"  Patched {spline_name}: {len(preserved_lines)} preserved + {len(new_kf_lines)} voice-reactive")

    with open(output_path, 'w') as f:
        f.write(content)

    return output_path


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

    out_path = Path(__file__).parent.parent / "fusion" / "bars_voice.setting"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"Reading: {src}")
    patch_setting(str(src), str(out_path))

    size_kb = out_path.stat().st_size / 1024
    print(f"\nWritten: {out_path} ({size_kb:.0f} KB)")
    print()
    print("What changed:")
    print("  - Kept your hand-tuned keyframes (f5, f57, f65, f68, f71)")
    print("  - f74-f188: Voice-reactive bar heights from real audio")
    print("  - f191-f210: Smooth wind-down to dots")
    print("  - f213+: Gentle breathing dots")
    print("  - Bars NEVER drop to zero — 35% baseline keeps them alive")
    print("  - Ripple delay: outer bars react 1-2f after center")
    print("  - Per-bar jitter: no two bars identical")
    print()
    print("Drag bars_voice.setting into Fusion to replace your current bars.")


if __name__ == "__main__":
    main()
