# Release Pipeline (v0.1.x and beyond)

This is the canonical, end-to-end checklist for cutting a new version of CompTIA
Study so that the in-app **Check for Updates** button works automatically. It is
designed for a single-maintainer GitHub Releases workflow.

---

## 0. One-time setup (only once per machine / repo)

You only need to do this section the first time. After that, every release is
just sections 1–4.

### 0.1 GitHub repository

You need a public GitHub repository hosting the releases. For example:

```
https://github.com/<OWNER>/comptia-study-app
```

Replace `<OWNER>` with your GitHub username (or org). All `<OWNER>` references
below mean the same thing.

> Update the placeholder once: in
> `src-tauri/tauri.conf.json` change
> `https://github.com/REPLACE_OWNER/comptia-study-app/...`
> to your real owner. **Commit this change before building 0.1.4** — the
> `pubkey` is baked into the binary and so is the endpoint URL, so a wrong
> endpoint is sticky.

### 0.2 Updater signing key

You already have a Tauri signing key at `C:\Users\dh-m\.tauri\comptia-study.key`
(public side is in `tauri.conf.json` under `plugins.updater.pubkey`).

Confirm the env vars are set in the shell where you build:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = "C:\Users\dh-m\.tauri\comptia-study.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = "<your password>"
```

If you ever lose the password, regenerate via
`npx @tauri-apps/cli signer generate --ci -f -p "<new password>"` and update
`pubkey` in `tauri.conf.json`. **Existing installs will not be able to update
across a key change** — they will need a manual re-install.

### 0.3 GitHub Personal Access Token (optional, for `gh` CLI uploads)

If you want to use `gh release create ...` instead of the GitHub web UI, install
[GitHub CLI](https://cli.github.com/) and run `gh auth login` once.

---

## 1. Pick the new version

Pick a SemVer string. Today the app is at **0.1.4**. For the next release,
increment using these rules:

| Change                                                   | Bump |
| -------------------------------------------------------- | ---- |
| Bug fix only, no new behaviour                            | 0.1.4 → 0.1.5 |
| New feature, no breaking change                           | 0.1.4 → 0.2.0 |
| Breaking change to data files / settings / save format    | 0.1.4 → 1.0.0 |

The version string must be identical in **every** file in section 2.

---

## 2. Bump the version (3 files)

Update **all three** to the new version, e.g. `0.1.5`:

1. `src-tauri/tauri.conf.json` → `"version"`
2. `src-tauri/Cargo.toml`      → `version = "..."` under `[package]`
3. `package.json`              → `"version"`

Also update the hardcoded fallback in
`src/components/UpdaterSection.tsx` (search for the previous version string):

```ts
setCurrentVersion('0.1.5')
```

> The fallback is only used in dev mode where the Tauri runtime can't be
> queried. In a real build the version comes from Tauri so this isn't
> user-facing, but keep it in sync to avoid confusion in the dev console.

Commit:

```powershell
git add src-tauri/tauri.conf.json src-tauri/Cargo.toml package.json src/components/UpdaterSection.tsx
git commit -m "chore: release 0.1.5"
git tag v0.1.5
git push && git push --tags
```

---

## 3. Build the signed installer + signature file

From `c:\Users\dh-m\slamtest\comptia-study-app` in **PowerShell**:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = "C:\Users\dh-m\.tauri\comptia-study.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = "<your password>"
npm.cmd run tauri build
```

This produces, under `src-tauri\target\release\bundle\`:

```
nsis\CompTIA Study_<VERSION>_x64-setup.exe
nsis\CompTIA Study_<VERSION>_x64-setup.exe.sig      <-- the signature file
msi\CompTIA Study_<VERSION>_x64_en-US.msi
msi\CompTIA Study_<VERSION>_x64_en-US.msi.sig       <-- the signature file
```

Use the **NSIS** pair (`-setup.exe` and `-setup.exe.sig`) for the updater. The
`.msi` is fine for sideloading but NSIS is what the in-app updater is configured
for.

> If the build complains about the signing key password you've forgotten it,
> regenerate the key (see 0.2) and bump `pubkey` in `tauri.conf.json` before
> rebuilding.

---

## 4. Create the GitHub Release with the right assets

The in-app updater hits this URL:

```
https://github.com/<OWNER>/comptia-study-app/releases/latest/download/latest.json
```

so the release must contain:

1. `CompTIA Study_<VERSION>_x64-setup.exe`     (binary)
2. `CompTIA Study_<VERSION>_x64-setup.exe.sig` (signature)
3. `latest.json`                               (manifest, see template below)

### 4.1 Get the signature contents

Open `CompTIA Study_<VERSION>_x64-setup.exe.sig` in a text editor and copy its
contents (it is base64). You will paste it into `latest.json`.

### 4.2 Build `latest.json`

Create a file called `latest.json` next to the installer with this exact shape:

```json
{
  "version": "0.1.5",
  "notes": "What changed in this release (markdown OK).",
  "pub_date": "2026-04-26T12:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "PASTE THE FULL CONTENTS OF .sig HERE",
      "url": "https://github.com/<OWNER>/comptia-study-app/releases/download/v0.1.5/CompTIA.Study_0.1.5_x64-setup.exe"
    }
  }
}
```

Notes:

- **`version`** must match section 2 exactly. No `v` prefix.
- **`pub_date`** is RFC 3339 / ISO 8601. Now in UTC works.
- **`url`** must be a permanent, downloadable URL. The pattern
  `releases/download/v<VER>/<FILENAME>` is what GitHub gives you for an asset
  attached to tag `v<VER>`. Spaces in the filename become dots — copy from the
  GitHub asset page after upload to be safe.
- **`signature`** is the entire content of the `.sig` file, including the
  `untrusted comment:` lines. Tauri parses it.

### 4.3 Upload via GitHub web UI

1. Go to `https://github.com/<OWNER>/comptia-study-app/releases/new`
2. Tag: `v0.1.5` (must match section 2)
3. Title: `CompTIA Study 0.1.5`
4. Body: release notes (same content as `latest.json` `notes` is fine)
5. Drag and drop the three files:
   - `CompTIA Study_0.1.5_x64-setup.exe`
   - `CompTIA Study_0.1.5_x64-setup.exe.sig`
   - `latest.json`
6. Click **Publish release**

After publishing, click the `latest.json` asset on the release page and copy
the URL. It must look like:

```
https://github.com/<OWNER>/comptia-study-app/releases/latest/download/latest.json
```

### 4.4 Or upload via gh CLI

```powershell
gh release create v0.1.5 `
  "src-tauri\target\release\bundle\nsis\CompTIA Study_0.1.5_x64-setup.exe" `
  "src-tauri\target\release\bundle\nsis\CompTIA Study_0.1.5_x64-setup.exe.sig" `
  "latest.json" `
  --title "CompTIA Study 0.1.5" `
  --notes-file release-notes.md
```

---

## 5. Verify the update flow

1. Install the **previous** version on a clean machine (or just keep the older
   installed copy on yours).
2. Open the app, go to **Settings → Updates**.
3. Click **Check for updates**.
4. You should see **Update available: 0.1.5** with notes.
5. Click **Install update**. The app downloads the signed installer, verifies
   the signature against the embedded `pubkey`, and runs the silent updater.

If the check fails:

| Symptom                                | Likely cause                                              |
| -------------------------------------- | --------------------------------------------------------- |
| `Check Failed`                         | `latest.json` URL is unreachable / wrong endpoint baked in |
| `signature verification failed`        | `.sig` content not pasted in full into `latest.json`       |
| `signature verification failed`        | Pubkey in `tauri.conf.json` ≠ key used to sign             |
| `unsupported platform`                 | Missing `windows-x86_64` block in `latest.json`            |
| Update downloads but never installs    | Run app as user, not admin; or AV blocking NSIS silent run |

---

## 6. Quick checklist (every release)

- [ ] Pick new version
- [ ] Bump `tauri.conf.json`, `Cargo.toml`, `package.json`, `UpdaterSection.tsx`
- [ ] `git commit && git tag v<VER> && git push --tags`
- [ ] `npm.cmd run tauri build` (with signing env vars set)
- [ ] Copy `.sig` contents into `latest.json`
- [ ] Create GitHub release with installer + .sig + latest.json
- [ ] Verify "Check for updates" picks it up
