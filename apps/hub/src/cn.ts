/** Joins class names, skipping falsy ones. The hub has no conflicting utilities to merge, so no tailwind-merge. */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')
