# Al Huda — Arabic Institute Website Prototype

A front-end-only UI/UX prototype for **Al Huda** (الهدى), a bilingual (English/Arabic) Arabic-language institute site. No backend, no database, no real payments — forms submit to a mock "success" UI state.

The brand name lives in `src/i18n/en.json` / `src/i18n/ar.json` under the `"brand"` key if it ever needs to change.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build   # production build + type check
npm run preview # preview the production build locally
```

## Tech stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (CSS-first config — see `src/index.css`, no `tailwind.config.js`)
- React Router v7 for client-side routing
- No backend/API calls, no database, no auth, no payment logic

## Folder structure

```
src/
  i18n/
    en.json              English strings
    ar.json               Arabic strings (mirror of en.json's keys)
    I18nContext.tsx        Locale state, dir switching, localStorage persistence, t()/td() helpers
  components/
    layout/                Header, Footer, Container
    ui/                     Reusable primitives: Button, Card, Accordion, Field (inputs/select/textarea), PlaceholderBadge
  pages/                    One file per route (Home, ProgramsConversational, ProgramsIGCSE, BookTrial, Contact, About, FAQs, Blog, Placeholder)
  data/                     Mock content: testimonials, tutor bios, blog posts, sample schedule
  App.tsx                   Route definitions
  main.tsx                  App entry — wraps App in I18nProvider + BrowserRouter
  index.css                 Tailwind import, theme tokens (@theme), fonts, base styles
```

## Adding or editing language strings

1. Open `src/i18n/en.json` and `src/i18n/ar.json` — both files share the same nested key structure (e.g. `home.heroHeadline`, `programs.conversational.title`).
2. Add or edit a string in **both** files under the same key path. If a key is missing from `ar.json`, the English string is used as a fallback automatically.
3. In a component, read strings with the `useI18n()` hook:
   ```tsx
   import { useI18n } from '../i18n/I18nContext'

   const { t } = useI18n()
   t('home.heroHeadline') // returns the string for the active locale
   ```
4. For arrays/objects (e.g. the FAQ list or program levels), use `td<T>()` instead of `t()`:
   ```tsx
   const items = td<{ q: string; a: string }[]>('faqs.items')
   ```
5. The active locale is stored in `localStorage` under `institute-locale` and persists across reloads. Toggling language (via the header switcher) flips `<html dir>` between `ltr`/`rtl` and swaps in the Arabic font stack — this is a **real layout mirror**, not just translated text: nav order, card order, icons/arrows, and spacing all flip because the app uses Tailwind's logical spacing (`ps-`/`pe-`/`ms-`/`me-`/`start-`/`end-`) instead of hardcoded `left`/`right` utilities.

## Design system

- **Colors** (see `@theme` in `src/index.css`): deep teal (`teal-950`–`teal-50`) as primary, warm gold (`gold-600`–`gold-100`) as accent, sand/ink neutrals for background and text.
- **Type**: Poppins for English display headings, Inter for English body/UI, IBM Plex Sans Arabic for all Arabic text (headings and body).
- **Components**: all reusable UI lives in `src/components/ui/` — extend `Button`, `Card`, `Field.tsx` inputs, etc. rather than styling ad hoc in pages.

## Programs

- **Conversational Arabic** — Modern Standard Arabic (Fusha) only.
- **IGCSE Arabic** — for Arab students following the IG curriculum (no First/Foreign Language tracks).
- **UAE Curriculum Arabic** — Arabic aligned to the UAE Ministry of Education curriculum (`/programs/uae`).

IGCSE and UAE share one layout: `src/components/sections/ProgramPage.tsx`, driven by the `programs.igcse` / `programs.uae` keys in the i18n files.

## Bookings: how a student joins, and how you find out

1. The student submits the form on `/book-trial` (name, email, **WhatsApp number**, country, program, preferred time).
2. The submission is POSTed as JSON to `VITE_FORM_ENDPOINT` (see `.env.example`) — that is how **you** learn about it. Point it at a Formspree / Web3Forms form (emails you every request) or a Make/Zapier webhook (e.g. into a Google Sheet or WhatsApp).
3. You confirm a time, then send the student a private video-class link (Zoom / Google Meet) by WhatsApp and email. The student just clicks it at class time — no account needed.

**If `VITE_FORM_ENDPOINT` is not set, the forms run in demo mode and nothing is delivered** — the success screen says so. Set it in Vercel under Project Settings → Environment Variables before going live.

## What's built vs. what's next

**Built:** Home, Conversational Arabic, IGCSE Arabic, UAE Curriculum Arabic, Book a Trial Class, FAQs, Contact.

**Stubbed (route exists, minimal content):** About, Blog. Copy for both already exists in the i18n files and mock data in `src/data/`.

## Placeholder content

Anything meant to be swapped before launch is either:
- Visually flagged with a dashed "Placeholder content" badge (testimonials, sample schedule, trial-form success copy) — see `PlaceholderBadge` component, or
- Clearly mock data in `src/data/*.ts` with a comment at the top of the file.

No real pricing, tuition numbers, or payment forms are included anywhere.
