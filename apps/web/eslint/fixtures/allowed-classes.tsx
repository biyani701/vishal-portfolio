const cn = (...classes: string[]) => classes.join(' ')

// Token utilities, arbitrary variants and non-class strings are all fine.
export const Fixture = () => (
  <div className={cn('flex p-4 text-ink', 'data-[state=open]:bg-surface', 'md:hover:text-accent/80')} title="p-[13px]">
    ok
  </div>
)
