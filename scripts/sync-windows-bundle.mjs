/**
 * Copies Tauri Windows bundle artifacts into ./bundle/ after `npm run tauri build`.
 * Only copies installers matching `version` in package.json; clears previous .exe/.msi in bundle/.
 */
import { copyFile, mkdir, readdir, readFile, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'bundle')
const nsisDir = join(root, 'src-tauri', 'target', 'release', 'bundle', 'nsis')
const msiDir = join(root, 'src-tauri', 'target', 'release', 'bundle', 'msi')

const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const version = pkg.version

async function clearOldBundles() {
  let names
  try {
    names = await readdir(outDir)
  } catch {
    return
  }
  for (const name of names) {
    if (name.endsWith('.exe') || name.endsWith('.msi')) {
      await unlink(join(outDir, name))
    }
  }
}

async function copyVersioned(dir, ext) {
  let names
  try {
    names = await readdir(dir)
  } catch {
    return []
  }
  const copies = []
  for (const name of names) {
    if (!name.endsWith(ext)) continue
    if (!name.includes(version)) continue
    await copyFile(join(dir, name), join(outDir, name))
    copies.push(name)
  }
  return copies
}

await mkdir(outDir, { recursive: true })
await clearOldBundles()

const nsis = await copyVersioned(nsisDir, '.exe')
const msi = await copyVersioned(msiDir, '.msi')

if (nsis.length === 0 && msi.length === 0) {
  console.warn(
    `[sync-windows-bundle] No installers for v${version} found. Run \`npm run tauri build\` first (Windows release profile).`,
  )
  process.exitCode = 1
} else {
  console.log('[sync-windows-bundle] Copied to bundle/:', [...nsis, ...msi].join(', ') || '(none)')
}
