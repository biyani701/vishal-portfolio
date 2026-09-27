// Follow-up questions after an answer, or starters before the first question (specs/ask-experience). Choosing
// one asks it.

export function AskSuggestions({ label, questions, onAsk }: { label: string; questions: readonly string[]; onAsk: (question: string) => void }) {
  if (!questions.length) return null
  return (
    <section aria-label={label} className="flex flex-col gap-2">
      <h2 className="font-mono text-mono-s text-muted uppercase">{label}</h2>
      <ul className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => onAsk(question)}
              className="inline-flex min-h-target items-center rounded-md border border-border bg-surface px-3 text-left text-body text-ink transition-colors duration-colour hover:border-border-strong"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
