import { expect, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

/** Effective hit area: the element's box, or its hit-target ::after layer if that is larger (§4.3). */
export function targetSize(element: Element) {
  const box = element.getBoundingClientRect()
  const after = getComputedStyle(element, '::after')
  const hasLayer = after.content !== 'none' && after.position === 'absolute'
  return {
    width: Math.max(box.width, hasLayer ? parseFloat(after.width) : 0),
    height: Math.max(box.height, hasLayer ? parseFloat(after.height) : 0),
  }
}

export function expectTarget(element: Element, min = 44) {
  const { width, height } = targetSize(element)
  const label = element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.tagName
  expect(width, `${label} target width`).toBeGreaterThanOrEqual(min)
  expect(height, `${label} target height`).toBeGreaterThanOrEqual(min)
}

export const isCoarsePointer = () => matchMedia('(pointer: coarse)').matches

/** Clicks a page corner away from the component under test (outside-click dismissal). */
export async function clickOutside(corner: 'top-left' | 'bottom-right' = 'top-left') {
  const position = corner === 'top-left' ? { x: 2, y: 2 } : { x: innerWidth - 2, y: innerHeight - 2 }
  await userEvent.click(document.body, { position })
}

/** Tabs `times` times and returns the elements that received focus. */
export async function tabThrough(times: number, shift = false) {
  const visited: Element[] = []
  for (let i = 0; i < times; i++) {
    await userEvent.keyboard(shift ? '{Shift>}{Tab}{/Shift}' : '{Tab}')
    // Base UI traps focus with guard elements that immediately hand focus back inside; record where it lands.
    await vi.waitFor(() => expect(document.activeElement?.hasAttribute('data-base-ui-focus-guard')).toBe(false))
    if (document.activeElement) visited.push(document.activeElement)
  }
  return visited
}

/** Waits for enter/exit animations (e.g. zoom-in-95) so measurements see the final layout. */
export async function settled() {
  // Let starting-style → transition kick in before collecting running animations.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => undefined)))
}
