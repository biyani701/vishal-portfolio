import type { Skill } from '@content/schema.ts'
import { fractionalYear } from '@/components/programme/buildProgramme.ts'
import { skills as allSkills } from '@/content/index.ts'
import { buildCapabilityMap, skillYears } from '@/features/experience/capability.ts'
import { cn } from '@/lib/utils'

// Skills over time on Experience: one row per skill, grouped, each with its years in text and a bar on an axis
// shared by every group. The bar and its fill are decorative; the text carries the dates and where the skill
// was used, so colour is never the only signal.

const USE_LABEL: Record<Skill['use'], string> = { professional: 'Professional', personal: 'Personal', learning: 'Learning' }
const USE_BAR: Record<Skill['use'], string> = {
  professional: 'bg-accent-fill',
  personal: 'border border-accent bg-accent-soft-border',
  learning: 'border border-dashed border-accent',
}

const pct = (fraction: number) => `${fraction * 100}%`

export function CapabilityMap({ skills = allSkills, now = fractionalYear(new Date()) }: { skills?: readonly Skill[]; now?: number }) {
  const map = buildCapabilityMap(skills, now)
  const span = map.axisEnd - map.axisStart

  return (
    <div className="flex flex-col gap-6">
      <ul aria-label="Key" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-mono-s text-muted uppercase">
        {(Object.keys(USE_LABEL) as Skill['use'][]).map((use) => (
          <li key={use} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('h-2 w-4 rounded-full', USE_BAR[use])} />
            {USE_LABEL[use]}
          </li>
        ))}
      </ul>

      <div className="grid gap-x-10 gap-y-8 desktop:grid-cols-2">
        {map.groups.map((group) => (
          <section key={group.name} aria-label={group.name} className="flex flex-col gap-2">
            <h3 className="font-sans text-h3 font-semibold">{group.name}</h3>
            {/* The shared axis, above each group's tracks. */}
            <div aria-hidden="true" className="grid grid-cols-1 tablet:grid-cols-12 desktop:grid-cols-12 compact-landscape:grid-cols-12">
              <span className="mobile:hidden tablet:col-span-4 desktop:col-span-4 compact-landscape:col-span-4" />
              <span className="relative h-4 font-mono text-mono-s text-muted tabular-nums tablet:col-span-8 desktop:col-span-8 compact-landscape:col-span-8">
                {map.ticks.map((year) => (
                  <span key={year} className={cn('absolute top-0', year > map.axisStart && '-translate-x-1/2')} style={{ left: pct((year - map.axisStart) / span) }}>
                    {year}
                  </span>
                ))}
              </span>
            </div>
            <ul className="flex flex-col">
              {group.bars.map(({ skill, start, width }) => (
                <li
                  key={skill.name}
                  className="grid grid-cols-1 items-center gap-x-4 gap-y-1 border-t border-border py-2 tablet:grid-cols-12 desktop:grid-cols-12 compact-landscape:grid-cols-12"
                >
                  <span className="flex items-baseline justify-between gap-3 tablet:col-span-4 desktop:col-span-4 compact-landscape:col-span-4 tablet:flex-col tablet:gap-0 desktop:flex-col desktop:gap-0 compact-landscape:flex-col compact-landscape:gap-0">
                    <span className="text-body font-medium text-ink">{skill.name}</span>
                    <span className="font-mono text-mono-s text-muted tabular-nums">
                      {skillYears(skill)}
                      {skill.use !== 'professional' && ` · ${USE_LABEL[skill.use]}`}
                    </span>
                  </span>
                  <span aria-hidden="true" className="relative h-2 rounded-full bg-past-track tablet:col-span-8 desktop:col-span-8 compact-landscape:col-span-8">
                    <span className={cn('absolute top-0 h-2 rounded-full', USE_BAR[skill.use])} style={{ left: pct(start), width: pct(width) }} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
