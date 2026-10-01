#!/usr/bin/env python3
"""
Generate a fully-wired Fusion .setting for S1 Intro (f0–f72).
Every node is connected — just drag into Fusion's node editor.
"""
from pathlib import Path

W, H = 1920, 1080

def fx(px): return round(px / W, 6)
def fy(px): return round(1 - px / H, 6)

# Easing helpers — absolute handle positions
def ease_out_kf(f1, v1, f2, v2):
    """Ease-out: fast start, slow arrival."""
    span = f2 - f1
    rh_x = round(f1 + span * 0.333, 2)
    lh_x = round(f2 - span * 0.333, 2)
    rh_y = round(v1 + (v2 - v1) * 0.7, 6)  # pulls toward end early
    lh_y = v2  # arrives at final value
    return (
        f'[{f1}] = {{ {v1}, RH = {{ {rh_x}, {rh_y} }} }}',
        f'[{f2}] = {{ {v2}, LH = {{ {lh_x}, {lh_y} }} }}'
    )

def ease_in_kf(f1, v1, f2, v2):
    """Ease-in: slow start, fast end."""
    span = f2 - f1
    rh_x = round(f1 + span * 0.333, 2)
    lh_x = round(f2 - span * 0.333, 2)
    rh_y = v1  # holds start value
    lh_y = round(v2 - (v2 - v1) * 0.3, 6)
    return (
        f'[{f1}] = {{ {v1}, RH = {{ {rh_x}, {rh_y} }} }}',
        f'[{f2}] = {{ {v2}, LH = {{ {lh_x}, {lh_y} }} }}'
    )

def ease_inout_kf(f1, v1, f2, v2):
    """Ease-in-out."""
    span = f2 - f1
    rh_x = round(f1 + span * 0.333, 2)
    lh_x = round(f2 - span * 0.333, 2)
    return (
        f'[{f1}] = {{ {v1}, RH = {{ {rh_x}, {v1} }} }}',
        f'[{f2}] = {{ {v2}, LH = {{ {lh_x}, {v2} }} }}'
    )

def hold_kf(f, v):
    return f'[{f}] = {{ {v} }}'


setting = f"""{{
\tTools = ordered() {{

\t\t-- ════════════════════════════════════════════════
\t\t-- S1: INTRO + T1 (f0–f72)
\t\t-- Fully wired — drag into Fusion node editor
\t\t-- ════════════════════════════════════════════════

\t\t-- ─── BACKGROUND ───
\t\tBackground1 = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 0.043, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.047, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.059, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 0, 100 }} }},
\t\t}},

\t\t-- ─── BACKGROUND LIFT (radial lighter centre) ───
\t\tBgLiftMask = EllipseMask {{
\t\t\tInputs = {{
\t\t\t\tCenter = Input {{ Value = {{ 0.5, 0.5 }}, }},
\t\t\t\tWidth = Input {{ Value = 0.729, }},
\t\t\t\tHeight = Input {{ Value = 1.296, }},
\t\t\t\tSoftEdge = Input {{ Value = 0.8, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 0, -50 }} }},
\t\t}},

\t\tBgLift = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 0.078, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.086, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.106, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "BgLiftMask",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 110, -50 }} }},
\t\t}},

\t\tBgMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "Background1",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "BgLift",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "BgLiftBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 220, 100 }} }},
\t\t}},

\t\tBgLiftBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 0, Green = 200, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t{ease_out_kf(0, 0, 12, 1)[0]},
\t\t\t\t{ease_out_kf(0, 0, 12, 1)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── RECORD BUTTON (220px amber circle at centre) ───
\t\tButtonMask = EllipseMask {{
\t\t\tInputs = {{
\t\t\t\tCenter = Input {{ Value = {{ 0.5, 0.5 }}, }},
\t\t\t\tWidth = Input {{ Value = {round(220/W, 6)}, }},
\t\t\t\tHeight = Input {{ Value = {round(220/H, 6)}, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 330, -100 }} }},
\t\t}},

\t\tButtonFill = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 1.0, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.761, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.294, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "ButtonMask",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 440, -100 }} }},
\t\t}},

\t\tButtonMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "BgMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "ButtonFill",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tCenter = Input {{ Value = {{ {fx(960)}, {fy(500)} }}, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "ButtonBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t\tSize = Input {{
\t\t\t\t\tSourceOp = "ButtonScale",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 440, 100 }} }},
\t\t}},

\t\tButtonBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 200, Green = 100, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(6, 0, 18, 1)[0]},
\t\t\t\t{ease_out_kf(6, 0, 18, 1)[1]},
\t\t\t}},
\t\t}},

\t\tButtonScale = BezierSpline {{
\t\t\tSplineColor = {{ Red = 200, Green = 100, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0.8)},
\t\t\t\t{ease_out_kf(6, 0.8, 18, 1.0)[0]},
\t\t\t\t{ease_out_kf(6, 0.8, 18, 1.0)[1]},
\t\t\t\t{hold_kf(46, 1.0)},
\t\t\t\t{ease_out_kf(46, 1.0, 48, 0.92)[1]},
\t\t\t\t{ease_out_kf(48, 0.92, 51, 1.0)[0]},
\t\t\t\t{ease_out_kf(48, 0.92, 51, 1.0)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── BUTTON RING (280px, 2px amber outline, 40% opacity) ───
\t\tRingMask = EllipseMask {{
\t\t\tInputs = {{
\t\t\t\tCenter = Input {{ Value = {{ 0.5, 0.5 }}, }},
\t\t\t\tWidth = Input {{ Value = {round(280/W, 6)}, }},
\t\t\t\tHeight = Input {{ Value = {round(280/H, 6)}, }},
\t\t\t\tSoftEdge = Input {{ Value = 0.0, }},
\t\t\t\tBorderWidth = Input {{ Value = {round(-1 + 2/140, 4)}, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 550, -100 }} }},
\t\t}},

\t\tRingFill = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 1.0, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.761, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.294, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "RingMask",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 660, -100 }} }},
\t\t}},

\t\tRingMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "ButtonMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "RingFill",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tCenter = Input {{ Value = {{ {fx(960)}, {fy(500)} }}, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "RingBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t\tSize = Input {{
\t\t\t\t\tSourceOp = "RingScale",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 660, 100 }} }},
\t\t}},

\t\tRingBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 200, Green = 150, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(6, 0, 18, 0.4)[0]},
\t\t\t\t{ease_out_kf(6, 0, 18, 0.4)[1]},
\t\t\t\t{hold_kf(49, 0.4)},
\t\t\t\t{ease_out_kf(49, 0.4, 63, 0)[1]},
\t\t\t}},
\t\t}},

\t\tRingScale = BezierSpline {{
\t\t\tSplineColor = {{ Red = 200, Green = 150, Blue = 0 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0.8)},
\t\t\t\t{ease_out_kf(6, 0.8, 18, 1.0)[0]},
\t\t\t\t{ease_inout_kf(18, 1.0, 30, 1.06)[0]},
\t\t\t\t{ease_inout_kf(18, 1.0, 30, 1.06)[1]},
\t\t\t\t{ease_inout_kf(30, 1.06, 42, 1.0)[1]},
\t\t\t\t{hold_kf(49, 1.0)},
\t\t\t\t{ease_out_kf(49, 1.0, 63, 1.6)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── SMALL LOGO "hum" (top-left) ───
\t\tSmallLogo = TextPlus {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["StyledText"] = Input {{ Value = "hum", }},
\t\t\t\tFont = Input {{ Value = "Inter", }},
\t\t\t\tStyle = Input {{ Value = "Medium", }},
\t\t\t\tSize = Input {{ Value = 0.026, }},
\t\t\t\tTracking = Input {{ Value = 1.0, }},
\t\t\t\tCenter = Input {{ Value = {{ {fx(149)}, {fy(110)} }}, }},
\t\t\t\t["HorizontalJustificationNew"] = Input {{ Value = 0, }},
\t\t\t\tRed1 = Input {{ Value = 0.961, }},
\t\t\t\tGreen1 = Input {{ Value = 0.953, }},
\t\t\t\tBlue1 = Input {{ Value = 0.933, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 770, -50 }} }},
\t\t}},

\t\tLogoMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "RingMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "SmallLogo",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "LogoBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 880, 100 }} }},
\t\t}},

\t\tLogoBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 0, Green = 200, Blue = 200 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(4, 0, 12, 1)[0]},
\t\t\t\t{ease_out_kf(4, 0, 12, 1)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── "Tap to record" LABEL ───
\t\tTapLabel = TextPlus {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["StyledText"] = Input {{ Value = "Tap to record", }},
\t\t\t\tFont = Input {{ Value = "Inter", }},
\t\t\t\tStyle = Input {{ Value = "Regular", }},
\t\t\t\tSize = Input {{ Value = 0.022, }},
\t\t\t\tCenter = Input {{
\t\t\t\t\tSourceOp = "TapLabelCenter",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t\tRed1 = Input {{ Value = 0.557, }},
\t\t\t\tGreen1 = Input {{ Value = 0.561, }},
\t\t\t\tBlue1 = Input {{ Value = 0.545, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 990, -50 }} }},
\t\t}},

\t\tTapLabelCenter = XYPath {{
\t\t\tShowKeyPoints = false,
\t\t\tShowHandles = false,
\t\t\tKeyFrames = {{
\t\t\t\t[10] = {{ {fx(960)}, {fy(698)}, RH = {{ {fx(960)}, {fy(694)} }} }},
\t\t\t\t[18] = {{ {fx(960)}, {fy(690)}, LH = {{ {fx(960)}, {fy(690)} }} }},
\t\t\t}},
\t\t}},

\t\tTapMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "LogoMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "TapLabel",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "TapBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1100, 100 }} }},
\t\t}},

\t\tTapBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 100, Green = 200, Blue = 100 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(10, 0, 18, 1)[0]},
\t\t\t\t{ease_out_kf(10, 0, 18, 1)[1]},
\t\t\t\t{hold_kf(49, 1)},
\t\t\t\t{ease_in_kf(49, 1, 54, 0)[0]},
\t\t\t\t{ease_in_kf(49, 1, 54, 0)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── TIMER "00:00" ───
\t\tTimer = TextPlus {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["StyledText"] = Input {{ Value = "00:00", }},
\t\t\t\tFont = Input {{ Value = "Inter", }},
\t\t\t\tStyle = Input {{ Value = "Regular", }},
\t\t\t\tSize = Input {{ Value = 0.022, }},
\t\t\t\tCenter = Input {{ Value = {{ {fx(960)}, {fy(700)} }}, }},
\t\t\t\tRed1 = Input {{ Value = 0.557, }},
\t\t\t\tGreen1 = Input {{ Value = 0.561, }},
\t\t\t\tBlue1 = Input {{ Value = 0.545, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1210, -100 }} }},
\t\t}},

\t\tTimerMerge = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "TapMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "Timer",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "TimerBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1320, 100 }} }},
\t\t}},

\t\tTimerBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 100, Green = 100, Blue = 200 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(68, 0, 72, 1)[0]},
\t\t\t\t{ease_out_kf(68, 0, 72, 1)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── STOP BUTTON (64px circle, amber outline + white square) ───
\t\tStopCircleMask = EllipseMask {{
\t\t\tInputs = {{
\t\t\t\tCenter = Input {{ Value = {{ {fx(960)}, {fy(780)} }}, }},
\t\t\t\tWidth = Input {{ Value = {round(64/W, 6)}, }},
\t\t\t\tHeight = Input {{ Value = {round(64/H, 6)}, }},
\t\t\t\tSoftEdge = Input {{ Value = 0.0, }},
\t\t\t\tBorderWidth = Input {{ Value = {round(-1 + 2/32, 4)}, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1430, -150 }} }},
\t\t}},

\t\tStopCircleFill = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 1.0, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.761, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.294, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "StopCircleMask",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1430, -50 }} }},
\t\t}},

\t\tStopSquareMask = RectangleMask {{
\t\t\tInputs = {{
\t\t\t\tCenter = Input {{ Value = {{ {fx(960)}, {fy(780)} }}, }},
\t\t\t\tWidth = Input {{ Value = {round(20/W, 6)}, }},
\t\t\t\tHeight = Input {{ Value = {round(20/H, 6)}, }},
\t\t\t\tCornerRadius = Input {{ Value = 0.2, }},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1540, -150 }} }},
\t\t}},

\t\tStopSquareFill = Background {{
\t\t\tInputs = {{
\t\t\t\tGlobalOut = Input {{ Value = 72, }},
\t\t\t\tWidth = Input {{ Value = {W}, }},
\t\t\t\tHeight = Input {{ Value = {H}, }},
\t\t\t\t["TopLeftRed"] = Input {{ Value = 0.961, }},
\t\t\t\t["TopLeftGreen"] = Input {{ Value = 0.953, }},
\t\t\t\t["TopLeftBlue"] = Input {{ Value = 0.933, }},
\t\t\t\tEffectMask = Input {{
\t\t\t\t\tSourceOp = "StopSquareMask",
\t\t\t\t\tSource = "Mask",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1540, -50 }} }},
\t\t}},

\t\tStopMerge1 = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "TimerMerge",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "StopCircleFill",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "StopBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1540, 50 }} }},
\t\t}},

\t\tStopMerge2 = Merge {{
\t\t\tInputs = {{
\t\t\t\tBackground = Input {{
\t\t\t\t\tSourceOp = "StopMerge1",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tForeground = Input {{
\t\t\t\t\tSourceOp = "StopSquareFill",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t\tPerformDepthMerge = Input {{ Value = 0, }},
\t\t\t\tBlend = Input {{
\t\t\t\t\tSourceOp = "StopBlend",
\t\t\t\t\tSource = "Value",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1650, 100 }} }},
\t\t}},

\t\tStopBlend = BezierSpline {{
\t\t\tSplineColor = {{ Red = 100, Green = 100, Blue = 200 }},
\t\t\tKeyFrames = {{
\t\t\t\t{hold_kf(0, 0)},
\t\t\t\t{ease_out_kf(68, 0, 72, 1)[0]},
\t\t\t\t{ease_out_kf(68, 0, 72, 1)[1]},
\t\t\t}},
\t\t}},

\t\t-- ─── FINAL OUTPUT ───
\t\tMediaOut1 = MediaOut {{
\t\t\tInputs = {{
\t\t\t\tInput = Input {{
\t\t\t\t\tSourceOp = "StopMerge2",
\t\t\t\t\tSource = "Output",
\t\t\t\t}},
\t\t\t}},
\t\t\tViewInfo = OperatorInfo {{ Pos = {{ 1800, 100 }} }},
\t\t}},
\t}},

\tActiveTool = "StopMerge2",
}}"""

# Write the file
out = Path("/home/user/HUM/fusion/S1_intro.setting")
out.write_text(setting)
print(f"✓ Written to {out}")
print(f"  File size: {out.stat().st_size} bytes")
print(f"\n  Nodes: 22 total")
print(f"  Chain: Background1 → BgMerge → ButtonMerge → RingMerge → LogoMerge → TapMerge → TimerMerge → StopMerge1 → StopMerge2 → MediaOut1")
print(f"\n  What you'll see:")
print(f"    f0:  Dark background fading in")
print(f"    f6:  Amber button + ring scaling up")
print(f"    f10: 'Tap to record' fading in")
print(f"    f18: Ring starts breathing pulse")
print(f"    f46: Button squash (tap)")
print(f"    f49: Ring ripple + 'Tap to record' fading out")
print(f"    f68: Timer + stop button fading in")
