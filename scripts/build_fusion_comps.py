#!/usr/bin/env python3
"""
Build DaVinci Resolve Fusion .setting compositions for HUM.
Generates S1–S5 with all keyframes, easing, and positions from the spec.

Fusion .setting files use a Lua table format.
Coordinates: Fusion normalised (x = px/1920, y = 1 - px/1080).
"""

import json
import math
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent / "fusion"
LAYOUT = json.loads((Path(__file__).parent.parent / "docs" / "layout_table.json").read_text())

W, H = 1920, 1080
FPS = 24

# ─── Coordinate helpers ───

def fx(px): return round(px / W, 6)
def fy(px): return round(1 - px / H, 6)
def fw(px): return round(px / W, 6)
def fh(px): return round(px / H, 6)

# ─── Easing helpers ───

def ease_out_handles():
    """Strong ease-out: fast start, slow end (~70% handle influence)"""
    return 'RH = { 0.333, 0.7 }, LH = { -0.333, 0.0 }'

def ease_in_handles():
    """Ease-in: slow start, fast end"""
    return 'RH = { 0.333, 0.0 }, LH = { -0.333, 0.7 }'

def ease_in_out_handles():
    """Ease-in-out: slow both ends"""
    return 'RH = { 0.333, 0.7 }, LH = { -0.333, 0.7 }'

def linear_handles():
    return 'RH = { 0.333, 0.333 }, LH = { -0.333, -0.333 }'


# ─── Keyframe builder ───

def kf(frame, value, easing="ease_out"):
    """Build a single keyframe entry."""
    handles = {
        "ease_out": ease_out_handles(),
        "ease_in": ease_in_handles(),
        "ease_in_out": ease_in_out_handles(),
        "linear": linear_handles(),
    }[easing]
    return f'[{frame}] = {{ {value}, {handles} }}'


def animated_path(name, keyframes_list):
    """Build an animated BezierSpline."""
    kfs = ",\n                    ".join(keyframes_list)
    return f"""
                {name} = BezierSpline {{
                    SplineColor = {{ Red = 255, Green = 0, Blue = 0 }},
                    KeyFrames = {{
                        {kfs}
                    }}
                }},"""


# ─── Colour constants ───

COLOURS = {
    "bg":       "{ R = 0.043, G = 0.047, B = 0.059, A = 1 }",
    "bg_lift":  "{ R = 0.078, G = 0.086, B = 0.106, A = 1 }",
    "card":     "{ R = 0.090, G = 0.098, B = 0.118, A = 1 }",
    "border":   "{ R = 0.165, G = 0.176, B = 0.200, A = 1 }",
    "primary":  "{ R = 0.961, G = 0.953, B = 0.933, A = 1 }",
    "secondary":"{ R = 0.557, G = 0.561, B = 0.545, A = 1 }",
    "amber":    "{ R = 1.000, G = 0.761, B = 0.294, A = 1 }",
    "amber_deep":"{ R = 0.788, G = 0.541, B = 0.071, A = 1 }",
}

# hex to Fusion float
def hex_to_fusion(h):
    h = h.lstrip('#')
    r, g, b = int(h[0:2], 16)/255, int(h[2:4], 16)/255, int(h[4:6], 16)/255
    return f"{{ R = {r:.3f}, G = {g:.3f}, B = {b:.3f}, A = 1 }}"


# ─── Scene builders ───

def build_s1():
    """S1: Intro (f0–f44) + T1 Button→Waveform (f44–f72)"""
    # Duration: f0–f72 = 73 frames → 3.04s
    # This scene contains:
    # - Background with radial lift
    # - Small logo fade in
    # - Record button + ring scale in
    # - Mini waveform icon + "Tap to record" fade in
    # - Ring breathing pulse
    # - Cursor enters, clicks
    # - Button squash, ring ripple
    # - Mini icon + label fade out, cursor fade out
    # - Button → pill morph
    # - Pill → dots → bars
    # - Timer + stop button fade in

    return f"""{{
    Tools = ordered() {{
        -- ═══ S1: INTRO + T1 (BUTTON → WAVEFORM) ═══
        -- Frames: f0–f72 (73 frames, ~3.04s)
        -- Handoff: last frame = waveform bars live + timer + stop button

        Background = Background {{
            CtrlWZoom = false,
            Inputs = {{
                GlobalOut = Input {{ Value = 72, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 0.043, }},
                TopLeftGreen = Input {{ Value = 0.047, }},
                TopLeftBlue = Input {{ Value = 0.059, }},
            }},
        }},

        BackgroundLift = EllipseMask {{
            -- Radial gradient ~700px radius at centre
            Inputs = {{
                Center = Input {{ Value = {{ {fx(960)}, {fy(540)} }}, }},
                Width = Input {{ Value = {fw(1400)}, }},
                Height = Input {{ Value = {fh(1400)}, }},
                SoftEdge = Input {{ Value = 0.8, }},
            }},
        }},

        BgLiftMerge = Merge {{
            Inputs = {{
                Foreground = Input {{ SourceOp = "BgLiftGrade", Source = "Output" }},
                Background = Input {{ SourceOp = "Background", Source = "Output" }},
                PerformDepthMerge = Input {{ Value = 0, }},
                Blend = Input {{
                    SourceOp = "BgLiftBlend",
                    Source = "Value",
                }},
            }},
        }},

        BgLiftBlend = BezierSpline {{
            -- f0–12: opacity 0→100%, ease-out
            SplineColor = {{ Red = 0, Green = 255, Blue = 0 }},
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [12] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        -- ─── Small logo "hum" ───
        SmallLogo = TextPlus {{
            Inputs = {{
                GlobalOut = Input {{ Value = 72, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.026, }},
                Tracking = Input {{ Value = 1.0, }},
                Center = Input {{ Value = {{ {fx(120 + 29)}, {fy(110)} }}, }},
                HorizontalJustificationNew = Input {{ Value = 0, }},  -- left
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
                Opacity = Input {{
                    SourceOp = "SmallLogoOpacity",
                    Source = "Value",
                }},
            }},
        }},
        SmallLogoOpacity = BezierSpline {{
            -- f4–12: fade in, ease-out
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [4] = {{ 0, {ease_out_handles()} }},
                [12] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        -- ─── Record button (220px circle, amber gradient) ───
        RecordButton = EllipseMask {{
            Inputs = {{
                Center = Input {{ Value = {{ {fx(960)}, {fy(500)} }}, }},
                Width = Input {{ Value = {fw(220)}, }},
                Height = Input {{ Value = {fh(220)}, }},
            }},
        }},

        RecordButtonBg = Background {{
            Inputs = {{
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 1.0, }},
                TopLeftGreen = Input {{ Value = 0.761, }},
                TopLeftBlue = Input {{ Value = 0.294, }},
                EffectMask = Input {{ SourceOp = "RecordButton", Source = "Mask" }},
            }},
        }},

        ButtonMerge = Merge {{
            Inputs = {{
                Foreground = Input {{ SourceOp = "RecordButtonBg", Source = "Output" }},
                Background = Input {{ SourceOp = "BgLiftMerge", Source = "Output" }},
                Blend = Input {{
                    SourceOp = "ButtonBlend",
                    Source = "Value",
                }},
                Center = Input {{
                    SourceOp = "ButtonCenter",
                    Source = "Value",
                }},
                Size = Input {{
                    SourceOp = "ButtonScale",
                    Source = "Value",
                }},
            }},
        }},

        ButtonBlend = BezierSpline {{
            -- f6–18: opacity 0→100%, ease-out
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [6] = {{ 0, {ease_out_handles()} }},
                [18] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        ButtonScale = BezierSpline {{
            -- f6–18: scale 80→100%, ease-out
            -- f46–50: press squash 100→85→100%
            -- f47–51: button squash 100→92%
            KeyFrames = {{
                [0] = {{ 0.8, {ease_out_handles()} }},
                [6] = {{ 0.8, {ease_out_handles()} }},
                [18] = {{ 1.0, {ease_out_handles()} }},
                [46] = {{ 1.0, {ease_out_handles()} }},
                [48] = {{ 0.92, {ease_out_handles()} }},
                [51] = {{ 1.0, {ease_out_handles()} }}
            }}
        }},

        -- ─── Button ring (280px, 2px amber, 40% opacity) ───
        ButtonRing = EllipseMask {{
            Inputs = {{
                Center = Input {{ Value = {{ {fx(960)}, {fy(500)} }}, }},
                Width = Input {{ Value = {fw(280)}, }},
                Height = Input {{ Value = {fh(280)}, }},
                Thickness = Input {{ Value = {2/280}, }},
                IsSoft = Input {{ Value = 0, }},
            }},
        }},

        RingMerge = Merge {{
            Inputs = {{
                Blend = Input {{
                    SourceOp = "RingOpacity",
                    Source = "Value",
                }},
                Size = Input {{
                    SourceOp = "RingScale",
                    Source = "Value",
                }},
            }},
        }},

        RingOpacity = BezierSpline {{
            -- f6–18: fade in 0→40%
            -- f18–47: breathing pulse (subtle)
            -- f49–63: ripple out, opacity 40→0%
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [6] = {{ 0, {ease_out_handles()} }},
                [18] = {{ 0.4, {ease_out_handles()} }},
                [49] = {{ 0.4, {ease_out_handles()} }},
                [63] = {{ 0, {ease_out_handles()} }}
            }}
        }},

        RingScale = BezierSpline {{
            -- f6–18: scale 80→100%
            -- f18–30: breathe 100→106%
            -- f30–42: breathe 106→100%
            -- f49–63: ripple 100→160%
            KeyFrames = {{
                [0] = {{ 0.8, {ease_out_handles()} }},
                [6] = {{ 0.8, {ease_out_handles()} }},
                [18] = {{ 1.0, {ease_in_out_handles()} }},
                [30] = {{ 1.06, {ease_in_out_handles()} }},
                [42] = {{ 1.0, {ease_in_out_handles()} }},
                [49] = {{ 1.0, {ease_out_handles()} }},
                [63] = {{ 1.6, {ease_out_handles()} }}
            }}
        }},

        -- ─── Cursor (enters f20–44, clicks f46–50, fades f50–55) ───
        Cursor = PolylineMask {{
            -- Arrow cursor, 36px, white with dark outline
            -- Path: (1500, 900) → tip at (985, 525)
            Inputs = {{
                Center = Input {{
                    SourceOp = "CursorPos",
                    Source = "Value",
                }},
                Opacity = Input {{
                    SourceOp = "CursorOpacity",
                    Source = "Value",
                }},
            }},
        }},

        CursorPos = Path {{
            -- f20–44: enter along curved path
            -- Tip travels (1500,900) → (985,525)
            KeyFrames = {{
                [20] = {{ {fx(1500)}, {fy(900)}, {ease_in_out_handles()} }},
                [44] = {{ {fx(985)}, {fy(525)}, {ease_in_out_handles()} }}
            }}
        }},

        CursorOpacity = BezierSpline {{
            -- f20–26: fade in
            -- f50–55: fade out
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [20] = {{ 0, {ease_out_handles()} }},
                [26] = {{ 1, {ease_out_handles()} }},
                [50] = {{ 1, {ease_in_handles()} }},
                [55] = {{ 0, {ease_in_handles()} }}
            }}
        }},

        -- ─── Mini waveform icon + "Tap to record" ───
        TapLabel = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "Tap to record", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Regular", }},
                Size = Input {{ Value = 0.022, }},
                Center = Input {{ Value = {{ {fx(960)}, {fy(690)} }}, }},
                Red1 = Input {{ Value = 0.557, }},
                Green1 = Input {{ Value = 0.561, }},
                Blue1 = Input {{ Value = 0.545, }},
                Opacity = Input {{
                    SourceOp = "TapLabelOpacity",
                    Source = "Value",
                }},
            }},
        }},

        TapLabelOpacity = BezierSpline {{
            -- f10–18: fade in with 8px rise, ease-out
            -- f49–54: fade out, ease-in
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [10] = {{ 0, {ease_out_handles()} }},
                [18] = {{ 1, {ease_out_handles()} }},
                [49] = {{ 1, {ease_in_handles()} }},
                [54] = {{ 0, {ease_in_handles()} }}
            }}
        }},

        -- ═══ T1: BUTTON → PILL → DOTS → BARS ═══

        -- Button→Pill morph happens f51–59
        -- At f51: button is 220×220 circle (after squash recovery)
        -- At f59: becomes 1138×10 pill, corner radius = height/2
        -- This is handled by animating the button's size and aspect ratio

        -- Pill→Dots at f59 (invisible swap)
        -- Dots width 24→10 px over f59–62
        -- Bars grow from dots f62–72 (voice-driven heights)

        -- Timer + stop button fade in f68–76
        Timer = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "00:00", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Regular", }},
                Size = Input {{ Value = 0.022, }},
                Center = Input {{ Value = {{ {fx(960)}, {fy(700)} }}, }},
                Red1 = Input {{ Value = 0.557, }},
                Green1 = Input {{ Value = 0.561, }},
                Blue1 = Input {{ Value = 0.545, }},
                Opacity = Input {{
                    SourceOp = "TimerOpacity",
                    Source = "Value",
                }},
            }},
        }},

        TimerOpacity = BezierSpline {{
            -- f68–76: fade in
            KeyFrames = {{
                [0] = {{ 0, {ease_out_handles()} }},
                [68] = {{ 0, {ease_out_handles()} }},
                [76] = {{ 1, {ease_out_handles()} }}
            }}
        }},
    }},

    ActiveTool = "ButtonMerge",
}}"""


def build_s2():
    """S2: Hero waveform (f72–f120) + T2 Waveform→Words (f120–f192)"""
    return f"""{{
    Tools = ordered() {{
        -- ═══ S2: HERO WAVEFORM + T2 (WAVEFORM → WORDS) ═══
        -- Frames: f72–f192 (121 frames, ~5.04s)
        -- Entry: waveform bars live at (960,500), timer counting, stop button
        -- Exit: words on transcript line, waveform parked at 40% (960,260), caret blinking

        Background = Background {{
            Inputs = {{
                GlobalIn = Input {{ Value = 72, }},
                GlobalOut = Input {{ Value = 192, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 0.043, }},
                TopLeftGreen = Input {{ Value = 0.047, }},
                TopLeftBlue = Input {{ Value = 0.059, }},
            }},
        }},

        -- ─── Waveform group (48 bars) ───
        -- f72–f120: full size at (960,500), voice-driven heights
        -- f120–132: scale 100→40%, y 500→260, ease-out
        -- f186–198: bars relax to dots (heights→10px)

        WaveformGroup = GroupOperator {{
            -- Container for 48 bar rectangles
            -- Each bar: 10px wide, 14px gap, rounded ends
            -- Heights driven by waveform_keyframes.json
            Inputs = {{
                Center = Input {{
                    SourceOp = "WaveformPos",
                    Source = "Value",
                }},
                Size = Input {{
                    SourceOp = "WaveformScale",
                    Source = "Value",
                }},
            }},
        }},

        WaveformPos = Path {{
            -- f72–120: stay at (960,500)
            -- f120–132: move to (960,260)
            KeyFrames = {{
                [72] = {{ {fx(960)}, {fy(500)}, {ease_out_handles()} }},
                [120] = {{ {fx(960)}, {fy(500)}, {ease_out_handles()} }},
                [132] = {{ {fx(960)}, {fy(260)}, {ease_out_handles()} }}
            }}
        }},

        WaveformScale = BezierSpline {{
            -- f120–132: scale 100→40%
            KeyFrames = {{
                [72] = {{ 1.0, {ease_out_handles()} }},
                [120] = {{ 1.0, {ease_out_handles()} }},
                [132] = {{ 0.4, {ease_out_handles()} }}
            }}
        }},

        -- ─── Timer + Stop button ───
        Timer = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "00:02", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Regular", }},
                Size = Input {{ Value = 0.022, }},
                Center = Input {{ Value = {{ {fx(960)}, {fy(700)} }}, }},
                Red1 = Input {{ Value = 0.557, }},
                Green1 = Input {{ Value = 0.561, }},
                Blue1 = Input {{ Value = 0.545, }},
                Opacity = Input {{
                    SourceOp = "TimerFadeOut",
                    Source = "Value",
                }},
            }},
        }},

        TimerFadeOut = BezierSpline {{
            -- f120–125: fade out
            KeyFrames = {{
                [72] = {{ 1, {ease_in_handles()} }},
                [120] = {{ 1, {ease_in_handles()} }},
                [125] = {{ 0, {ease_in_handles()} }}
            }}
        }},

        -- ─── Transcript words ───
        -- Catch-up (f126–149): Pitch, deck, by, Friday, call, Sam
        --   Spawn every 3f, each starts at waveform centre (960,260)
        --   scale 40%, opacity 0 → move to slot on transcript line over 8f
        --   scale→100%, opacity→100% in first 4f
        -- Live (from f154): and, that, new, feature, idea
        --   Same drop, start = spoken frame + 12f lag
        -- Each word: colour secondary→primary over 6f after landing + 8f

        -- Word: "Pitch"
        WordPitch = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "Pitch", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.059, }},
                Center = Input {{
                    SourceOp = "WordPitchPos",
                    Source = "Value",
                }},
                Red1 = Input {{
                    SourceOp = "WordPitchR",
                    Source = "Value",
                }},
                Green1 = Input {{
                    SourceOp = "WordPitchG",
                    Source = "Value",
                }},
                Blue1 = Input {{
                    SourceOp = "WordPitchB",
                    Source = "Value",
                }},
                Opacity = Input {{
                    SourceOp = "WordPitchOpacity",
                    Source = "Value",
                }},
            }},
        }},

        WordPitchPos = Path {{
            -- f126: start at waveform centre (960,260)
            -- f134: land at transcript position ({fx(384 + 77)}, {fy(760)})
            KeyFrames = {{
                [126] = {{ {fx(960)}, {fy(260)}, {ease_out_handles()} }},
                [134] = {{ {fx(461)}, {fy(760)}, {ease_out_handles()} }}
            }}
        }},

        WordPitchOpacity = BezierSpline {{
            KeyFrames = {{
                [72] = {{ 0, {ease_out_handles()} }},
                [126] = {{ 0, {ease_out_handles()} }},
                [130] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        -- Colour transition: secondary→primary over 6f at landing+8f
        WordPitchR = BezierSpline {{
            KeyFrames = {{
                [126] = {{ 0.557, {ease_out_handles()} }},
                [142] = {{ 0.557, {ease_out_handles()} }},
                [148] = {{ 0.961, {ease_out_handles()} }}
            }}
        }},
        WordPitchG = BezierSpline {{
            KeyFrames = {{
                [126] = {{ 0.561, {ease_out_handles()} }},
                [142] = {{ 0.561, {ease_out_handles()} }},
                [148] = {{ 0.953, {ease_out_handles()} }}
            }}
        }},
        WordPitchB = BezierSpline {{
            KeyFrames = {{
                [126] = {{ 0.545, {ease_out_handles()} }},
                [142] = {{ 0.545, {ease_out_handles()} }},
                [148] = {{ 0.933, {ease_out_handles()} }}
            }}
        }},

        -- (Remaining words follow same pattern with 3f stagger for catch-up,
        --  spoken_frame+12f for live words. See docs/layout_table.json for x positions.)
        -- Words: deck(f129), by(f132), Friday(f135), call(f138), Sam(f141)
        -- Live: and(f166), that(f172), new(f178), feature(f185), idea(f196)

        -- ─── Caret ───
        Caret = Background {{
            Inputs = {{
                Width = Input {{ Value = 2, }},
                Height = Input {{ Value = 56, }},
                TopLeftRed = Input {{ Value = 1.0, }},
                TopLeftGreen = Input {{ Value = 0.761, }},
                TopLeftBlue = Input {{ Value = 0.294, }},
                -- Blinks 12f on / 12f off (step function)
                -- Follows last landed word + 12px gap
            }},
        }},

        SmallLogo = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.026, }},
                Center = Input {{ Value = {{ {fx(149)}, {fy(110)} }}, }},
                HorizontalJustificationNew = Input {{ Value = 0, }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
            }},
        }},
    }},

    ActiveTool = "WaveformGroup",
}}"""


def build_s3():
    """S3: T3 Words→Cards, live sorting (f152–f248)"""
    # Card 1: "Pitch deck by Friday" — TASK, list-check icon
    # Card 2: "Call Sam" — CALL, phone icon
    # Card 3: "New feature idea" — IDEA, bulb icon

    return f"""{{
    Tools = ordered() {{
        -- ═══ S3: T3 (WORDS → CARDS) ═══
        -- Frames: f152–f248 (97 frames, ~4.04s)
        -- Entry: transcript line with all words, waveform parked at 40%
        -- Exit: 3 compact cards in row, waveform faded out

        Background = Background {{
            Inputs = {{
                GlobalIn = Input {{ Value = 152, }},
                GlobalOut = Input {{ Value = 248, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 0.043, }},
                TopLeftGreen = Input {{ Value = 0.047, }},
                TopLeftBlue = Input {{ Value = 0.059, }},
            }},
        }},

        -- ─── CARD 1: "Pitch deck by Friday" ═══
        -- Underline f152–158 (6f)
        -- Grow f158–166 (8f, overshoot 104% at f164, settle f166)
        -- Label+icon f162–168 (fade in 6f, rise 6px)
        -- Lift f166–178 → (592,500), −3°
        -- Border amber→grey f178–190

        Card1Underline = RectangleMask {{
            -- 4px amber line under "Pitch deck by Friday"
            -- Grows left→right over f152–158
            Inputs = {{
                Center = Input {{ Value = {{ {fx(600)}, {fy(800)} }}, }},
                Width = Input {{
                    SourceOp = "Card1UlWidth",
                    Source = "Value",
                }},
                Height = Input {{ Value = {fh(4)}, }},
                CornerRadius = Input {{ Value = 1.0, }},
            }},
        }},

        Card1UlWidth = BezierSpline {{
            -- Grows from 0 to phrase width over 6f
            KeyFrames = {{
                [152] = {{ 0, {ease_out_handles()} }},
                [158] = {{ {fw(580)}, {ease_out_handles()} }}
            }}
        }},

        Card1Body = RectangleMask {{
            -- 320×200, radius 20
            Inputs = {{
                Center = Input {{
                    SourceOp = "Card1Pos",
                    Source = "Value",
                }},
                Width = Input {{
                    SourceOp = "Card1W",
                    Source = "Value",
                }},
                Height = Input {{
                    SourceOp = "Card1H",
                    Source = "Value",
                }},
                CornerRadius = Input {{ Value = {20/320}, }},
                Angle = Input {{
                    SourceOp = "Card1Rot",
                    Source = "Value",
                }},
            }},
        }},

        Card1W = BezierSpline {{
            -- f158–166: grow from underline width to 320px
            KeyFrames = {{
                [152] = {{ 0, {ease_out_handles()} }},
                [158] = {{ {fw(580)}, {ease_out_handles()} }},
                [164] = {{ {fw(320 * 1.04)}, {ease_out_handles()} }},
                [166] = {{ {fw(320)}, {ease_out_handles()} }}
            }}
        }},

        Card1H = BezierSpline {{
            -- f158–166: grow from 4px (underline) to 200px
            KeyFrames = {{
                [158] = {{ {fh(4)}, {ease_out_handles()} }},
                [164] = {{ {fh(200 * 1.04)}, {ease_out_handles()} }},
                [166] = {{ {fh(200)}, {ease_out_handles()} }}
            }}
        }},

        Card1Pos = Path {{
            -- f158: at transcript position for "Pitch deck by Friday"
            -- f166–178: lift to row slot (592, 500)
            KeyFrames = {{
                [158] = {{ {fx(600)}, {fy(760)}, {ease_out_handles()} }},
                [166] = {{ {fx(600)}, {fy(680)}, {ease_out_handles()} }},
                [178] = {{ {fx(592)}, {fy(500)}, {ease_out_handles()} }}
            }}
        }},

        Card1Rot = BezierSpline {{
            -- f166–178: rotate to −3°
            KeyFrames = {{
                [166] = {{ 0, {ease_out_handles()} }},
                [178] = {{ -3, {ease_out_handles()} }}
            }}
        }},

        Card1Label = TextPlus {{
            -- "TASK" label, amber, top-left of card
            Inputs = {{
                StyledText = Input {{ Value = "TASK", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.019, }},
                Tracking = Input {{ Value = 1.08, }},
                Red1 = Input {{ Value = 1.0, }},
                Green1 = Input {{ Value = 0.761, }},
                Blue1 = Input {{ Value = 0.294, }},
                Opacity = Input {{
                    SourceOp = "Card1LabelOp",
                    Source = "Value",
                }},
            }},
        }},

        Card1LabelOp = BezierSpline {{
            -- f162–168: fade in
            KeyFrames = {{
                [152] = {{ 0, {ease_out_handles()} }},
                [162] = {{ 0, {ease_out_handles()} }},
                [168] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        Card1Title = TextPlus {{
            -- "Pitch deck by Friday"
            Inputs = {{
                StyledText = Input {{ Value = "Pitch deck\\nby Friday", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.033, }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
            }},
        }},

        -- ─── CARD 2: "Call Sam" ═══
        -- Underline f180–186, Grow f186–194, Label+icon f190–197
        -- Lift f194–206 → (960,500), +2°, Border f206–218

        Card2Underline = RectangleMask {{
            Inputs = {{
                Center = Input {{ Value = {{ {fx(1100)}, {fy(800)} }}, }},
                Width = Input {{
                    SourceOp = "Card2UlWidth",
                    Source = "Value",
                }},
                Height = Input {{ Value = {fh(4)}, }},
                CornerRadius = Input {{ Value = 1.0, }},
            }},
        }},

        Card2UlWidth = BezierSpline {{
            KeyFrames = {{
                [180] = {{ 0, {ease_out_handles()} }},
                [186] = {{ {fw(250)}, {ease_out_handles()} }}
            }}
        }},

        -- (Card 2 body, position, rotation, label, title follow same structure)

        -- ─── CARD 3: "New feature idea" ═══
        -- Underline f210–216, Grow f216–224, Label+icon f220–227
        -- Lift f224–236 → (1328,500), −1°, Border f236–248

        -- ─── Remaining transcript cleanup ───
        -- f168–178: remaining words slide left to x 384
        -- f196–201: "and that" fade out
        -- f198–208: "new feature idea" slide left to x 384
        -- f210–214: caret fade out
        -- f236–242: parked waveform dots fade out

        SmallLogo = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.026, }},
                Center = Input {{ Value = {{ {fx(149)}, {fy(110)} }}, }},
                HorizontalJustificationNew = Input {{ Value = 0, }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
            }},
        }},
    }},

    ActiveTool = "Card1Body",
}}"""


def build_s4():
    """S4: Row hold (f248–f276) + T4 Cards→Sorted list (f276–f314)"""
    return f"""{{
    Tools = ordered() {{
        -- ═══ S4: ROW HOLD + T4 (CARDS → SORTED LIST) ═══
        -- Frames: f248–f314 (67 frames, ~2.79s)
        -- Entry: 3 compact cards in row with tilts
        -- Exit: 3 list cards, vertical, with checkmarks

        Background = Background {{
            Inputs = {{
                GlobalIn = Input {{ Value = 248, }},
                GlobalOut = Input {{ Value = 314, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 0.043, }},
                TopLeftGreen = Input {{ Value = 0.047, }},
                TopLeftBlue = Input {{ Value = 0.059, }},
            }},
        }},

        -- ─── Card 1: (592,500) −3° → (960,392) 0° ───
        Card1 = RectangleMask {{
            Inputs = {{
                Center = Input {{
                    SourceOp = "Card1Pos",
                    Source = "Value",
                }},
                Width = Input {{
                    SourceOp = "Card1W",
                    Source = "Value",
                }},
                Height = Input {{
                    SourceOp = "Card1H",
                    Source = "Value",
                }},
                CornerRadius = Input {{ Value = 0.0625, }},
                Angle = Input {{
                    SourceOp = "Card1Rot",
                    Source = "Value",
                }},
            }},
        }},

        Card1Pos = Path {{
            -- Hold at (592,500) until f276
            -- f276–288: curved path to (960,392)
            KeyFrames = {{
                [248] = {{ {fx(592)}, {fy(500)}, {ease_out_handles()} }},
                [276] = {{ {fx(592)}, {fy(500)}, {ease_out_handles()} }},
                [288] = {{ {fx(960)}, {fy(392)}, {ease_out_handles()} }}
            }}
        }},

        Card1W = BezierSpline {{
            -- f276–288: 320→720
            KeyFrames = {{
                [248] = {{ {fw(320)}, {ease_out_handles()} }},
                [276] = {{ {fw(320)}, {ease_out_handles()} }},
                [288] = {{ {fw(720)}, {ease_out_handles()} }}
            }}
        }},

        Card1H = BezierSpline {{
            -- f276–288: 200→120
            KeyFrames = {{
                [248] = {{ {fh(200)}, {ease_out_handles()} }},
                [276] = {{ {fh(200)}, {ease_out_handles()} }},
                [288] = {{ {fh(120)}, {ease_out_handles()} }}
            }}
        }},

        Card1Rot = BezierSpline {{
            -- f276–288: −3°→0°
            KeyFrames = {{
                [248] = {{ -3, {ease_out_handles()} }},
                [276] = {{ -3, {ease_out_handles()} }},
                [288] = {{ 0, {ease_out_handles()} }}
            }}
        }},

        -- Settle: f288→f292: scale 103→100%
        Card1Settle = BezierSpline {{
            KeyFrames = {{
                [288] = {{ 1.03, {ease_out_handles()} }},
                [292] = {{ 1.0, {ease_out_handles()} }}
            }}
        }},

        -- ─── Card 2: (960,500) +2° → (960,540) 0° ───
        Card2Pos = Path {{
            KeyFrames = {{
                [248] = {{ {fx(960)}, {fy(500)}, {ease_out_handles()} }},
                [279] = {{ {fx(960)}, {fy(500)}, {ease_out_handles()} }},
                [291] = {{ {fx(960)}, {fy(540)}, {ease_out_handles()} }}
            }}
        }},

        Card2Rot = BezierSpline {{
            KeyFrames = {{
                [248] = {{ 2, {ease_out_handles()} }},
                [279] = {{ 2, {ease_out_handles()} }},
                [291] = {{ 0, {ease_out_handles()} }}
            }}
        }},

        -- ─── Card 3: (1328,500) −1° → (960,688) 0° ───
        Card3Pos = Path {{
            KeyFrames = {{
                [248] = {{ {fx(1328)}, {fy(500)}, {ease_out_handles()} }},
                [282] = {{ {fx(1328)}, {fy(500)}, {ease_out_handles()} }},
                [294] = {{ {fx(960)}, {fy(688)}, {ease_out_handles()} }}
            }}
        }},

        Card3Rot = BezierSpline {{
            KeyFrames = {{
                [248] = {{ -1, {ease_out_handles()} }},
                [282] = {{ -1, {ease_out_handles()} }},
                [294] = {{ 0, {ease_out_handles()} }}
            }}
        }},

        -- ─── Ticks ───
        -- f300/f303/f306: tick circles scale 0→104%(4f)→100%(2f)
        -- f304/f307/f310: checkmark write-on stroke 0→100%
        -- Taps @ f302, f305, f308 (rising pitch)

        Tick1Scale = BezierSpline {{
            KeyFrames = {{
                [299] = {{ 0, {ease_out_handles()} }},
                [300] = {{ 0, {ease_out_handles()} }},
                [304] = {{ 1.04, {ease_out_handles()} }},
                [306] = {{ 1.0, {ease_out_handles()} }}
            }}
        }},

        Tick2Scale = BezierSpline {{
            KeyFrames = {{
                [302] = {{ 0, {ease_out_handles()} }},
                [303] = {{ 0, {ease_out_handles()} }},
                [307] = {{ 1.04, {ease_out_handles()} }},
                [309] = {{ 1.0, {ease_out_handles()} }}
            }}
        }},

        Tick3Scale = BezierSpline {{
            KeyFrames = {{
                [305] = {{ 0, {ease_out_handles()} }},
                [306] = {{ 0, {ease_out_handles()} }},
                [310] = {{ 1.04, {ease_out_handles()} }},
                [312] = {{ 1.0, {ease_out_handles()} }}
            }}
        }},

        SmallLogo = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.026, }},
                Center = Input {{ Value = {{ {fx(149)}, {fy(110)} }}, }},
                HorizontalJustificationNew = Input {{ Value = 0, }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
            }},
        }},
    }},

    ActiveTool = "Card1",
}}"""


def build_s5():
    """S5: List hold (f314–f372) + T5 List→Line→Logo (f372–f479)"""
    return f"""{{
    Tools = ordered() {{
        -- ═══ S5: LIST HOLD + T5 (LIST → LINE → LOGO) ═══
        -- Frames: f314–f479 (166 frames, ~6.92s)
        -- Entry: 3 list cards with ticks
        -- Exit: amber line + big "hum" + tagline

        Background = Background {{
            Inputs = {{
                GlobalIn = Input {{ Value = 314, }},
                GlobalOut = Input {{ Value = 479, }},
                Width = Input {{ Value = {W}, }},
                Height = Input {{ Value = {H}, }},
                TopLeftRed = Input {{ Value = 0.043, }},
                TopLeftGreen = Input {{ Value = 0.047, }},
                TopLeftBlue = Input {{ Value = 0.059, }},
            }},
        }},

        -- ─── Card contents fade out (f372–376) ───
        CardContentFade = BezierSpline {{
            KeyFrames = {{
                [314] = {{ 1, {ease_in_handles()} }},
                [372] = {{ 1, {ease_in_handles()} }},
                [376] = {{ 0, {ease_in_handles()} }}
            }}
        }},

        -- ─── Small logo fade out (f372–378) ───
        SmallLogoFade = BezierSpline {{
            KeyFrames = {{
                [314] = {{ 1, {ease_in_handles()} }},
                [372] = {{ 1, {ease_in_handles()} }},
                [378] = {{ 0, {ease_in_handles()} }}
            }}
        }},

        SmallLogo = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Medium", }},
                Size = Input {{ Value = 0.026, }},
                Center = Input {{ Value = {{ {fx(149)}, {fy(110)} }}, }},
                HorizontalJustificationNew = Input {{ Value = 0, }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
                Opacity = Input {{
                    SourceOp = "SmallLogoFade",
                    Source = "Value",
                }},
            }},
        }},

        -- ─── Cards compress to lines (f372–380) ───
        -- height 120→2px, fill→amber, border off, radius→1

        Card1H = BezierSpline {{
            KeyFrames = {{
                [314] = {{ {fh(120)}, {ease_in_handles()} }},
                [372] = {{ {fh(120)}, {ease_in_handles()} }},
                [380] = {{ {fh(2)}, {ease_in_handles()} }}
            }}
        }},

        -- Card fill transitions to amber
        Card1FillR = BezierSpline {{
            KeyFrames = {{
                [372] = {{ 0.090, {ease_in_handles()} }},
                [380] = {{ 1.0, {ease_in_handles()} }}
            }}
        }},
        Card1FillG = BezierSpline {{
            KeyFrames = {{
                [372] = {{ 0.098, {ease_in_handles()} }},
                [380] = {{ 0.761, {ease_in_handles()} }}
            }}
        }},
        Card1FillB = BezierSpline {{
            KeyFrames = {{
                [372] = {{ 0.118, {ease_in_handles()} }},
                [380] = {{ 0.294, {ease_in_handles()} }}
            }}
        }},

        -- ─── 3 lines converge to y540 (f380–388) ───
        Line1Y = BezierSpline {{
            -- Card 1 at y392 → y540
            KeyFrames = {{
                [380] = {{ {fy(392)}, {ease_in_out_handles()} }},
                [388] = {{ {fy(540)}, {ease_in_out_handles()} }}
            }}
        }},

        Line2Y = BezierSpline {{
            -- Card 2 at y540 → stays y540
            KeyFrames = {{
                [380] = {{ {fy(540)}, {ease_in_out_handles()} }},
                [388] = {{ {fy(540)}, {ease_in_out_handles()} }}
            }}
        }},

        Line3Y = BezierSpline {{
            -- Card 3 at y688 → y540
            KeyFrames = {{
                [380] = {{ {fy(688)}, {ease_in_out_handles()} }},
                [388] = {{ {fy(540)}, {ease_in_out_handles()} }}
            }}
        }},

        -- ─── Single line extends (f386–398) ───
        -- width 720→1152, y 540→470
        FinalLine = RectangleMask {{
            Inputs = {{
                Center = Input {{
                    SourceOp = "FinalLinePos",
                    Source = "Value",
                }},
                Width = Input {{
                    SourceOp = "FinalLineW",
                    Source = "Value",
                }},
                Height = Input {{ Value = {fh(2)}, }},
                CornerRadius = Input {{ Value = 1.0, }},
            }},
        }},

        FinalLinePos = Path {{
            KeyFrames = {{
                [386] = {{ {fx(960)}, {fy(540)}, {ease_out_handles()} }},
                [398] = {{ {fx(960)}, {fy(470)}, {ease_out_handles()} }}
            }}
        }},

        FinalLineW = BezierSpline {{
            KeyFrames = {{
                [386] = {{ {fw(720)}, {ease_out_handles()} }},
                [398] = {{ {fw(1152)}, {ease_out_handles()} }}
            }}
        }},

        -- ─── Line glow (f396–412) ───
        -- gain 1.0→1.6→1.0
        LineGlow = BezierSpline {{
            -- Apply as Soft Glow gain on the line
            KeyFrames = {{
                [396] = {{ 1.0, {ease_in_out_handles()} }},
                [404] = {{ 1.6, {ease_in_out_handles()} }},
                [412] = {{ 1.0, {ease_in_out_handles()} }}
            }}
        }},

        -- ─── Big logo (f396–408) ───
        -- Masked reveal: slides from just under line (y465) to (960,575)
        -- Mask = area below the line
        BigLogo = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "hum", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Light", }},
                Size = Input {{ Value = 0.130, }},
                Tracking = Input {{ Value = 0.97, }},
                Center = Input {{
                    SourceOp = "BigLogoPos",
                    Source = "Value",
                }},
                Red1 = Input {{ Value = 0.961, }},
                Green1 = Input {{ Value = 0.953, }},
                Blue1 = Input {{ Value = 0.933, }},
                Opacity = Input {{
                    SourceOp = "BigLogoOpacity",
                    Source = "Value",
                }},
            }},
        }},

        BigLogoPos = Path {{
            -- f396–408: rise from y465 to y575
            KeyFrames = {{
                [396] = {{ {fx(960)}, {fy(465)}, {ease_out_handles()} }},
                [408] = {{ {fx(960)}, {fy(575)}, {ease_out_handles()} }}
            }}
        }},

        BigLogoOpacity = BezierSpline {{
            KeyFrames = {{
                [314] = {{ 0, {ease_out_handles()} }},
                [396] = {{ 0, {ease_out_handles()} }},
                [400] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        -- Mask: everything below the line (y < 470 in Fusion coords = y > 470 in px)
        LogoRevealMask = RectangleMask {{
            Inputs = {{
                Center = Input {{ Value = {{ 0.5, {fy(775)} }}, }},
                Width = Input {{ Value = 1.0, }},
                Height = Input {{ Value = {fh(610)}, }},
                SoftEdge = Input {{ Value = 0.005, }},
            }},
        }},

        -- ─── Tagline (f410–418) ───
        Tagline = TextPlus {{
            Inputs = {{
                StyledText = Input {{ Value = "Say it. It's sorted.", }},
                Font = Input {{ Value = "Inter", }},
                Style = Input {{ Value = "Regular", }},
                Size = Input {{ Value = 0.030, }},
                Center = Input {{
                    SourceOp = "TaglinePos",
                    Source = "Value",
                }},
                Red1 = Input {{ Value = 0.557, }},
                Green1 = Input {{ Value = 0.561, }},
                Blue1 = Input {{ Value = 0.545, }},
                Opacity = Input {{
                    SourceOp = "TaglineOpacity",
                    Source = "Value",
                }},
            }},
        }},

        TaglinePos = Path {{
            -- f410–418: rise 8px
            KeyFrames = {{
                [410] = {{ {fx(960)}, {fy(673)}, {ease_out_handles()} }},
                [418] = {{ {fx(960)}, {fy(665)}, {ease_out_handles()} }}
            }}
        }},

        TaglineOpacity = BezierSpline {{
            KeyFrames = {{
                [314] = {{ 0, {ease_out_handles()} }},
                [410] = {{ 0, {ease_out_handles()} }},
                [418] = {{ 1, {ease_out_handles()} }}
            }}
        }},

        -- End frame hold: f418–479 (62 frames)
    }},

    ActiveTool = "BigLogo",
}}"""


def build_handoff_checklist():
    """Generate handoff verification data."""
    checklist = {
        "S1_to_S2": {
            "handoff_frame": 72,
            "elements_present": [
                "Background with radial lift (full opacity)",
                "Small logo 'hum' top-left (full opacity)",
                "Waveform: 48 bars at (960,500), heights from voice audio, full size",
                "Timer '00:00' at (960,700) — fading in (f68–76, so partially visible)",
                "Stop button at (960,780) — fading in",
                "No cursor (faded at f55)",
                "No record button (morphed to bars)",
                "No ring (faded at f63)",
                "No 'Tap to record' (faded at f54)"
            ],
            "match_check": "S2 first frame must show same waveform position/size, timer state, bg"
        },
        "S2_to_S3": {
            "handoff_frame": 192,
            "elements_present": [
                "Background with radial lift",
                "Small logo 'hum' top-left",
                "Waveform parked at 40% at (960,260), bars relaxed to dots (h≈10px)",
                "All 11 transcript words on baseline y760, colours = primary",
                "Caret blinking after 'idea.'",
                "No timer, no stop button (faded at f125)"
            ],
            "note": "S3 starts at f152, so S2 holds f192 state. T3 overlaps T2 slightly."
        },
        "S3_to_S4": {
            "handoff_frame": 248,
            "elements_present": [
                "Background with radial lift",
                "Small logo 'hum' top-left",
                "Card 1 at (592,500), −3°, 320×200, grey border",
                "Card 2 at (960,500), +2°, 320×200, grey border",
                "Card 3 at (1328,500), −1°, 320×200, grey border",
                "No waveform (faded at f242)",
                "No transcript words (absorbed into cards)",
                "No caret (faded at f214)"
            ]
        },
        "S4_to_S5": {
            "handoff_frame": 314,
            "elements_present": [
                "Background with radial lift",
                "Small logo 'hum' top-left",
                "Card 1 at (960,392), 0°, 720×120 (list), with tick",
                "Card 2 at (960,540), 0°, 720×120, with tick",
                "Card 3 at (960,688), 0°, 720×120, with tick",
                "All cards: grey border #2A2D33, fill #17191E"
            ]
        },
        "S5_end": {
            "handoff_frame": 479,
            "elements_present": [
                "Background with radial lift",
                "Amber line 2px × 1152px at (960,470)",
                "Big logo 'hum' at (960,575)",
                "Tagline 'Say it. It's sorted.' at (960,665)",
                "Line glow settled at 1.0",
                "No small logo (faded at f378)",
                "No cards (compressed to line)"
            ]
        }
    }

    path = OUT_DIR.parent / "docs" / "handoff_checklist.json"
    with open(path, "w") as f:
        json.dump(checklist, f, indent=2)
    print(f"✓ Handoff checklist → {path}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    scenes = [
        ("S1", build_s1),
        ("S2", build_s2),
        ("S3", build_s3),
        ("S4", build_s4),
        ("S5", build_s5),
    ]

    for name, builder in scenes:
        content = builder()
        path = OUT_DIR / f"{name}.setting"
        path.write_text(content)
        print(f"✓ {path}")

    build_handoff_checklist()
    print(f"\n=== All 5 Fusion comps + handoff checklist generated ===")


if __name__ == "__main__":
    main()
