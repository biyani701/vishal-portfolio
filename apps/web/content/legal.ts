import type { Legal } from './schema.ts'

// Privacy policy, terms of use and colophon (specs/content-pages "About, Colophon and Legal"; task 10.5). Every
// statement describes what the code does today; when that changes, this file changes with it:
// - contact messages: apps/api src/contact (Neon Postgres, Resend, CONTACT_RETENTION_DAYS, default 365)
// - Ask: apps/api src/ai (NVIDIA API catalog; no conversation storage) and apps/web src/features/ask (localStorage)
// - rate limits: apps/api src/ratelimit.ts (hashed IP, one-hour windows in Upstash Redis)
// - theme: apps/web src/layout/theme.ts (local storage; the cookie only with consent)
// - analytics: none yet (P13 adds analytics with a consent banner, and must update this policy)
// DRAFT until the owner has reviewed it (task 10.5's check): the pages say so while `draft` is true.

export const legal = {
  draft: true,
  updated: '2026-09-27',

  privacy: {
    title: 'Privacy policy',
    summary:
      'What this site collects, why, where it goes and how long it stays. In short: nothing unless you send a message or ask a question, no advertising, and no analytics yet.',
    sections: [
      {
        title: 'Who is responsible',
        paragraphs: [
          'This site is run by Vishal Biyani, in Mumbai, India, as a personal portfolio. For anything about your data, use the contact form and choose “Something else”.',
        ],
      },
      {
        title: 'Messages you send through the contact form',
        paragraphs: [
          'When you send a message, the site stores what you entered (what it is about, your name, your email address and your message), when it arrived, and whether it came from the contact page or from Ask. It then emails a copy to Vishal so he can reply.',
          'Messages are stored in a Postgres database run by Neon, and the email is sent through Resend. Both act only on this site’s behalf. If the email can’t be sent straight away, the stored message is retried until it goes through.',
          'Stored messages are deleted automatically 365 days after they arrive. The copy in Vishal’s inbox is kept as ordinary correspondence.',
        ],
      },
      {
        title: 'Questions you ask with Ask',
        paragraphs: [
          'Ask answers questions using only what is published on this site. Your question, and the earlier questions and answers in the same conversation, are sent to the site’s own service and, from there, to NVIDIA’s AI service (the NVIDIA API catalog) to write the answer. NVIDIA processes them under its own terms.',
          'The site’s service does not store your questions or answers. Its operational logs record that a request happened, how long it took and whether it worked, never what you asked.',
          'The conversation is kept only in your browser (its local storage), so you can come back to it. “New conversation” deletes it; it isn’t available on any other device.',
          'Please don’t put personal or confidential information in a question. If Ask drafts a contact request for you, nothing is sent until you check it and choose “Send request”; it is then handled like any other message.',
        ],
      },
      {
        title: 'Limits against abuse',
        paragraphs: [
          'To stop the contact form and Ask being flooded, the site counts requests per visitor for one hour at a time. It counts them against a scrambled (hashed) form of your IP address, so the address itself is never stored, and each count expires after the hour.',
        ],
      },
      {
        title: 'Cookies and storage in your browser',
        paragraphs: [
          'The site uses no advertising or tracking cookies. It keeps a few things in your browser’s local storage: your light or dark theme choice, and your Ask conversation if you use Ask.',
          'Your theme choice can also be kept in a “themeMode” cookie for up to a year, but only if you have agreed to preference cookies.',
        ],
      },
      {
        title: 'Analytics',
        paragraphs: ['The site does not use analytics at present. If that changes, this policy will say so first, and analytics will only run if you agree.'],
      },
      {
        title: 'Hosting',
        paragraphs: [
          'The site and its service are hosted by Vercel, which keeps standard request logs (such as IP address, browser and time) for security and operations, under its own privacy policy. The rate-limit counts are held in Upstash Redis.',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'You can ask to see, correct or delete a message you sent, using the contact form. Clearing your browser’s site data removes the theme choice and any Ask conversation.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    summary: 'The terms for using this site: what you may do with its content, how far you can rely on it, and how Ask fits in.',
    sections: [
      {
        title: 'Using this site',
        paragraphs: [
          'You’re welcome to read, share links to and quote from this site. The words, images and design belong to Vishal Biyani unless stated otherwise; please don’t republish them as your own or use them commercially without asking. Code in linked open-source projects is covered by those projects’ own licences.',
        ],
      },
      {
        title: 'Accuracy',
        paragraphs: [
          'The content describes Vishal’s own work and experience and is kept as accurate as he can make it, but it is provided as it is, without any warranty. Figures and descriptions of client work are summaries, not statements on behalf of those clients.',
        ],
      },
      {
        title: 'Ask',
        paragraphs: [
          'Ask’s answers are written by an AI model from the site’s own content. They can be incomplete or wrong, so check the sources it cites before relying on an answer. Ask never speaks for Vishal: for anything that matters, use the contact form.',
          'Please don’t use Ask to try to extract anything other than the site’s published content, or to overload it. Requests are limited, and abusive use may be blocked.',
        ],
      },
      {
        title: 'Links',
        paragraphs: ['Links to other sites are provided for convenience. Their content and policies are their own.'],
      },
      {
        title: 'Liability',
        paragraphs: [
          'As far as the law allows, Vishal Biyani isn’t liable for any loss arising from using, or not being able to use, this site or its answers.',
        ],
      },
      {
        title: 'Changes and law',
        paragraphs: [
          'These terms may change; the date below shows the latest version. They are governed by the laws of India.',
        ],
      },
    ],
  },

  colophon: {
    title: 'Colophon',
    summary: 'How this site is made: the stack, the type, the services behind it, and credits.',
    sections: [
      {
        title: 'Built with',
        paragraphs: ['The site is a single-page React app; its service is a small API alongside it. Both are open source in the portfolio repository.'],
        items: [
          'React 19, React Router and Vite, written in TypeScript',
          'Tailwind CSS with the site’s own design tokens, and Base UI for accessible components',
          'Lucide icons',
          'An API built with Hono, running as Vercel functions',
          'Ask: CopilotKit’s runtime and the AG-UI protocol, answering with models from NVIDIA’s API catalog',
        ],
      },
      {
        title: 'Type',
        paragraphs: ['Three typefaces, all under the SIL Open Font License and served from this site:'],
        items: ['Bricolage Grotesque for headings and interface text', 'Newsreader for reading text', 'JetBrains Mono for code and small labels'],
      },
      {
        title: 'Services',
        paragraphs: ['Hosting by Vercel. Contact messages are stored in Neon Postgres and emailed through Resend; request limits live in Upstash Redis.'],
      },
      {
        title: 'Credits',
        paragraphs: [
          'Designed and written by Vishal Biyani, with AI assistance for code and copy. Earlier versions of the site drew on Mads Stoumann’s CSS periodic-table approach and Chris Benjamin’s responsive icon tutorial.',
        ],
      },
    ],
  },
} as const satisfies Legal
