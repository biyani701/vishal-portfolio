import type { Page } from '@playwright/test'

// Touch targets (specs/responsive-layout "Touch targets and safe areas"): every visible interactive element is
// at least 44×44 CSS px on touch layouts. A control's target is the larger of its own box and a `hit-target`
// ::after (src/design/tokens.css). WCAG 2.5.8's inline exception applies: a link inside a sentence of running
// text is sized by the text, so links whose block also holds other text are left out.

export interface Undersized {
  element: string
  width: number
  height: number
}

export function undersizedTargets(page: Page, minimum = 44): Promise<Undersized[]> {
  return page.evaluate((min) => {
    const selector = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      'summary',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="radio"]',
      '[role="checkbox"]',
      '[role="switch"]',
      '[role="option"]',
      '[role="menuitem"]',
    ].join(',')

    const visible = (el: Element) => {
      const style = getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none') return false
      const box = el.getBoundingClientRect()
      return box.width > 1 && box.height > 1 && !el.closest('[inert], [aria-hidden="true"]')
    }

    /** A link set inside running text: its nearest block ancestor has text outside the link. */
    const inline = (el: Element) => {
      if (el.tagName !== 'A' || getComputedStyle(el).display !== 'inline') return false
      let block = el.parentElement
      while (block && getComputedStyle(block).display.startsWith('inline')) block = block.parentElement
      if (!block) return false
      const own = el.textContent?.trim().length ?? 0
      return (block.textContent?.trim().length ?? 0) > own
    }

    /** A visually hidden input whose label is the real target. */
    const labelled = (el: Element) => el instanceof HTMLInputElement && el.labels && el.labels.length > 0 && !visible(el)

    const size = (el: Element) => {
      const box = el.getBoundingClientRect()
      const after = getComputedStyle(el, '::after')
      const extra = after.content !== 'none' && after.position === 'absolute' ? [parseFloat(after.width) || 0, parseFloat(after.height) || 0] : [0, 0]
      return { width: Math.max(box.width, extra[0]!), height: Math.max(box.height, extra[1]!) }
    }

    const describe = (el: Element) => {
      const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
      const where = el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : el.closest('[role="dialog"]') ? 'dialog' : 'main'
      return `${where} ${el.tagName.toLowerCase()}${el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''} "${name}"`
    }

    /** A radio or checkbox inside its label: tapping anywhere on the label toggles it, so the label is the target. */
    const targetOf = (el: Element) => (el.matches('[role="radio"], [role="checkbox"], [role="switch"]') && el.closest('label')) || el

    const results: { element: string; width: number; height: number }[] = []
    for (const el of document.querySelectorAll(selector)) {
      if (labelled(el) || !visible(el) || inline(el)) continue
      const { width, height } = size(targetOf(el))
      // Half a pixel of rounding from fluid type is not a failure.
      if (width + 0.5 < min || height + 0.5 < min) results.push({ element: describe(el), width: Math.round(width), height: Math.round(height) })
    }
    return results
  }, minimum)
}
