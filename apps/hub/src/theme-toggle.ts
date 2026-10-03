import './hub.css'

// The light/dark toggle (specs/domain-hub "Static, accessible and on-brand"). index.html's inline script has already
// applied the saved choice or the system theme; this only reveals the button and handles clicks.
const KEY = 'themeMode'
const root = document.documentElement
const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')

function show(theme: 'light' | 'dark') {
  root.dataset.theme = theme
  if (!button) return
  const next = theme === 'dark' ? 'light' : 'dark'
  button.setAttribute('aria-label', `Switch to ${next} theme`)
  button.querySelector('[data-icon="moon"]')?.classList.toggle('hidden', theme === 'dark')
  button.querySelector('[data-icon="sun"]')?.classList.toggle('hidden', theme === 'light')
}

if (button) {
  show(root.dataset.theme === 'dark' ? 'dark' : 'light')
  button.hidden = false
  button.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    show(theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      // Private mode or blocked storage: the choice lasts for this page view only.
    }
  })
}
