import { renderToStaticMarkup } from 'react-dom/server'
import { hub } from '../content/sites.ts'
import { Page } from './components/Page.tsx'

// Built with `vite build --ssr` and run once by scripts/render.ts: the hub ships as static HTML, with no React in
// the browser (openspec add-biyani-hub, D1).
export const render = (year: number) => renderToStaticMarkup(<Page hub={hub} year={year} />)
