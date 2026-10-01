#!/usr/bin/env python3
"""
Generate subtitle text animation for hum video.

Voiceover: "Pitch deck by Friday, call Sam and the new feature idea."
Word-by-word gray text reveal → yellow underline on task completion.
All nodes connected in a clean merge chain with ViewInfo for flow layout.

Output: fusion/subtitle_words.setting
"""

from pathlib import Path

W, H = 1920, 1080

GRAY_R, GRAY_G, GRAY_B = 0.557, 0.561, 0.545
WHITE_R, WHITE_G, WHITE_B = 0.961, 0.953, 0.933
AMBER_R, AMBER_G, AMBER_B = 1.0, 0.761, 0.294
BG_R, BG_G, BG_B = 0.043, 0.047, 0.059

BASELINE_Y = 760
UL_Y = 800
FONT_SIZE = 0.059
SPACE_W = 17.0

SPAWN_X, SPAWN_Y = 960, 260
GLOBAL_IN = 120
GLOBAL_OUT = 250

def nx(px):
    return round(px / W, 6)

def ny(px):
    return round(1.0 - px / H, 6)


# Voiceover: "Pitch deck by Friday, call Sam and the new feature idea."
# Tasks: 1="Pitch deck by Friday", 2="call Sam", 3="new feature idea"
# group 0 = connector words ("and the") — fade out after card 2
WORDS = [
    {"name": "Pitch",   "text": "Pitch",   "x": 384,  "w": 153.7, "spawn": 126, "land": 134, "group": 1},
    {"name": "Deck",    "text": "deck",    "x": 555,  "w": 149.2, "spawn": 129, "land": 137, "group": 1},
    {"name": "By",      "text": "by",      "x": 721,  "w": 76.0,  "spawn": 132, "land": 140, "group": 1},
    {"name": "Friday",  "text": "Friday,", "x": 814,  "w": 209.8, "spawn": 135, "land": 143, "group": 1},
    {"name": "Call",    "text": "call",    "x": 1041, "w": 105.1, "spawn": 138, "land": 146, "group": 2},
    {"name": "Sam",     "text": "Sam",     "x": 1163, "w": 133.9, "spawn": 141, "land": 149, "group": 2},
    {"name": "And",     "text": "and",     "x": 1314, "w": 113.9, "spawn": 148, "land": 156, "group": 0},
    {"name": "The",     "text": "the",     "x": 1445, "w": 93.0,  "spawn": 156, "land": 164, "group": 0},
    {"name": "New",     "text": "new",     "x": 1555, "w": 128.6, "spawn": 173, "land": 181, "group": 3},
    {"name": "Feature", "text": "feature", "x": 1701, "w": 219.9, "spawn": 183, "land": 191, "group": 3},
    {"name": "Idea",    "text": "idea.",   "x": 1938, "w": 148.4, "spawn": 194, "land": 202, "group": 3},
]

# Add idx for position calc
for i, w in enumerate(WORDS):
    w["idx"] = i

# Slide 1: after card 1 lifts, remaining words shift left so "call" → x=384
SLIDE1_START, SLIDE1_END = 168, 178
SLIDE1_SHIFT = 1041 - 384  # 657px

# Slide 2: after card 2 lifts, "new feature idea" shift left so "new" → x=384
SLIDE2_START, SLIDE2_END = 198, 208

# "and the" connector words fade out
AND_FADE_START, AND_FADE_END = 196, 201

# Underline positions (after their respective slides have landed)
UNDERLINES = [
    {
        "name": "UL1", "start": 152, "end": 158,
        "left": 384,
        "right": 384 + 153.7 + SPACE_W + 149.2 + SPACE_W + 76.0 + SPACE_W + 209.8,
    },
    {
        "name": "UL2", "start": 180, "end": 186,
        "left": 384,
        "right": 384 + 105.1 + SPACE_W + 133.9,
    },
    {
        "name": "UL3", "start": 210, "end": 216,
        "left": 384,
        "right": 384 + 128.6 + SPACE_W + 219.9 + SPACE_W + 148.4,
    },
]

CARET_GAP = 12
CARET_HEIGHT_PX = 56
CARET_WIDTH_PX = 2
CARET_BLINK_START = 126
CARET_BLINK_END = 214


def kf(frame, value):
    return f"[{frame}] = {{ {value}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}"


def pos_kf(frame, x_px, y_px):
    return f"[{frame}] = {{ {nx(x_px)}, {ny(y_px)}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}"


def word_cx(word):
    return word["x"] + word["w"] / 2


def gen_word_nodes(word):
    """Generate Text+ node + all its spline/path children for one word."""
    n = f"Word{word['name']}"
    idx = word["idx"]
    cx = word_cx(word)

    # Position keyframes
    pos_kfs = [pos_kf(word["spawn"], SPAWN_X, SPAWN_Y)]
    pos_kfs.append(pos_kf(word["land"], cx, BASELINE_Y))

    if idx >= 4:
        slid1_cx = cx - SLIDE1_SHIFT
        pos_kfs.append(pos_kf(SLIDE1_START, cx, BASELINE_Y))
        pos_kfs.append(pos_kf(SLIDE1_END, slid1_cx, BASELINE_Y))

        if idx >= 8:
            s2_shift = (1555 - SLIDE1_SHIFT) - 384
            slid2_cx = slid1_cx - s2_shift
            pos_kfs.append(pos_kf(SLIDE2_START, slid1_cx, BASELINE_Y))
            pos_kfs.append(pos_kf(SLIDE2_END, slid2_cx, BASELINE_Y))

    # Opacity keyframes
    op_kfs = [kf(GLOBAL_IN, 0), kf(word["spawn"], 0), kf(word["spawn"] + 4, 1)]
    if word["group"] == 0:
        op_kfs += [kf(AND_FADE_START, 1), kf(AND_FADE_END, 0)]

    # Color keyframes (gray → white)
    color_hold = word["land"] + 8
    color_done = color_hold + 6
    colors = {
        "R": (GRAY_R, WHITE_R),
        "G": (GRAY_G, WHITE_G),
        "B": (GRAY_B, WHITE_B),
    }

    out = []

    # TextPlus node
    out.append(f"        {n} = TextPlus {{")
    out.append(f"            Inputs = {{")
    out.append(f'                StyledText = Input {{ Value = "{word["text"]}", }},')
    out.append(f'                Font = Input {{ Value = "Inter", }},')
    out.append(f'                Style = Input {{ Value = "Medium", }},')
    out.append(f"                Size = Input {{ Value = {FONT_SIZE}, }},")
    out.append(f'                Center = Input {{ SourceOp = "{n}Pos", Source = "Value", }},')
    out.append(f'                Red1 = Input {{ SourceOp = "{n}R", Source = "Value", }},')
    out.append(f'                Green1 = Input {{ SourceOp = "{n}G", Source = "Value", }},')
    out.append(f'                Blue1 = Input {{ SourceOp = "{n}B", Source = "Value", }},')
    out.append(f'                Opacity = Input {{ SourceOp = "{n}Opacity", Source = "Value", }},')
    out.append(f"            }},")
    out.append(f"            ViewInfo = OperatorInfo {{ Pos = {{ {770 + idx * 110}, 16.5 }} }},")
    out.append(f"        }},")

    # Path
    out.append(f"        {n}Pos = Path {{")
    out.append(f"            KeyFrames = {{")
    for k in pos_kfs:
        out.append(f"                {k},")
    out.append(f"            }}")
    out.append(f"        }},")

    # Opacity
    out.append(f"        {n}Opacity = BezierSpline {{")
    out.append(f"            KeyFrames = {{")
    for k in op_kfs:
        out.append(f"                {k},")
    out.append(f"            }}")
    out.append(f"        }},")

    # Color channels
    for ch, (gray_v, white_v) in colors.items():
        out.append(f"        {n}{ch} = BezierSpline {{")
        out.append(f"            KeyFrames = {{")
        out.append(f"                {kf(word['spawn'], gray_v)},")
        out.append(f"                {kf(color_hold, gray_v)},")
        out.append(f"                {kf(color_done, white_v)},")
        out.append(f"            }}")
        out.append(f"        }},")

    out.append("")
    return "\n".join(out)


def gen_underline_nodes(ul, flow_x):
    """Generate underline Background + RectangleMask."""
    n = ul["name"]
    cx = nx((ul["left"] + ul["right"]) / 2)
    cy = ny(UL_Y)
    fw = nx(ul["right"] - ul["left"])
    h = round(4 / H, 6)

    out = []
    out.append(f"        {n}Mask = RectangleMask {{")
    out.append(f"            Inputs = {{")
    out.append(f"                Center = Input {{ Value = {{ {cx}, {cy} }}, }},")
    out.append(f'                Width = Input {{ SourceOp = "{n}Width", Source = "Value", }},')
    out.append(f"                Height = Input {{ Value = {h}, }},")
    out.append(f"                CornerRadius = Input {{ Value = 1.0, }},")
    out.append(f"            }},")
    out.append(f"        }},")

    out.append(f"        {n}Width = BezierSpline {{")
    out.append(f"            KeyFrames = {{")
    out.append(f"                {kf(ul['start'], 0)},")
    out.append(f"                {kf(ul['end'], fw)},")
    out.append(f"            }}")
    out.append(f"        }},")

    out.append(f"        {n}Bg = Background {{")
    out.append(f"            Inputs = {{")
    out.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    out.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    out.append(f"                Width = Input {{ Value = {W}, }},")
    out.append(f"                Height = Input {{ Value = {H}, }},")
    out.append(f"                TopLeftRed = Input {{ Value = {AMBER_R}, }},")
    out.append(f"                TopLeftGreen = Input {{ Value = {AMBER_G}, }},")
    out.append(f"                TopLeftBlue = Input {{ Value = {AMBER_B}, }},")
    out.append(f'                EffectMask = Input {{ SourceOp = "{n}Mask", Source = "Mask", }},')
    out.append(f"            }},")
    out.append(f"            ViewInfo = OperatorInfo {{ Pos = {{ {flow_x}, 16.5 }} }},")
    out.append(f"        }},")
    out.append("")
    return "\n".join(out)


def gen_caret_nodes(flow_x):
    """Generate caret Background + RectangleMask + blink spline."""
    cy = ny(BASELINE_Y)
    cw = nx(CARET_WIDTH_PX)
    ch = round(CARET_HEIGHT_PX / H, 6)

    # Caret x jumps to right edge of each word as it lands
    positions = []
    for word in WORDS:
        right = word["x"] + word["w"] + CARET_GAP + 1
        positions.append((word["land"], right))

    # After slide 1
    positions.append((SLIDE1_START, WORDS[5]["x"] + WORDS[5]["w"] + CARET_GAP + 1))
    sam_slid = (WORDS[5]["x"] + WORDS[5]["w"] + CARET_GAP + 1) - SLIDE1_SHIFT
    positions.append((SLIDE1_END, sam_slid))

    # After "and" and "the" land (already shifted by slide1)
    and_slid = (WORDS[6]["x"] + WORDS[6]["w"] + CARET_GAP + 1) - SLIDE1_SHIFT
    positions.append((WORDS[6]["land"] + 2, and_slid))
    the_slid = (WORDS[7]["x"] + WORDS[7]["w"] + CARET_GAP + 1) - SLIDE1_SHIFT
    positions.append((WORDS[7]["land"] + 2, the_slid))

    # After slide 2
    s2_shift = (1555 - SLIDE1_SHIFT) - 384
    for word in WORDS[8:]:
        right_s2 = (word["x"] + word["w"] + CARET_GAP + 1) - SLIDE1_SHIFT - s2_shift
        positions.append((word["land"] + 2, right_s2))

    # Deduplicate and sort
    seen = {}
    for f, px in positions:
        seen[f] = px
    positions = sorted(seen.items())

    out = []
    out.append(f"        CaretMask = RectangleMask {{")
    out.append(f"            Inputs = {{")
    out.append(f'                Center = Input {{ SourceOp = "CaretPos", Source = "Value", }},')
    out.append(f"                Width = Input {{ Value = {cw}, }},")
    out.append(f"                Height = Input {{ Value = {ch}, }},")
    out.append(f"            }},")
    out.append(f"        }},")

    out.append(f"        CaretPos = Path {{")
    out.append(f"            KeyFrames = {{")
    for f, px in positions:
        out.append(f"                {pos_kf(f, px, BASELINE_Y)},")
    out.append(f"            }}")
    out.append(f"        }},")

    out.append(f"        CaretBg = Background {{")
    out.append(f"            Inputs = {{")
    out.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    out.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    out.append(f"                Width = Input {{ Value = {W}, }},")
    out.append(f"                Height = Input {{ Value = {H}, }},")
    out.append(f"                TopLeftRed = Input {{ Value = {AMBER_R}, }},")
    out.append(f"                TopLeftGreen = Input {{ Value = {AMBER_G}, }},")
    out.append(f"                TopLeftBlue = Input {{ Value = {AMBER_B}, }},")
    out.append(f'                EffectMask = Input {{ SourceOp = "CaretMask", Source = "Mask", }},')
    out.append(f'                Opacity = Input {{ SourceOp = "CaretBlink", Source = "Value", }},')
    out.append(f"            }},")
    out.append(f"            ViewInfo = OperatorInfo {{ Pos = {{ {flow_x}, 16.5 }} }},")
    out.append(f"        }},")

    # Blink: 12f on, 12f off (step function)
    out.append(f"        CaretBlink = BezierSpline {{")
    out.append(f"            KeyFrames = {{")
    out.append(f"                {kf(GLOBAL_IN, 0)},")
    f = CARET_BLINK_START
    while f <= CARET_BLINK_END:
        out.append(f"                {kf(f, 1)},")
        out.append(f"                {kf(f + 12, 1)},")
        out.append(f"                {kf(f + 13, 0)},")
        out.append(f"                {kf(f + 24, 0)},")
        f += 24
    out.append(f"            }}")
    out.append(f"        }},")
    out.append("")
    return "\n".join(out)


def gen_merge(merge_name, bg_op, fg_op, flow_x, flow_y=49.5):
    """Generate one Merge node."""
    return "\n".join([
        f"        {merge_name} = Merge {{",
        f"            Inputs = {{",
        f'                Background = Input {{ SourceOp = "{bg_op}", Source = "Output", }},',
        f'                Foreground = Input {{ SourceOp = "{fg_op}", Source = "Output", }},',
        f"            }},",
        f"            ViewInfo = OperatorInfo {{ Pos = {{ {flow_x}, {flow_y} }} }},",
        f"        }},",
    ])


def generate_setting():
    lines = []
    lines.append("{")
    lines.append("    Tools = ordered() {")
    lines.append('        -- ═══ SUBTITLE TEXT: word-by-word reveal + yellow underlines ═══')
    lines.append('        -- Voiceover: "Pitch deck by Friday, call Sam and the new feature idea."')
    lines.append("        -- Voice starts f102. Words appear f126+. Underlines on task completion.")
    lines.append("")

    # Background
    lines.append("        SubtitleBg = Background {")
    lines.append("            Inputs = {")
    lines.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    lines.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    lines.append(f"                Width = Input {{ Value = {W}, }},")
    lines.append(f"                Height = Input {{ Value = {H}, }},")
    lines.append("                UseFrameFormatSettings = Input { Value = 1, },")
    lines.append(f"                TopLeftRed = Input {{ Value = {BG_R}, }},")
    lines.append(f"                TopLeftGreen = Input {{ Value = {BG_G}, }},")
    lines.append(f"                TopLeftBlue = Input {{ Value = {BG_B}, }},")
    lines.append("                TopLeftAlpha = Input { Value = 0, },")
    lines.append("            },")
    lines.append("            ViewInfo = OperatorInfo { Pos = { 660, 49.5 } },")
    lines.append("        },")
    lines.append("")

    # All foreground elements in merge order
    fg_elements = []

    # Words
    lines.append("        -- ─── Words (11 Text+ nodes) ───")
    for word in WORDS:
        lines.append(gen_word_nodes(word))
        fg_elements.append(f"Word{word['name']}")

    # Underlines
    lines.append("        -- ─── Yellow underlines (3 tasks) ───")
    ul_flow_x = 770 + len(WORDS) * 110
    for i, ul in enumerate(UNDERLINES):
        lines.append(gen_underline_nodes(ul, ul_flow_x + i * 110))
        fg_elements.append(f"{ul['name']}Bg")

    # Caret
    lines.append("        -- ─── Blinking caret ───")
    caret_flow_x = ul_flow_x + len(UNDERLINES) * 110
    lines.append(gen_caret_nodes(caret_flow_x))
    fg_elements.append("CaretBg")

    # Merge chain
    lines.append("        -- ─── Merge chain (all connected) ───")
    prev = "SubtitleBg"
    for i, fg in enumerate(fg_elements):
        merge_name = f"Mrg{i + 1}"
        flow_x = 770 + i * 110
        lines.append(gen_merge(merge_name, prev, fg, flow_x))
        lines.append("")
        prev = merge_name

    lines.append("    },")
    lines.append("")
    lines.append(f'    ActiveTool = "{prev}",')
    lines.append("}")

    return "\n".join(lines)


def main():
    out_path = Path(__file__).parent.parent / "fusion" / "subtitle_words.setting"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    content = generate_setting()
    with open(out_path, "w") as f:
        f.write(content)

    size_kb = out_path.stat().st_size / 1024
    print(f"Output: {out_path} ({size_kb:.1f} KB)")
    print()
    print("Voiceover: \"Pitch deck by Friday, call Sam and the new feature idea.\"")
    print("Voice starts at f102.")
    print()
    print("Timeline:")
    print("  f126–f141: Catch-up words drop from waveform center (960,260)")
    print("             Pitch(126) deck(129) by(132) Friday(135) call(138) Sam(141)")
    print("  f148–f202: Live words with 12f lag")
    print("             and(148) the(156) new(173) feature(183) idea(194)")
    print("  f152–f158: Underline 1 — 'Pitch deck by Friday'")
    print("  f168–f178: Slide 1 — remaining words shift left")
    print("  f180–f186: Underline 2 — 'call Sam'")
    print("  f196–f201: 'and the' fade out")
    print("  f198–f208: Slide 2 — 'new feature idea' shifts left")
    print("  f210–f216: Underline 3 — 'new feature idea'")
    print("  f126–f214: Caret blinks (12f on / 12f off)")
    print()
    print("All nodes connected: SubtitleBg → Mrg1…Mrg15 → output")
    print("ViewInfo positions set — nodes lay out cleanly in Fusion flow.")


if __name__ == "__main__":
    main()
