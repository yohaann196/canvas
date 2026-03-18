# ljvcanvas

A Lissajous figure toy built as a single HTML file. No dependencies, no build step — just open it in a browser.

---

## What is a Lissajous figure?

A Lissajous figure is the curve traced by a point whose x and y coordinates each follow a sine wave:

```
x = sin(a·t + δ)
y = sin(b·t)
```

The ratio `a:b` determines the shape. The phase offset `δ` rotates and morphs it. When you change these values in real time, the figure continuously rewrites itself.

---

## Usage

```bash
git clone https://github.com/yohaann196/canvas
cd canvas
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

The output goes to `dist/` and can be hosted on GitHub Pages, Netlify, or any static host.

To deploy to GitHub Pages:

```bash
npm run deploy
```

This builds the project and publishes the `dist/` folder to the `gh-pages` branch. The site will be live at `https://yohaann196.github.io/canvas/`.

---

## Controls

### Sidebar

| Control | Description |
|---|---|
| **freq_x / freq_y** | Integer frequency of the x and y sine waves. The ratio between them defines the shape. |
| **delta** | Phase offset between the two waves (0 to 2π). Morphs the figure without changing its structure. |
| **speed** | How fast the point traces the curve. Higher = fills in faster. |
| **size** | Diameter of each plotted point. |
| **glow** | Radius of the soft glow halo around each point. |
| **fade** | How quickly old points fade out, creating a trail effect. 0 = no fade (persistent). |
| **color** | Six color modes: Green, White, Amber, Cyan, Pink, Spectrum (hue-shifting). |
| **Show dot** | Toggles a bright leading dot that shows the current position of the point. |
| **Delta drift** | Slowly and continuously increments delta, causing the figure to morph over time. |
| **Mirror ×4** | Reflects the curve across both axes simultaneously. |
| **Presets** | Eight pre-configured frequency ratios with good-looking delta values. |

### Keyboard

| Key | Action |
|---|---|
| `Space` | Play / pause |
| `C` | Clear canvas |
| `←` / `→` | Decrease / increase freq_x |
| `↓` / `↑` | Decrease / increase freq_y |

### Buttons

| Button | Action |
|---|---|
| **⏸ / ▶** | Play / pause animation |
| **✕** | Clear canvas (header) |
| **Clear** | Clear canvas (footer) |
| **Export PNG** | Save current frame as a PNG file |

---

## Presets reference

| Preset | freq_x | freq_y | Notes |
|---|---|---|---|
| 3∶2 | 3 | 2 | Classic figure-eight variant |
| 5∶4 | 5 | 4 | Rose-like lobes |
| 1∶1 | 1 | 1 | Ellipse / diagonal line |
| 5∶3 | 5 | 3 | Knotted |
| 7∶6 | 7 | 6 | Dense loops |
| 4∶3 | 4 | 3 | Rectangular envelope |
| 8∶7 | 8 | 7 | Web-like |
| 11∶10 | 11 | 10 | Near-chaotic fill |

## Project structure

```
src/
├── main.js                      # App entry point
├── style.css                    # Global resets + CSS variables
├── App.vue                      # Root — wires sidebar to canvas, handles keyboard
├── composables/
│   └── useLissajous.js          # All drawing logic, state, animation loop
└── components/
    ├── LissajousCanvas.vue      # Canvas element + corner badges
    ├── Sidebar.vue              # Full control panel
    ├── SliderRow.vue            # Reusable labelled range input
    └── ToggleRow.vue            # Reusable toggle switch
```

---

## Browser support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses Canvas 2D API only — no WebGL, no frameworks.

