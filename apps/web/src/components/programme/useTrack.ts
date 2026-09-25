import { useCallback, useState } from 'react'

// A Programme Line track's rendered width and a text measure in its font, so buildProgramme's label and
// cluster rules (§6.3, §6.4) run on real pixels. Until the track is measured (tests, prerendering, a form
// hidden in this layout mode) the form's typical width stands in.

export interface Track {
  width: number
  measure?: (label: string) => number
}

function textMeasure(el: HTMLElement): Track['measure'] {
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return undefined
  const style = getComputedStyle(el)
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  return (label) => context.measureText(label).width
}

export function useTrack(fallbackWidth: number) {
  const [track, setTrack] = useState<Track>({ width: fallbackWidth })

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const update = () => {
      const width = el.getBoundingClientRect().width
      // A form hidden in this layout mode measures 0; keep the last real width.
      if (width > 0) setTrack({ width, measure: textMeasure(el) })
    }
    const observer = new ResizeObserver(update)
    observer.observe(el)
    // Labels are measured in the web font, which may land after the first layout. `ready` alone isn't enough:
    // it can resolve before the lane fonts start loading, leaving labels measured in the (wider) fallback.
    void document.fonts?.ready.then(update)
    document.fonts?.addEventListener('loadingdone', update)
    return () => {
      observer.disconnect()
      document.fonts?.removeEventListener('loadingdone', update)
    }
  }, [])

  return [ref, track] as const
}
