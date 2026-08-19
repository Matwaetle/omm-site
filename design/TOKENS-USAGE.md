# TOKENS-USAGE — class cheat sheet

Source of truth: `DIRECTION.md` §3 + §5. Implemented in `src/app/globals.css`.
Tailwind's stock palette and radius ladder are **deleted** — if a class isn't listed here it does not exist.

## Colors

Any color prefix works: `bg-`, `text-`, `border-`, `fill-`, `stroke-`, `outline-`, `divide-`, `ring-`, `caret-`, `accent-`.

| Group | Names |
|---|---|
| surfaces | `bg-0` page · `bg-1` raised · `bg-2` header/zebra · `bg-3` hover |
| text | `ink-0` display/h2 · `ink-1` body · `ink-2` secondary · `ink-3` label/dim |
| lines | `line-0` hairline · `line-1` emphasis · `line-2` over-texture rule |
| accent | `accent` · `accent-press` · `accent-ink` (text on fills) · `accent-wash` · `accent-line` |
| terminal only | `term-ok` · `term-warn` · `term-err` — **banned outside the terminal component** |
| passthrough | `transparent` · `current` · `inherit` |

e.g. `bg-bg-1`, `text-ink-2`, `border-line-0`, `text-accent`, `bg-accent text-accent-ink`.

## Radius — 8px ceiling

`rounded-sm` 3px (badges, inline code) · `rounded-md` 5px (buttons, inputs, tabs) · `rounded-lg` 8px (terminal, panels) · `rounded-none`.
`rounded-full` is allowed **only** on the three terminal traffic-light dots. Bare `rounded`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` no longer compile.

## Type scale

`text-display` 76/70/42px · `text-h2` 40→30 · `text-h3` 22→20 · `text-lede` 19→17 · `text-small` 14 · `text-label` 11 mono UPPER +0.14em · `text-terminal` 13.5 mono · `text-table` 13 mono.
Body (16/1.62 Archivo, `ink-1`) is the `<body>` default — no class needed.
Mobile sizes fire automatically at `max-width: 640px` (display also steps down at 1024px). Each class carries a default color (`ink-0`/`ink-1`/`ink-2`/`ink-3`); override with any `text-ink-*` utility.
Families: `font-sans` (Archivo) · `font-mono` (JetBrains Mono). Nothing else exists.

## Spacing — 4px base, allowed steps only

`1`=4 `2`=8 `3`=12 `4`=16 `6`=24 `8`=32 `12`=48 `16`=64 `24`=96 `32`=128 `42`=168.
Section padding must vary (§5.9): Hero `pb-42`, Problem `py-14` (56px), Features `py-32`, Runners `py-24`, Install `py-32`, Footer `py-16`.
Container: `max-w-page` (1280px), `px-8` desktop / `px-5` mobile, 12-col grid with `gap-6` (24px).

## Texture + motion

`grid-bg` — engineering grid with radial mask. **Hero and Install only.**
`grain` — already on `<body>` in `layout.tsx`. Never add it again.
`rise` — 320ms opacity + 8px translateY entrance, plays once. `rise-init` holds an element hidden until an IntersectionObserver adds `rise` (unobserve after firing — never re-arm on scroll-back). `prefers-reduced-motion` handled globally.
Durations: `duration-[120ms]` hover/focus, `duration-[180ms]` state, `duration-[320ms]` entrance. Easing vars `--ease-micro` / `--ease-entrance`.
Focus rings are automatic (`:focus-visible` → 2px accent outline). On accent fills add `focus-ring-neutral`.

## Do / don't

1. DO `<div className="rounded-lg border border-line-1 bg-bg-1 p-6">` — DON'T `rounded-2xl shadow-lg bg-neutral-900`. No elevation shadows, no radius over 8px, no stock palette.
2. DO hover as `hover:bg-bg-3 hover:border-line-1` (one background step, one border step) — DON'T `hover:scale-105`, `hover:-translate-y-1`, or any glow. Cards never lift.
3. DO `<span className="text-label">7 runners · 21 platform targets</span>` — DON'T hand-roll `text-[11px] uppercase tracking-[0.14em] font-mono`. Use the scale class so mobile sizes and colors stay in sync.
