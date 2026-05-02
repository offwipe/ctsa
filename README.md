# CompTIA Study App

A Windows desktop app for studying CompTIA exams. You open it like any other program, pick what you want to work on, and your progress and settings stay on your machine.

## Download and install

1. Go to the **[Releases](https://github.com/offwipe/comptia-study-app/releases)** page for this repository.
2. Download the latest **installer** (`.exe`) for Windows.
3. Run the installer, then launch **CompTIA Study** from the Start menu or a shortcut.

If there is no release yet, you need to build the app from source (see **For developers** below).

**Updates:** After you install, open the app and use **Settings → Updates** to look for newer versions when they are published.

## What it has

- **Home** — Choose a certification track (some tracks are still “coming soon”).
- **Study (Blitz)** — Quick rounds that mix timed recall and spaced repetition.
- **Exam prep** — Practice exams with scoring.
- **Subnetting** — Drill questions on subnet math.
- **PBQ practice** — Hands-on scenarios you solve by placing items in the right spots.
- **Flashcards** — Flip cards for terms and cloze-style prompts.
- **Pomodoro** — Timer and stopwatch for focus sessions.
- **Settings** — Dark or light theme, colors, layout presets, optional sound and scene effects.

Study material grows over time; not every certification has the same amount of content yet.

## How it works

The app is a normal **desktop program** for Windows. It shows a single window with a sidebar and a main area. Your preferences (theme, layout, timers, and similar options) are **saved on your computer** so they come back the next time you open the app.

Optional **in-app updates** use the project’s GitHub Releases page: when a new version is published there, the app can download and install it from **Settings → Updates**. Maintainers who ship builds should follow the signing and release steps in `docs/UPDATES.md` and `docs/RELEASING.md`.

---

## For developers

### Run in development

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`, or run the desktop shell (needs Rust):

```bash
npm run tauri dev
```

### Build the Windows app

You need **Node.js**, **Rust** ([rustup](https://rustup.rs/)), and on Windows the **C++ build tools** if the installer asks for them.

```bash
npm install
npm run tauri build
```

Built installers and binaries end up under `src-tauri/target/release/` and `bundle/`. Step-by-step: **[docs/BUILD_EXE.md](docs/BUILD_EXE.md)**

### Ship updates

Configure signing, publish installers to GitHub Releases, and attach the updater manifest. Details: **[docs/UPDATES.md](docs/UPDATES.md)**, **[docs/RELEASING.md](docs/RELEASING.md)**

### Repository layout

- **`src/`** — React front end (routes, screens, layout, UI components, study data)
- **`src-tauri/`** — Tauri v2 shell (Rust), updater, windowing

Optional screenshot-style PNGs in the project root (`*-ui.png`, `*-final.png`) are listed in `.gitignore` so they can stay on your machine without being part of the repository. They are not used by builds.
