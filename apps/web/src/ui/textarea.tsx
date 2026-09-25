import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-sm border border-border bg-surface px-2.5 py-2 text-body transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:bg-border disabled:opacity-50 aria-invalid:border-error",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
