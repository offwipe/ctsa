import { useState } from 'react'
import { Section } from './ui/Section'
import { PrimaryButton } from './ui/PrimaryButton'
import './UpdaterSection.css'

export function UpdaterSection() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'update-available' | 'downloading' | 'ready' | 'no-update' | 'error'>('idle')
  const [currentVersion, setCurrentVersion] = useState<string>('')
  const [updateVersion, setUpdateVersion] = useState<string>('')
  const [updateNotes, setUpdateNotes] = useState<string>('')
  const [updateDate, setUpdateDate] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)

  const checkForUpdates = async () => {
    if (typeof window === 'undefined' || !(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) {
      setStatus('error')
      setErrorMessage('Updates are only available in the desktop app.')
      return
    }
    setStatus('checking')
    setErrorMessage('')
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const update = await check()
      if (update) {
        setUpdateVersion(update.version)
        setUpdateNotes(update.body ?? '')
        setUpdateDate(update.date ?? '')
        setStatus('update-available')
      } else {
        setStatus('no-update')
      }
    } catch (e) {
      setStatus('error')
      const msg = e instanceof Error ? e.message : 'Check failed'
      if (msg.includes('YOUR_USERNAME') || msg.includes('404') || msg.includes('Not Found')) {
        setErrorMessage('Update endpoint not configured yet. Set a real URL in tauri.conf.json → plugins.updater.endpoints.')
      } else {
        setErrorMessage(msg)
      }
    }
  }

  const downloadAndInstall = async () => {
    if (typeof window === 'undefined' || !(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) return
    setStatus('downloading')
    setDownloadProgress(0)
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const update = await check()
      if (!update) {
        setStatus('error')
        setErrorMessage('Update no longer available')
        return
      }
      let total = 0
      let contentLength = 0
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          contentLength = event.data?.contentLength ?? 0
        }
        if (event.event === 'Progress' && event.data?.chunkLength) {
          total += event.data.chunkLength
          setDownloadProgress(contentLength ? Math.min(100, Math.round((100 * total) / contentLength)) : 50)
        }
        if (event.event === 'Finished') setDownloadProgress(100)
      })
      setStatus('ready')
    } catch (e) {
      setStatus('error')
      setErrorMessage(e instanceof Error ? e.message : 'Download failed')
    }
  }

  const restart = async () => {
    try {
      const { relaunch } = await import('@tauri-apps/plugin-process')
      await relaunch()
    } catch {
      setErrorMessage('Restart failed')
    }
  }

  const loadVersion = async () => {
    try {
      const { getVersion } = await import('@tauri-apps/api/app')
      setCurrentVersion(await getVersion())
    } catch {
      setCurrentVersion('0.1.4')
    }
  }

  if (typeof window !== 'undefined' && currentVersion === '' && (window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) {
    loadVersion()
  }

  const inTauri = typeof window !== 'undefined' && !!(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__

  if (!inTauri && status === 'idle') {
    return (
      <Section title="Updates" description="When running as the desktop app, you can check for updates and install them here.">
        <p className="updater-browser-hint">Open the installed .exe to use in-app updates.</p>
      </Section>
    )
  }

  return (
    <Section
      title="Updates"
      description="Keep the app up to date. Updates are verified with a signature before installation."
    >
      {currentVersion && (
        <div className="updater-current">
          <span className="updater-label">Current version</span>
          <span className="updater-version">{currentVersion}</span>
        </div>
      )}
      <div className="updater-actions">
        {status === 'idle' && (
          <PrimaryButton onClick={checkForUpdates}>Check for updates</PrimaryButton>
        )}
        {status === 'checking' && (
          <span className="updater-status updater-checking">Checking…</span>
        )}
        {status === 'no-update' && (
          <div className="updater-row">
            <span className="updater-status updater-status--success">You're up to date.</span>
            <PrimaryButton onClick={checkForUpdates}>Check again</PrimaryButton>
          </div>
        )}
        {status === 'update-available' && (
          <div className="updater-available">
            <p className="updater-available-version">Version {updateVersion} available{updateDate ? ` · ${updateDate}` : ''}</p>
            {updateNotes && <p className="updater-notes">{updateNotes}</p>}
            <PrimaryButton onClick={downloadAndInstall}>Download and install</PrimaryButton>
          </div>
        )}
        {status === 'downloading' && (
          <div className="updater-downloading">
            <div className="updater-progress-bar">
              <div className="updater-progress-fill" style={{ width: `${downloadProgress}%` }} />
            </div>
            <span className="updater-status">Downloading… {downloadProgress}%</span>
          </div>
        )}
        {status === 'ready' && (
          <div className="updater-row">
            <span className="updater-status updater-status--success">Update installed. Restart to apply.</span>
            <PrimaryButton onClick={restart}>Restart now</PrimaryButton>
          </div>
        )}
        {status === 'error' && (
          <div className="updater-row">
            <span className="updater-status updater-status--error">{errorMessage}</span>
            <PrimaryButton onClick={checkForUpdates}>Try again</PrimaryButton>
          </div>
        )}
      </div>
    </Section>
  )
}
