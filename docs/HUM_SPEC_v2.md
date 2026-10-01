# HUM — Production Spec v2 (single source of truth)

> 20-sec UI motion film for a fictional audio-notes app called **hum**.
> Owner: Gaurav Ameta (Gaurav Motion). Builder: Claude Code. Animator & sound: Gaurav.
> **This file overrides every older storyboard timestamp and timing sheet.**
> Storyboards (attached PNGs) define the *look and idea*. This file defines the *exact numbers*.

---

## 0. Concept in one line
Voice → waveform → words → cards → sorted list → one calm line → logo.
**Golden rule: nothing appears from nothing. Every element is born from the previous one.**
Signature: every UI motion has a sound, every sound has a motion.

---

## 1. Storyboard audit — conflicts found and decisions made

| # | Conflict | Decision (final) |
|---|---|---|
| 1 | Timestamps differ between boards (e.g. T4 shown as 0:11–0:15 and 0:15–0:18) | Section 7 master timing is the only timing |
| 2 | Main board: 4 s of pure waveform. T2 board: words start immediately | ~2 s hero waveform, then a fast "catch-up" cascade of already-spoken words, then live words |
| 3 | T3 board sorts cards *while* the voice is still speaking; old sheet sorted after | **Live sorting:** each card forms as soon as its phrase is finished |
| 4 | Transcript frame only shows "…call Sam", but the voice line ends "…and that new feature idea" | Full line is transcribed. "and that" fade out, "new feature idea" becomes card 3 |
| 5 | 3 cards at 720×120 cannot sit side-by-side in a 1152 px zone | Two card states: **compact 320×200** (row, T3) → **list 720×120** (T4 morph) |
| 6 | T4 starts from a diagonal stack, but T3 ends in a row | T4 starts from the T3 row |
| 7 | Tilt: T4 says 8°, style system says small | Tilts **−3°, +2°, −1°** (subtle = premium) |
| 8 | Card gap: 24 / 48 / 28 px in different boards | Row gap **48 px**, list gap **28 px** (list centres Y 392 / 540 / 688) |
| 9 | 48 bars × 10 px + 10 px gaps ≠ 1152 px | Bar 10 px + gap 14 px (pitch 24) = **1138 px**. Pill final width = 1138 px |
| 10 | Max bar height 320 (style) vs ~160 (T1 board) | **280 px** hero max, 10 px min (a dot) |
| 11 | T1 board morphs circle→pill in 4 frames | **8 frames** (4 f looks like a glitch at 24 fps) |
| 12 | T2 easing ease-out vs ease-in-out | **Ease-out** (as storyboard) |
| 13 | "No fade-outs" vs labels like "Tap to record" that must leave | Shapes never fade; **small UI labels may fade out in 4–6 f** |
| 14 | Ticks "scale from 0" vs "nothing pops in" | Allowed exception: confirmation ticks grow from a point |
| 15 | T5 board has 1.4 s of silence | Silence shortened to **8 f** so the ending doesn't drag |
| 16 | End frame shows two "hum" logos (small top-left + big) | Small logo fades out at T5 start |

---

## 2. Project settings

| Setting | Value |
|---|---|
| Resolution | 1920×1080 (16:9) |
| Frame rate | **24 fps** |
| Duration | 20 s = **480 frames (f0–f479)** |
| Resolve | 21.1 **Free** — no scripting API; deliver files (.setting, PNG, EDL) the owner drags in |
| Coordinates in this file | **Pixels, top-left origin, element centres**. Convert for Fusion: x = px/1920, y = 1 − px/1080 |
| Safe content zone | x 384–1536 (centre 1152 px), margins 120 px sides / 96 px top-bottom |

---

## 3. Colour (locked)

| Role | Hex |
|---|---|
| Background | `#0B0C0F` |
| Background lift (radial, ~700 px radius, centre) | `#14161B` |
| Card surface | `#17191E` |
| Card border | `#2A2D33` (1 px) |
| Text primary | `#F5F3EE` |
| Text secondary | `#8E8F8B` |
| Accent amber | `#FFC24B` |
| Amber deep | `#C98A12` (button inner shade only) |

Rules: one accent only. Ticks amber. Glow only on amber shapes (button, waveform, line) via Soft Glow — never on text or cards. No drop shadows.

---

## 4. Typography (locked — Fusion Text+ values)

Font: **Inter** (static install may appear as "Inter 24pt"; pick the matching style).

| Element | Style | Size | Tracking | Line spacing | Colour |
|---|---|---|---|---|---|
| Big logo "hum" | Light | 0.130 | 0.97 | 1.0 | primary |
| Tagline "Say it. It's sorted." | Regular | 0.030 | 1.0 | 1.0 | secondary |
| Transcript words | Medium | 0.059 | 1.0 | 0.95 | secondary → primary |
| Card title | Medium | 0.033 | 1.0 | 1.0 | primary |
| Card label TASK / CALL / IDEA | Medium | 0.019 | 1.08 | 1.0 | amber |
| Small UI text ("Tap to record") | Regular | 0.022 | 1.0 | 1.0 | secondary |
| Small logo top-left | Medium | 0.026 | 1.0 | 1.0 | primary |
| Timer | Regular (IBM Plex Mono if digits jitter) | 0.022 | 1.0 | 1.0 | secondary |

First task: calibrate Text+ size by rendering "hum" at 0.130 and checking ~121 px cap-to-baseline height; scale all sizes by the same factor if needed.

---

## 5. Element specs and positions (px, centres)

| Element | Spec | Position |
|---|---|---|
| Small logo | "hum", left-aligned | left edge x 120, y 110 |
| Record button | 220 px circle, amber, inner shade `#C98A12` | (960, 500) |
| Button ring | 280 px circle, 2 px amber line, 40 % opacity | (960, 500) |
| Mini waveform icon | 5 bars, 24 px tall, amber | (960, 650) |
| "Tap to record" | small UI text | (960, 690) |
| Cursor | arrow, 36 px, white with dark outline | path (1500, 900) → tip at (985, 525) |
| Pill (T1 end) | 1138 × 10, full rounded ends | (960, 500) |
| Waveform hero | 48 bars, 10 px wide, 14 px gap, rounded ends, heights 10–280 | (960, 500) |
| Timer | "00:00" | (960, 700) |
| Stop button | 64 px circle, 2 px amber line + 20 px rounded square `#F5F3EE` | (960, 780) |
| Waveform parked | same group scaled to 40 % | (960, 260) |
| Transcript line | words left-aligned from x 384, single line, reflows left | baseline row y 760 |
| Caret | 2 × 56 px amber, blinks 12 f on / 12 f off | 12 px after last landed word |
| Underline | 4 px amber, grows left → right under a phrase | y 800 |
| Card — compact (row) | 320 × 200, radius 20, fill `#17191E`, 1 px border | row slots (592, 500) / (960, 500) / (1328, 500) |
| Compact card content | label top-left (24, 28 offset), icon 28 px top-right, title from (24, 96), wraps at 272 px | — |
| Card — list | 720 × 120, radius 20 | (960, 392) / (960, 540) / (960, 688) |
| List card content | icon circle 56 px `#2A2D33` centred 60 px from left, amber icon 28 px; label at x+112, y−14; title at x+112, y+16; tick centred 52 px from right | — |
| Tick | 36 px amber circle, 3 px ink `#0B0C0F` checkmark | in list card |
| Final line | 2 px amber, 1152 wide | (960, 470) |
| Big logo | "hum" | (960, 575) |
| Tagline | | (960, 665) |

Card content mapping: Card 1 = TASK · list icon · "Pitch deck by Friday" · Card 2 = CALL · phone icon · "Call Sam" · Card 3 = IDEA · bulb icon · "New feature idea".
Icons: Tabler Icons (MIT licence) outline set — `list-check`, `phone`, `bulb`.

---

## 6. Motion standards (24 fps)

| Motion | Frames | Easing |
|---|---|---|
| Micro (tap squash, tick) | 4–6 | ease-out, overshoot 103–104 % then settle in 2–4 f |
| Fade in | 6–8 | ease-out |
| Fade out (labels only) | 4–6 | ease-in |
| Move / rotate | 10–12 | ease-out on arrival, ease-in-out across screen |
| Shape morph | 8–12 | ease-in-out |
| Stagger | 3 f (cards in T4, ticks), catch-up words 3 f | — |
| Overlap | next move starts 2–4 f before previous ends | — |
| Text hold | min 24 f | — |
| Linear | **never** (except timer count + typewriter caret blink) | — |

Implement easing as Bézier keyframe handles (strong ease ≈ 70 % handle influence), not linear interpolation.

---

## 7. Master timing (frames @ 24 fps)

Voice word frames below are **estimates**. After recording, Claude Code replaces them with real Whisper timestamps and re-times only voice-dependent rows (marked 🎙). Holds absorb the difference so the total stays 480 f.

### Voice estimate 🎙
| Word | Pitch | deck | by | Friday, | call | Sam | and | that | new | feature | idea. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Spoken at f | 62 | 70 | 77 | 84 | 110 | 118 | 142 | 148 | 154 | 161 | 172 |
Voice ends ≈ f186. Natural pauses after "Friday," and "Sam".

### Intro (f0–f44)
| Frames | Element | Animation | Easing |
|---|---|---|---|
| f0–12 | Background lift | opacity 0 → 100 % | ease-out |
| f4–12 | Small logo | opacity 0 → 100 % | ease-out |
| f6–18 | Button + ring | scale 80 → 100 %, opacity 0 → 100 % | ease-out |
| f10–18 | Mini icon + "Tap to record" | opacity 0 → 100 %, rise 8 px | ease-out |
| f18–47 | Ring | breathing pulse scale 100 → 106 → 100 % (24 f cycle) | ease-in-out |
| f20–44 | Cursor | enters along path, opacity 0 → 100 % in first 6 f | ease-in-out |

### T1 — Button → Waveform (f44–f72)
| Frames | Element | Animation | Easing | Sound |
|---|---|---|---|---|
| f46–50 | Cursor | press scale 100 → 85 → 100 % | ease-out | **Click @ f47** |
| f47–51 | Button | squash 100 → 92 %, glow gain 1.0 → 1.5 | ease-out | |
| f49–63 | Ring | ripple scale 100 → 160 %, opacity 40 → 0 % | ease-out | |
| f49–54 | Mini icon + label | fade out | ease-in | |
| f50–55 | Cursor | fade out | ease-in | |
| f51–59 | Button → pill | rounded rect 203 × 203 → 1138 × 10, corner radius = height/2 throughout | ease-in-out | Stretch tone f51–59 |
| f59 | Pill → 48 dots | **invisible swap**: dots are 24 px wide (touching) at swap | — | |
| f59–62 | Dots | width 24 → 10 px (gaps open) | ease-out | |
| f62–72 | Dots → bars | heights driven by voice (section 8), with a 0 → 1 ramp multiplier over f62–70 | from audio | Voice starts f62 🎙 |
| f68–76 | Timer + stop button | fade in, rise 8 px; timer = floor((f − 62) / 24) as 00:0X | ease-out | |

### Hero waveform (f72–f120)
Waveform live at full size. Timer counting.

### T2 — Waveform → Words (f120–f192) 🎙
| Frames | Element | Animation | Easing | Sound |
|---|---|---|---|---|
| f120–132 | Waveform group | scale 100 → 40 %, centre y 500 → 260 | ease-out | |
| f120–125 | Timer + stop | fade out | ease-in | |
| f126–149 | Catch-up words (Pitch, deck, by, Friday, call, Sam) | spawn every 3 f; each: starts at waveform centre (960, 260), scale 40 %, opacity 0 → moves to its slot on the transcript line over 8 f, scale → 100 %, opacity → 100 % in first 4 f | ease-out | tick on each landing |
| from f154 | Live words (and, that, new, feature, idea) | same drop, **start = spoken frame + 12 f** (live-transcription lag) | ease-out | tick on each landing |
| landing + 8 f | Each word | colour secondary → primary over 6 f | ease-out | |
| f126 → | Caret | follows last landed word, blinks 12/12 | step | |
| f186–198 | Waveform (parked) | bars relax to dots (heights → 10 px) as voice ends | ease-out | |

### T3 — Words → Cards, live sorting (f152–f248) 🎙
Per card: underline (6 f) → card grows around the words (8 f, overshoot 104 % at f+6, settle f+8) → card lifts into its row slot with tilt (12 f) → border amber → `#2A2D33` (12 f).
During the grow, the transcript words scale 0.059 → 0.033 and move into title position, then crossfade (6 f) into the card's title text (capitalised, comma removed). Label + icon fade in 6 f, rise 6 px, starting 4 f into the grow. Card is born with a 1.5 px amber border.

| Card | Underline | Grow (snap sound) | Label + icon | Lift to slot (rotation) | Border to grey |
|---|---|---|---|---|---|
| 1 "Pitch deck by Friday" | f152–158 | f158–166 (**snap @ f164**) | f162–168 | f166–178 → (592, 500), −3° | f178–190 |
| 2 "Call Sam" | f180–186 | f186–194 (**snap @ f192**) | f190–197 | f194–206 → (960, 500), +2° | f206–218 |
| 3 "New feature idea" | f210–216 | f216–224 (**snap @ f222**) | f220–227 | f224–236 → (1328, 500), −1° | f236–248 |

| Frames | Element | Animation | Easing |
|---|---|---|---|
| f168–178 | Remaining transcript words | slide left to start at x 384 | ease-in-out |
| f196–201 | "and that" | fade out | ease-in |
| f198–208 | "new feature idea" | slide left to x 384 | ease-in-out |
| f210–214 | Caret | fade out | ease-in |
| f236–242 | Parked waveform dots | fade out | ease-in |

### Row hold (f248–f276)

### T4 — Cards → Sorted list (f276–f314)
| Frames | Element | Animation | Easing | Sound |
|---|---|---|---|---|
| f276–288 / f279–291 / f282–294 | Cards 1 / 2 / 3 | move to list slots on a curved path (x ease-out cubic, y ease-in-out), rotation → 0°, size 320×200 → 720×120, content re-layouts to list positions (title unwraps to one line) | as noted | Soft whoosh f276–290 |
| arrival → +4 f | Each card | settle scale 103 → 100 % | ease-out back | |
| f300 / f303 / f306 (+6 f) | Tick circles 1 / 2 / 3 | scale 0 → 104 % (4 f) → 100 % (2 f) | ease-out | |
| f304 / f307 / f310 (+4 f) | Checkmarks | write-on stroke 0 → 100 % | ease-out | **Taps @ f302, f305, f308**, rising pitch |

### List hold (f314–f372)

### T5 — List → Line → Logo (f372–f479)
| Frames | Element | Animation | Easing | Sound |
|---|---|---|---|---|
| f372–376 | Card contents (icons, labels, titles, ticks) | fade out | ease-in | Whoosh f372–388 |
| f372–378 | Small logo top-left | fade out | ease-in | |
| f372–380 | Cards | height 120 → 2 px, fill → amber, border off, radius → 1 | ease-in | |
| f380–388 | 3 lines | converge to y 540 (curved), merge into one | ease-in-out | |
| f386–398 | Line | width 720 → 1152, move y 540 → 470 | ease-out | Silence f388–396 |
| f396–412 | Line glow | gain 1.0 → 1.6 → 1.0 | ease-in-out | **Warm note @ f396** |
| f396–408 | Big logo | masked reveal: slides from just under the line (centre y 465) down to (960, 575), mask = area below the line | ease-out | |
| f410–418 | Tagline | fade in, rise 8 px | ease-out | |
| f418–479 | End frame | hold | — | note tail fades |

---

## 8. Waveform algorithm (Claude Code bakes this from the real voice)

1. Load voice WAV (mono, 48 kHz). RMS per frame window (1/24 s, centred). Convert to dB.
2. Normalise: `L = clamp((dB + 50) / 44, 0, 1)`. Smooth: attack 2 f, release 6 f.
3. Bars i = 0…47, centre c = 23.5. Bell weight `G(i) = exp(-((i - c) / 12)^2)`.
4. Outward ripple delay `d(i) = round(|i - c| / 6)` frames.
5. Per-bar jitter `j(i)` ∈ [0.85, 1.15], seeded, re-rolled every 2 f and smoothed.
6. Height `h(i, t) = 10 + 270 × L(t − d(i)) × G(i) × j(i)` → range 10–280 px, symmetric bell, tallest at centre.
7. Bake keyframes (every frame) for each bar; playback must stay real-time on the owner's Mac.

---

## 9. Who does what

### Claude Code
| # | Task | Output |
|---|---|---|
| 1 | Calibrate Text+ sizes (section 4) | calibration note |
| 2 | Run Whisper locally on the voice → word timestamps | `word_timings.csv` |
| 3 | Re-time section 7 to the real voice (🎙 rows only) | updated timing table |
| 4 | Bake waveform (section 8) | waveform keyframes inside the comp |
| 5 | Measure word widths with the Inter TTF so transcript + card positions are exact | layout table |
| 6 | Build Fusion comps, one per scene, with every keyframe and easing from section 7: **S1** intro+T1 · **S2** hero+T2 · **S3** T3 · **S4** T4 · **S5** T5 | `S1.setting` … `S5.setting` |
| 7 | Guarantee seamless handoff: last frame of each scene = first frame of the next | handoff checklist |
| 8 | Export icons, cursor, checkmark as PNG/SVG | `/assets` |
| 9 | Sound hit list as Resolve markers | `markers.edl` (Timeline → Import → Timeline Markers from EDL) |
| 10 | `retime.py`: re-run everything if the voice is re-recorded | script |

### Gaurav
| # | Task |
|---|---|
| 1 | Record the voice line (below) — WAV 48 kHz, quiet room |
| 2 | Install fonts; create a 1920×1080, 24 fps timeline |
| 3 | Import each scene, test, send screenshots/recordings to Claude Code |
| 4 | Polish timing feel and easing in the Spline editor |
| 5 | Sound design at the markers (library or self-recorded), mix to −14 LUFS, true peak ≤ −1 dBTP |
| 6 | Tune glow; final export; approve each scene |

Voice line (casual, like a note to self, with natural pauses):
> "Pitch deck by Friday… call Sam… and that new feature idea."

### Build loop
Claude Code builds one scene → Gaurav tests → feedback → fix → next scene. Order: S1 → S2 → S3 → S4 → S5 → full assembly.

---

## 10. QA checklist (every scene)
- [ ] Matches section 7 frames (±1 f only after owner approval)
- [ ] No element appears from nothing (except ticks, by design)
- [ ] No linear easing
- [ ] Handoff frame matches the next scene exactly
- [ ] Colours and fonts match sections 3–4
- [ ] Real-time playback without render cache
- [ ] Every sound marker has a matching motion, every key motion has a sound
- [ ] Text readable on its first full frame

## 11. Deliverables
- Master: 1920×1080, 24 fps, H.264 high bitrate (+ a master-quality export)
- Later: 9:16 reframe (key content already inside the centre 60 %)
- Behance case study: final film + 3 transition breakdowns (T1, T3, T5) + style frames
