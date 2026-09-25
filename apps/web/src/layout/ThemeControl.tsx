import { Monitor, Moon, Sun } from 'lucide-react'
import { Icon } from '@/components/Icon.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group.tsx'
import { Button } from '@/ui/button.tsx'
import { isPreference, setPreference, useThemePreference } from './theme.ts'

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

/** Three-way theme control with visible labels, for the navigation drawer. */
export function ThemeControl() {
  const preference = useThemePreference()
  return (
    <ToggleGroup
      aria-label="Theme"
      variant="outline"
      spacing={0}
      className="grid w-full grid-cols-3"
      value={[preference]}
      // Pressing the selected option again would empty the group; keep the current choice instead.
      onValueChange={([next]: string[]) => isPreference(next) && setPreference(next)}
    >
      {OPTIONS.map(({ value, label, icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={`${label} theme`} className="aria-pressed:bg-ink aria-pressed:text-bg">
          <Icon icon={icon} />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** Desktop header: one 44px button showing the current choice, opening a menu of the three. */
export function ThemeMenu() {
  const preference = useThemePreference()
  const current = OPTIONS.find((option) => option.value === preference)!
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Theme: ${current.label}`} />}>
        <Icon icon={current.icon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={preference} onValueChange={(next: string) => isPreference(next) && setPreference(next)}>
          {OPTIONS.map(({ value, label, icon }) => (
            <DropdownMenuRadioItem key={value} value={value} aria-label={`${label} theme`} closeOnClick>
              <Icon icon={icon} />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
