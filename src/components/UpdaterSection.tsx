import { useState, useEffect } from 'react'
import { Section } from './ui/Section'
import { PrimaryButton } from './ui/PrimaryButton'
import { GITHUB_RELEASES_LATEST_API } from '../config/githubRelease'
import './UpdaterSection.css'

function normalizeReleaseTag(tag: string): string {
  return tag.trim().replace(/^v/i, '')
}

export function UpdaterSection() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'update-available' | 'downloading' | 'ready' | 'no-update' | 'error'>('idle')
  const [currentVersion, setCurrentVersion] = useState<string>('')
  const [updateVersion, setUpdateVersion] = useState<string>('')
  const [updateNotes, setUpdateNotes] = useState<string>('')
  const [updateDate, setUpdateDate] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [latestTag, setLatestTag] = useState<string>('')
  const [latestName, setLatestName] = useState<string>('')
  const [latestDate, setLatestDate] = useState<string>('')
  const [latestUrl, setLatestUrl] = useState<string>('')
  const [latestLoadFailed, setLatestLoadFailed] = useState(false)

  const appVersion = import.meta.env.VITE_APP_VERSION
  const displayVersion = currentVersion || appVersion

  const inTauri = typeof window !== 'undefined' && !!(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__

  useEffect(() => {
    if (!inTauri) return
    let cancelled = false
    ;(async () => {
      try {
        const { getVersion } = await import('@tauri-apps/api/app')
        const v = await getVersion()
        if (!cancelled) setCurrentVersion(v)
      } catch {
        if (!cancelled) setCurrentVersion(appVersion)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [inTauri, appVersion])

  useEffect(() => {
    let cancelled = false
    fetch(GITHUB_RELEASES_LATEST_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json() as Promise<{ tag_name?: string; name?: string; published_at?: string; html_url?: string }>
      })
      .then((data) => {
        if (cancelled || !data.tag_name) return
        setLatestTag(data.tag_name)
        setLatestName(data.name?.trim() ? data.name : data.tag_name)
        setLatestUrl(data.html_url ?? '')
        if (data.published_at) {
          const d = new Date(data.published_at)
          setLatestDate(Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { dateStyle: 'medium' }))
        }
      })
      .catch(() => {
        if (!cancelled) setLatestLoadFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matchesLatestPublished =
    Boolean(latestTag && displayVersion) &&
    normalizeReleaseTag(latestTag) === normalizeReleaseTag(displayVersion)

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

  if (!inTauri && status === 'idle') {
    return (
      <Section title="Updates" description="When running as the desktop app, you can check for updates and install them here.">
        <div className="updater-release-meta">
          <span className="updater-label">This build</span>
          <span className="updater-version">{appVersion}</span>
        </div>
        {!latestLoadFailed && latestTag ? (
          <p className="updater-github-note">
            Latest release on GitHub:{' '}
            {latestUrl ? (
              <a href={latestUrl} target="_blank" rel="noreferrer" className="updater-release-link">
                {latestTag}
              </a>
            ) : (
              <strong>{latestTag}</strong>
            )}
            {latestDate ? ` · ${latestDate}` : ''}
            {matchesLatestPublished ? (
              <span className="updater-match">Same version as this web build.</span>
            ) : null}
          </p>
        ) : latestLoadFailed ? (
          <p className="updater-browser-hint">Could not load latest release from GitHub.</p>
        ) : (
          <p className="updater-browser-hint">Loading release info…</p>
        )}
        <p className="updater-browser-hint">Open the installed desktop app to use in-app updates.</p>
      </Section>
    )
  }

  return (
    <Section
      title="Updates"
      description="Keep the app up to date. Updates are verified with a signature before installation."
    >
      <div className="updater-current">
        <span className="updater-label">This app</span>
        <span className="updater-version">{displayVersion}</span>
      </div>

      {!latestLoadFailed && latestTag ? (
        <div className="updater-github-latest">
          <span className="updater-label">Latest release</span>
          <span className="updater-github-row">
            {latestUrl ? (
              <a href={latestUrl} target="_blank" rel="noreferrer" className="updater-release-link">
                {latestTag}
              </a>
            ) : (
              <strong>{latestTag}</strong>
            )}
            {latestName && latestName !== latestTag ? <span className="updater-release-name">{latestName}</span> : null}
            {latestDate ? <span className="updater-release-date">{latestDate}</span> : null}
          </span>
          {matchesLatestPublished ? (
            <span className="updater-match installer">This build matches the latest published release.</span>
          ) : null}
        </div>
      ) : latestLoadFailed ? (
        <p className="updater-browser-hint">Could not load latest release from GitHub (offline or rate limit).</p>
      ) : (
        <p className="updater-browser-hint">Loading latest release…</p>
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
