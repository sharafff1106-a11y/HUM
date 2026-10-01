#!/usr/bin/env python3
"""
Generate subtitle text animation for hum video.

Word-by-word gray text reveal with yellow underlines on task completion.
Words drop from waveform center, land on transcript line, then slide left
as task groups get consumed by cards.

Output: fusion/subtitle_words.setting
"""

from pathlib import Path

W, H = 1920, 1080

GRAY_R, GRAY_G, GRAY_B = 0.557, 0.561, 0.545
WHITE_R, WHITE_G, WHITE_B = 0.961, 0.953, 0.933
AMBER_R, AMBER_G, AMBER_B = 1.0, 0.761, 0.294

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


WORDS = [
    {"name": "Pitch",   "text": "Pitch",   "x": 384,  "w": 153.7, "spawn": 126, "land": 134, "group": 1, "idx": 0},
    {"name": "Deck",    "text": "deck",    "x": 555,  "w": 149.2, "spawn": 129, "land": 137, "group": 1, "idx": 1},
    {"name": "By",      "text": "by",      "x": 721,  "w": 76.0,  "spawn": 132, "land": 140, "group": 1, "idx": 2},
    {"name": "Friday",  "text": "Friday,", "x": 814,  "w": 209.8, "spawn": 135, "land": 143, "group": 1, "idx": 3},
    {"name": "Call",    "text": "call",    "x": 1041, "w": 105.1, "spawn": 138, "land": 146, "group": 2, "idx": 4},
    {"name": "Sam",     "text": "Sam",     "x": 1163, "w": 133.9, "spawn": 141, "land": 149, "group": 2, "idx": 5},
    {"name": "And",     "text": "and",     "x": 1314, "w": 113.9, "spawn": 148, "land": 156, "group": 0, "idx": 6},
    {"name": "That",    "text": "that",    "x": 1445, "w": 117.9, "spawn": 156, "land": 164, "group": 0, "idx": 7},
    {"name": "New",     "text": "new",     "x": 1580, "w": 128.6, "spawn": 173, "land": 181, "group": 3, "idx": 8},
    {"name": "Feature", "text": "feature", "x": 1725, "w": 219.9, "spawn": 183, "land": 191, "group": 3, "idx": 9},
    {"name": "Idea",    "text": "idea.",   "x": 1962, "w": 148.4, "spawn": 194, "land": 202, "group": 3, "idx": 10},
]

SLIDE1_START, SLIDE1_END = 168, 178
SLIDE1_SHIFT = 1041 - 384

SLIDE2_START, SLIDE2_END = 198, 208

AND_FADE_START, AND_FADE_END = 196, 201

UNDERLINES = [
    {
        "name": "UL1", "start": 152, "end": 158,
        "left": 384, "right": 384 + 153.7 + SPACE_W + 149.2 + SPACE_W + 76.0 + SPACE_W + 209.8,
    },
    {
        "name": "UL2", "start": 180, "end": 186,
        "left": 384, "right": 384 + 105.1 + SPACE_W + 133.9,
    },
    {
        "name": "UL3", "start": 210, "end": 216,
        "left": 384, "right": 384 + 128.6 + SPACE_W + 219.9 + SPACE_W + 148.4,
    },
]

CARET_BLINK_START = 126
CARET_BLINK_END = 214
CARET_GAP = 12
CARET_HEIGHT_PX = 56
CARET_WIDTH_PX = 2


def kf(frame, value):
    return f"[{frame}] = {{ {value}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}"

def kf_smooth(frame, value):
    lh_f = frame - 0.999899983406
    rh_f = frame + 0.999899983406
    return (f"[{frame}] = {{ {value:.6f}, "
            f"LH = {{ {lh_f:.12g}, {value:.6f} }}, "
            f"RH = {{ {rh_f:.12g}, {value:.6f} }}, "
            f"Flags = {{ {{ SCEF_IS_SMOOTH, SCNF_IS_SMOOTH }} }} }}")


def word_center_x(word):
    return nx(word["x"] + word["w"] / 2)

def word_center_x_px(word):
    return word["x"] + word["w"] / 2


def gen_word_pos_keyframes(word):
    """Generate position Path keyframes for a word."""
    spawn_x = nx(SPAWN_X)
    spawn_y = ny(SPAWN_Y)
    land_x = word_center_x(word)
    land_y = ny(BASELINE_Y)
    idx = word["idx"]
    grp = word["group"]

    kfs = []
    kfs.append(f"[{word['spawn']}] = {{ {spawn_x}, {spawn_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")
    kfs.append(f"[{word['land']}] = {{ {land_x}, {land_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")

    if idx >= 4:
        slide1_x = nx(word_center_x_px(word) - SLIDE1_SHIFT)
        kfs.append(f"[{SLIDE1_START}] = {{ {land_x}, {land_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")
        kfs.append(f"[{SLIDE1_END}] = {{ {slide1_x}, {land_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")

        if idx >= 8:
            after_s1_px = word_center_x_px(word) - SLIDE1_SHIFT
            slide2_shift = (1580 - SLIDE1_SHIFT) - 384
            slide2_x = nx(after_s1_px - slide2_shift)
            kfs.append(f"[{SLIDE2_START}] = {{ {slide1_x}, {land_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")
            kfs.append(f"[{SLIDE2_END}] = {{ {slide2_x}, {land_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }}")

    return kfs


def gen_word_opacity_keyframes(word):
    """Generate opacity BezierSpline keyframes."""
    kfs = []
    kfs.append(kf(GLOBAL_IN, 0))
    kfs.append(kf(word["spawn"], 0))
    kfs.append(kf(word["spawn"] + 4, 1))

    if word["group"] == 0:
        kfs.append(kf(AND_FADE_START, 1))
        kfs.append(kf(AND_FADE_END, 0))

    return kfs


def gen_color_keyframes(word, channel_idx):
    """Generate color channel BezierSpline keyframes (0=R, 1=G, 2=B)."""
    gray = (GRAY_R, GRAY_G, GRAY_B)[channel_idx]
    white = (WHITE_R, WHITE_G, WHITE_B)[channel_idx]
    color_start = word["land"] + 8
    color_end = color_start + 6

    kfs = []
    kfs.append(kf(word["spawn"], gray))
    kfs.append(kf(color_start, gray))
    kfs.append(kf(color_end, white))
    return kfs


def gen_word_block(word):
    """Generate all Fusion nodes for one word."""
    name = f"Word{word['name']}"
    lines = []

    lines.append(f"        {name} = TextPlus {{")
    lines.append(f"            Inputs = {{")
    lines.append(f'                StyledText = Input {{ Value = "{word["text"]}", }},')
    lines.append(f'                Font = Input {{ Value = "Inter", }},')
    lines.append(f'                Style = Input {{ Value = "Medium", }},')
    lines.append(f"                Size = Input {{ Value = {FONT_SIZE}, }},")
    lines.append(f"                Center = Input {{")
    lines.append(f'                    SourceOp = "{name}Pos",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Red1 = Input {{")
    lines.append(f'                    SourceOp = "{name}R",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Green1 = Input {{")
    lines.append(f'                    SourceOp = "{name}G",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Blue1 = Input {{")
    lines.append(f'                    SourceOp = "{name}B",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Opacity = Input {{")
    lines.append(f'                    SourceOp = "{name}Opacity",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"            }},")
    lines.append(f"        }},")
    lines.append(f"")

    pos_kfs = gen_word_pos_keyframes(word)
    lines.append(f"        {name}Pos = Path {{")
    lines.append(f"            KeyFrames = {{")
    for k in pos_kfs:
        lines.append(f"                {k},")
    lines.append(f"            }}")
    lines.append(f"        }},")
    lines.append(f"")

    op_kfs = gen_word_opacity_keyframes(word)
    lines.append(f"        {name}Opacity = BezierSpline {{")
    lines.append(f"            KeyFrames = {{")
    for k in op_kfs:
        lines.append(f"                {k},")
    lines.append(f"            }}")
    lines.append(f"        }},")
    lines.append(f"")

    for ch_name, ch_idx in [("R", 0), ("G", 1), ("B", 2)]:
        c_kfs = gen_color_keyframes(word, ch_idx)
        lines.append(f"        {name}{ch_name} = BezierSpline {{")
        lines.append(f"            KeyFrames = {{")
        for k in c_kfs:
            lines.append(f"                {k},")
        lines.append(f"            }}")
        lines.append(f"        }},")
        lines.append(f"")

    return "\n".join(lines)


def gen_underline_block(ul):
    """Generate underline mask + background nodes."""
    name = ul["name"]
    center_x = nx((ul["left"] + ul["right"]) / 2)
    center_y = ny(UL_Y)
    final_width = nx(ul["right"] - ul["left"])
    height = round(4 / H, 6)

    lines = []

    lines.append(f"        {name}Mask = RectangleMask {{")
    lines.append(f"            Inputs = {{")
    lines.append(f"                Center = Input {{ Value = {{ {center_x}, {center_y} }}, }},")
    lines.append(f"                Width = Input {{")
    lines.append(f'                    SourceOp = "{name}Width",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Height = Input {{ Value = {height}, }},")
    lines.append(f"                CornerRadius = Input {{ Value = 1.0, }},")
    lines.append(f"            }},")
    lines.append(f"        }},")
    lines.append(f"")

    lines.append(f"        {name}Width = BezierSpline {{")
    lines.append(f"            KeyFrames = {{")
    lines.append(f"                {kf(ul['start'], 0)},")
    lines.append(f"                {kf(ul['end'], final_width)},")
    lines.append(f"            }}")
    lines.append(f"        }},")
    lines.append(f"")

    lines.append(f"        {name}Bg = Background {{")
    lines.append(f"            Inputs = {{")
    lines.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    lines.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    lines.append(f"                Width = Input {{ Value = {W}, }},")
    lines.append(f"                Height = Input {{ Value = {H}, }},")
    lines.append(f"                TopLeftRed = Input {{ Value = {AMBER_R}, }},")
    lines.append(f"                TopLeftGreen = Input {{ Value = {AMBER_G}, }},")
    lines.append(f"                TopLeftBlue = Input {{ Value = {AMBER_B}, }},")
    lines.append(f"                EffectMask = Input {{")
    lines.append(f'                    SourceOp = "{name}Mask",')
    lines.append(f'                    Source = "Mask",')
    lines.append(f"                }},")
    lines.append(f"            }},")
    lines.append(f"        }},")
    lines.append(f"")

    return "\n".join(lines)


def gen_caret_block():
    """Generate blinking caret that follows the last landed word."""
    caret_y = ny(BASELINE_Y)
    caret_w = nx(CARET_WIDTH_PX)
    caret_h = round(CARET_HEIGHT_PX / H, 6)

    caret_positions = []
    last_right = WORDS[0]["x"]
    for word in WORDS:
        right_px = word["x"] + word["w"] + CARET_GAP + CARET_WIDTH_PX / 2
        caret_positions.append((word["land"], right_px))
        if word["group"] == 0:
            continue

    lines = []

    lines.append(f"        CaretMask = RectangleMask {{")
    lines.append(f"            Inputs = {{")
    lines.append(f"                Center = Input {{")
    lines.append(f'                    SourceOp = "CaretPos",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"                Width = Input {{ Value = {caret_w}, }},")
    lines.append(f"                Height = Input {{ Value = {caret_h}, }},")
    lines.append(f"            }},")
    lines.append(f"        }},")
    lines.append(f"")

    lines.append(f"        CaretPos = Path {{")
    lines.append(f"            KeyFrames = {{")

    cum_x = {}
    for word in WORDS:
        right = word["x"] + word["w"] + CARET_GAP + 1
        cum_x[word["idx"]] = right

    positions_over_time = []

    positions_over_time.append((134, cum_x[0]))
    positions_over_time.append((137, cum_x[1]))
    positions_over_time.append((140, cum_x[2]))
    positions_over_time.append((143, cum_x[3]))
    positions_over_time.append((146, cum_x[4]))
    positions_over_time.append((149, cum_x[5]))

    positions_over_time.append((SLIDE1_START, cum_x[5]))
    slid1_sam_right = cum_x[5] - SLIDE1_SHIFT
    positions_over_time.append((SLIDE1_END, slid1_sam_right))

    positions_over_time.append((156, slid1_sam_right))  # "and" lands

    and_right = (1314 + 113.9 + CARET_GAP + 1) - SLIDE1_SHIFT
    positions_over_time.append((158, and_right))

    that_right = (1445 + 117.9 + CARET_GAP + 1) - SLIDE1_SHIFT
    positions_over_time.append((164, that_right))

    positions_over_time.append((181, that_right))  # "new" lands after and/that

    slide2_shift = (1580 - SLIDE1_SHIFT) - 384
    new_right_s2 = (1580 + 128.6 + CARET_GAP + 1) - SLIDE1_SHIFT - slide2_shift
    positions_over_time.append((SLIDE2_END, new_right_s2))

    feat_right_s2 = (1725 + 219.9 + CARET_GAP + 1) - SLIDE1_SHIFT - slide2_shift
    positions_over_time.append((191, feat_right_s2))

    idea_right_s2 = (1962 + 148.4 + CARET_GAP + 1) - SLIDE1_SHIFT - slide2_shift
    positions_over_time.append((202, idea_right_s2))

    positions_over_time.sort(key=lambda x: x[0])

    seen = set()
    deduped = []
    for f, px in positions_over_time:
        if f not in seen:
            seen.add(f)
            deduped.append((f, px))
        else:
            for i, (ef, _) in enumerate(deduped):
                if ef == f:
                    deduped[i] = (f, px)
    deduped.sort(key=lambda x: x[0])

    for f, px in deduped:
        lines.append(f"                [{f}] = {{ {nx(px)}, {caret_y}, RH = {{ 0.333, 0.7 }}, LH = {{ -0.333, 0.0 }} }},")

    lines.append(f"            }}")
    lines.append(f"        }},")
    lines.append(f"")

    lines.append(f"        CaretBg = Background {{")
    lines.append(f"            Inputs = {{")
    lines.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    lines.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    lines.append(f"                Width = Input {{ Value = {W}, }},")
    lines.append(f"                Height = Input {{ Value = {H}, }},")
    lines.append(f"                TopLeftRed = Input {{ Value = {AMBER_R}, }},")
    lines.append(f"                TopLeftGreen = Input {{ Value = {AMBER_G}, }},")
    lines.append(f"                TopLeftBlue = Input {{ Value = {AMBER_B}, }},")
    lines.append(f"                EffectMask = Input {{")
    lines.append(f'                    SourceOp = "CaretMask",')
    lines.append(f'                    Source = "Mask",')
    lines.append(f"                }},")
    lines.append(f"                Opacity = Input {{")
    lines.append(f'                    SourceOp = "CaretBlink",')
    lines.append(f'                    Source = "Value",')
    lines.append(f"                }},")
    lines.append(f"            }},")
    lines.append(f"        }},")
    lines.append(f"")

    blink_on = 12
    blink_off = 12
    lines.append(f"        CaretBlink = BezierSpline {{")
    lines.append(f"            KeyFrames = {{")
    lines.append(f"                {kf(GLOBAL_IN, 0)},")
    f = CARET_BLINK_START
    while f <= CARET_BLINK_END:
        lines.append(f"                {kf(f, 1)},")
        lines.append(f"                {kf(f + blink_on, 1)},")
        lines.append(f"                {kf(f + blink_on + 1, 0)},")
        lines.append(f"                {kf(f + blink_on + blink_off, 0)},")
        f += blink_on + blink_off
    lines.append(f"            }}")
    lines.append(f"        }},")
    lines.append(f"")

    return "\n".join(lines)


def gen_merge_chain():
    """Generate merge chain connecting all elements."""
    elements = []
    for word in WORDS:
        elements.append(f"Word{word['name']}")
    for ul in UNDERLINES:
        elements.append(f"{ul['name']}Bg")
    elements.append("CaretBg")

    lines = []
    prev = "SubtitleBg"

    for i, elem in enumerate(elements):
        merge_name = f"SubMerge{i + 1}"
        lines.append(f"        {merge_name} = Merge {{")
        lines.append(f"            Inputs = {{")
        lines.append(f"                Background = Input {{")
        lines.append(f'                    SourceOp = "{prev}",')
        lines.append(f'                    Source = "Output",')
        lines.append(f"                }},")
        lines.append(f"                Foreground = Input {{")
        lines.append(f'                    SourceOp = "{elem}",')
        lines.append(f'                    Source = "Output",')
        lines.append(f"                }},")
        lines.append(f"            }},")
        lines.append(f"        }},")
        lines.append(f"")
        prev = merge_name

    return "\n".join(lines), prev


def generate_setting():
    parts = []

    parts.append("""{
    Tools = ordered() {
        -- Subtitle text animation: word-by-word reveal + yellow underlines
        -- Words drop from waveform center (960,260) to transcript line (y=760)
        -- Gray words turn white after landing
        -- Yellow underline grows left-to-right when each task completes
        -- Three tasks: "Pitch deck by Friday", "call Sam", "new feature idea"

        SubtitleBg = Background {
            Inputs = {""")
    parts.append(f"                GlobalIn = Input {{ Value = {GLOBAL_IN}, }},")
    parts.append(f"                GlobalOut = Input {{ Value = {GLOBAL_OUT}, }},")
    parts.append(f"                Width = Input {{ Value = {W}, }},")
    parts.append(f"                Height = Input {{ Value = {H}, }},")
    parts.append("""                UseFrameFormatSettings = Input { Value = 1, },
                TopLeftRed = Input { Value = 0.043, },
                TopLeftGreen = Input { Value = 0.047, },
                TopLeftBlue = Input { Value = 0.059, },
                TopLeftAlpha = Input { Value = 0, },
            },
        },
""")

    parts.append("        -- ─── Words ───")
    for word in WORDS:
        parts.append(gen_word_block(word))

    parts.append("        -- ─── Underlines ───")
    for ul in UNDERLINES:
        parts.append(gen_underline_block(ul))

    parts.append("        -- ─── Caret ───")
    parts.append(gen_caret_block())

    parts.append("        -- ─── Merge chain ───")
    merge_text, last_merge = gen_merge_chain()
    parts.append(merge_text)

    parts.append(f'    }},\n\n    ActiveTool = "{last_merge}",\n}}')

    return "\n".join(parts)


def main():
    out_path = Path(__file__).parent.parent / "fusion" / "subtitle_words.setting"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    content = generate_setting()
    with open(out_path, "w") as f:
        f.write(content)

    size_kb = out_path.stat().st_size / 1024
    print(f"Output: {out_path} ({size_kb:.1f} KB)")
    print()
    print("Timeline:")
    print("  f126–f149: Catch-up words drop from waveform center")
    print("             Pitch(126), deck(129), by(132), Friday(135), call(138), Sam(141)")
    print("  f148–f202: Live words drop with 12f lag after spoken")
    print("             and(148), that(156), new(173), feature(183), idea(194)")
    print("  f152–f158: Underline 1 — 'Pitch deck by Friday'")
    print("  f168–f178: Slide 1 — remaining words shift left")
    print("  f180–f186: Underline 2 — 'call Sam'")
    print("  f196–f201: 'and that' fade out")
    print("  f198–f208: Slide 2 — 'new feature idea' shifts left")
    print("  f210–f216: Underline 3 — 'new feature idea'")
    print("  f126–f214: Caret blinks (12f on / 12f off)")
    print()
    print("Colors:")
    print("  Words: gray (#8E8F8B) → white (#F5F3EE) over 6f after landing")
    print("  Underlines: amber (#FFC24B)")
    print("  Caret: amber (#FFC24B)")
    print()
    print("Drag subtitle_words.setting into Fusion to use.")


if __name__ == "__main__":
    main()
