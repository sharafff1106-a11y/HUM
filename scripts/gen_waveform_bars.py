#!/usr/bin/env python3
"""
Generate a Fusion .setting file with 24 waveform bars,
all pre-connected and positioned. Drag into Fusion node editor.
"""

NUM_BARS = 24
FRAME_W = 1920
FRAME_H = 1080

# Waveform area: 1152px wide, centered
WAVEFORM_WIDTH_PX = 1152
WAVEFORM_START_PX = (FRAME_W - WAVEFORM_WIDTH_PX) / 2  # 384px
BAR_SPACING_PX = WAVEFORM_WIDTH_PX / NUM_BARS  # 48px per bar
BAR_WIDTH_PX = 20  # each bar is 20px wide (gap = 28px)

# Amber color
R, G, B = 1.0, 0.761, 0.294  # #FFC24B

# Bar center Y
CENTER_Y = 0.5

# Bell curve heights at f72 (center bars taller)
import math
CENTRE_BAR = (NUM_BARS - 1) / 2.0
MAX_HEIGHT_PX = 160
MIN_HEIGHT_PX = 16

out = []
out.append("""{
\tTools = ordered() {""")

# Generate each bar (Background + Rectangle mask)
for i in range(NUM_BARS):
    bar_num = i + 1
    cx_px = WAVEFORM_START_PX + i * BAR_SPACING_PX + BAR_SPACING_PX / 2
    cx = cx_px / FRAME_W

    # Normalised width and initial height (dot = 10px)
    w_norm = BAR_WIDTH_PX / FRAME_W
    h_start = 10 / FRAME_H  # dot at f60

    # Bell curve height at f72
    dist = abs(i - CENTRE_BAR)
    bell = math.exp(-(dist / (NUM_BARS * 0.25)) ** 2)
    h_f72_px = MIN_HEIGHT_PX + (MAX_HEIGHT_PX - MIN_HEIGHT_PX) * bell
    h_f72 = h_f72_px / FRAME_H

    # Node position in viewer (spread bars horizontally in node editor)
    vx = 220 + i * 55
    vy = -200

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
\t\t\t\tCornerRadius = Input {{ Value = 1, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {vx}, {vy - 60} }} }},
\t\t}},""")

    # Animated height spline (dot → bar)
    out.append(f"""
\t\tBarHeight{bar_num} = BezierSpline {{
\t\t\tSplineColor = {{ Red = 0, Green = 180, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t[60] = {{ {h_start:.6f}, RH = {{ 62, {h_start + (h_f72 - h_start) * 0.3:.6f} }}, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t\t[72] = {{ {h_f72:.6f}, LH = {{ 70, {h_f72 - (h_f72 - h_start) * 0.15:.6f} }}, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t}},
\t\t}},""")

    # Background (amber filled)
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
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {vx}, {vy} }} }},
\t\t}},""")

# Generate merge chain: Bar1 → Merge1 ← Bar2 → Merge2 ← Bar3 ...
for i in range(NUM_BARS - 1):
    merge_num = i + 1
    bar_bg = i + 1      # background (yellow input)
    bar_fg = i + 2      # foreground (green input)
    vx = 220 + (i + 1) * 55
    vy = 100

    if i == 0:
        bg_source_op = f"Bar1"
        bg_source = "Output"
    else:
        bg_source_op = f"BarMerge{i}"
        bg_source = "Output"

    out.append(f"""
\t\tBarMerge{merge_num} = Merge {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "{bg_source_op}",
\t\t\t\t\tSource = "{bg_source}",
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
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ {220 + NUM_BARS * 55}, 100 }} }},
\t\t}},""")

out.append("""
\t},
\tActiveTool = "BarMerge1",
}""")

# Write
from pathlib import Path
setting_path = Path(__file__).parent.parent / "fusion" / "waveform_bars.setting"
with open(setting_path, "w") as f:
    f.write("\n".join(out))

print(f"✓ Written to {setting_path}")
print(f"  {NUM_BARS} bars, each with Background + Rectangle mask + animated height")
print(f"  {NUM_BARS - 1} Merge nodes chaining them together")
print(f"  Total nodes: {NUM_BARS * 2 + NUM_BARS - 1 + 1} ({NUM_BARS} bars + {NUM_BARS} masks + {NUM_BARS-1} merges + 1 MediaOut)")
print(f"\n  Bar heights animate from dots (f60) to full waveform (f72)")
print(f"  Center bars reach {MAX_HEIGHT_PX}px, edge bars {MIN_HEIGHT_PX}px")
print(f"\n  Drag waveform_bars.setting into your Fusion node editor.")
print(f"  Then connect the final BarMerge{NUM_BARS-1} output into your main comp's merge chain.")
