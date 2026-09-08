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

## What's built vs. what's next

**Built:** Home, Programs → Conversational Arabic, Programs → IGCSE Arabic, Book a Trial Class (with mock success state), Contact (form + WhatsApp + email + socials).

**Stubbed (routes exist, minimal content):** About, FAQs, Blog. The components needed for these already exist (`Accordion` for FAQs, `Card` grid for Blog/tutor bios, mock data in `src/data/`) — they just need to be assembled into full page layouts the same way the built pages are.

## Placeholder content

Anything meant to be swapped before launch is either:
- Visually flagged with a dashed "Placeholder content" badge (testimonials, sample schedule, trial-form success copy) — see `PlaceholderBadge` component, or
- Clearly mock data in `src/data/*.ts` with a comment at the top of the file.

No real pricing, tuition numbers, or payment forms are included anywhere.
