# CompTIA Study App

Desktop study app for CompTIA certifications (Network+, A+, and more). Foundation phase: app shell, dark UI (inspired by [Raycast/ray-so](https://github.com/raycast/ray-so)), settings, and screen placeholders. Question content and generators come in a later phase.

## Run in development

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in a browser, or run the Tauri desktop window (requires Rust):

```bash
npm run tauri dev
```

## Build executable (.exe on Windows)

You need **Node.js**, **Rust** ([rustup.rs](https://rustup.rs/)), and (on Windows) the **C++ build tools** if the Rust installer asks for them. Then:

```bash
npm install
npm run tauri build
```

Output: `src-tauri/target/release/CompTIA Study.exe` and an installer under `src-tauri/target/release/bundle/nsis/`.

**Step-by-step:** **[docs/BUILD_EXE.md](docs/BUILD_EXE.md)**

## In-app updates

The app can update itself after install. In **Settings → Updates** users can check for updates, download, and restart. To publish updates you must:

1. Generate a signing keypair and add the public key to `src-tauri/tauri.conf.json`
2. Set the `endpoints` URL (e.g. a GitHub Releases `latest.json` link)
3. Build with `TAURI_SIGNING_PRIVATE_KEY` set and publish the installer plus a manifest

Full steps: **[docs/UPDATES.md](docs/UPDATES.md)**

## Project structure

- **src/** — React app: router, design tokens, layout (sidebar + main), UI controls, screens
- **src/components/** — Sidebar, Layout, UI (Toggle, Slider, Dropdown, ColorPicker, PreviewBox, ResetButton, Section, PrimaryButton, SettingsRow), DragDropContainer, CardFlip
- **src/screens/** — Home, Study, Exam Prep, Subnetting, PBQ, Flashcards, Settings
- **src/data/** — Stub (question bank later)
- **src/generators/** — Stub (subnetting / PBQ later)
- **src-tauri/** — Tauri v2 backend

## Current scope

- Dark theme, two-panel layout (sidebar + main content)
- All UI controls: toggle, slider with value, dropdown, color picker, preview box, reset button, section chrome, primary CTA
- Settings page using every control type
- Screen shells for Study, Exam Prep, Subnetting, PBQ, Flashcards (placeholders; no questions yet)
- No question bank or generators yet

## Recreating UI from another app

To match the look of another desktop app (e.g. a .exe) without copying its code, see **[docs/REVERSE_ENGINEER_UI.md](docs/REVERSE_ENGINEER_UI.md)** for a step-by-step workflow (DevTools, screenshots, color picker, design tokens).
