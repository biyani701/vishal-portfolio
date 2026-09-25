import { LogOut, User } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from '@/auth/context.ts'
import { Icon } from '@/components/Icon.tsx'
import { Button } from '@/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx'

/** Desktop header, signed in: name, email, Account and Sign out (specs/auth-integration). */
export function AccountMenu() {
  const { session, signOut } = useAuth()
  if (!session) return null
  const { user } = session
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Account: ${user.name}`} />}>
        {user.image ? <img src={user.image} alt="" className="size-7 rounded-full" /> : <Icon icon={User} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col text-ink">
            <span className="font-medium">{user.name}</span>
            {user.email && <span className="truncate font-normal text-muted">{user.email}</span>}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link to="/account" />}>
          <Icon icon={User} />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <Icon icon={LogOut} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
