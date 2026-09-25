import { Monitor, Moon, Sun } from 'lucide-react'
import { Icon } from '@/components/Icon.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group.tsx'
import { isPreference, setPreference, useThemePreference } from './theme.ts'

const OPTIONS = [
  { value: 'light', label: 'Light theme', icon: Sun },
  { value: 'dark', label: 'Dark theme', icon: Moon },
  { value: 'system', label: 'Match system theme', icon: Monitor },
] as const

/** Three-way theme control. P5 moves it into the navigation drawer on tablet, mobile and compact landscape. */
export function ThemeControl() {
  const preference = useThemePreference()
  return (
    <ToggleGroup
      aria-label="Theme"
      spacing={0}
      value={[preference]}
      // Pressing the selected option again would empty the group; keep the current choice instead.
      onValueChange={([next]: string[]) => isPreference(next) && setPreference(next)}
    >
      {OPTIONS.map(({ value, label, icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon icon={icon} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
