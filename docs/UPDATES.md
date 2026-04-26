# CompTIA Study App – Updates and Publishing

The app uses Tauri’s built-in updater so users can get new versions from Settings without reinstalling.

## 1. Generate signing keys (one-time)

Updates must be signed. Generate a keypair and **keep the private key safe** (you need it for every future release):

```bash
cd comptia-study-app
npm run tauri signer generate -w ~/.tauri/comptia-study.key
```

- **Windows (PowerShell):** use a path like `$env:USERPROFILE\.tauri\comptia-study.key`
- This creates:
  - **Private key** at the path you gave (e.g. `~/.tauri/comptia-study.key`) — **never commit or share**
  - **Public key** printed in the terminal

Copy the **public key** (the long string) into `src-tauri/tauri.conf.json`:

```json
"plugins": {
  "updater": {
    "pubkey": "PASTE_THE_PUBLIC_KEY_HERE",
    ...
  }
}
```

Replace `REPLACE_WITH_YOUR_PUBLIC_KEY` with that value.

## 2. Set the update endpoint

The app checks a URL for a **manifest JSON** that describes the latest version and where to download the installer.

**Option A – GitHub Releases (good default)**

1. Create a repo (e.g. `YOUR_USERNAME/comptia-study-app`) or use an existing one.
2. In `tauri.conf.json`, set:

```json
"endpoints": [
  "https://github.com/YOUR_USERNAME/comptia-study-app/releases/latest/download/latest.json"
]
```

3. For each release you will upload:
   - The installer (e.g. `CompTIA Study_0.1.0_x64-setup.nsis.zip` or the `.msi` / `.exe` your build produces)
   - Its `.sig` file
   - A file named **`latest.json`** in the format below

**Option B – Your own server**

Use any HTTPS URL that returns the same JSON. You can use template variables in the URL:

- `{{target}}` — `windows`, `darwin`, or `linux`
- `{{arch}}` — e.g. `x86_64`, `aarch64`
- `{{current_version}}` — version the app is running

Example:  
`https://your-server.com/updates/{{target}}/{{arch}}/{{current_version}}`

The server should return **204 No Content** if no update, or **200** with the JSON body below.

## 3. Manifest format (`latest.json`)

For a **static** file (e.g. GitHub Releases), use this shape:

```json
{
  "version": "0.1.1",
  "notes": "Bug fixes and improvements.",
  "pub_date": "2025-03-01T12:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "CONTENTS_OF_THE_.sig_FILE",
      "url": "https://github.com/YOUR_USERNAME/comptia-study-app/releases/download/v0.1.1/CompTIA.Study_0.1.1_x64-setup.nsis.zip"
    }
  }
}
```

- **version** — SemVer (e.g. `0.1.1`).
- **notes** — Shown in the app when an update is available.
- **pub_date** — RFC 3339 (optional).
- **platforms** — One entry per platform. Key format: `windows-x86_64`, `darwin-x86_64`, `darwin-aarch64`, `linux-x86_64`, etc.
  - **signature** — Entire contents of the `.sig` file (not a path).
  - **url** — Direct download URL for the update bundle (e.g. NSIS zip or installer).

## 4. Build and sign

Set the private key so Tauri can sign the artifacts (**.env is not used**; set env vars in the shell):

**Windows (PowerShell):**

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = "C:\Users\YourName\.tauri\comptia-study.key"
# Or paste the raw private key string:
# $env:TAURI_SIGNING_PRIVATE_KEY = "-----BEGIN PRIVATE KEY----- ..."
npm run tauri build
```

**macOS / Linux:**

```bash
export TAURI_SIGNING_PRIVATE_KEY="$HOME/.tauri/comptia-study.key"
npm run tauri build
```

With `createUpdaterArtifacts: true`, the build produces:

- **Windows:** `src-tauri/target/release/bundle/nsis/` — `.exe` (or zip) and `.exe.sig`
- **macOS:** `src-tauri/target/release/bundle/macos/` — `.app.tar.gz` and `.app.tar.gz.sig`
- **Linux:** `src-tauri/target/release/bundle/appimage/` — `.AppImage` and `.AppImage.sig`

Use the **same** installer (or archive) URL in `latest.json` that users will download. The `.sig` content goes in `platforms.<target-arch>.signature`.

## 5. Publish a release

1. Bump `version` in:
   - `package.json`
   - `src-tauri/tauri.conf.json`
   - `src-tauri/Cargo.toml`
2. Build with `TAURI_SIGNING_PRIVATE_KEY` set as above.
3. Create a new release (e.g. on GitHub), upload:
   - The installer/zip
   - The `.sig` file
4. Create **`latest.json`** with the correct `version`, `url`, and `signature` (paste in the full contents of the `.sig` file).
5. Upload `latest.json` to the same release (or the same URL path you use in `endpoints`).

After that, installed apps that point at this endpoint will see the update in Settings and can download and install it.

## 6. Summary checklist

- [ ] Run `tauri signer generate`, save private key, add public key to `tauri.conf.json`
- [ ] Set `endpoints` in `tauri.conf.json` (e.g. GitHub `latest.json` URL)
- [ ] Build with `TAURI_SIGNING_PRIVATE_KEY` set
- [ ] For each release: upload installer + `.sig`, create `latest.json` with correct `url` and `signature`

For more detail, see [Tauri Updater plugin docs](https://v2.tauri.app/plugin/updater/).
