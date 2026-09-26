// The main sections (specs/site-navigation "Primary navigation"), in navigation order. The 404 page links
// to them now; P5 builds the navigation from the same list.
export const sections = [
  { path: '/work', label: 'Work' },
  { path: '/experience', label: 'Experience' },
  { path: '/about', label: 'About' },
  { path: '/ask', label: 'Ask' },
  { path: '/contact', label: 'Contact' },
] as const
