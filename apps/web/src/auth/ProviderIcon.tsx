import { Github, LogIn } from 'lucide-react'
import { Icon } from '@/components/Icon.tsx'

/** Monochrome provider marks in the current text colour; unknown providers get a generic sign-in icon. */
export function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'github') return <Icon icon={Github} size="md" />
  if (provider === 'google') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" className="shrink-0">
        <path
          fill="currentColor"
          d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.69 14.54 2.7 12 2.7 6.87 2.7 2.7 6.87 2.7 12s4.17 9.3 9.3 9.3c5.37 0 8.93-3.77 8.93-9.09 0-.61-.07-1.08-.16-1.54z"
        />
      </svg>
    )
  }
  return <Icon icon={LogIn} size="md" />
}
