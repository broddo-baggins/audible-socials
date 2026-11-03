# Redesign, November 2026

Branch `redesign/2026-11`. UI only: no API calls, `api/`, package versions or Vercel settings were touched. The system is written in [`DESIGN.md`](DESIGN.md); tokens are in `src/index.css` and `tokens.json`.

## Critique of the site as it was (captured Nov 3, 2026)

1. **The colour system never loaded.** Tailwind v4 ignores `tailwind.config.js`, so none of the ~950 `audible-*` and `echo-*` classes rendered. What showed was Tailwind's default purple, pink, blue and yellow, chosen screen by screen.
2. **Generic AI look.** Purple-to-pink gradient banners on Social, Clubs and the idle game, sparkle icons beside titles, translucent "glass" stat tiles, neon buttons, emoji in headings, centred hero blocks, a glowing robot button in the corner.
3. **No identity.** An imitation of Audible's orange and its wording ("Search Audible", "Audible Originals"), with Helvetica and Inter and no type scale.
4. **Broken layouts.** The book page stretched the cover to the full page width. The 768 to 1023 px range had no header and no navigation (the `tablet:` variant did not exist). `/club/:id` crashed (`MeetingsSummary is not defined`). Unknown routes rendered an empty page.
5. **Accessibility.** Measured from the pixels: text at 1.0 to 3.2 : 1 on most routes (white on pale gradients, grey on grey); `div` click targets; focus rings tied to the invisible orange; no reduced-motion handling; a scroll listener on every page.

## Decisions

- **Identity "Marginalia":** ink on paper with one highlighter, because the product is books and the social layer is people marking what they love. Covers bring all the colour.
- **Type:** Literata (a typeface made for reading books) for titles and book names, Schibsted Grotesk for the interface. Both OFL, self-hosted.
- **Signature:** a deterministic **waveform** per book, club and listener, drawn in SVG from its id. It is the progress bar on Now playing and the player, friends' progress on Home, and the empty, loading and error marks.
- **One dark surface:** the player and Now playing, the room with the lights off. Everything else is light.
- **Fold, then migrate:** the legacy hue families are mapped in `@theme` onto ink and the highlighter, so no old class can bring purple back, while each page was rebuilt on semantic tokens.
- **Shell:** one responsive header at every width with a menu sheet below 1024 px (no destination lost), a five-item bottom nav on phones, a sitemap footer that states the disclaimer once.

## Before and after

Screenshots: `/private/tmp/claude-502/-Users-Amit-Yogev-Downloads-projects-shellcv/d9eb7315-1044-4b41-896f-5a4547688b8e/scratchpad/design-shots/audible-socials/` (`before-<route>-<width>.png`, `after-<route>-<width>.png`, plus `compare-<route>.png` side by side).

| Route | Before | After |
| --- | --- | --- |
| `/` Home | Disclaimer in a blue-purple glass box, centred hero, three equal club cards | Disclaimer strip; Now playing on night with the book's waveform; friends listening; clubs block; next-book lists; shelves |
| `/browse`, `/originals`, `/podcasts` | One page for all three; filters and most sorts did nothing | All / Originals / Podcasts tabs; filters, sorts and genre links work; cover grid and list view |
| `/book/:id` | Cover stretched to the full page width | Cover and waveform left, facts row, one highlighter action, chapters, friends, clubs, shelves; not-found state |
| `/search` | Crashed on typing | Search field with suggestions, recent and popular searches, genres; results and no-results states |
| `/library`, `/friend/:id/library`, `/discover` | Default-palette cards; Discover unrouted | Typographic counts, tabs, cover grids, empty states; Discover routed |
| `/social` | Purple-to-pink "Social Hub" banner, sparkles, glass tiles | Page header, typographic stats, ruled activity feed, listening now, clubs to join |
| `/clubs`, `/clubs/friends`, `/clubs/activity` | Gradient banner and a pink welcome block | URL tabs, clubs with covers and waveforms, private club dialog that now opens |
| `/club/:id` | Crashed (`MeetingsSummary is not defined`) | Renders: waveform of the reading period, meetings with RSVP, perks, private-club tabs; not-found state |
| `/idle`, `/battles` | Neon purple game slab; gradient battle cards | Night game panel with highlighter progress, still under reduced motion; tabbed battle list with ranked leaders |
| `/profile`, `/account`, `/settings`, `/help`, `/notifications` | Repeated sections, dead help items | Tabs, charts from stored stats, real switches and links; each route opens its section |
| Company, help, legal, apps (15 pages) | Template cards, emoji, "Audible" self-references | A distinct layout per company page, an accessible FAQ, a labelled contact form, one reading layout with a table of contents for legal, real app screenshots in device frames |
| 404, loading, empty, error | Blank page; spinners | NotFound page, page-shaped skeletons, dashed empty states, waveform error state |

## Checks (Nov 3, 2026, on the production build)

- **Routes:** all 37 route paths plus fonts and screenshots return 200 (`vite preview`); 117 captures at 1440, 768 and 390 px with **zero console errors**; `/club/1` renders.
- **Contrast, measured from pixels** (headless Chrome; per text box: the background is the commonest colour and the foreground the darkest 3 % of pixels; only text that is topmost at its centre): **3,887 text elements, 96 flagged, none real on review.** The flags are screen-reader-only text, single glyphs (separator dots, commas, ©) whose box is almost all background, and items inside the collapsed "On this page" disclosure. Before: most routes had text at 1.0 to 3.2 : 1. Token ratios are in `DESIGN.md`.
- **Focus:** a real Tab key shows the ink ring with highlighter halo on paper and the highlighter ring on night. **Reduced motion:** `MotionConfig reducedMotion="user"` plus a CSS override.
- **Build** passes. **Lint:** 0 errors (26 warnings, in the Node download scripts and in hook dependencies left as they were). Before: 65 errors.

## Known and not done

- A full dark theme (the app is light with night surfaces). See `DESIGN.md` section 7.
- `FriendRecommendations` and `BookClubTeaser` `fetch('/src/data/*.json')`, which works only on the dev server; in a production build those two panels stay empty. This predates the redesign and was left alone because it is a data call (it belongs with the fix/security-2026-11 work).
- Data quirks: club events are dated 2025, and the demo user is in 3 clubs against a limit of 2 ("3 of 2 clubs").
