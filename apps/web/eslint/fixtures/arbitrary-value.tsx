const cn = (...classes: string[]) => classes.join(' ')

export const Colour = () => <p className="text-[#2447D9]">Colour</p>
export const Spacing = () => <div className={cn('flex', 'p-[13px]')}>Spacing</div>
export const Property = () => <div className={`md:[mask-type:alpha]`}>Property</div>
export const Variable = () => <div className="hover:p-(--gap)">Variable</div>
