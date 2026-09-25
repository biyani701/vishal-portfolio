import { Moon, Search, Sun } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { StatusChip } from '@/components/StatusChip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/ui/autocomplete'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/ui/combobox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/ui/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/ui/hover-card'
import { Input } from '@/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/ui/input-group'
import { Label } from '@/ui/label'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/ui/navigation-menu'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group'
import { ScrollArea } from '@/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Separator } from '@/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Textarea } from '@/ui/textarea'
import { Toaster, createToastManager } from '@/ui/toast'
import { Toggle } from '@/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'

// Dev-only component gallery (task 2.6, route /_dev/ui): every src/ui component and the token-level
// compositions, for visual review in both themes. Its axe check lives in UiGallery.contract.test.tsx.
const PAGES = ['Experience', 'Work', 'Writing', 'Knowledge', 'Contact']
const STACKS = ['Python', 'TypeScript', 'Java', 'Go']
const toastManager = createToastManager()

type Theme = 'light' | 'dark'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`gallery-${title}`} className="flex flex-col gap-4 border-t-2 border-ink pt-4">
      <h2 id={`gallery-${title}`} className="font-sans text-h3 font-semibold">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  )
}

export function UiGallery() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) ?? 'light')
  const [agree, setAgree] = useState(false)
  const [failedRetries, setFailedRetries] = useState(0)

  function applyTheme(next: Theme) {
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  return (
    <TooltipProvider>
      <Toaster toastManager={toastManager}>
        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-gutter py-section">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-mono-s text-muted uppercase">Dev only · /_dev/ui</p>
              <h1 className="font-sans text-h1 font-semibold">Component gallery</h1>
            </div>
            <ToggleGroup
              aria-label="Theme"
              value={[theme]}
              onValueChange={(value: string[]) => value[0] && applyTheme(value[0] as Theme)}
            >
              <ToggleGroupItem value="light" aria-label="Light theme">
                <Icon icon={Sun} />
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark theme">
                <Icon icon={Moon} />
              </ToggleGroupItem>
            </ToggleGroup>
          </header>

          <Section title="Status chips">
            <StatusChip status="delivered" period="2019–2023" />
            <StatusChip status="in-flight" />
            <StatusChip status="done" />
            <StatusChip status="failed" onRetry={() => setFailedRetries((n) => n + 1)} />
            <StatusChip status="answer-complete" sources={3} />
            <StatusChip status="selected" />
            <span className="sr-only" aria-live="polite">
              {failedRetries ? `Retried ${failedRetries} times` : ''}
            </span>
          </Section>

          <Section title="Buttons and toggles">
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="secondary">Tertiary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Delete</Button>
            <Button size="lg">Send message</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
            <Button size="icon" aria-label="Search">
              <Icon icon={Search} />
            </Button>
            <Toggle aria-label="Show architecture">Architecture</Toggle>
            <ToggleGroup aria-label="Filter by stack" multiple>
              {STACKS.map((stack) => (
                <ToggleGroupItem key={stack} value={stack}>
                  {stack}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Section>

          <Section title="Form controls">
            <Field className="w-72">
              <FieldLabel htmlFor="gallery-name">Name</FieldLabel>
              <Input id="gallery-name" placeholder="Ada Lovelace" />
              <FieldDescription>As you'd like to be addressed.</FieldDescription>
            </Field>
            <Field className="w-72" data-invalid>
              <FieldLabel htmlFor="gallery-email">Email</FieldLabel>
              <Input id="gallery-email" aria-invalid aria-describedby="gallery-email-error" defaultValue="ada@" />
              <FieldError id="gallery-email-error">Enter a full email address, like name@example.com.</FieldError>
            </Field>
            <Field className="w-72">
              <FieldLabel htmlFor="gallery-message">Message</FieldLabel>
              <Textarea id="gallery-message" placeholder="What would you like to discuss?" />
            </Field>
            <InputGroup className="w-72">
              <InputGroupAddon>
                <Icon icon={Search} />
              </InputGroupAddon>
              <InputGroupInput aria-label="Search articles" placeholder="Search articles" />
            </InputGroup>
            <div className="flex items-center gap-3">
              <Checkbox id="gallery-agree" checked={agree} onCheckedChange={setAgree} />
              <Label htmlFor="gallery-agree">Keep a copy of my message</Label>
            </div>
            <RadioGroup aria-label="Reason for contact" defaultValue="role" className="flex flex-col gap-3">
              {[
                ['role', 'A role'],
                ['project', 'A project'],
                ['talk', 'A talk'],
              ].map(([value, text]) => (
                <div key={value} className="flex items-center gap-3">
                  <RadioGroupItem id={`gallery-reason-${value}`} value={value} />
                  <Label htmlFor={`gallery-reason-${value}`}>{text}</Label>
                </div>
              ))}
            </RadioGroup>
            <Select defaultValue="Python">
              <SelectTrigger aria-label="Primary stack" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STACKS.map((stack) => (
                  <SelectItem key={stack} value={stack}>
                    {stack}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Combobox items={STACKS}>
              <ComboboxInput aria-label="Stack" placeholder="Choose a stack" className="w-56" />
              <ComboboxContent>
                <ComboboxEmpty>No stacks found</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Autocomplete items={PAGES}>
              <AutocompleteInput aria-label="Search the site" placeholder="Search the site" className="w-56" />
              <AutocompleteContent>
                <AutocompleteEmpty>No matches</AutocompleteEmpty>
                <AutocompleteList>
                  {(item: string) => (
                    <AutocompleteItem key={item} value={item}>
                      {item}
                    </AutocompleteItem>
                  )}
                </AutocompleteList>
              </AutocompleteContent>
            </Autocomplete>
          </Section>

          <Section title="Overlays">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send message</DialogTitle>
                  <DialogDescription>We reply within two working days.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button>Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>Alert dialog</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard your message?</AlertDialogTitle>
                  <AlertDialogDescription>What you've written will be lost.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction>Discard</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Drawer>
              <DrawerTrigger render={<Button variant="outline" />}>Drawer</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerDescription>Jump to a section.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>3-D Secure</PopoverTitle>
                  <PopoverDescription>Card-holder authentication for online payments.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
            <HoverCard>
              <HoverCardTrigger href="#preview" className="text-accent underline underline-offset-4">
                Preview card
              </HoverCardTrigger>
              <HoverCardContent>Fast JiraQL: a query layer over Jira for delivery reporting.</HoverCardContent>
            </HoverCard>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" />}>Tooltip</TooltipTrigger>
              <TooltipContent>Tooltips are never the only source of information.</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Theme</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-24 w-56 items-center justify-center rounded-md border border-dashed border-border-strong text-label text-muted">
                Right-click or long-press here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Copy link</ContextMenuItem>
                <ContextMenuItem>Open in new tab</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <Button variant="outline" onClick={() => toastManager.add({ title: 'Copied', description: 'Code copied to the clipboard.' })}>
              Toast
            </Button>
          </Section>

          <Section title="Disclosure and navigation">
            <Tabs defaultValue="overview" className="w-full max-w-md">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="outcome">Outcome</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">A query layer over Jira.</TabsContent>
              <TabsContent value="architecture">Parser, planner and cache.</TabsContent>
              <TabsContent value="outcome">Reports in seconds instead of hours.</TabsContent>
            </Tabs>
            <Accordion className="w-full max-w-md">
              <AccordionItem value="stack">
                <AccordionTrigger>What stack does it use?</AccordionTrigger>
                <AccordionContent>Python, FastAPI and PostgreSQL.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="team">
                <AccordionTrigger>Who built it?</AccordionTrigger>
                <AccordionContent>A team of four over two quarters.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Collapsible className="w-full max-w-md">
              <CollapsibleTrigger render={<Button variant="ghost" />}>On this page</CollapsibleTrigger>
              <CollapsibleContent className="pt-2 text-body text-ink-2">Context · Approach · Outcome</CollapsibleContent>
            </Collapsible>
            <NavigationMenu>
              <NavigationMenuList>
                {['Experience', 'Work', 'Writing'].map((item) => (
                  <NavigationMenuItem key={item}>
                    <NavigationMenuLink href={`#${item.toLowerCase()}`}>{item}</NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </Section>

          <Section title="Layout">
            <ScrollArea className="h-32 w-64 rounded-md border border-border" aria-label="Glossary terms" tabIndex={0}>
              <ul className="p-3 text-body">
                {['Acquirer', 'Authorisation', 'BIN', 'Chargeback', 'Issuer', 'Settlement', 'Tokenisation'].map((term) => (
                  <li key={term} className="py-1">
                    {term}
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className="flex h-16 items-center gap-4 text-label">
              <span>Delivery</span>
              <Separator orientation="vertical" />
              <span>Evidence</span>
              <Separator orientation="vertical" />
              <span>Status</span>
            </div>
          </Section>
        </main>
      </Toaster>
    </TooltipProvider>
  )
}
