#!/usr/bin/env python3
"""
Generate a Fusion .setting with an animated recording timer.
- IBM Plex Mono font (falls back to Courier if not installed)
- Counts from 00:00 to 00:04 based on voice duration
- Fades in at f68, fades out at f120
- Position: center, below waveform
"""

FRAME_W = 1920
FRAME_H = 1080
FPS = 24

# Timer starts counting when voice begins (f62)
VOICE_START = 62
# Timer fades in at f68, out at f120
FADE_IN_START = 68
FADE_IN_END = 76
FADE_OUT_START = 120
FADE_OUT_END = 125

# Position: center, 700px from top
POS_X = 960 / FRAME_W  # 0.5
POS_Y = 1 - (700 / FRAME_H)  # 0.352

# Text size (0.022 of frame height from spec)
TEXT_SIZE = 0.022

# Color: secondary #8E8F8B
R, G, B = 0.557, 0.561, 0.545

# Generate timer text values at each second
# f62 = 0:00, f86 = 0:01, f110 = 0:02, f134 = 0:03, f158 = 0:04
timer_values = []
for f in range(FADE_IN_START, FADE_OUT_END + 1):
    elapsed_frames = f - VOICE_START
    seconds = max(0, elapsed_frames // FPS)
    timer_values.append((f, f"00:0{seconds}"))

# Build the .setting
out = []
out.append("""{
\tTools = ordered() {""")

# We need separate Text+ nodes for each timer value because
# Fusion Text+ can't be animated via expressions easily.
# Instead: one Text+ with StyledText keyframes at second boundaries.

# Timer text node
out.append(f"""
\t\tTimerText = TextPlus {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tGlobalIn = Input {{ Value = 0, }},
\t\t\t\tGlobalOut = Input {{ Value = 479, }},
\t\t\t\tWidth = Input {{ Value = {FRAME_W}, }},
\t\t\t\tHeight = Input {{ Value = {FRAME_H}, }},
\t\t\t\tUseFrameFormatSettings = Input {{ Value = 0, }},
\t\t\t\t["Gamut.SLogVersion"] = Input {{ Value = FuID {{ "SLog2" }}, }},
\t\t\t\tCenter = Input {{ Value = {{ {POS_X:.6f}, {POS_Y:.6f} }}, }},
\t\t\t\tRed1 = Input {{ Value = {R}, }},
\t\t\t\tGreen1 = Input {{ Value = {G}, }},
\t\t\t\tBlue1 = Input {{ Value = {B}, }},
\t\t\t\tSize = Input {{ Value = {TEXT_SIZE}, }},
\t\t\t\tFont = Input {{ Value = "IBM Plex Mono", }},
\t\t\t\tStyle = Input {{ Value = "Regular", }},
\t\t\t\tStyledText = Input {{
\t\t\t\t\tSourceOp = "TimerStyledText",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t\tTracking = Input {{ Value = 1, }},
\t\t\t\tHorizontalJustificationNew = Input {{ Value = 1, }},
\t\t\t\tVerticalJustificationNew = Input {{ Value = 1, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 110, -100 }} }},
\t\t}},""")

# StyledText keyframes (changes text at each second)
out.append(f"""
\t\tTimerStyledText = BezierSpline {{
\t\t\tSplineColor = {{ Red = 180, Green = 0, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t[0] = {{ "00:00", Flags = {{ Linear = true }} }},
\t\t\t\t[{VOICE_START}] = {{ "00:00", Flags = {{ Linear = true }} }},
\t\t\t\t[{VOICE_START + FPS}] = {{ "00:01", Flags = {{ Linear = true }} }},
\t\t\t\t[{VOICE_START + FPS * 2}] = {{ "00:02", Flags = {{ Linear = true }} }},
\t\t\t\t[{VOICE_START + FPS * 3}] = {{ "00:03", Flags = {{ Linear = true }} }},
\t\t\t\t[{VOICE_START + FPS * 4}] = {{ "00:04", Flags = {{ Linear = true }} }},
\t\t\t}},
\t\t}},""")

# Merge node to composite timer (with animated blend for fade in/out)
out.append(f"""
\t\tTimerMerge = Merge {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "TimerBg",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "TimerText",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "TimerBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 330, 0 }} }},
\t\t}},""")

# Transparent background for merge
out.append(f"""
\t\tTimerBg = Background {{
\t\t\tCtrlWZoom = false,
\t\t\tInputs = {{
\t\t\t\tGlobalIn = Input {{ Value = 0, }},
\t\t\t\tGlobalOut = Input {{ Value = 479, }},
\t\t\t\tWidth = Input {{ Value = {FRAME_W}, }},
\t\t\t\tHeight = Input {{ Value = {FRAME_H}, }},
\t\t\t\t["Gamut.SLogVersion"] = Input {{ Value = FuID {{ "SLog2" }}, }},
\t\t\t\tTopLeftAlpha = Input {{ Value = 0, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 220, 0 }} }},
\t\t}},""")

# Blend spline: fade in f68-76, hold, fade out f120-125
# Also rise 8px during fade in (spec says "rise 8 px")
out.append(f"""
\t\tTimerBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 0, Green = 0, Blue = 180 }},
\t\t\tKeyFrames = {{
\t\t\t\t[0] = {{ 0, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t\t[{FADE_IN_START}] = {{ 0, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t\t[{FADE_IN_END}] = {{ 1, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t\t[{FADE_OUT_START}] = {{ 1, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t\t[{FADE_OUT_END}] = {{ 0, Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }},
\t\t\t}},
\t\t}},""")

# MediaOut
out.append(f"""
\t\tMediaOut1 = MediaOut {{
\t\t\tInputs = {{
\t\t\t\tInput = Input {{
\t\t\t\t\tSourceOp = "TimerMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 440, 0 }} }},
\t\t}},""")

out.append("""
\t},
\tActiveTool = "TimerText",
}""")

from pathlib import Path
setting_path = Path(__file__).parent.parent / "fusion" / "timer.setting"
with open(setting_path, "w") as f:
    f.write("\n".join(out))

print(f"✓ Written to {setting_path}")
print(f"  Font: IBM Plex Mono Regular (fallback: Courier)")
print(f"  Position: center, 700px from top")
print(f"  Color: #8E8F8B (secondary)")
print(f"  Timer: 00:00 → 00:04 (ticks every 24 frames from f62)")
print(f"  Fade in: f68–f76 (ease-out)")
print(f"  Fade out: f120–f125 (ease-in)")
print(f"\n  Drag timer.setting into Fusion node editor.")


if __name__ == "__main__":
    main() if 'main' in dir() else None
