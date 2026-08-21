# omm landing site — design direction

Research basis: raw HTML + compiled CSS bundles pulled from all ten reference sites
(`payloadcms.com`, `supabase.com`, `dub.co`, `appwrite.io`, `plane.so`, `penpot.app`,
`posthog.com`, `infisical.com`, `formbricks.com`, `coolify.io`). Findings below are from
actual declarations in those files, not from screenshots.

---

## 1. Reference findings

**payloadcms.com** — Untitled Sans (commercial grotesque) + GeistMono, declared as
`--font-body` / `--font-geist-mono`. Palette is a **perfectly desaturated** 21-step neutral
ramp (`--color-base-0: rgb(255,255,255)` … `--color-base-950: rgb(7,7,7)`, every step
`rgb(N,N,N)`), plus narrow semantic families: blue `#007fae`, orange `#f4ac4f`. Radii are tiny
— `1px`, `3px`, `4px`, `.25rem`, `.5rem`. Signature move: **a tiled `noise.png` overlay**
(`.Payload3D_noise`, `.HoverCards_noiseWrapper`) laid over surfaces at z-index 5. Steal: the
zero-tint neutral ramp and the grain layer.

**dub.co** — Three-face system: Satoshi (display sans), **Rowan (serif)** for editorial
accents, GeistMono for code. Radii ladder from `.125rem` to `.75rem` with asymmetric corner
cuts (`border-radius: 0 0 0 6px`). Signature move: **per-logo `--accent-color` custom property**
(`#00AEEF`, `#20808D`, `#FF6154`, `#FCBC32` …) so the customer wall carries each brand's real
color instead of being grayscaled. Steal: a serif cameo inside an otherwise sans/mono system.

**supabase.com** — Inter + Manrope + Source Code Pro + Office Code Pro. Entire palette is
**relational oklch** (`--border: oklch(from var(--foreground) …)`), so every border is derived
from foreground rather than hand-picked. Radii go to `1.5rem`. Steal: derive borders from
foreground with alpha instead of authoring separate border hexes. Do **not** steal the green.

**appwrite.io** — Aeonik Pro + Inter. Signature move: an inline
`<feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="3" stitchTiles="stitch" seed="0">`
filter — fine-grain film noise generated in-page, no image request. Hero headline ends in a
blinking underscore: "Build faster and scale bigger than ever _". Steal: both, literally.

**plane.so** — Ships ~200 self-hosted `.otf`/`.woff2` faces (Framer-built). Copy is the asset:
"Every setting versioned, reviewed, and deployed from your terminal." and "Two Fortune 10
companies chose Plane for their Jira migration." Steal: **headlines that state a verifiable
fact**, not a benefit.

**penpot.app** — Work Sans from Google Fonts, loaded with a full italic + 400–800 axis set.
H1 "Think and build digital products. Together." Proof that a single Google face with a wide
weight range reads as a designed system when the weight range is actually used.

**posthog.com** — Deliberately anti-corporate type stack: RoundHog (custom), IBM Plex Sans,
Source Code Pro, plus `Comic Sans MS`, `Impact`, `Fairytale`, `Computer Modern` as real
declared families. Steal the principle only: **one intentionally "wrong" typographic
moment** beats ten tasteful ones.

**infisical.com** — `alliance` (display) + **JetBrains Mono** + Poppins. Near-monochrome with
exactly one accent: acid yellow-green `rgba(231,242,86,…)`, used as a `--color-from`/`--color-to`
glow and as `--tw-ring-color: rgb(231 242 86 / 0.5)`. Signature move: low-frequency
`feTurbulence baseFrequency="0.005"` fractalNoise used as an **atmospheric haze**, not grain.
Headline: "Everyone has secrets. We secure 10 Billion every day." Steal: one unexpected warm
accent + a real number in the sub-headline.

**formbricks.com** — Jost + Lexend + Poppins, `--radius: 0.5rem`, radii up to `3rem`. Uses
Shiki for syntax highlighting (`--shiki-color-text`). Cautionary reference: three similar
geometric sans faces cancel each other out. Avoid.

**coolify.io** — Almost no CSS at all; the only declared family is `ui-monospace, monospace`.
H1 "Self-hosting with superpowers", then an 18-block feature grid and a Cloud-vs-Self-hosted
comparison. Steal: the confidence to run near-system type and let density do the work.

**Cross-site craft detail worth stealing:** every one of them fades content edges with
`mask-image: linear-gradient(...)` rather than a colored overlay —
`mask-image:linear-gradient(180deg,black calc(100% - 80px),transparent calc(100% - 32px))`,
`mask-image:linear-gradient(135deg,black,transparent 70%)`. Use this for the terminal scroll
edge, the runner marquee, and the grid texture falloff.

---

## 2. omm design direction

**The vibe, in one sentence: an amber-phosphor terminal rendered with the restraint of a
type-specimen sheet — pure black-to-white neutrals, one warm amber signal, hairline rules,
and real command output treated as the hero image.**

Committed, not optional: dark-only (no light theme, no theme toggle). Payload's zero-tint
neutral ramp, Infisical's single-warm-accent discipline, Coolify's density, Appwrite's
in-page feTurbulence grain. Explicitly **not** Supabase green, not glass, not gradients.

---

## 3. Design tokens

### Palette

```css
:root {
  /* background layers — zero chroma, no blue tint (this is the anti-AI move) */
  --bg-0:   #0A0A0A;  /* page */
  --bg-1:   #111111;  /* raised surface: terminal body, table */
  --bg-2:   #171717;  /* terminal title bar, table header, zebra row */
  --bg-3:   #1F1F1F;  /* hover / pressed */

  /* text layers */
  --ink-0:  #F4F4F4;  /* display + h2 */
  --ink-1:  #C2C2C2;  /* body */
  --ink-2:  #8A8A8A;  /* secondary, captions */
  --ink-3:  #5C5C5C;  /* labels, disabled, terminal dim output */

  /* lines */
  --line-0: #212121;  /* default hairline */
  --line-1: #2E2E2E;  /* emphasized hairline, focus ring base */
  --line-2: rgba(244,244,244,0.06); /* derived-from-foreground rule (supabase trick) */

  /* accent — exactly one */
  --accent:       #FFB000;
  --accent-press: #D89400;
  --accent-ink:   #0A0A0A;  /* text on accent fills */
  --accent-wash:  rgba(255,176,0,0.09);
  --accent-line:  rgba(255,176,0,0.32);

  /* terminal-only signal colors — forbidden outside the terminal component */
  --term-ok:   #5BD98A;
  --term-warn: #FFB000;
  --term-err:  #F2645A;
}
```

**Accent rationale:** `#FFB000` is amber-phosphor — the actual color of DEC VT-series amber
CRTs. It is warm (every AI-generated dark site is cold blue/violet), it is not on any
competitor's palette, it reaches ~11:1 against `#0A0A0A`, and it means something for a CLI
product instead of being decoration. Purple, violet, indigo, cyan and Supabase-green are
banned from the stylesheet.

### Fonts

| Role | Family | Loaded via | Weights / axes |
|---|---|---|---|
| Display + UI + body | **Archivo** | `Archivo` | variable 400/500/600/700, `wdth` 87–100 |
| Mono / terminal / labels | **JetBrains Mono** | self-hosted `localFont`, `src/fonts/` | 400, 500, 700 |
| Hangul fallback only (`/ko`) | **Noto Sans KR** | `Noto_Sans_KR` | 400, 500, 600, 700, `preload: false` |

Archivo (Omnibus-Type) is an industrial grotesque with a tall x-height and closed apertures —
it reads engineered at 76px and stays legible at 16px, so it carries the whole page. Its
`wdth` axis at 90 gives the hero a slightly condensed, plated-metal feel that Inter cannot do.
JetBrains Mono is the font a large share of the audience already has open in their editor,
which is exactly why the terminal should be set in it; it is served from `src/fonts/` rather
than from Google because the Google latin subset drops the box-drawing block the terminal
tables need. **Inter is not permitted anywhere.**

**Hangul exception (added with `/ko`).** Neither Archivo nor JetBrains Mono ships Hangul, so
the Korean pages would otherwise fall through to whatever the OS picks. Noto Sans KR is added
as the *last* named family in both stacks, never the first:

```css
--stack-sans: var(--font-archivo), var(--font-noto-kr), system-ui, sans-serif;
--stack-mono: var(--font-jetbrains), var(--font-noto-kr), ui-monospace, monospace;
```

Latin letters, digits, punctuation and the box-drawing block all exist in the first family, so
they never reach Noto and the English pages — and every terminal capture on both — render
byte-identically to before. This is the only permitted third family, it is loaded with
`preload: false`, and it must never be named first in a stack or used for Latin text.

**`:lang(ko)` type corrections** (in `globals.css`, never per component): the scale's negative
tracking is drawn for Archivo's Latin apertures and collapses Hangul syllable blocks, and the
0.94 display leading leaves no room for the taller Hangul glyph box. Korean therefore overrides
tracking (`display` −0.01em, `h2`/`h3`/`lede` 0, `label` +0.06em) and leading (`display` 1.08,
`h2` 1.25, `h3` 1.4, `lede` 1.65, `small` 1.6, body 1.7). Sizes are unchanged, so the measure
and the grid stay identical. Korean also sets `word-break: keep-all` with
`overflow-wrap: anywhere` — Hangul has no intra-word spaces, so the default rules split tokens
mid-word — and `pre`/`code` opt back out so literal output scrolls instead of wrapping.

### Type scale (px, desktop → mobile)

```
display   76/70 lh 0.94  ls -0.035em  Archivo 600 wdth 90   → 42/42 lh 1.0
h2        40    lh 1.06  ls -0.022em  Archivo 600           → 30
h3        22    lh 1.25  ls -0.012em  Archivo 600           → 20
lede      19    lh 1.55  ls -0.005em  Archivo 400  ink-1    → 17
body      16    lh 1.62               Archivo 400  ink-1
small     14    lh 1.5                Archivo 400  ink-2
label     11    lh 1.0   ls +0.14em   JetBrains 500 UPPER ink-3
terminal  13.5  lh 1.62               JetBrains 400
table     13    lh 1.45               JetBrains 400
```

### Spacing rhythm

4px base. Allowed steps only: `4 8 12 16 24 32 48 64 96 128 168`.
**Density contrast is mandatory** — section vertical padding must not be uniform:
Hero `168` bottom, Problem strip `56` (deliberately cramped), Features `128`,
Runners `96`, Install `128`, Footer `64`. Grid: 12 columns, 1280px max, 24px gutters,
32px page margin desktop / 20px mobile.

### Radius

`--r-sm: 3px` (badges, inline code, checkboxes) · `--r-md: 5px` (buttons, inputs, tabs) ·
`--r-lg: 8px` (terminal window, panels). **8px is the hard ceiling.** No `border-radius:
9999px` except the three terminal traffic-light dots. No `rounded-2xl` anywhere.

### Borders

Default `1px solid var(--line-0)`. Emphasis `1px solid var(--line-1)`. For anything overlaying
a texture use `box-shadow: inset 0 0 0 1px var(--line-2)` so the rule stays sub-pixel-crisp.
Section boundaries are **full-bleed 1px rules** edge-to-edge, not container-width. No box
shadows for elevation anywhere on the page — depth comes from `--bg-0/1/2/3` only.

### Noise / texture recipe (CSS-only)

```css
/* grain — appwrite's trick, inlined. Apply to <body>::after, fixed, pointer-events:none */
.grain::after{
  content:""; position:fixed; inset:0; z-index:60; pointer-events:none; opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* engineering grid — hero + install only, never full page */
.grid-bg{
  background-image:
    repeating-linear-gradient(90deg, var(--line-2) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(0deg,  var(--line-2) 0 1px, transparent 1px 64px);
  mask-image: radial-gradient(120% 80% at 50% 0%, #000 0%, transparent 72%);
}
```

Permitted gradients: neutral-to-transparent `mask-image` fades, and one `--accent-wash`
radial behind the terminal at ≤9% alpha. **Color-to-color gradients are banned.**

### Motion

Durations `120ms` (hover, focus), `180ms` (tab/state change), `320ms` (in-view entrance).
Easings: entrance `cubic-bezier(0.2, 0, 0, 1)`, micro `cubic-bezier(0.4, 0, 0.2, 1)`.
Entrance is opacity `0→1` plus `translateY(8px→0)` — 8px, not 24px — fired once, never on
scroll-back. Terminal typing: 22ms/char with ±8ms jitter, 380ms pause between commands,
600ms cursor blink (step-end, not fade).

**Never animates:** the H1 (no letter/word reveal), numbers (no count-up), backgrounds (no
drifting blobs), the grain, gradients (no shimmer/sweep), cards (no lift, scale, tilt, or
glow on hover — hover changes background one step and border one step, that is all). No
parallax, no scroll-jacking, no marquee except the runner strip. Under
`prefers-reduced-motion: reduce`, the terminal renders its final frame immediately and all
entrance animations become instant.

---

## 4. Section-by-section art direction

### 4.1 Nav

56px tall, sticky, `--bg-0` at 92% with **no backdrop-blur** (opaque-ish, not glass), single
`--line-0` rule underneath. Layout is left-heavy, not centered: wordmark `omm` in JetBrains
Mono 500 lowercase, immediately followed by a 3px-radius version chip `v0.x` in `--ink-3`;
then nav links (Problem · Features · Runners · Install · Docs) at `small`, `--ink-2`, hover
→ `--ink-0` with a 1px `--accent` underline drawn in 120ms. Far right: a GitHub star count
(fetched at build time — real number or omit the element) and one accent-filled button
`Install` at `--r-md`. No hamburger animation on mobile; the menu is a full-width panel that
appears, no slide.

### 4.2 Hero

Asymmetric 12-col split: copy occupies cols 1–5, terminal occupies cols 6–12 and **bleeds
past the right container edge by 48px** so it reads as a window, not a card. `.grid-bg`
behind, faded by the radial mask. Nothing is centered.

Copy tone: state what the tool does and one true constraint. Engineer-written means specific
nouns, no verbs like "supercharge", "seamless", "effortless", "unlock".

> **Example H1 (pick one, do not blend):**
> "One hub for your GGUF files. Seven runners linked automatically."
> "Stop keeping four copies of the same 7B model."

Lede: one sentence naming the seven runners by name. Then two CTAs: a solid accent button
`Install omm`, and a mono one-liner `curl -fsSL …/install.sh | sh` inside a `--bg-2` field
with a copy button — the command is the second CTA, no ghost button.

**Terminal window spec.** `--bg-1` body, `--r-lg` (8px), `1px solid --line-1`, title bar 34px
at `--bg-2` with a bottom hairline. Three 8px dots at `--ink-3`/`--line-1` — grey, not
red/yellow/green (that macOS cliché is an AI tell). Title bar center-left text:
`ahseo@workstation: ~` in JetBrains Mono 11px `--ink-3`; right side a tiny live `● rec`-style
label is banned — instead show the shell name `pwsh 7.4`. Body padding 20px, `terminal`
type scale, bottom edge faded with
`mask-image: linear-gradient(180deg,#000 calc(100% - 56px), transparent calc(100% - 16px))`.
Prompt glyph `$` (or `PS >` on the Windows tab) in `--accent`, command text `--ink-0`,
output `--ink-1`, secondary output `--ink-3`. Block cursor `10x18px` solid `--accent`.

**Exact command sequence to fake** (four beats, ~14s loop, then hold on the final frame —
do not auto-restart more than twice):

```
$ omm scan
  os        Windows 11 26200 · x86_64
  cpu       16 cores
  ram       31.7 GiB total · 12.4 GiB safe budget
  gpu       NVIDIA RTX 4070 · 8.0 GiB VRAM
  runners   3 of 7 detected — ollama, lmstudio, jan

$ omm install qwen2.5-7b-instruct-q4_k_m
  resolve   curated → huggingface
  fit       4.37 GiB model vs 12.4 GiB budget         ok
  download  ████████████████████░░░░  81%  · 4.37 GiB
  checksum  verified
  link      ollama            ~/.ollama/models        hardlink
  link      lmstudio          ~/.lmstudio/models      hardlink
  link      jan               ~/jan/models            symlink
  link      anythingllm       not installed           skipped
  link      msty              not installed           skipped
  link      textgen-webui     not installed           skipped
  link      koboldcpp         not installed           skipped
  done      1 model · 3 runners linked · 0 bytes duplicated

$ omm list
  NAME                          SIZE      LINKED
  qwen2.5-7b-instruct-q4_k_m    4.37 GiB  ollama, lmstudio, jan
```

`ok` and `verified` in `--term-ok`; `skipped` in `--ink-3`; the progress bar in `--accent`
with `--line-1` track. **Before launch, replace every number above with a capture from a real
`omm scan` / `omm install` run** — the checklist in §5 enforces this.

### 4.3 Problem strip

Deliberately dense and short: 56px vertical padding, full-bleed `--line-0` rules top and
bottom, `--bg-1` background so it reads as an inset band. Asymmetric 5/7 split — left column
is two short sentences at `body`; right column is a raw `ls -la`-style listing in mono showing
the same model file duplicated across four runner directories with sizes, and a total line.
No icons, no illustration.

> **Example headline:** "Four runners. Four copies. 17.5 GiB of the same weights."
> **Example headline:** "Your disk is a model registry with no index."

Tone: describe the mess factually. Do not use the word "pain" or "nightmare".

### 4.4 Features (4)

No icon cards. No 3-column grid. Alternating full-width rows, each 12-col with the text
block swapping sides (5/7, then 7/5), separated by full-bleed hairlines. Each row: `label`
eyebrow in mono, `h2`, two-sentence body, and one **purpose-built visual**:

1. **Central hub, automatic links** — an SVG link diagram: `~/.omm/models/<name>.gguf` on the
   left, seven runner paths on the right, joined by 1px `--line-1` orthogonal connectors
   (right-angle, not curves); the three connected paths' lines are `--accent-line`, the four
   unconnected ones dashed `--line-0`. Static, no animation.
2. **Fit before download** — a horizontal budget bar in mono: total RAM, the live in-use
   subtraction, the 2 GiB / 10% OS reserve, and the remaining safe budget, each segment a
   different neutral step with the model's footprint marked by a 1px `--accent` tick.
   Numbers come from README's Localfit description.
3. **Benchmarks, not vibes** — a real data table (13px mono, zebra `--bg-1`/`--bg-2`, header
   `--bg-2` + hairline): the versioned eight-item bilingual arithmetic smoke pack, columns
   `#`, `prompt`, `answer`, `correct`, `median ms`. Table is the visual. Add a `--ink-3`
   footnote: "Eight items. Not a leaderboard."
4. **Signed data, reversible catalogs** — a diff-style block showing a catalog snapshot being
   replaced and `omm setting catalog-rollback` restoring it, with the Ed25519 manifest line
   rendered as verbatim CLI output.

> **Example headlines:** "One file on disk. Seven runners think they own it."
> "It checks whether the model fits before it spends your bandwidth."

### 4.5 Runners

**Not a logo grid.** Render the README's coverage table verbatim as the section's centerpiece
— 13px JetBrains Mono, three columns (Runner · Automated on · Manual elsewhere), full-bleed
hairline rows, no vertical rules, no cell backgrounds except a `--bg-1` header. Platform
names as small mono chips (`macOS` `Linux` `Windows`) at `--r-sm` with `--line-1` borders;
`—` rendered in `--ink-3`. Runner names in Archivo 500 `--ink-0` so the one sans column
anchors the mono grid. Above the table, one line of `label`-scale mono: `7 RUNNERS · 21
PLATFORM TARGETS`. Optional single row of monochrome runner wordmarks below at `--ink-3`,
40px tall, in one horizontal strip with `mask-image` fades at both edges — grayscale, no
cards, no hover color.

> **Example headline:** "omm links into these seven. It does not replace any of them."

### 4.6 Install

`.grid-bg` returns here to bookend the hero. Centered container is acceptable in exactly this
one section (installation instructions earn symmetry), max width 880px. OS tabs as a
segmented control: `macOS / Linux` and `Windows`, `--r-md`, 1px `--line-1`, active tab
`--bg-2` with a 2px `--accent` bottom edge; tab switch is a 180ms crossfade with **no height
animation** (reserve max height). Command block is `--bg-1`, `--r-lg`, mono, with a copy
button that changes label to `copied` for 1.2s — no toast, no checkmark icon.

Include the real README caveats as `--ink-2` footnotes under each tab — the Windows TLS
pre-line, "open a new shell so `PATH` picks up `omm`", and the Python 3.10+ requirement. Below
the tabs, a three-item mono list of what the installer actually does (staging clone, signed
commit verification against the bootstrap trust anchor, pipx switch). That verifiable detail
is the section's credibility.

> **Example headline:** "One line. It verifies the signed commit before it installs anything."

### 4.7 Footer

Dense, 64px padding, top full-bleed hairline, `--bg-0`. Four columns at `small`/`--ink-2`:
Docs · Commands · Project (Contributing, Code of Conduct, Security, Third-party notices) ·
Source. Left of the columns, the `omm` wordmark in mono and one line: `MIT · Python 3.10+ ·
Windows, macOS, Linux`. Bottom row in `label` scale `--ink-3`: repo path, license, and the
build's commit short-SHA (real, injected at build time). No newsletter form, no social icon
row, no "Made with ❤️".

---

## 5. Anti-AI checklist (QA-verifiable)

1. **No gradient text.** `background-clip: text` and `-webkit-background-clip: text` appear
   zero times in the compiled CSS.
2. **No color-to-color gradients.** Every `linear-gradient` / `radial-gradient` in the bundle
   either targets `mask-image` or interpolates a single color to `transparent`.
3. **Max radius 8px.** No computed `border-radius` exceeds 8px, except the three 8px terminal
   dots and any `border-radius: 50%` on them. Grep the build output for `rounded-2xl`,
   `rounded-3xl`, `rounded-full`, `1rem`, `1.5rem`, `9999px` → zero hits in component code.
4. **Palette lock.** No hex, `rgb()`, or `hsl()` outside the token block in §3. Specifically:
   zero occurrences of purple/violet/indigo hues (hue 250–300), and every neutral satisfies
   `R === G === B`.
5. **No glass, no elevation shadows.** `backdrop-filter` count is zero. `box-shadow` is used
   only as `inset 0 0 0 1px` hairlines and for `:focus-visible` rings — no offset/blur shadow
   anywhere.
6. **Two font families only** — three on `/ko`, where Noto Sans KR is loaded as the Hangul
   fallback and appears last in both stacks (see §3). On the unprefixed English pages the
   network panel still loads exactly Archivo and JetBrains Mono. The string `Inter` does not
   appear in the codebase.
7. **No emoji, no generic icon-cards.** Zero emoji characters in JSX/content. No component
   renders a repeated `{icon, title, body}` tuple in a 3-column grid.
8. **Asymmetry is measurable.** At ≥1024px, at least three sections have their primary content
   block off-center (its horizontal midpoint differs from the container midpoint by >5%),
   and the four feature rows alternate side.
9. **Density contrast.** Section vertical paddings are not all equal: the smallest is ≤56px
   and the largest is ≥128px, a ratio of at least 2.3×.
10. **Every number is real.** Each numeral rendered on the page traces to the README, an
    actual `omm` run captured on a real machine, or a build-time API value (GitHub stars,
    commit SHA). No invented benchmarks, no "10,000+ developers", no percentage without a
    method. Banned copy strings, checked by grep: `supercharge`, `seamless`, `effortless`,
    `unlock`, `revolutionize`, `game-chang`, `blazing`, `next-level`, `powerful yet simple`.
