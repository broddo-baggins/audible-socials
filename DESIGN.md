# Listenable design system: "Marginalia"

Listenable is a social audiobook app: you listen, and you listen with people. The identity borrows from a well-read paperback: paper, ink, and one highlighter swipe where something matters. Book titles are set in a typeface made for books, and every book, club and listener carries its own **waveform**, the one mark the brand owns.

The source of truth for values is `src/index.css` (CSS custom properties and the Tailwind v4 `@theme`); `tokens.json` is the same set, machine-readable. Change all three together.

## 1. Principles

1. **Covers bring the colour.** The interface is ink on paper so that 400 book covers can be loud. Nothing in the chrome competes with a cover.
2. **One highlighter.** `--hl` is the only accent. It is a *fill under ink* (a selected chip, the active nav bar, the heard part of a waveform, one key button). It is never text on paper (1.1:1).
3. **Left-aligned and asymmetric.** Pages open left-aligned with a serif title. Rows are uneven on purpose (1.7 : 1, 1.1 : 1). Nothing is centred except a lone button in a dialog.
4. **Say it once, plainly.** Sentence case, no exclamation marks, no emoji, no em dashes, no "unleash", "seamless", "elevate". A number carries its unit.
5. **Quiet states.** Empty, loading and error look like the page they stand in for, in grey, with one way forward.

## 2. Tokens

### 2.1 Colour

| Token | Value | Use | Contrast (measured on paper #F2F2EE) |
| --- | --- | --- | --- |
| `--paper` | #F2F2EE | Page ground | |
| `--surface` | #FBFBF9 | Cards, inputs, sheets, menus | |
| `--surface-sunk` | #E9E9E4 | Wells, skeletons, the disclaimer strip | |
| `--night` / `--night-raised` | #141519 / #1F2127 | The player and Home's Now playing slab: the one dark surface | |
| `--ink` | #17181C | Headings, body, primary button fill | 15.8 : 1 |
| `--ink-2` | #43464E | Secondary text | 8.4 : 1 |
| `--ink-3` | #53575F | Meta, captions, placeholders | 6.5 : 1 (kept above 6 because 11 to 13 px antialiased text measures about 1.5 lower) |
| `--ink-on-night` / `--ink-on-night-2` | #F2F2EE / #A3A7AF | Text on night | 16.3 / 7.6 : 1 on night |
| `--line` | #DCDDD7 | Hairlines and dividers (decorative) | |
| `--line-strong` | #7E8279 | Edges of inputs and outline buttons | 3.5 : 1 (non-text 3 : 1) |
| `--hl`, `--hl-soft`, `--hl-wash` | #E2F04B, #EEF6A6, #F6FAD4 | The highlighter, its tint, its wash | ink on hl 14.2 : 1; hl on night 14.6 : 1 |
| `--danger` / `--danger-wash` | #B3261E / #FBEFEE | Errors, destructive confirmations | 5.8 : 1 |
| `--success` / `--success-wash` | #2D6A39 / #EEF5EF | Confirmations | 5.8 : 1 |

Tailwind names: `bg-paper`, `bg-surface`, `bg-surface-sunk`, `bg-night`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-line`, `border-line-strong`, `bg-hl`, `bg-hl-soft`, `bg-hl-wash`, `text-danger`, `text-success`.

**Legacy classes are folded, not banned.** The `purple-*`, `pink-*`, `blue-*`, `indigo-*`, `orange-*`, `amber-*`, `yellow-*`, `teal-*` (and similar) families resolve to the highlighter for 50 to 400 and to ink for 500 to 950; greys resolve to the neutral ramp; `green-*`/`emerald-*` to success and `red-*` to danger; `audible-*` and `echo-*` to the semantic tokens. New code uses the semantic names.

### 2.2 Type

Two families, both OFL and self-hosted in `public/fonts/`:

- **Literata** (serif, made for reading books): page titles, section titles, book titles, the wordmark.
- **Schibsted Grotesk** (sans, a newspaper house face): everything else.

| Role | Class | Spec |
| --- | --- | --- |
| Display | `.t-display` | Literata 500, 36 to 60 px fluid, 1.04, -0.02em |
| Page title | `.t-h1` | Literata 500, 30 to 44 px fluid, 1.1 |
| Section title | `.t-h2` | Literata 500, 22 to 28 px fluid, 1.2 |
| Card title | `.t-h3` | Schibsted 600, 18 px, 1.35 |
| Body | `.t-body` / default | Schibsted 400, 16 px, 1.6 |
| Small | `.t-small` | 14 px, 1.5 |
| Meta | `.t-meta` | 13 px, ink-3, tabular figures |
| Label | `.t-label` | 12 px, 600, uppercase, +0.04em. **At most one per three sections.** |
| Book title | `.t-title-book` | Literata 500 at the size of its context |

Numbers that change or compare (minutes, members, counts) use `.tabular`.

### 2.3 Space

A 4 px base: `--space-1` 4, `-2` 8, `-3` 12, `-4` 16, `-5` 24, `-6` 32, `-7` 48, `-8` 64, `-9` 96 (Tailwind 1, 2, 3, 4, 6, 8, 12, 16, 24). Sections on a page sit 64 to 80 px apart (`space-y-16 md:space-y-20`); a title sits 20 px above its content (`mb-5`). The page container is `.page` (max 1280 px; gutters 16, 32, 48).

### 2.4 Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-cover` (`rounded-sm`) | 3 px | Book covers, badges |
| `rounded-md` | 6 px | Small inline elements |
| `--radius-panel` (`rounded-lg`, `rounded-xl`) | 10 px | Cards, inputs, menus, panels |
| `--radius-sheet` (`rounded-2xl`, `rounded-3xl`) | 14 px | Dialogs, large feature blocks, Now playing |
| `--radius-pill` (`rounded-full`) | 999 px | Every button, chip, avatar, toggle |

### 2.5 Elevation and motion

Shadows are tinted with ink, never black: `--shadow-1` (resting), `--shadow-2` (menus and dialogs), `--shadow-cover` (a book on a table). Cards rest on a 1 px `--line` edge, not a shadow. There is no glass: no `backdrop-blur` on content.

Motion is feedback, never decoration: 120 to 220 ms, `--ease-out`. A pressed button scales to 0.98; a hovered cover lifts 4 px. Page changes fade in over 220 ms. `<MotionConfig reducedMotion="user">` and a CSS block stop all of it under `prefers-reduced-motion`.

## 3. Components

All in `src/components/ui/` and exported from `ui/index.js`.

- **Button**: `primary` (ink pill), `highlight` (one per screen at most), `secondary`/`outline` (3 : 1 edge), `ghost`, `link`, `onNight`. Heights 36, 44, 48, 56. Labels are 1 to 3 words and never wrap.
- **Card**: surface + hairline, `rounded-lg`. Use only when a group needs a boundary; otherwise use a rule (`divide-y divide-line`) and space.
- **Badge**: square-cornered sticker (`original` ink, `podcast` outlined, `highlight`, states).
- **Tag**: pill chip; `primary` is the selected state.
- **Input**: label above, hint or error below (`aria-describedby`), 44 px, focus ring = ink edge + highlighter halo.
- **Rating**: ink stars on a line track, never yellow.
- **Cover**: 2:3, 3 px corners, cast shadow, a spine shade, and a typeset fallback when the image fails.
- **Waveform**: deterministic bars from a seed (book id, club id, user id). With `progress`, heard bars take `playedClassName` (highlighter on night, ink on paper). Used for Now playing, friends' progress, loading and error states.
- **Avatar**: photo or initials.
- **PageHeader**: every page's opening: optional kicker, serif title, one line, actions right, slot below for tabs.
- **EmptyState** / **ErrorState**: dashed panel or waveform, one sentence, one action.
- **Skeleton** (`HeroSkeleton`, `CarouselSkeleton`, `BookCardSkeleton`): the shape of the real layout.
- **Logo**: three waveform bars on a highlighter square, the wordmark in Literata.

Shell: `layout/DesktopHeader` (the one header at every width; a menu sheet below 1024 px), `layout/MobileBottomNav` (below 768 px), `layout/Footer`.

**Tabs** (pattern, not a component): a row of `role="tab"` buttons or links, `text-ink-2`, the selected one `text-ink` with a 3 px highlighter bar under it; the row sits on a `border-b border-line`.

## 4. Patterns

- **Page opening**: `<div className="page">` then `<PageHeader>`. No full-bleed gradient banners.
- **Shelves**: `BookCarousel` (serif title, See all, arrows that work by keyboard).
- **Lists over cards**: more than five similar items become a `divide-y` list or a grid of covers, not a stack of boxed cards.
- **Stats**: big numbers in Literata at `t-h1` size with a meta label under; no icon tile above every number.
- **Charts**: ink bars or lines on a line-coloured baseline, the current or chosen value in highlighter, values printed, never colour alone.
- **Dark surface**: only the player and Now playing use night. Everything else is light.

## 5. Do and don't

| Do | Don't |
| --- | --- |
| Let covers carry colour | Purple, pink or blue gradients; "hero" gradient banners |
| One highlighter moment per view | Highlighter text on paper; several accent colours |
| Left-aligned serif titles | Centred everything; sparkle icons beside titles |
| `lucide-react` icons at `strokeWidth={1.75}` | Emoji as icons; hand-drawn icon paths |
| Real data from `src/data/` | Lorem ipsum, invented metrics |
| Dashed empty states with one action | Spinners for page loads |
| 44 px targets, visible focus, real `<button>`/`<a>` | `div onClick`, focus `outline: none` without a replacement |
| Hyphens and commas | Em dashes |

## 6. Accessibility floors

Text 4.5 : 1 (3 : 1 at 24 px and up), measured from rendered pixels in headless Chrome (see `REDESIGN.md`). Focus visible on every control. Reduced motion respected. Layouts checked at 390, 768 and 1440 px.

## 7. Not done (Known)

- **Dark theme.** The app is light, with night surfaces for the player. A full dark theme needs the legacy `bg-white` uses retired first; it is the next step.
- **Hue fold.** The folded hue families are a migration aid; components should move to semantic names as they are touched.
