import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group"

// Not in the shadcn registry: a thin Programme wrapper over Base UI Autocomplete (free text with
// suggestions, e.g. the ⌘K palette). Mirrors src/ui/combobox.tsx, which shares most Base UI parts.

const Autocomplete = AutocompletePrimitive.Root

function AutocompleteInput({
  className,
  children,
  disabled = false,
  showClear = false,
  ...props
}: AutocompletePrimitive.Input.Props & { showClear?: boolean }) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <AutocompletePrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      {showClear && (
        <InputGroupAddon align="inline-end">
          <AutocompletePrimitive.Clear
            data-slot="autocomplete-clear"
            aria-label="Clear"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
            disabled={disabled}
          >
            <XIcon className="pointer-events-none" />
          </AutocompletePrimitive.Clear>
        </InputGroupAddon>
      )}
      {children}
    </InputGroup>
  )
}

function AutocompleteContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<AutocompletePrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            "group/autocomplete-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-md bg-surface text-ink shadow-overlay ring-1 ring-border duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  )
}

function AutocompleteList({ className, ...props }: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn(
        "no-scrollbar max-h-[min(--spacing(72),var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        // Focus stays in the input; the highlighted item gets an accent bar as its visible indicator.
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1 pr-2 pl-1.5 text-label outline-hidden select-none pointer-coarse:min-h-11 data-highlighted:bg-accent-soft data-highlighted:text-ink data-highlighted:shadow-[inset_2px_0_0_var(--color-accent)] data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return <AutocompletePrimitive.Group data-slot="autocomplete-group" className={cn(className)} {...props} />
}

function AutocompleteLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-label"
      className={cn("px-2 py-1.5 font-mono text-mono-s tracking-(--text-mono-s--letter-spacing) text-muted uppercase", className)}
      {...props}
    />
  )
}

function AutocompleteCollection(props: AutocompletePrimitive.Collection.Props) {
  return <AutocompletePrimitive.Collection data-slot="autocomplete-collection" {...props} />
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-label text-muted group-data-empty/autocomplete-content:flex",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn("px-2 py-1.5 text-label text-muted empty:hidden", className)}
      {...props}
    />
  )
}

function AutocompleteSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteLabel,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteSeparator,
}
