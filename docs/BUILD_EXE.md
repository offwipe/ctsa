# How to build the app into an .exe

The app is a **Tauri v2** desktop application. Building produces a Windows executable (and installer) in addition to the web build.

---

## Prerequisites

1. **Node.js** (v18+). Install from [nodejs.org](https://nodejs.org/).
2. **Rust**. Install from [rustup.rs](https://rustup.rs/):
   - Run the installer and accept defaults.
   - Restart your terminal after installation.
3. **Windows build tools** (if the Rust installer prompts you):
   - It may ask you to install "Visual Studio Build Tools" or "C++ build tools". Follow the link it gives and install the **Desktop development with C++** workload so that `cargo build` works.

---

## Build steps

1. **Open a terminal** in the project folder:
   ```powershell
   cd c:\Users\dh-m\slamtest\comptia-study-app
   ```

2. **Install dependencies** (if you haven’t already):
   ```powershell
   npm install
   ```

3. **Build the desktop app**:
   ```powershell
   npm run tauri build
   ```
   The first build can take several minutes while Rust compiles.

4. **Find the output**:
   - **Executable:**  
     `comptia-study-app\src-tauri\target\release\CompTIA Study.exe`  
     (or similar name; look for the `.exe` in `src-tauri\target\release\`.)
   - **Installer:**  
     Under `src-tauri\target\release\bundle\nsis\` you’ll get an installer (e.g. `CompTIA Study_0.1.0_x64-setup.exe`) that users can run to install the app.

You can copy the standalone `.exe` from `target\release\` and run it on the same machine, or distribute the installer from `bundle\nsis\` for other Windows PCs.

---

## Run in development (without building .exe)

- **Web only:**  
  `npm run dev`  
  Then open http://localhost:5173 in a browser.

- **Desktop window (needs Rust):**  
  `npm run tauri dev`  
  Opens the app in a native window and hot-reloads the frontend.

---

## Optional: signed updates

To enable in-app updates (Settings → Check for updates), you must:

1. Generate a signing keypair and add the **public** key to `src-tauri/tauri.conf.json`.
2. Set the updater **endpoints** in that config (e.g. a GitHub Releases URL).
3. For each release, build with **TAURI_SIGNING_PRIVATE_KEY** set and publish the installer plus a `latest.json` manifest.

Full details: **[docs/UPDATES.md](UPDATES.md)**.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `cargo not found` | Install Rust from [rustup.rs](https://rustup.rs/) and restart the terminal. |
| Build fails with linker or C++ errors | Install the Windows “Desktop development with C++” workload (Visual Studio Build Tools). |
| `npm run tauri build` fails on frontend | Run `npm run build` alone; fix any TypeScript/Vite errors, then run `npm run tauri build` again. |
| App window is blank | Ensure `npm run build` succeeds and that `tauri.conf.json` has `"frontendDist": "../dist"`. |
