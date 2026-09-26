import { Link } from 'react-router'
import { profile } from '@/content/index.ts'

// Static footer (specs/site-navigation, task 5.4): social and legal links. Cookie preferences join when the
// consent banner arrives with analytics (P13).
const linkClass = 'inline-flex min-h-target items-center text-accent underline-offset-4 hover:underline'

export function Footer() {
  return (
    <footer className="border-t border-border pb-safe">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-page py-4 text-label text-muted tablet:flex-row tablet:items-center tablet:justify-between desktop:flex-row desktop:items-center desktop:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <a href={profile.links.linkedin} className={linkClass}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.github} className={linkClass}>
                GitHub
              </a>
            </li>
            <li>
              <Link to="/colophon" className={linkClass}>
                Colophon
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/legal/terms" className={linkClass}>
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
