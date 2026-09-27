import { organisations, projects, roles } from '@/content/index.ts'
import type { AskErrorCode, Step } from './model.ts'
import type { Role } from '@content/schema.ts'

// Plain-language copy for Ask (specs/ask-experience "Activity presentation": one sentence per step, no raw
// reasoning; design package §8). Tool names appear only under Details.

const parse = (args: string): Record<string, unknown> => {
  try {
    const value = JSON.parse(args) as unknown
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const projectTitle = (slug: unknown) => projects.find((p) => p.slug === slug)?.title
function roleLabel(id: unknown) {
  const role = (roles as readonly Role[]).find((r) => r.id === id)
  if (!role) return undefined
  const org = organisations.find((o) => o.id === role.org)
  return org ? `${role.title} at ${org.name}` : role.title
}

/** What the step is doing (in flight) or did (done), or what couldn't be done (failed). */
export function stepSentence(step: Pick<Step, 'tool' | 'args' | 'status'>): string {
  const args = parse(step.args)
  const [doing, done, failed] = ((): [string, string, string] => {
    switch (step.tool) {
      case 'search_site': {
        const query = typeof args.query === 'string' && args.query ? ` for “${args.query}”` : ''
        return [`Searching the site${query}…`, `Searched the site${query}`, `Couldn’t search the site${query}`]
      }
      case 'list_projects':
        return ['Looking through projects…', 'Looked through projects', 'Couldn’t look through projects']
      case 'get_project': {
        const title = projectTitle(args.slug)
        return title
          ? [`Reading the ${title} case study…`, `Read the ${title} case study`, `Couldn’t read the ${title} case study`]
          : ['Reading a case study…', 'Read a case study', 'Couldn’t read the case study']
      }
      case 'get_experience': {
        const role = roleLabel(args.role_id)
        return role
          ? [`Looking at the role of ${role}…`, `Looked at the role of ${role}`, `Couldn’t look up the role of ${role}`]
          : ['Looking through roles…', 'Looked through roles', 'Couldn’t look through roles']
      }
      case 'get_profile':
        return ['Reading the profile…', 'Read the profile', 'Couldn’t read the profile']
      case 'draft_contact_request':
        return ['Drafting a contact request…', 'Drafted a contact request', 'Couldn’t draft a contact request']
      default:
        return ['Looking something up…', 'Looked something up', 'Couldn’t complete a lookup']
    }
  })()
  return step.status === 'in-flight' ? doing : step.status === 'done' ? done : failed
}

/** For the draft's notice: what a failed step would have supplied. */
export function leftOut(step: Pick<Step, 'tool' | 'args'>): string {
  switch (step.tool) {
    case 'get_experience':
      return 'role details'
    case 'get_project':
    case 'list_projects':
      return 'project details'
    case 'get_profile':
      return 'profile details'
    default:
      return 'details from a lookup'
  }
}

export function errorCopy(code: AskErrorCode | undefined, retryAfterSeconds?: number): string {
  switch (code) {
    case 'ask_rate_limited': {
      const minutes = retryAfterSeconds ? Math.max(1, Math.ceil(retryAfterSeconds / 60)) : undefined
      return `You’ve asked a lot of questions in a short time, so answers are paused${minutes ? ` for about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : ''}. You can still search the site or send a message.`
    }
    case 'ask_budget_exhausted':
      return 'Ask has reached its limit for today. You can still search the site or send a message.'
    case 'ask_unavailable':
      return 'The answering service is unavailable right now. Try again in a moment, or search the site instead.'
    case 'network':
      return 'The connection dropped before the answer finished.'
    default:
      return 'Something went wrong while answering.'
  }
}

/** Starter questions before the first question (AskSurface). */
export const STARTERS = ['Which projects show hands-on engineering?', 'What did he run at the IFC?', 'What is he working on now?']
