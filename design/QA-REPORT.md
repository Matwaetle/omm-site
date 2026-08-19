# omm-site — anti-AI QA audit

Audited: dev server `http://localhost:3000`, commit `b942ccf`, viewport 1280x800 and 375x812.
Sources of truth: `design/DIRECTION.md` §3/§4/§5, `design/FACTS.md`,
`D:\Desktop\오픈소스 개발자 프로젝트\omm-hippo\README.md` + `src/omm/`.

Method: source grep, live `document.styleSheets` rule scan (361 rules, 0 CORS failures),
live DOM measurement, and line-by-line cross-check of every rendered numeral against the
omm source tree. Screenshot was not used (pane not rendered in this environment).

**Counts — CRITICAL 5 · MAJOR 5 · MINOR 7. Verdict: FIX-FIRST.**

---

## §5 anti-AI checklist — machine-verified result

| # | Rule | Result |
|---|---|---|
| 1 | No `background-clip: text` | **PASS** — 0 hits in all loaded stylesheets |
| 2 | No color-to-color gradients | **PASS** — only `.grid-bg` (line-2 → transparent + `mask-image` radial), `.grain` data-URI, hero `--accent-wash` → transparent, terminal `mask-image` |
| 3 | Max radius 8px | **PASS** — 12 offending corners, all 4 corners x 3 terminal dots (`Terminal.tsx:328-330`), the sanctioned exception. No `rounded-xl/2xl/3xl` in `src/` |
| 4 | Palette lock | **PASS** — no hex/rgb/hsl in `.tsx` except `#000` inside two `mask-image` stops (`Terminal.tsx:218`), which is a mask alpha, not a color. Zero hue 250–300. All neutrals R===G===B |
| 5 | No glass / elevation shadows | **PASS** — `backdrop-filter` count 0, `box-shadow` count 0 |
| 6 | Two font families only | **PASS** — network shows 3 `.woff2` (Archivo variable + JetBrains 400/500). `Inter` appears nowhere. `__nextjs-Geist` in `document.fonts` is the **dev overlay only** — re-verify absent in `next build` output |
| 7 | No emoji, no icon-cards | **PASS** — full unicode sweep of `src/` finds only `→` inside code comments. `Ω` in the terminal is real omm output (`cli.py:3745`) |
| 8 | Asymmetry measurable | **PASS** — hero copy −28.2%, problem −28.2%, feature rows −29.7 / +29.7 / −29.7 / +29.7 (alternating), install 0% (sanctioned by §4.6) |
| 9 | Density contrast | **PASS** — min 56px (`#problem`), max 168px (hero bottom), ratio 3.0x |
| 10 | Every number is real | **FAIL** — see C-02, C-03, C-04, C-05, M-01, M-03 |

Motion constants also verified against §3: `CHAR_MS 22`, `JITTER_MS 8`, `PAUSE_MS 380`,
cursor `600ms step-end`, `RUNS = 2` then hold (`Terminal.tsx:198-202, 205-212, 263-268`).
Reduced-motion path is correct: `reduced` forces `step = EVENTS.length` and the effect
returns before arming any timer (`Terminal.tsx:248-252`), plus `.omm-cursor { animation: none }`.

---

## CRITICAL

### C-01 — Install section forces 332px of horizontal page scroll (1048px on mobile)
`src/components/InstallTabs.tsx:126` — `<div className="mt-8 grid">`

The grid has no explicit track, so the single implicit column resolves to `max-content`.
Measured `grid-template-columns: 1404.58px`, driven by the un-wrappable Windows one-liner.
Both tabpanels become 1405px wide inside an 880px container.

Measured: `documentElement.scrollWidth` 1597 vs `clientWidth` 1265 → `maxScrollLeft = 332`.
At 375px: `scrollWidth` 1423 vs 375 → **1048px of horizontal scroll**, the whole page
draggable sideways. `overflow-x-auto` on the inner `<pre>` never engages because the track
above it grew instead. `#install` is the sole cause; hero's 48px bleed is correctly clipped
by `overflow-x-clip` (`Hero.tsx:13`) and contributes nothing.

**Fix:** `className="mt-8 grid grid-cols-[minmax(0,1fr)]"`.

### C-02 — Fabricated transfer speed rendered on the page
`src/components/Terminal.tsx:109` — `const SPEED_BPS = 41_800_000;`

Renders `41.8 MB/s` and the `ETA 0:00` derived from it (`Terminal.tsx:122,129`). No capture
in `FACTS.md` contains a speed, and `FACTS.md` §Banned forbids "any number not traceable to
the README, a real capture, or build-time API". A network speed is also machine- and
ISP-specific, which is exactly the class of number §5.10 exists to stop. This is the single
clearest AI-tell number on the page.

**Fix:** drop the `TransferSpeedColumn` and `EtaColumn` segments from `downloadLine()` and
render only the `#` bar + `DownloadColumn` — still faithful to `downloader.py:159-166`,
since a real capture may legitimately be quiet-mode. Or capture one real `omm install` run
and paste its numbers.

### C-03 — The same file is shown as three different sizes
- `4.4/4.4 GB` — terminal download line (`Terminal.tsx:128`, `TOTAL_BYTES / 1e9`)
- `4.37 GB` — `Problem.tsx:18`, `FeatureBudgetBar.tsx:20,65`
- `4.07 GB` — terminal `omm list` row (`Terminal.tsx:152`, `TOTAL_BYTES / 1024 ** 3`)
- `4.4 GB` again in the terminal's screen-reader label (`Terminal.tsx:234`)

The 4.07 figure is a faithful reproduction of a real omm defect (`cli.py:4369-4375` divides
by `1024**3` and labels the unit `GB`), and the code comment says so. But a visitor sees
"downloaded 4.4 GB" and then "4.07 GB" ten lines below, in the hero, with no explanation —
it reads as sloppy invented data, which is the opposite of the credibility this section buys.

**Fix (pick one):** (a) file the unit bug upstream and render `4.07 GiB` in the list block;
(b) end the terminal loop at the install summary and drop the `omm list` beat; (c) keep it
and add an `--ink-3` caption under the terminal naming the base-1024/base-1000 split.
Do not leave it unexplained.

### C-04 — The demo scan reports two runners as installed that were never captured
`src/components/Terminal.tsx:83` — `RUNNERS_DETECTED = ["Ollama", "LM Studio", "Jan"]`

The only sanctioned capture (`FACTS.md` §"Real `omm scan --no-color` capture") lists
**Ollama only**, and `+ 6 program(s) not installed`. `FACTS.md` explicitly sanctions
re-deriving *"available/budget"* while keeping *"CPU/GPU/OS/total-RAM identical"* — it does
not sanction inventing runner detection state. The fabrication then propagates: `+ 4
program(s)` (`Terminal.tsx:84,99`), the three `link` lines in the install summary
(`Terminal.tsx:139-141`), the `Links` column of `omm list` (`Terminal.tsx:150`), and the
three accent connectors + "linked" legend in `FeatureLinkDiagram.tsx:15-17`.

**Fix:** install LM Studio and Jan on the capture machine and re-run `omm scan` / `omm
install`, then paste. If that is not possible, add the sanction to `FACTS.md` explicitly
(with the reasoning) so the claim has a written provenance like every other number does.

### C-05 — Localfit copy contradicts its own declared source of truth
`src/components/Features.tsx:47-48` — "holds back 10% of total RAM — **never less than 1 GB**"

- `FACTS.md:46` and `omm-hippo/README.md` (Localfit paragraph): "keeps at least **2 GB**
  (or 10% of RAM)".
- `omm-hippo/src/omm/hardware.py:17`: `RAM_SAFETY_RESERVE_MIN_GB = 1.0`, used as
  `max(1.0, total * 0.10)` at `hardware.py:202-205`.

The site matches the **code**; the README (and therefore `FACTS.md`) is stale. This is not a
harmless mismatch: at 15.5 GB the floor is inert either way (10% = 1.55 GB), but on an 8 GB
machine the README promises 2.0 GB reserve while omm reserves 1.0 GB — and the rendered
`Reserved for apps/OS 1.6 GB+` / `Safe model budget 8.2 GB` pair is only arithmetically
correct under the 1.0 GB floor.

**Fix:** correct README ~line 145-149 upstream to "at least 1 GB", then update `FACTS.md:46`.
Until that lands the site is asserting something its cited source denies.

---

## MAJOR (AI-tell / unsourced)

### M-01 — "21 PLATFORM TARGETS" does not match the table under it
`src/components/Runners.tsx:82`

DOM count of automated chips: **18** (3+3+3+2+1+3+3). 21 is 7 runners x 3 platforms — the
total grid, not what is automated. Sitting directly above a table headed "Automated on", it
reads as a claim of 21 automated targets. DIRECTION §4.5 proposed the string, but §5.10
outranks it.

**Fix:** `7 runners · 18 automated targets` (or `7 runners · 3 platforms`).

### M-02 — `--ink-3` fails WCAG AA everywhere it is used as text
Computed ratios: ink-3 on bg-0 **2.96:1**, on bg-1 **2.82:1**, on bg-2 **2.68:1** (AA needs
4.5:1 for text this size). `.text-label` is 11px, so the 3:1 large-text allowance does not
apply — and it misses even that on bg-1/bg-2.

Affected: every eyebrow (`text-label`), `Runners.tsx:142` `—` cells, `Install.tsx:59` step
numbers, `FeatureBenchTable.tsx:135` footnote, `FeatureCatalogDiff.tsx:87` caption, all
terminal dim output. ink-1 (11.11:1), ink-2 (5.73:1), accent (10.81:1) all pass.

**Fix:** lift `--ink-3` to about `#767676` (4.5:1 on bg-0) and introduce a separate
non-text-only step for the terminal dots/rules, or restrict ink-3 to decorative glyphs.

### M-03 — `TOTAL_BYTES` has no written provenance
`src/components/Terminal.tsx:108` — `4_368_439_584`. It is the real HF byte size of
`mistral-7b-instruct-v0.2.Q4_K_M.gguf`, and it feeds `4.37 GB` in `Problem.tsx:18`,
`FeatureBudgetBar.tsx:20`, and the whole download line. But `hub.py` `CURATED_INDEX` stores
only `(repo_id, filename)` — no size — so nothing in the repo or `FACTS.md` backs it.

**Fix:** add the byte count and its source (HF file listing, retrieval date) to `FACTS.md`.

### M-04 — Footer is missing the build-time commit short-SHA
DIRECTION §4.7 requires the bottom row to carry "repo path, license, and the build's commit
short-SHA (real, injected at build time)". `Footer.tsx:98-101` renders only the first two.
The SHA is the footer's only verifiable-at-a-glance detail; without it the row is decoration.

**Fix:** inject `process.env.VERCEL_GIT_COMMIT_SHA ?? git rev-parse --short HEAD` at build
time and render it, or delete the row rather than half-implement §4.7.

### M-05 — Entrance motion is specified, built, and never wired up
`src/app/globals.css:292-318` defines `@keyframes omm-rise`, `.rise`, `.rise-init` and the
reduced-motion override, with a comment describing an IntersectionObserver. Grep of `src/**
/*.tsx`: **zero** usages, and no IntersectionObserver exists anywhere. Nothing on the page
animates in. Dead CSS shipped to every visitor plus an unimplemented §3 requirement.

**Fix:** either implement the once-only observer (§3: opacity 0→1 + `translateY(8px→0)`,
320ms, never re-armed on scroll-back) or delete the three rules.

---

## MINOR (polish / copy)

### m-01 — Broken sentence in the budget bar legend
`src/components/FeatureBudgetBar.tsx:91-92` — "Install cap — 80% of total, whichever is
smaller". "Whichever is smaller" has nothing to compare against inside its own row; the
min() happens between this cap and the live figure, which lives in a different row.
**Fix:** label this row `Install cap — 80% of total RAM` and put the min() in the
`Safe model budget` row: `Safe model budget — the smaller of the two`.

### m-02 — Dangling antecedent in the Localfit body
`src/components/Features.tsx:48-49` — "The safe budget is whichever is smaller: **that live
figure**, or 80% of total RAM." The preceding sentence describes the *reserve*, never
introduces a "live figure". **Fix:** "…whichever is smaller: what is left after that
subtraction, or 80% of total RAM."

### m-03 — Four extra `<h2>` in the footer
`src/components/Footer.tsx:78` renders column titles ("Docs", "Commands", "Project",
"Source") as `<h2>`, the same rank as every section headline, so the document outline shows
12 h2s of which a third are navigation labels. **Fix:** `<p className="text-label">` or
`<h3>` scoped inside the labelled `<nav>`.

### m-04 — `aria-live` on the button element itself
`src/components/HeroCommand.tsx:34` puts `aria-live="polite"` on the `<button>`, so the live
region and the accessible name are the same node — some screen readers announce a name
change instead of a status. `InstallTabs.tsx:157` does it correctly (inner `<span>`).
**Fix:** move it to a `<span>` wrapping `{copied ? "copied" : "copy"}`.

### m-05 — Third size unit in the terminal's screen-reader label
`src/components/Terminal.tsx:234` — "downloads a 4.4 GB quantised Mistral 7B". Sighted users
read 4.37 in three places. **Fix:** align with whatever C-03 settles on.

### m-06 — Jan's path is shown flat, but omm nests per model
`FeatureLinkDiagram.tsx:17` and `Problem.tsx:23` show
`~/.config/Jan/data/llamacpp/models`. `linker.py:1500` returns that dir, but the module
docstring (`linker.py:18`) notes models land under
`<jan data>/llamacpp/models/<model_id>/` — a bare dropped `.gguf` is not picked up.
Every other path on the page is exact, so this one is worth matching. **Fix:** append
`/<model_id>/` in the diagram, or footnote it.

### m-07 — Hero terminal's right border is invisible at 1280 with a scrollbar
Measured terminal right edge 1281 vs `clientWidth` 1265: the 48px bleed is exactly right
(container content edge 1233 + 48), but 16px of it — including the window's right hairline —
is clipped by `overflow-x-clip`. §4.2 wants it to "read as a window", and a window with no
visible right edge reads as a full-bleed panel instead. **Fix:** reduce the bleed to
`lg:-mr-6` (24px) or let the page reserve gutter space, then re-measure at 1280 and 1440.

---

## Verified-clean (no action)

- All 8 benchmark rows are **verbatim** from `omm-hippo/src/omm/data/quality-pack-v1.json`
  (pack_id, pack_version 1.1.0, item ids, prompts EN and KO, expected answers 18/3/70000/
  540/20/64/260/160). `temperature 0, seed 0` matches the pack's `generation` block exactly.
- Catalog diff: `artifact_sha256 a07e9a…11fa` and `signed_at 2026-08-19T03:43:59Z` are
  verbatim from `omm-hippo/published/recommend-model.manifest.json`. The `<fingerprint>` /
  `<base64 ed25519 public key>` placeholders are the right call.
- Every runner directory in `FeatureLinkDiagram` / `Problem` traces to `linker.py`
  (`:102`, `:95`, `:1500`, `:1483`, `:1650`, `:1710` + `:1667`, `:1746`).
- Terminal output strings trace to `cli.py:3032` (checksum), `:3745` (`Ω Installed`),
  `:3750`, `:3751`, `:4363-4376`; the ASCII `#` bar to `downloader.py:107-128`.
- Install commands and both caveats are verbatim from README / `FACTS.md:50-54`.
  `Windows 10 22H2` traces to README line 28.
- `v0.2.106` matches `omm-hippo/pyproject.toml`.
- Nav anchors `#problem` `#features` `#runners` `#install` all resolve. Exactly one `<h1>`.
  No control lacks an accessible name. Zero console errors.
- Copy tone: no banned string (`supercharge`, `seamless`, `effortless`, `unlock`,
  `revolutionize`, `game-chang`, `blazing`, `next-level`, `powerful yet simple`), no benefit
  verbs, no invented adoption claim. No Konglish beyond m-01/m-02.

---

## Verdict

**FIX-FIRST.** C-01 alone is disqualifying — the page scrolls sideways by 332px on desktop
and nearly three viewport widths on mobile. C-02 through C-05 each put a number on screen
that the site's own provenance rules forbid, on a page whose entire argument is that its
numbers are real. The design system itself is clean: 9 of the 10 §5 rules pass on
machine verification, and §5.10 is the only failure.
