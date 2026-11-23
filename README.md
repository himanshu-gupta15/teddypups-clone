# TeddyPups clone

**Live:** https://teddypups-clone-seven.vercel.app

A rebuild of [puppy.instabizweb.com](https://puppy.instabizweb.com/) made as a technical assignment. It is not affiliated with the original business, and it asks search engines not to index it.

## What is included

| Route | What it does |
| --- | --- |
| `/` | Eight scenes from dawn to night: puppies popping up behind a quilt, a pinned hallway of opening doors, a WhatsApp chat that plays as you scroll, a passport with stamps, a photo wall and more |
| `/puppies` | Sketchbook listing with filters stored in the URL |
| `/puppies/[slug]` | 42 profiles with a photo and video gallery, facts, the journey home and an enquiry form |
| `/gone-home` | Ticket wall of puppies that have been adopted |
| `/happy-families` | 64-photo wall with a full-screen viewer (arrow keys and swipe) |
| `/how-it-works` | Keyboard-friendly tabs, and a plane that flies as you scroll |
| `/faq` | Searchable notice board with highlighted matches |
| `/contact` | Fill-in-the-blanks letter that folds into an envelope and posts itself |

Across the site: a page-transition curtain, a header that hides on scroll, a mobile menu, a sticky WhatsApp bar on phones, a paw-print cursor trail, smooth scrolling, and Teddy, a puppy that walks between spots on the home page. On phones Teddy peeks over the WhatsApp bar instead.

## Run it

Needs Node 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
npm test             # unit tests
npm run test:e2e     # browser tests, desktop and phone (uses installed Chrome)
```

## Stack

Next.js 16 (App Router, statically generated), React 19, TypeScript, Tailwind CSS 4, Motion, Lenis, Vitest, Playwright, and Vercel for hosting.

## Structure

```
src/
  app/            routes, layout, global styles and the enquiry server action
  components/
    layout/       header, footer, menu, page curtain, smooth scroll, paw trail
    teddy/        rig (poses), engine (animation), PupJourney (walks the page)
    home/ puppies/ families/ faq/ how/ forms/   one folder per feature
    ui/           shared pieces: Photo, Scene, RevealScope, icons, stamps
  data/           puppies, family photos and showroom media as JSON
  lib/            types, data access, filters, validation, sketch generator
  styles/         feature stylesheets
tests/            unit and e2e
```

## Implementation decisions

- **Static first.** All pages are prerendered. Without JavaScript the content is still there: `RevealScope` only hides elements once it is running, and every Teddy stop contains a still drawing.
- **Teddy** (`components/teddy`). A pose is a set of joint angles. `rig.ts` turns a pose and motion into SVG transforms, `engine.ts` eases between poses, and `PupJourney.tsx` maps scroll position to a resting spot or a walk between two.
- **Hallway of doors** (`home/Meet.tsx`). The section is as tall as the track is wide, so vertical scroll becomes sideways movement. Below 1024px or with reduced motion it becomes a grid.
- **Sketchbook shapes** (`lib/sketch.ts`). Blobs are generated from a hash of the puppy's slug, so server and browser always agree and there is no hydration mismatch.
- **Reduced motion** turns off the curtain, pinning, smooth scroll, paw trail and travelling Teddy.
- **Media.** The source files were 70 MB. `scripts/optimise-media.mjs` reduced them to 39 MB of WebP and MP4, and `next/image` resizes further per device.

## What was ported and what was written

To match the design closely, the stylesheet rules, SVG artwork, text, photos and data come from the reference site's public pages. The CSS was split into feature files in `src/styles`, without the admin styles. The interaction behaviour was studied from the site's public JavaScript bundle, and the React components follow its markup and, in places, its approach. Data access, filters, validation, the Teddy engine, the travelling companion, tests and tooling were written for this project.

All photos, artwork and branding belong to their original owners and are used here only for the assignment.

## Known differences

- Forms validate on the server but **nothing is stored or sent**: there is no database or inbox. `src/app/actions.ts` is where a mailer or CRM would go.
- WhatsApp links use the placeholder number shown on the site, so a demo cannot message a real business. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to change it.
- Social and map links are generic, because the reference points them all at its agency.
- Teddy's route between spots is a simpler version of the original's path.
- The admin area is not included, since it is private on the reference site.

## Testing

- 20 unit tests: validation, filters, data integrity (including that every media file exists) and sketch generation.
- 44 browser tests (22 each on desktop and phone): every route renders without console errors or sideways scroll, plus navigation, filters, gallery, photo viewer, FAQ, tabs, both forms, Teddy and reduced motion.
- Full-page screenshots compared with the reference at 1440px and 390px: page heights within 2px. Pixel difference was under 0.7% on all 18 captures except two phone pages at about 4%, where a 2px height difference shifts the content below it.

## AI usage

See [docs/AI_USAGE.md](docs/AI_USAGE.md) for the tools and exact prompts.
