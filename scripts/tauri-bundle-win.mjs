/**
 * Runs `tauri build`, then always copies NSIS + MSI into ./bundle/
 * (Installers are usually emitted even when updater signing exits with an error.)
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const build = spawnSync('npm', ['run', 'tauri', '--', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
})

await import('./sync-windows-bundle.mjs')

if (build.status !== 0 && build.status !== null) {
  console.warn(
    `[tauri-bundle-win] tauri build exited with code ${build.status} (often updater signing). Check bundle/ for installers.`,
  )
}
