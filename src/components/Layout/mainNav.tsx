/* eslint-disable react-refresh/only-export-components -- shared nav defs + icon set for multiple shells */
import type { ComponentType, ReactNode } from 'react'
import type { CertificationId } from '../../data/certificationPacks'

export type NavIconProps = { size?: number; className?: string }

export type MainNavEntry = {
  to: string
  label: string
  group: 'study' | 'system'
  Icon: ComponentType<NavIconProps>
}

function strokeIcon(path: ReactNode, size = 18) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {path}
    </svg>
  )
}

export function HomeIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>,
    size,
  )
}

export function BoltIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(<path d="M13 2 4 14h6l-1 8 9-12h-6z" />, size)
}

export function ExamIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>,
    size,
  )
}

export function NetworkIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>,
    size,
  )
}

export function LightbulbIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5C8.35 12.26 8.82 13.02 9 14" />
    </>,
    size,
  )
}

export function CardsIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <rect x="2" y="4" width="14" height="16" rx="2" />
      <path d="M18 8h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
    </>,
    size,
  )
}

export function ClockIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2" />
      <path d="M9 2h6" />
      <path d="M12 2v3" />
    </>,
    size,
  )
}

export function GameIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M8 12h4" />
      <path d="M10 10v4" />
      <circle cx="16.5" cy="11" r="0.8" />
      <circle cx="18.5" cy="14" r="0.8" />
    </>,
    size,
  )
}

export function SettingsIcon({ size = 18 }: NavIconProps) {
  return strokeIcon(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>,
    size,
  )
}

export const MAIN_NAV: MainNavEntry[] = [
  { to: '/', label: 'Home', group: 'study', Icon: HomeIcon },
  { to: '/study', label: 'Blitz', group: 'study', Icon: BoltIcon },
  { to: '/exam', label: 'Exam Prep', group: 'study', Icon: ExamIcon },
  { to: '/subnetting', label: 'Subnetting', group: 'study', Icon: NetworkIcon },
  { to: '/pbq', label: 'PBQ Practice', group: 'study', Icon: LightbulbIcon },
  { to: '/flashcards', label: 'Flashcards', group: 'study', Icon: CardsIcon },
  { to: '/pomodoro', label: 'Pomodoro', group: 'study', Icon: ClockIcon },
  { to: '/settings', label: 'Settings', group: 'system', Icon: SettingsIcon },
]

export const CCST_NAV: MainNavEntry[] = [
  { to: '/', label: 'Home', group: 'study', Icon: HomeIcon },
  { to: '/pbq', label: 'PBQ Practice', group: 'study', Icon: LightbulbIcon },
  { to: '/exam', label: 'Exam Prep', group: 'study', Icon: ExamIcon },
  { to: '/subnetting', label: 'Subnetting', group: 'study', Icon: NetworkIcon },
  { to: '/ccst-minigames', label: 'CCST Minigames', group: 'study', Icon: GameIcon },
  { to: '/pomodoro', label: 'Pomodoro', group: 'study', Icon: ClockIcon },
  { to: '/settings', label: 'Settings', group: 'system', Icon: SettingsIcon },
]

export function getMainNav(activeCertification: CertificationId | null): MainNavEntry[] {
  if (!activeCertification) return [{ to: '/', label: 'Home', group: 'study', Icon: HomeIcon }]
  return activeCertification === 'ccst-it-support' ? CCST_NAV : MAIN_NAV
}

const CRUMB: Record<string, string> = {
  '/': 'Home',
  '/study': 'Blitz',
  '/exam': 'Exam Prep',
  '/subnetting': 'Subnetting',
  '/pbq': 'PBQ Practice',
  '/flashcards': 'Flashcards',
  '/pomodoro': 'Pomodoro',
  '/ccst-minigames': 'CCST Minigames',
  '/settings': 'Settings',
}

export function breadcrumbTitle(pathname: string): string {
  return CRUMB[pathname] ?? 'Home'
}
