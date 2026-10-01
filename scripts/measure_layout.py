#!/usr/bin/env python3
"""
Measure word widths with Inter TTF for exact transcript + card layout positions.
Uses fonttools to get real glyph advance widths.
Output: layout_table.json
"""

import json
from fontTools.ttLib import TTFont
from pathlib import Path

FONT_DIR = Path("/tmp/inter_font/extras/ttf")

# Fusion Text+ sizes are normalised to frame HEIGHT (1080 px)
# size 0.059 → 0.059 * 1080 ≈  63.7 px (transcript words)
# size 0.033 → 0.033 * 1080 ≈  35.6 px (card title)
# size 0.130 → 0.130 * 1080 ≈ 140.4 px (big logo — ~121 px cap-to-baseline)
# size 0.026 → 0.026 * 1080 ≈  28.1 px (small logo)
# size 0.019 → 0.019 * 1080 ≈  20.5 px (card label)
# size 0.022 → 0.022 * 1080 ≈  23.8 px (small UI text / timer)
# size 0.030 → 0.030 * 1080 ≈  32.4 px (tagline)

# Fusion Text+ Size is normalised to frame HEIGHT (1080), not width
FRAME_H = 1080

def load_font(style):
    name_map = {
        "Light": "Inter-Light.ttf",
        "Regular": "Inter-Regular.ttf",
        "Medium": "Inter-Medium.ttf",
    }
    return TTFont(FONT_DIR / name_map[style])

def measure_text(font, text, size_norm):
    """Return width in pixels for text at a given normalised size."""
    size_px = size_norm * FRAME_H
    cmap = font.getBestCmap()
    glyf_or_cff = font
    hmtx = font["hmtx"]
    units_per_em = font["head"].unitsPerEm

    total_advance = 0
    for ch in text:
        gid = cmap.get(ord(ch))
        if gid:
            advance, _ = hmtx[gid]
            total_advance += advance
        else:
            # space or missing — use space width
            space_gid = cmap.get(ord(' '))
            if space_gid:
                adv, _ = hmtx[space_gid]
                total_advance += adv

    return round(total_advance * size_px / units_per_em, 1)


def main():
    inter_medium = load_font("Medium")
    inter_regular = load_font("Regular")
    inter_light = load_font("Light")

    results = {}

    # === Transcript words (Medium, size 0.059) ===
    transcript_words = ["Pitch", "deck", "by", "Friday,", "call", "Sam", "and", "that", "new", "feature", "idea."]
    word_widths = {}
    space_w = measure_text(inter_medium, " ", 0.059)
    x = 384  # left edge of safe content zone
    word_positions = []
    for w in transcript_words:
        pw = measure_text(inter_medium, w, 0.059)
        word_widths[w] = pw
        word_positions.append({"word": w, "x": round(x), "width": round(pw, 1)})
        x += pw + space_w

    results["transcript"] = {
        "font": "Inter Medium",
        "fusion_size": 0.059,
        "px_size": round(0.059 * FRAME_H, 1),
        "baseline_y": 760,
        "space_width": round(space_w, 1),
        "words": word_positions,
        "total_width": round(x - 384 - space_w, 1),
    }

    # === Card titles (Medium, size 0.033) ===
    card_titles = [
        "Pitch deck by Friday",
        "Call Sam",
        "New feature idea",
    ]
    card_title_widths = []
    for t in card_titles:
        w = measure_text(inter_medium, t, 0.033)
        card_title_widths.append({"title": t, "width": round(w, 1)})

    results["card_titles"] = {
        "font": "Inter Medium",
        "fusion_size": 0.033,
        "px_size": round(0.033 * FRAME_H, 1),
        "titles": card_title_widths,
    }

    # === Card labels (Medium, size 0.019, tracking 1.08) ===
    labels = ["TASK", "CALL", "IDEA"]
    label_widths = []
    for l in labels:
        w = measure_text(inter_medium, l, 0.019) * 1.08  # tracking
        label_widths.append({"label": l, "width": round(w, 1)})

    results["card_labels"] = {
        "font": "Inter Medium",
        "fusion_size": 0.019,
        "tracking": 1.08,
        "px_size": round(0.019 * FRAME_H, 1),
        "labels": label_widths,
    }

    # === Big logo (Light, size 0.130) ===
    hum_big = measure_text(inter_light, "hum", 0.130)
    results["big_logo"] = {
        "font": "Inter Light",
        "fusion_size": 0.130,
        "px_size": round(0.130 * FRAME_H, 1),
        "text": "hum",
        "width": round(hum_big, 1),
        "centre": [960, 575],
    }

    # === Small logo (Medium, size 0.026) ===
    hum_small = measure_text(inter_medium, "hum", 0.026)
    results["small_logo"] = {
        "font": "Inter Medium",
        "fusion_size": 0.026,
        "px_size": round(0.026 * FRAME_H, 1),
        "text": "hum",
        "width": round(hum_small, 1),
        "left_edge_x": 120,
        "y": 110,
    }

    # === Tagline (Regular, size 0.030) ===
    tagline = "Say it. It's sorted."
    tag_w = measure_text(inter_regular, tagline, 0.030)
    results["tagline"] = {
        "font": "Inter Regular",
        "fusion_size": 0.030,
        "px_size": round(0.030 * FRAME_H, 1),
        "text": tagline,
        "width": round(tag_w, 1),
        "centre": [960, 665],
    }

    # === Small UI text (Regular, size 0.022) ===
    tap = "Tap to record"
    tap_w = measure_text(inter_regular, tap, 0.022)
    results["tap_label"] = {
        "font": "Inter Regular",
        "fusion_size": 0.022,
        "text": tap,
        "width": round(tap_w, 1),
        "centre": [960, 690],
    }

    # === Card layout: compact row positions ===
    results["compact_cards"] = {
        "size": [320, 200],
        "radius": 20,
        "fill": "#17191E",
        "border": "1px #2A2D33",
        "row_gap": 48,
        "slots": [
            {"card": 1, "label": "TASK", "title": "Pitch deck by Friday", "icon": "list-check", "centre": [592, 500], "tilt_deg": -3},
            {"card": 2, "label": "CALL", "title": "Call Sam",             "icon": "phone",      "centre": [960, 500], "tilt_deg": 2},
            {"card": 3, "label": "IDEA", "title": "New feature idea",     "icon": "bulb",        "centre": [1328, 500], "tilt_deg": -1},
        ],
    }

    # === Card layout: list positions ===
    results["list_cards"] = {
        "size": [720, 120],
        "radius": 20,
        "list_gap": 28,
        "slots": [
            {"card": 1, "centre": [960, 392]},
            {"card": 2, "centre": [960, 540]},
            {"card": 3, "centre": [960, 688]},
        ],
        "icon_circle": {"diameter": 56, "fill": "#2A2D33", "offset_from_left": 60},
        "label_offset": {"x": 112, "y": -14},
        "title_offset": {"x": 112, "y": 16},
        "tick_offset_from_right": 52,
    }

    # === Waveform specs ===
    results["waveform"] = {
        "bars": 48,
        "bar_width": 10,
        "gap": 14,
        "pitch": 24,
        "total_width": 1138,
        "min_height": 10,
        "max_height": 280,
        "centre": [960, 500],
        "parked_scale": 0.4,
        "parked_centre": [960, 260],
    }

    # === Caret ===
    results["caret"] = {
        "width": 2,
        "height": 56,
        "colour": "#FFC24B",
        "blink_on": 12,
        "blink_off": 12,
        "gap_after_word": 12,
    }

    # === Underline ===
    results["underline"] = {
        "height": 4,
        "colour": "#FFC24B",
        "y": 800,
    }

    # === Final line ===
    results["final_line"] = {
        "height": 2,
        "colour": "#FFC24B",
        "width": 1152,
        "centre": [960, 470],
    }

    # === Pill ===
    results["pill"] = {
        "width": 1138,
        "height": 10,
        "centre": [960, 500],
    }

    out = Path("/home/user/HUM/docs/layout_table.json")
    with open(out, "w") as f:
        json.dump(results, f, indent=2)

    print(f"✓ Layout table written to {out}")
    print(f"\nKey measurements:")
    print(f"  Transcript total width: {results['transcript']['total_width']} px")
    print(f"  Big logo 'hum' width:   {results['big_logo']['width']} px")
    print(f"  Small logo 'hum' width: {results['small_logo']['width']} px")
    print(f"  Tagline width:          {results['tagline']['width']} px")
    for wp in word_positions:
        print(f"  '{wp['word']}' → x={wp['x']}, w={wp['width']}")


if __name__ == "__main__":
    main()
