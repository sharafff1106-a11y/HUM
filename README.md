# HUM — 20s UI Motion Film

> Voice → waveform → words → cards → sorted list → one calm line → logo.

A 20-second, 480-frame (24 fps) UI motion film for a fictional audio-notes app called **hum**.

## Project Structure

```
HUM/
├── assets/
│   ├── icons/           # Tabler Icons (MIT) — list-check, phone, bulb
│   └── ui/              # Record button, cursor, checkmark, stop button, mini waveform
├── docs/
│   ├── HUM_SPEC_v2.md   # Production spec (single source of truth)
│   ├── layout_table.json # Measured word widths & positions (Inter font)
│   └── handoff_checklist.json # Scene-to-scene handoff verification
├── fusion/
│   ├── S1.setting        # Intro + T1 (Button → Waveform)
│   ├── S2.setting        # Hero waveform + T2 (Waveform → Words)
│   ├── S3.setting        # T3 (Words → Cards)
│   ├── S4.setting        # T4 (Cards → Sorted list)
│   └── S5.setting        # T5 (List → Line → Logo)
├── scripts/
│   ├── measure_layout.py # Font measurement with Inter TTF
│   ├── build_fusion_comps.py # Generates all .setting files
│   └── retime.py         # Voice → Whisper → retimed animation
├── markers.edl           # Sound hit markers for Resolve timeline
└── storyboards/          # Reference storyboard PNGs
```

## Quick Start

### Without voice recording (layout + comps)
```bash
python3 scripts/measure_layout.py
python3 scripts/build_fusion_comps.py
```

### With voice recording
```bash
pip install openai-whisper numpy scipy soundfile
python3 scripts/retime.py voice.wav
python3 scripts/build_fusion_comps.py  # rebuild with real timing
```

## Build Loop
1. Import S1.setting into Fusion → test → feedback → fix
2. Repeat for S2 → S3 → S4 → S5
3. Full assembly

## Scenes (480 frames total)

| Scene | Frames | Duration | Transition |
|-------|--------|----------|------------|
| S1 | f0–f72 | 3.0s | Intro + Button → Waveform |
| S2 | f72–f192 | 5.0s | Hero waveform + Waveform → Words |
| S3 | f152–f248 | 4.0s | Words → Cards (live sorting) |
| S4 | f248–f314 | 2.8s | Row hold + Cards → Sorted list |
| S5 | f314–f479 | 6.9s | List hold + List → Line → Logo |

## Colour Palette
- Background: `#0B0C0F`
- Card surface: `#17191E`
- Text primary: `#F5F3EE`
- Text secondary: `#8E8F8B`
- Accent amber: `#FFC24B`

## Font
**Inter** — Light (logo), Regular (UI text), Medium (titles, labels)
