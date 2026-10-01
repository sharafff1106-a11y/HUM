#!/usr/bin/env python3
"""
Generate a fully-animated waveform .setting for Fusion.
24 bars with real voice-reactive keyframes from waveform_keyframes.json.

Features:
- Fade in from invisible (f52) to dots (f60) to full waveform (f72)
- Voice-reactive heights from real audio data (f72–f188)
- Ripple delay: outer bars react 1–2 frames later than center
- Jitter: each bar's heights slightly randomised for organic feel
- Fade out to dots when voice ends (f188–f200)
- Smooth BezierSpline easing on all keyframes
"""

import json
import math
import random
from pathlib import Path

FPS = 24
FRAME_W = 1920
FRAME_H = 1080

NUM_BARS = 24
WAVEFORM_WIDTH_PX = 1152
WAVEFORM_START_PX = (FRAME_W - WAVEFORM_WIDTH_PX) / 2  # 384
BAR_SPACING_PX = WAVEFORM_WIDTH_PX / NUM_BARS  # 48
BAR_WIDTH_PX = 20
CENTER_Y = 0.5

# Amber
R, G, B = 1.0, 0.761, 0.294

# Bar indices in 48-bar data → sample every 2nd
BAR_SAMPLE = list(range(0, 48, 2))

OUT_DIR = Path(__file__).parent.parent
DATA_DIR = OUT_DIR / "docs"


def load_waveform_data():
    with open(DATA_DIR / "waveform_keyframes.json") as f:
        raw = json.load(f)
    # Convert string keys to int, sample 24 bars from 48
    data = {}
    for frame_str, heights in raw.items():
        frame = int(frame_str)
        data[frame] = [heights[i] for i in BAR_SAMPLE]
    return data


def get_bar_heights(waveform, frame, bar_idx, ripple_delay=0):
    """Get height for a specific bar at a frame, with ripple delay."""
    delayed_frame = max(0, frame - ripple_delay)
    if delayed_frame in waveform:
        return waveform[delayed_frame][bar_idx]
    # Interpolate between nearest frames
    frames = sorted(waveform.keys())
    if delayed_frame <= frames[0]:
        return waveform[frames[0]][bar_idx]
    if delayed_frame >= frames[-1]:
        return waveform[frames[-1]][bar_idx]
    for i in range(len(frames) - 1):
        if frames[i] <= delayed_frame <= frames[i + 1]:
            t = (delayed_frame - frames[i]) / (frames[i + 1] - frames[i])
            h1 = waveform[frames[i]][bar_idx]
            h2 = waveform[frames[i + 1]][bar_idx]
            return h1 + t * (h2 - h1)
    return 10.0


def compute_ripple_delay(bar_idx):
    """Center bars react first, outer bars 1-2 frames later."""
    center = (NUM_BARS - 1) / 2.0
    dist = abs(bar_idx - center)
    return round(dist / 6)  # max ~2 frame delay for edge bars


def add_jitter(height, bar_idx, frame, strength=0.08):
    """Add per-bar jitter so bars don't move identically."""
    random.seed(bar_idx * 1000 + frame)
    jitter = 1.0 + random.uniform(-strength, strength)
    h = height * jitter
    return max(10.0, min(280.0, h))


def bezier_kf(frame, value, smooth=True):
    """Generate a single BezierSpline keyframe entry."""
    if smooth:
        return f"\t\t\t\t[{frame}] = {{ {value:.6f}, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},"
    else:
        return f"\t\t\t\t[{frame}] = {{ {value:.6f}, }},"


def generate_bar_spline(waveform, bar_idx):
    """Generate BezierSpline keyframes for one bar's height animation."""
    ripple = compute_ripple_delay(bar_idx)
    keyframes = []

    # Phase 1: Invisible (f0–f52)
    keyframes.append(bezier_kf(0, 0.0))

    # Phase 2: Fade in to dots (f52–f60)
    keyframes.append(bezier_kf(52, 0.0))
    dot_h = 10.0 / FRAME_H
    keyframes.append(bezier_kf(60, dot_h))

    # Phase 3: Dots grow to waveform (f60–f72)
    # Sample at f63, f66, f69, f72
    for f in [63, 66, 69, 72]:
        h_px = get_bar_heights(waveform, f, bar_idx, ripple)
        h_px = add_jitter(h_px, bar_idx, f)
        keyframes.append(bezier_kf(f, h_px / FRAME_H))

    # Phase 4: Voice-reactive (f72–f188)
    # Sample every 3 frames for smooth animation
    for f in range(75, 189, 3):
        h_px = get_bar_heights(waveform, f, bar_idx, ripple)
        h_px = add_jitter(h_px, bar_idx, f)
        keyframes.append(bezier_kf(f, h_px / FRAME_H))

    # Phase 5: Voice ends, shrink to dots (f188–f200)
    keyframes.append(bezier_kf(192, 15.0 / FRAME_H))
    keyframes.append(bezier_kf(200, dot_h))

    # Phase 6: Stay as dots
    keyframes.append(bezier_kf(250, dot_h))

    return "\n".join(keyframes)


def generate_setting():
    waveform = load_waveform_data()

    out = []
    out.append("""{
\tTools = ordered() {""")

    # Generate bars
    for i in range(NUM_BARS):
        bar_num = i + 1
        cx_px = WAVEFORM_START_PX + i * BAR_SPACING_PX + BAR_SPACING_PX / 2
        cx = cx_px / FRAME_W
        w_norm = BAR_WIDTH_PX / FRAME_W

        # Node editor positions
        col = i % 12
        row = i // 12
        vx = 110 + col * 110
        vy_mask = -300 + row * 500
        vy_bg = vy_mask + 80

        # Rectangle mask
        out.append(f"""
\t\tBarMask{bar_num} = RectangleMask {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tMaskWidth = Input {{ Value = {FRAME_W}, }},
\t\t\t\tMaskHeight = Input {{ Value = {FRAME_H}, }},
\t\t\t\tPixelAspect = Input {{ Value = {{ 1, 1 }}, }},
\t\t\t\tClippingMode = Input {{ Value = FuID {{ "None" }}, }},
\t\t\t\tCenter = Input {{ Value = {{ {cx:.6f}, {CENTER_Y} }}, }},
\t\t\t\tWidth = Input {{ Value = {w_norm:.6f}, }},
\t\t\t\tHeight = Input {{
\t\t\t\t\tSourceOp = "BarHeight{bar_num}",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t\tCornerRadius = Input {{ Value = 0.4, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {vx}, {vy_mask} }} }},
\t\t}},""")

        # Animated height spline
        spline_kfs = generate_bar_spline(waveform, i)
        out.append(f"""
\t\tBarHeight{bar_num} = BezierSpline {{
\t\t\tSplineColor = {{ Red = 0, Green = 180, Blue = 0 }},
\t\t\tKeyFrames = {{
{spline_kfs}
\t\t\t}},
\t\t}},""")

        # Background node (amber)
        out.append(f"""
\t\tBar{bar_num} = Background {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tGlobalIn = Input {{ Value = 0, }},
\t\t\t\tGlobalOut = Input {{ Value = 479, }},
\t\t\t\tWidth = Input {{ Value = {FRAME_W}, }},
\t\t\t\tHeight = Input {{ Value = {FRAME_H}, }},
\t\t\t\t["Gamut.SLogVersion"] = Input {{ Value = FuID {{ "SLog2" }}, }},
\t\t\t\tTopLeftRed = Input {{ Value = {R}, }},
\t\t\t\tTopLeftGreen = Input {{ Value = {G}, }},
\t\t\t\tTopLeftBlue = Input {{ Value = {B}, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "BarMask{bar_num}",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {vx}, {vy_bg} }} }},
\t\t}},""")

    # Merge chain
    for i in range(NUM_BARS - 1):
        merge_num = i + 1
        bar_fg = i + 2
        vx = 110 + merge_num * 60
        vy = 400

        if i == 0:
            bg_op = "Bar1"
        else:
            bg_op = f"BarMerge{i}"

        out.append(f"""
\t\tBarMerge{merge_num} = Merge {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "{bg_op}",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "Bar{bar_fg}",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {vx}, {vy} }} }},
\t\t}},""")

    # MediaOut
    out.append(f"""
\t\tMediaOut1 = MediaOut {{
\t\t\tInputs = {{
\t\t\t\tInput = Input {{
\t\t\t\t\tSourceOp = "BarMerge{NUM_BARS - 1}",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {110 + NUM_BARS * 60 + 60}, 400 }} }},
\t\t}},""")

    out.append("""
\t},
\tActiveTool = "BarMerge12",
}""")

    return "\n".join(out)


def main():
    setting = generate_setting()
    out_path = OUT_DIR / "fusion" / "waveform_v2.setting"
    with open(out_path, "w") as f:
        f.write(setting)

    size_kb = out_path.stat().st_size / 1024
    print(f"✓ Written to {out_path} ({size_kb:.0f} KB)")
    print(f"  24 bars × ~45 keyframes each = ~1080 animated keyframes")
    print(f"  Real voice data from waveform_keyframes.json")
    print()
    print(f"  Animation timeline:")
    print(f"    f0–f52:   Bars invisible")
    print(f"    f52–f60:  Fade in (grow from nothing to dots)")
    print(f"    f60–f72:  Dots grow to waveform shape")
    print(f"    f72–f188: Voice-reactive movement (real audio)")
    print(f"    f188–f200: Voice ends, bars shrink to dots")
    print(f"    f200+:    Dots hold")
    print()
    print(f"  Features:")
    print(f"    ✓ Ripple delay (outer bars react 1-2f after center)")
    print(f"    ✓ Per-bar jitter (no two bars move identically)")
    print(f"    ✓ Bell curve distribution (center tall, edges short)")
    print(f"    ✓ Smooth BezierSpline easing")
    print()
    print(f"  Drag waveform_v2.setting into Fusion node editor.")


if __name__ == "__main__":
    main()
