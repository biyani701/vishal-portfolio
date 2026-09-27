import { profile } from '@/content/index.ts'

// Per-page metadata (task 13.2): title, description, canonical URL, Open Graph and Twitter card. React 19 hoists
// these elements into <head>, and the build's prerender step (scripts/prerender.ts) saves them into each page's
// HTML, so crawlers and link previews see them without running the app.

export const SITE_URL = 'https://vishal.biyani.xyz'
const SITE_NAME = profile.name

interface PageMetaProps {
  /** The page's own title; the site name is appended. Home passes none. */
  title?: string
  description: string
  /** The page's path, e.g. /work/fast-jiraql, for the canonical URL. */
  path: string
  /** Pages that shouldn't be indexed (the 404). */
  noindex?: boolean
}

export function PageMeta({ title, description, path, noindex = false }: PageMetaProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · ${profile.positioning}`
  const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`
  const image = `${SITE_URL}${profile.portrait.src}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:type" content={path === '/' ? 'profile' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={profile.portrait.alt} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
