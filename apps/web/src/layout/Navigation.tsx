import { ArrowRight, Menu, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useAuth } from '@/auth/context.ts'
import { Icon } from '@/components/Icon.tsx'
import { shortcutLabel, usePalette } from '@/features/search/context.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button.tsx'
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/ui/drawer.tsx'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/ui/navigation-menu.tsx'
import { AccountMenu } from './AccountMenu.tsx'
import { sections } from './sections.ts'
import { ThemeControl, ThemeMenu } from './ThemeControl.tsx'
import { useLayoutMode } from './useLayoutMode.ts'

// Primary navigation in three compositions (design package §7; specs/site-navigation "Primary navigation"):
// - desktop: inline bar · ⌘K search field · Ask · theme · account · Contact
// - tablet and mobile: Ask and a menu button opening a Drawer
// - compact landscape: the same in the 44px bar, plus a search button
// The current section is marked with aria-current and an accent underline.

const barSections = sections.filter((section) => section.path !== '/ask' && section.path !== '/contact')

const underline =
  'relative after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 aria-[current=page]:after:opacity-100'

export function Navigation() {
  return useLayoutMode() === 'desktop' ? <DesktopNavigation /> : <CompactNavigation />
}

function SearchField({ className, onOpen }: { className?: string; onOpen?: () => void }) {
  const { openPalette } = usePalette()
  return (
    <button
      type="button"
      onClick={() => (onOpen ? onOpen() : openPalette())}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        'flex h-10 min-w-11 items-center gap-2 overflow-hidden rounded-md border border-border-control bg-surface px-3 text-label text-muted transition-colors hover:border-border-strong',
        className,
      )}
    >
      <Icon icon={Search} className="shrink-0" />
      <span className="flex-1 truncate text-left">Search or ask…</span>
      <kbd className="shrink-0 rounded-sm border border-border px-1 font-mono text-mono-s">{shortcutLabel()}</kbd>
    </button>
  )
}

function DesktopNavigation() {
  const { status } = useAuth()
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <NavigationMenu aria-label="Primary" className="max-w-none flex-none">
        <NavigationMenuList>
          {barSections.map((section) => (
            <NavigationMenuItem key={section.path}>
              <NavigationMenuLink
                render={<NavLink to={section.path} />}
                className={cn('h-11 px-2.5 text-body font-medium text-ink hover:bg-sunken', underline)}
              >
                {section.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <span className="flex-1" />
      <SearchField className="w-72 max-w-72 min-w-11 shrink" />
      <NavLink to="/ask" className={cn('inline-flex h-11 items-center rounded-md px-2.5 font-semibold text-accent hover:bg-sunken', underline)}>
        Ask
      </NavLink>
      <ThemeMenu />
      {status === 'signed-in' && <AccountMenu />}
      <Button render={<Link to="/contact" />}>Contact</Button>
    </div>
  )
}

function CompactNavigation() {
  const { openPalette } = usePalette()
  const mode = useLayoutMode()
  const { pathname } = useLocation()
  // The drawer stays open only on the page it was opened from, so any navigation (a link in it, or Back)
  // closes it. After a navigation, focus goes to the new page's heading (AppShell), not back to the menu button.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const openedFrom = useRef<string | null>(null)
  const open = openOn === pathname
  const setOpen = (next: boolean) => {
    if (next) openedFrom.current = pathname
    setOpenOn(next ? pathname : null)
  }
  const returnFocus = () => openedFrom.current === window.location.pathname

  return (
    <div className="-mr-2 flex items-center">
      {mode === 'compact-landscape' && (
        <Button variant="ghost" size="icon" aria-label="Search or ask" onClick={() => openPalette()}>
          <Icon icon={Search} />
        </Button>
      )}
      <NavLink to="/ask" className="inline-flex h-11 items-center rounded-md px-2.5 font-semibold text-accent hover:bg-sunken">
        Ask
      </NavLink>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(isOpen) => !isOpen && setOpenOn(null)}
        swipeDirection="right"
      >
        <DrawerTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
          <Icon icon={Menu} size="md" />
        </DrawerTrigger>
        <DrawerContent finalFocus={returnFocus}>
          {/* Searching from the drawer closes it first, so the palette isn't stacked on another modal. */}
          <NavigationDrawer onSearch={() => (setOpen(false), openPalette())} />
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function NavigationDrawer({ onSearch }: { onSearch: () => void }) {
  const { status, session, signOut } = useAuth()
  const { pathname } = useLocation()
  return (
    <nav aria-label="Menu" className="flex h-full flex-col gap-3 overflow-y-auto px-4 pt-safe pb-6">
      <div className="flex h-14 shrink-0 items-center justify-between">
        <DrawerTitle className="text-body font-semibold">Vishal Biyani</DrawerTitle>
        <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Close menu" className="-mr-2" />}>
          <Icon icon={X} size="md" />
        </DrawerClose>
      </div>

      <SearchField className="h-11 w-full shrink-0" onOpen={onSearch} />

      <ul className="flex flex-col">
        {sections
          .filter((section) => section.path !== '/contact')
          .map((section) => (
            <li key={section.path}>
              <NavLink
                to={section.path}
                className={cn(
                  'flex h-14 items-center justify-between border-b border-border text-h3 font-semibold text-ink aria-[current=page]:text-accent',
                  section.path === '/ask' && 'text-accent',
                )}
              >
                {section.label}
                {section.path === '/ask' ? (
                  <Icon icon={ArrowRight} />
                ) : (
                  pathname.startsWith(section.path) && <span className="font-mono text-mono-s text-accent uppercase">Current</span>
                )}
              </NavLink>
            </li>
          ))}
      </ul>

      <div className="mt-2">
        <ThemeControl />
      </div>

      <Button size="lg" className="mt-auto" render={<Link to="/contact" />}>
        Contact
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-x-5 text-label">
        {status === 'signed-in' && session ? (
          <>
            <Link to="/account" className="inline-flex min-h-target items-center text-accent">
              Account ({session.user.name})
            </Link>
            <button type="button" onClick={signOut} className="inline-flex min-h-target items-center text-accent">
              Sign out
            </button>
          </>
        ) : (
          <Link to={`/signin?from=${encodeURIComponent(pathname)}`} className="inline-flex min-h-target items-center text-accent">
            Sign in
          </Link>
        )}
        <Link to="/legal/privacy" className="inline-flex min-h-target items-center text-accent">
          Privacy
        </Link>
        <Link to="/colophon" className="inline-flex min-h-target items-center text-accent">
          Colophon
        </Link>
      </div>
    </nav>
  )
}
