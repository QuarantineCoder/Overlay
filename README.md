# Overlay

Ever run into the issue that you are sharing your screen in a meeting and need to cover sensitive information on your desktop? Overlay is a lightweight Windows desktop utility that lets you place transparent panes anywhere on your screen — without closing or minimising the app showing it.

---

## Features

- **Color panes** — spawn a solid-color transparent window in any color
- **Blur panes** — spawn a frosted glass / acrylic blur pane (Windows only)
- **Opacity control** — set transparency from 10% to 100%
- **Layer control** — pin panes above everything or just above the desktop
- **Custom size** — set width and height before spawning
- **6 preset slots** — save and restore full configurations with custom names
- **Duplicate panes** — hover a pane and click ⧉ to clone it at its current size
- **Close panes** — hover a pane and click × to dismiss it individually

---

## Requirements

- Windows 10/11
- [Node.js](https://nodejs.org/) (v18 or later recommended)

---

## Installation

```bash
git clone https://github.com/QuarantineCoder/Overlay.git
cd Overlay
npm install
```

---

## Running the app

```bash
npm start
```

---

## Usage

1. **Select a type** — Color or Blur
2. **Pick a color** — shown when Color is selected
3. **Set a layer** — Above Everything (always on top) or Above Desktop
4. **Set size** — width and height in pixels
5. **Set opacity** — drag the slider
6. **Click Create Pane** — spawns the overlay window
7. **Hover a pane** — reveals ⧉ (duplicate) and × (close) buttons in the top-right corner
8. **Presets** — click ↑ on any slot to save current settings, click the swatch to load, click the name to rename

---

## Project structure

```
Overlay/
├── main.js       # Electron main process — creates windows, handles IPC
├── index.html    # Controller UI — configure and spawn panes
├── pane.html     # Pane renderer — transparent draggable overlay window
└── package.json
```

---

## Tech stack

- [Electron](https://www.electronjs.org/) v41
- [Tailwind CSS](https://tailwindcss.com/) (CDN) for the controller UI
- Vanilla JavaScript — no frontend framework
- `localStorage` for preset persistence

---

## Notes

- Blur panes use the Windows `backgroundMaterial: 'acrylic'` API and only work on Windows 10/11
- Panes persist on screen if the controller window is closed
- Presets are stored locally in the app's `localStorage` and survive restarts
