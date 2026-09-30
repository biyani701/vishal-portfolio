import type { Legal } from './schema.ts'

// Privacy policy, terms of use and colophon (specs/content-pages "About, Colophon and Legal"; task 10.5). The three
// pages describe one system and must agree. Every statement describes what the code does today; when that changes,
// this file changes with it:
// - contact messages: apps/api src/contact (fields in schema.ts; Neon Postgres; Resend; retried by the daily cron and
//   flagged after FLAG_AFTER_HOURS; deleted after CONTACT_RETENTION_DAYS, default 365)
// - Ask: apps/web src/features/ask (conversation in localStorage "ask:conversation:v1"; the whole conversation and
//   any "Ask about this" page context go with each run) and apps/api src/ai (CopilotKit runtime, no conversation
//   storage; AI_BASE_URL defaults to the NVIDIA API catalog; answers from /ai-context.json)
// - rate limits and the AI budget: apps/api src/ratelimit.ts, src/ai/budget.ts (SHA-256 of the IP, one-hour windows,
//   Upstash Redis)
// - logs: apps/api src/log.ts (no bodies, query strings, emails, IPs or conversation text)
// - theme: apps/web src/layout/theme.ts (local storage and the themeMode cookie; no consent manager is loaded, so the
//   cookie is written whenever a theme is picked)
// - analytics: none (dropped in P13); adding any means updating this policy first
// - hosting (design.md "Previews", "Cut-over"): the site is published on GitHub Pages; only apps/api runs on Vercel
// - the browser loads nothing from third parties: fonts are self-hosted, and only the API is called
// - licences: the root LICENSE (MIT for the code, with a Scope section excluding personal content, photographs,
//   branding and third-party material); the terms' "Content and copyright" and the colophon's "Licences" must match it
// VERIFY IN P14.2: production CONTACT_RETENTION_DAYS=365 and AI_BASE_URL on the NVIDIA API catalog (owner decision
// 2026-09-30); these pages describe the new site, which goes live at that cut-over.

export const legal = {
  updated: '2026-09-30',

  privacy: {
    title: 'Privacy policy',
    summary:
      'No advertising, no analytics. Information is collected when you send it through the contact form or Ask; the services that host the site also handle the technical details needed to run and secure it.',
    sections: [
      {
        title: 'In short',
        paragraphs: [
          'The site does not use advertising or analytics tracking. Information is collected when you actively provide it: by sending a message through the contact form, or by asking a question with Ask. The providers that host and run the site also process standard technical information, such as your IP address, to operate and secure it.',
          'This policy describes what the code behind the site actually does, and changes when that does. The [terms of use](/legal/terms) cover how the site may be used, and the [colophon](/colophon) how it is built.',
        ],
      },
      {
        title: 'Who is responsible',
        paragraphs: [
          'This site is run by Vishal Biyani, in Mumbai, India, as a personal portfolio. It is not run by a company. For anything about your data, use the [contact form](/contact) and choose “Something else”.',
        ],
      },
      {
        title: 'What is collected',
        paragraphs: [
          'Information you provide, only when you use these features:',
        ],
        items: [
          'Contact form: what the message is about (a role, a programme or engagement, or something else), your name, your email address and your message.',
          'Ask: your questions, and, if you arrived through an “Ask about this” link, the title and a short description of the page you came from.',
        ],
        after: [
          'Technical information, whenever you visit: like any website, each request reaches the hosting providers with your IP address, browser and device details, the address requested and the time: GitHub Pages, which serves the site’s pages, and Vercel, which runs its service (see Hosting and service providers below). The site’s own service does not store IP addresses, and its logs record only that a request happened, where it went, whether it worked and how long it took.',
        ],
      },
      {
        title: 'Messages you send through the contact form',
        paragraphs: [
          'A message goes from the form to the site’s own service, which stores it first and then emails a copy to Vishal so he can reply:',
        ],
        diagram: {
          caption: 'How a contact message travels',
          alt: 'Your browser sends the contact form to the site’s service. The service stores the message in Neon Postgres, then sends it through Resend to Vishal’s email inbox.',
          drawing: 'You\n │  contact form\n ▼\nsite service (Vercel)\n ├─▶ Neon Postgres\n │     stored, deleted after 365 days\n └─▶ Resend ─▶ Vishal’s inbox',
        },
        after: [
          'The stored record holds what you entered, when it arrived, whether it came from the contact page or from Ask, and whether the email copy has been sent. Storing it first means a message isn’t lost if email is briefly unavailable: the email is retried, and if it still hasn’t gone through after a day, the message is flagged for Vishal to pick up from the database.',
          'Stored messages are deleted from the database automatically 365 days after they arrive. The email copy in Vishal’s inbox is not deleted automatically; it is kept as ordinary correspondence. Resend, which delivers the email, may keep its own delivery records under its own terms.',
        ],
      },
      {
        title: 'Questions you ask with Ask',
        paragraphs: [
          'Ask answers questions using only what is published on this site. It works like this:',
        ],
        diagram: {
          caption: 'How an Ask question travels',
          alt: 'Your browser sends the conversation to the site’s service. The service adds excerpts of the site’s published content and sends them to NVIDIA’s AI service, which writes the answer that comes back to your browser. The conversation is saved only in your browser.',
          drawing: 'Your browser\n │  your question + the conversation\n ▼\nsite service (Vercel)\n │  + excerpts of the site’s content\n ▼\nNVIDIA API catalog\n │  writes the answer\n ▼\nYour browser\n    answer with sources,\n    saved in local storage only',
        },
        after: [
          'Each time you ask, your question and the earlier questions and answers in the same conversation are sent to the site’s service, so the answer can follow the conversation. The service passes them, with excerpts of the site’s content, to NVIDIA’s AI service (the NVIDIA API catalog), which writes the answer and suggests follow-up questions. The request to NVIDIA comes from the site’s service, not from your browser, so NVIDIA does not receive your IP address. NVIDIA processes the conversation under its own terms.',
          'The site’s service does not store your questions or answers: it holds a conversation only while an answer is being written. Its logs never record what you asked.',
          'The conversation is saved in your browser’s local storage, so it is still there when you come back. “New conversation” deletes it, and it isn’t available on any other device.',
          'Ask doesn’t need anything personal. Please don’t enter passwords, financial details, confidential business information or other sensitive or private information in a question. If Ask drafts a contact request for you, nothing is sent until you check it and choose “Send request”; it is then handled exactly like a message from the contact form.',
        ],
      },
      {
        title: 'Limits against abuse',
        paragraphs: [
          'To stop the contact form and Ask being flooded, the site counts requests per visitor for one hour at a time. The count is kept against a scrambled (hashed) form of your IP address, so the address itself is never stored, and each count expires when its hour ends. The counts are held in Upstash Redis. A daily total of Ask usage is kept there too, with nothing about who asked.',
        ],
      },
      {
        title: 'Cookies and browser storage',
        paragraphs: [
          'The site uses no advertising or tracking cookies, and loads nothing from other sites: its fonts, images and code are all served from this site.',
          'Cookies. One cookie, “themeMode”, set only when you pick a theme. It holds “light”, “dark” or “system”, lasts up to a year, and lets the page open in the right colours before anything else loads. It is sent only to this site.',
          'Local storage (kept in your browser, not sent with requests):',
        ],
        items: [
          '“themeMode”: the same theme choice.',
          '“ask:conversation:v1”: your Ask conversation, if you have used Ask.',
        ],
        after: [
          'Clearing this site’s data in your browser removes both the cookie and everything in local storage, including any Ask conversation.',
        ],
      },
      {
        title: 'Analytics',
        paragraphs: [
          'The site does not currently use analytics. If analytics or other tracking technologies are introduced, this policy will be updated to describe them and any consent choices that apply.',
        ],
      },
      {
        title: 'Hosting and service providers',
        paragraphs: [
          'The site relies on these services. Each acts on the site’s behalf, receives only what its job needs, and handles it under its own privacy and data-processing terms.',
        ],
        table: {
          caption: 'Service providers and the information each handles',
          columns: ['Service', 'What it does', 'Information involved'],
          rows: [
            ['GitHub Pages', 'Serves the site’s pages', 'Request details (IP address, browser, address, time) for every page visit'],
            ['Vercel', 'Runs the site’s service (the API)', 'Request details for contact and Ask requests; contact messages and Ask conversations pass through it'],
            ['Neon', 'Stores contact messages', 'What you entered in the contact form'],
            ['Resend', 'Emails contact messages to Vishal', 'What you entered in the contact form'],
            ['Upstash', 'Holds request counts for the limits', 'Hashed IP addresses and counts; a daily Ask usage total'],
            ['NVIDIA API catalog', 'Writes Ask’s answers', 'Your Ask conversation and excerpts of the site’s content'],
          ],
        },
      },
      {
        title: 'Processing outside India',
        paragraphs: [
          'Several of these providers are based outside India, so information you send may be processed outside India. Each provider handles it under its own privacy and data-processing terms.',
        ],
      },
      {
        title: 'Security',
        paragraphs: [
          'Reasonable technical and organisational measures protect the information the site handles: connections are encrypted, access to the database and services is limited to Vishal, IP addresses are hashed before they are counted, and logs leave out personal details. No internet service can guarantee absolute security.',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'Using the [contact form](/contact), you can ask what is held from a message you sent, and ask for it to be corrected or deleted. Some information may need to be kept where the law requires it, or to deal with abuse.',
          'Your theme choice and any Ask conversation live in your browser: “New conversation” deletes the conversation, and clearing this site’s data removes both.',
        ],
      },
      {
        title: 'Changes',
        paragraphs: [
          'When the site changes what it collects or who handles it, this policy changes first. The date at the top shows the latest version.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    summary: 'The terms for using this site: what you may do with its content, what not to do, how far to rely on it, and how Ask fits in.',
    sections: [
      {
        title: 'Using this site',
        paragraphs: [
          'This is Vishal Biyani’s personal portfolio. You’re welcome to read it, share it and link to it. Using it means accepting these terms; the [privacy policy](/legal/privacy) explains what happens to information you send.',
        ],
      },
      {
        title: 'Content and copyright',
        paragraphs: [
          'Unless stated otherwise, the site’s original writing, photographs and graphics, and Vishal’s name and personal branding, belong to Vishal Biyani, who keeps the copyright. You may view them, link to them and quote reasonable portions, keeping the attribution. Please don’t present the material as your own, and ask before reusing it commercially.',
          'The source code is a different matter: code in a published repository is covered by the licence that accompanies that repository, not by these terms. The site’s own code, including its styles, is open source under the MIT License; that licence covers the code only, not the writing, photographs or branding above. The [colophon](/colophon) links to the code and its licence.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: ['Please use the site lawfully and leave it working for everyone else. In particular, don’t:'],
        items: [
          'interfere with the site, or try to get round its limits or access controls;',
          'probe, scan or attack the site or the services behind it;',
          'send spam or abuse through the contact form, or use Ask to extract anything other than the site’s published content;',
          'overload the site or its service with automated or excessive requests.',
        ],
        after: ['Requests are limited, and abusive use may be blocked.'],
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
          'Ask is a way to explore what is published on this site. Its answers are written by an AI model from the site’s own content, so they can be incomplete or wrong: check the sources it cites before relying on an answer.',
          'An answer from Ask isn’t Vishal speaking. It isn’t his personal view or a statement made by him, and it isn’t legal, financial, medical, employment or any other professional advice. Using Ask doesn’t create a professional or advisory relationship with Vishal. For anything that matters, use the [contact form](/contact).',
        ],
      },
      {
        title: 'Links',
        paragraphs: [
          'Links to other sites are there for convenience. Those sites are run independently, and their own terms and privacy policies apply.',
        ],
      },
      {
        title: 'Liability',
        paragraphs: [
          'As far as the law allows, Vishal Biyani isn’t liable for any loss arising from using, or not being able to use, this site or Ask’s answers.',
        ],
      },
      {
        title: 'Changes and governing law',
        paragraphs: [
          'These terms may change. The “Last updated” date at the top shows the current version, which applies from that date.',
          'These terms are governed by the laws of India.',
        ],
      },
    ],
  },

  colophon: {
    title: 'Colophon',
    summary: 'How this site is made: the stack, the type, the services behind it, licences and credits.',
    sections: [
      {
        title: 'Built with',
        paragraphs: [
          'The site is a single-page React app, prerendered at build time and published on GitHub Pages; its service is a small API alongside it, on Vercel. Both live in one open-source repository, published at [github.com/biyani701/vishal-portfolio](https://github.com/biyani701/vishal-portfolio).',
        ],
        items: [
          'React 19, React Router and Vite, written in TypeScript',
          'Tailwind CSS with the site’s own design tokens, and Base UI for accessible components',
          'Lucide icons',
          'An API built with Hono, running as Vercel functions',
          'Ask: CopilotKit’s runtime and the AG-UI protocol, answering with models from NVIDIA’s API catalog',
        ],
      },
      {
        title: 'How it fits together',
        paragraphs: ['The browser gets a static site; everything that needs a server goes through the API:'],
        diagram: {
          caption: 'The site and its service',
          alt: 'The browser loads the React and Vite site from GitHub Pages and calls the API on Vercel. The API sends Ask questions to the NVIDIA API catalog, stores contact messages in Neon Postgres and emails them through Resend, and keeps request limits in Upstash Redis.',
          drawing: 'Browser\n ├── site: React + Vite, GitHub Pages\n └── API: Hono, Vercel functions\n      ├── Ask ─────▶ NVIDIA API catalog\n      │    from published content\n      ├── Contact ─┬▶ Neon Postgres\n      │            └▶ Resend ─▶ inbox\n      └── Limits ──▶ Upstash Redis',
        },
        after: [
          'Ask doesn’t read the database or search the internet: at build time the site writes its published content into one file, the API fetches that file from the site, and the model sees only what its search tools find there. Conversations stay in the browser. The [privacy policy](/legal/privacy) has the detail of what each service receives.',
        ],
      },
      {
        title: 'Type',
        paragraphs: ['Three typefaces, all under the SIL Open Font License and served from this site:'],
        items: ['Bricolage Grotesque for headings and interface text', 'Newsreader for reading text', 'JetBrains Mono for code and small labels'],
      },
      {
        title: 'Services',
        paragraphs: ['The site is served by GitHub Pages and its API runs on Vercel. Contact messages are stored in Neon Postgres and emailed through Resend; request limits live in Upstash Redis. Ask’s answers come from NVIDIA’s API catalog.'],
      },
      {
        title: 'Licences',
        paragraphs: [
          'The site’s source code is open source under the [MIT License](https://github.com/biyani701/vishal-portfolio/blob/main/LICENSE): use it, change it and build on it, keeping the copyright notice.',
          'The MIT License covers the code only. Vishal’s writing, photographs, name and personal branding stay his, with copyright kept, as the [terms of use](/legal/terms) explain; the licence file lists exactly what it leaves out.',
          'Everything else keeps its own licence: React, React Router, Vite, Tailwind CSS, Base UI, Hono and CopilotKit are MIT-licensed, Lucide is ISC-licensed, and the typefaces are under the SIL Open Font License, with their licence files served alongside them.',
        ],
      },
      {
        title: 'Credits',
        paragraphs: [
          'Designed and written by Vishal Biyani, with human judgment and AI assistance. AI tools helped with exploration, implementation, debugging and copy editing; the architecture, the final content and the published code remain Vishal’s responsibility.',
          'Earlier versions of the site drew on Mads Stoumann’s CSS periodic-table approach and Chris Benjamin’s responsive icon tutorial.',
        ],
      },
    ],
  },
} as const satisfies Legal
