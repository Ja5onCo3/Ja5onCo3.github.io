# Code Beats — Syntax-to-Synth Lab

A browser-based audio synthesis playground where you type code commands to generate synth sounds, shape envelopes, apply effects, and program drum patterns — all in real time.

**[Live Demo →](https://ja5onco3.github.io/portfolio_website/code-beats/)**

---

## Features

- **Command-based synthesis** — type commands like `play(C4, 0.5)` or `synth(square)` to control audio
- **ADSR envelope editor** — shape attack, decay, sustain, and release with a live curve visualizer
- **Effects chain** — reverb and delay with real-time wet/dry control
- **Multi-row drum sequencer** — independent kick, snare, and hi-hat patterns with clickable grid cells
- **CodeMirror editor** — syntax highlighting, line numbers, and Ctrl+Enter shortcut
- **6 built-in presets** — Basic, Dreamy, Punchy, Groove, Hip-Hop, Ambient

---

## Command Reference

### Synth & Melody
| Command | Description |
|---|---|
| `play(C4, 0.5)` | Play note for duration in seconds. Notes: A–G, sharps (#), flats (b), octave 1–8 |
| `synth(sine)` | Set waveform: `sine` \| `square` \| `triangle` \| `sawtooth` |
| `bpm(120)` | Set tempo in BPM (40–240) |
| `volume(0.8)` | Master volume (0.0–1.0) |

### Envelope (ADSR)
| Command | Description |
|---|---|
| `attack(0.02)` | Time to reach full volume (0.001–2.0 s) |
| `decay(0.1)` | Time to drop to sustain level (0.001–2.0 s) |
| `sustain(0.5)` | Volume held while note plays (0.0–1.0) |
| `release(0.8)` | Fade time after note ends (0.001–4.0 s) |

### Effects
| Command | Description |
|---|---|
| `reverb(0.6)` | Room reverb wet mix (0.0–1.0) |
| `delay(0.3)` | Echo feedback delay wet mix (0.0–1.0) |

### Drums
| Command | Description |
|---|---|
| `kick([1,0,0,0,1,0,0,0])` | 8-step kick drum pattern (1=on, 0=off) |
| `snare([0,0,1,0,0,0,1,0])` | 8-step snare pattern |
| `hihat([1,1,1,1,1,1,1,1])` | 8-step hi-hat pattern |
| `loop(true)` | Start/stop the drum sequencer |

Lines beginning with `//` are comments and are ignored by the parser.

---

## Built With

- [Tone.js](https://tonejs.github.io/) — Web Audio synthesis engine
- [CodeMirror 5](https://codemirror.net/5/) — Code editor with syntax highlighting
- Vanilla HTML, CSS, JavaScript — no build tools required
- Hosted on GitHub Pages

---

## Project Structure

```
code-beats/
└── index.html    # Self-contained app (HTML + CSS + JS)
```

---

## Part of

[Professional Digital Portfolio](https://ja5onco3.github.io/portfolio_website/) — IT Infrastructure & Blue-Team Security
