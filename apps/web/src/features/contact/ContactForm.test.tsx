import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Component as ContactPage } from '@/routes/contact.tsx'
import { sendContact, validate, type SendResult } from './contact.ts'
import { ContactForm } from './ContactForm.tsx'

// Task 10.4 (specs/contact): the form, its validation, and every outcome of a send.

afterEach(() => vi.unstubAllGlobals())

const filled = { intent: 'role' as const, name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello' }

function setup(results: SendResult[], initial: Partial<typeof filled> = filled) {
  const send = vi.fn<typeof sendContact>()
  results.forEach((result) => send.mockResolvedValueOnce(result))
  render(<ContactForm initial={initial} send={send} />)
  return { send, user: userEvent.setup() }
}

describe('Contact form', () => {
  it('asks what the message is about, then name, email and message; no contact details are published', () => {
    render(<ContactForm />)
    const group = screen.getByRole('group', { name: 'What is this about?' })
    expect(within(group).getAllByRole('radio').map((r) => r.closest('label')?.textContent)).toEqual(['A role', 'A programme or engagement', 'Something else'])
    for (const label of ['Your name', 'Your email', 'Message']) expect(screen.getByLabelText(label)).toBeInTheDocument()
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
  })

  it('shows the email error and moves focus to it when the email is missing (Validation)', async () => {
    const { send, user } = setup([], { ...filled, email: '' })
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByText('Enter an email address so he can reply')).toBeInTheDocument()
    expect(screen.getByLabelText('Your email')).toHaveFocus()
    expect(screen.getByLabelText('Your email')).toHaveAttribute('aria-invalid', 'true')
    expect(send).not.toHaveBeenCalled()
  })

  it('reports errors in field order, starting with the intent', async () => {
    const user = userEvent.setup()
    render(<ContactForm send={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByText('Choose what this is about')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')[0]).toHaveFocus()
    expect(validate({ intent: '', name: '', email: 'nope', message: '' })).toEqual({
      intent: 'Choose what this is about',
      name: 'Enter your name',
      email: 'Enter a valid email address, like name@example.com',
      message: 'Write a message',
    })
  })

  it('replaces the form with a confirmation once the service acknowledges it (Successful send)', async () => {
    const { send, user } = setup([{ ok: true }])
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    const status = await screen.findByRole('status')
    expect(within(status).getByRole('heading', { name: 'Message sent' })).toHaveFocus()
    expect(status).toHaveTextContent('Vishal will reply to ada@example.com')
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument()
    expect(send).toHaveBeenCalledWith(filled, { source: 'page', website: '' })
  })

  it('keeps every value and offers Try again when the service fails (Service unavailable)', async () => {
    const { send, user } = setup([{ ok: false, kind: 'unavailable' }, { ok: true }])
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing was sent, and everything you wrote is kept.')
    expect(screen.getByLabelText('Your name')).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('says when to try again after a rate limit, keeping the message (Rate limited)', async () => {
    const { user } = setup([{ ok: false, kind: 'rate_limited', retryAfterSeconds: 1500 }])
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Try again in about 25 minutes. Your message is kept.')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello')
  })

  it('shows the server’s field errors in the page’s words', async () => {
    const { user } = setup([{ ok: false, kind: 'invalid', errors: { email: 'Enter a valid email address, like name@example.com' } }])
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByText('Enter a valid email address, like name@example.com')).toBeInTheDocument()
    expect(screen.getByLabelText('Your email')).toHaveFocus()
  })

  it('hides the honeypot from people and assistive technology', () => {
    render(<ContactForm />)
    const trap = document.querySelector<HTMLInputElement>('input[name="website"]')!
    expect(trap).toHaveAttribute('tabindex', '-1')
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(screen.queryByRole('textbox', { name: 'Website' })).not.toBeInTheDocument()
  })
})

describe('sendContact', () => {
  const stub = (status: number, body: unknown = {}) =>
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))

  it('posts to {VITE_API_BASE_URL}/contact and counts only 201 as sent', async () => {
    const fetch = stub(201, { status: 'received' })
    expect(await sendContact(filled, { source: 'ask', website: '', fetch })).toEqual({ ok: true })
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.test.invalid/contact')
    expect(JSON.parse(String(init.body))).toEqual({ ...filled, source: 'ask', website: '' })
  })

  it('maps rate limits, field errors, outages and network failures', async () => {
    expect(await sendContact(filled, { source: 'page', fetch: stub(429, { error: 'rate_limited', retryAfterSeconds: 60 }) })).toEqual({
      ok: false,
      kind: 'rate_limited',
      retryAfterSeconds: 60,
    })
    expect(await sendContact(filled, { source: 'page', fetch: stub(400, { error: 'invalid', fields: { email: 'invalid' } }) })).toEqual({
      ok: false,
      kind: 'invalid',
      errors: { email: 'Enter a valid email address, like name@example.com' },
    })
    expect(await sendContact(filled, { source: 'page', fetch: stub(503, { error: 'unavailable' }) })).toEqual({ ok: false, kind: 'unavailable' })
    expect(await sendContact(filled, { source: 'page', fetch: vi.fn(async () => Promise.reject(new TypeError('offline'))) })).toEqual({ ok: false, kind: 'unavailable' })
  })
})

describe('/contact', () => {
  it('prefills the intent and message from the URL, as Ask’s “Open the contact form instead” does', async () => {
    const router = createMemoryRouter([{ path: '/contact', Component: ContactPage }], { initialEntries: ['/contact?intent=role&message=About+a+role'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Message')).toHaveValue('About a role'))
    expect(screen.getByRole('radio', { name: 'A role' })).toBeChecked()
  })
})
