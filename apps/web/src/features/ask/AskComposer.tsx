import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/ui/button.tsx'
import { Textarea } from '@/ui/textarea.tsx'

// The question box (specs/ask-experience "Failure, interruption and recovery", "Accessibility"). Enter sends,
// Shift+Enter adds a line; Stop replaces Ask while an answer streams. Focus stays in the box after sending, so
// the next question can follow straight away. A prefilled question ("Ask about this") arrives as `initial`;
// the surface remounts the composer for each new one.

export function AskComposer({
  streaming,
  onAsk,
  onStop,
  initial = '',
  autoFocus = false,
}: {
  streaming: boolean
  onAsk: (question: string) => void
  onStop: () => void
  /** A question already in the box, e.g. from "Ask about this"; the visitor still sends it. */
  initial?: string
  autoFocus?: boolean
}) {
  const id = useId()
  const box = useRef<HTMLTextAreaElement>(null)
  const [question, setQuestion] = useState(initial)

  useEffect(() => {
    if (autoFocus) box.current?.focus({ preventScroll: true })
  }, [autoFocus])

  const send = (event?: FormEvent) => {
    event?.preventDefault()
    const text = question.trim()
    if (!text || streaming) return
    onAsk(text)
    setQuestion('')
    box.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) send(event)
  }

  return (
    <form onSubmit={send} className="flex items-end gap-2">
      <label htmlFor={id} className="sr-only">
        Your question
      </label>
      <Textarea
        id={id}
        ref={box}
        rows={1}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={onKeyDown}
        maxLength={1000}
        placeholder="Ask about roles, projects or skills…"
        className="max-h-40 min-h-12 flex-1 resize-none border-border-strong font-serif text-body"
      />
      {streaming ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            onStop()
            box.current?.focus()
          }}
        >
          Stop
        </Button>
      ) : (
        <Button type="submit" size="lg" disabled={!question.trim()}>
          Ask
        </Button>
      )}
    </form>
  )
}
