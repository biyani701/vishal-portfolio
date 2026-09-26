import type { SegmentTone } from './buildProgramme.ts'

// Status colours for Programme Line segments (§6.5): in-flight for the current role, past for pre-Cognizant work.

/** Labelled segments (lanes): soft fills that carry ink text. */
export const segmentTone: Record<SegmentTone, string> = {
  current: 'border-flight-border bg-flight-bg font-semibold text-flight-fg',
  delivered: 'border-accent-soft-border bg-accent-soft text-ink',
  past: 'border-border bg-past-track text-ink',
}

/** Unlabelled spans (mobile rows, the compact-landscape hero's mini line): solid fills. */
export const spanTone: Record<SegmentTone, string> = {
  current: 'bg-flight-dot',
  delivered: 'bg-accent-fill',
  past: 'bg-past',
}

/** The Selected style (§6.5) on Experience: accent fill with an ink outline; rows get the soft fill and an ink rule. */
export const selectedSegment = 'z-1 border-accent-fill bg-accent-fill text-on-accent ring-2 ring-border-strong'
export const selectedRow = 'border-l-border-strong bg-accent-soft'
