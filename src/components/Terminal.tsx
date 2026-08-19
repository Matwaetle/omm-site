"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
 * Every string rendered below is reproduced from real omm output, not invented:
 *
 *  `omm scan` table   design/FACTS.md capture. Only "RAM (available)" and
 *                     "Safe model budget now" are re-derived (per the note in
 *                     FACTS.md) so the demo runs on a machine the model fits on.
 *  runner sub-table   same capture; box=None borderless rich table
 *                     (omm-hippo/src/omm/cli.py:923).
 *  download line      omm-hippo/src/omm/downloader.py:107-170 — rich Progress
 *                     with SpinnerColumn, the filename, an ASCII '#' bar
 *                     (_HashBar, deliberately not Unicode blocks), DownloadColumn
 *                     (base-1000 "GB"), TransferSpeedColumn and EtaColumn
 *                     ("ETA " + compact m:ss).
 *  checksum line      omm-hippo/src/omm/cli.py:3031-3032.
 *  install summary    omm-hippo/src/omm/cli.py:3745-3751. Runners that are not
 *                     installed are skipped silently (cli.py:2141-2155), which
 *                     is why only the three detected ones are listed.
 *  `omm list` table   omm-hippo/src/omm/cli.py:4363-4376 — rich default
 *                     HEAVY_HEAD box, title "omm models", columns
 *                     # / Filename / Size / Links, Filename in the accent style,
 *                     size printed as bytes/1024^3 with 2 decimals but labelled
 *                     "GB", Links as comma-joined engine labels.
 *  model id/filename  omm-hippo/src/omm/hub.py CURATED_INDEX.
 *  ollama tag         omm-hippo/src/omm/linker.py:833-842 sanitize_ollama_tag().
 * ------------------------------------------------------------------------- */

type Tone = "cmd" | "out" | "dim" | "ok" | "accent";
type Part = { t: string; tone: Tone };
type Line = Part[];

const TONE: Record<Tone, string> = {
  cmd: "text-ink-0",
  out: "text-ink-1",
  dim: "text-ink-3",
  ok: "text-term-ok",
  accent: "text-accent",
};

const BOX_RUN = /([─-╿]+)/;
const IS_BOX = /[─-╿]/;

/** Splits a rendered table row so the box-drawing rules sit a tone below the data. */
function boxed(text: string, tone: Tone = "out"): Line {
  return text
    .split(BOX_RUN)
    .filter((chunk) => chunk.length > 0)
    .map((chunk): Part => ({ t: chunk, tone: IS_BOX.test(chunk) ? "dim" : tone }));
}

const plain = (text: string, tone: Tone = "out"): Line => [{ t: text, tone }];
const rule = (ch: string, n: number) => ch.repeat(n);
const center = (text: string, width: number) =>
  " ".repeat(Math.max(0, Math.floor((width - text.length) / 2))) + text;

/* -- beat 1: omm scan ----------------------------------------------------- */

const SCAN_FIELD = 21; // widest field: "Safe model budget now"
const SCAN_VALUE = 33; // widest value: "Shared or unavailable from the OS"
const SCAN_WIDTH = SCAN_FIELD + SCAN_VALUE + 7; // 2 cells of padding + 3 rules

const SCAN_ROWS: readonly (readonly [string, string])[] = [
  ["OS", "Windows 11"],
  ["CPU", "Intel(R) Core(TM) Ultra 7 155H"],
  ["RAM (total)", "15.5 GB"],
  ["RAM (available)", "9.8 GB"],
  ["Safe model budget now", "8.2 GB"],
  ["Reserved for apps/OS", "1.6 GB+"],
  ["GPU", "Intel(R) Arc(TM) Graphics"],
  ["VRAM", "Shared or unavailable from the OS"],
];

const scanRow = (field: string, value: string): Line => [
  { t: `│ ${field.padEnd(SCAN_FIELD)} │ `, tone: "dim" },
  { t: value.padEnd(SCAN_VALUE), tone: "out" },
  { t: " │", tone: "dim" },
];

const RUNNER_COL = 9; // widest program label: "LM Studio"
const RUNNERS_DETECTED = ["Ollama", "LM Studio", "Jan"];
const RUNNERS_MISSING = 7 - RUNNERS_DETECTED.length;
const runnerRow = (program: string, status: string) =>
  ` ${program.padEnd(RUNNER_COL)}  ${status}`;

const SCAN_BLOCK: Line[] = [
  plain(center("omm hardware scan", SCAN_WIDTH), "dim"),
  boxed(`┌${rule("─", SCAN_FIELD + 2)}┬${rule("─", SCAN_VALUE + 2)}┐`),
  boxed(`│ ${"Field".padEnd(SCAN_FIELD)} │ ${"Value".padEnd(SCAN_VALUE)} │`, "cmd"),
  boxed(`├${rule("─", SCAN_FIELD + 2)}┼${rule("─", SCAN_VALUE + 2)}┤`),
  ...SCAN_ROWS.map(([field, value]) => scanRow(field, value)),
  boxed(`└${rule("─", SCAN_FIELD + 2)}┴${rule("─", SCAN_VALUE + 2)}┘`),
  [],
  plain(center("Local AI runners", RUNNER_COL + 2 + "installed".length + 2), "dim"),
  plain(runnerRow("Program", "Status"), "dim"),
  ...RUNNERS_DETECTED.map((program) => plain(runnerRow(program, "installed"))),
  plain(`+ ${RUNNERS_MISSING} program(s) not installed — see the compatibility list:`, "dim"),
  plain("https://github.com/omm-hippo/omm/wiki/Compatible-Programs", "dim"),
];

/* -- beat 2: omm install -------------------------------------------------- */

const MODEL_ID = "mistral-7b-instruct-q4";
const MODEL_FILE = "mistral-7b-instruct-v0.2.Q4_K_M.gguf";
const OLLAMA_TAG = "mistral-7b-instruct-v0.2.q4_k_m";
const TOTAL_BYTES = 4_368_439_584;
const SPEED_BPS = 41_800_000;
const BAR_WIDTH = 12;
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

const mmss = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function downloadLine(ratio: number, tick: number): Line {
  const filled = Math.min(BAR_WIDTH, Math.round(BAR_WIDTH * ratio));
  const done = (TOTAL_BYTES * ratio) / 1e9;
  const total = TOTAL_BYTES / 1e9;
  const eta = (TOTAL_BYTES * (1 - ratio)) / SPEED_BPS;
  return [
    { t: ratio >= 1 ? "  " : `${SPINNER[tick % SPINNER.length]} `, tone: "dim" },
    { t: MODEL_FILE, tone: "accent" },
    { t: " ", tone: "dim" },
    { t: rule("#", filled) + rule(" ", BAR_WIDTH - filled), tone: "accent" },
    { t: ` ${done.toFixed(1)}/${total.toFixed(1)} GB`, tone: "out" },
    { t: ` ${(SPEED_BPS / 1e6).toFixed(1)} MB/s ETA ${mmss(eta)}`, tone: "dim" },
  ];
}

const INSTALL_TAIL: Line[] = [
  plain("Verifying checksum..."),
  [{ t: `Ω Installed ${MODEL_FILE}`, tone: "ok" }],
  [
    { t: "  Ollama: ", tone: "out" },
    { t: `ollama run ${OLLAMA_TAG}`, tone: "ok" },
  ],
  plain("  LM Studio: visible in your local models list"),
  plain("  Jan: visible in your local models list"),
  [
    { t: "  Uninstall with: ", tone: "out" },
    { t: `omm uninstall ${MODEL_FILE}`, tone: "accent" },
  ],
];

/* -- beat 3: omm list ----------------------------------------------------- */

const LIST_LINKS = RUNNERS_DETECTED.join(", ");
/** cli.py divides size_bytes by 1024^3 but prints the unit as "GB". */
const LIST_SIZE = `${(TOTAL_BYTES / 1024 ** 3).toFixed(2)} GB`;
const LIST_COLS = [1, MODEL_FILE.length, LIST_SIZE.length, LIST_LINKS.length];
const LIST_WIDTH = LIST_COLS.reduce((sum, w) => sum + w + 3, 1);
const listRule = (left: string, mid: string, right: string, ch: string) =>
  left + LIST_COLS.map((w) => rule(ch, w + 2)).join(mid) + right;

const LIST_BLOCK: Line[] = [
  plain(center("omm models", LIST_WIDTH), "dim"),
  boxed(listRule("┏", "┳", "┓", "━")),
  boxed(
    `┃ ${"#".padStart(LIST_COLS[0])} ┃ ${"Filename".padEnd(LIST_COLS[1])} ┃ ` +
      `${"Size".padStart(LIST_COLS[2])} ┃ ${"Links".padEnd(LIST_COLS[3])} ┃`,
    "cmd",
  ),
  boxed(listRule("┡", "╇", "┩", "━")),
  [
    { t: `│ ${"1".padStart(LIST_COLS[0])} │ `, tone: "dim" },
    { t: MODEL_FILE, tone: "accent" },
    { t: " │ ", tone: "dim" },
    { t: LIST_SIZE.padStart(LIST_COLS[2]), tone: "out" },
    { t: " │ ", tone: "dim" },
    { t: LIST_LINKS.padEnd(LIST_COLS[3]), tone: "out" },
    { t: " │", tone: "dim" },
  ],
  boxed(listRule("└", "┴", "┘", "─")),
];

/* -- sequence ------------------------------------------------------------- */

type Event =
  | { k: "cmd"; text: string }
  | { k: "block"; lines: Line[]; delay: number }
  | { k: "download"; duration: number };

const EVENTS: Event[] = [
  { k: "cmd", text: "omm scan" },
  { k: "block", lines: SCAN_BLOCK, delay: 700 },
  { k: "cmd", text: `omm install ${MODEL_ID}` },
  { k: "download", duration: 2800 },
  { k: "block", lines: INSTALL_TAIL, delay: 620 },
  { k: "cmd", text: "omm list" },
  { k: "block", lines: LIST_BLOCK, delay: 260 },
];

const PROMPT = "PS > ";
const DOWNLOAD_TICKS = 40;
const CHAR_MS = 22; // ±8ms jitter, DIRECTION.md §3
const JITTER_MS = 8;
const PAUSE_MS = 380;
const RESTART_MS = 2600;
const RUNS = 2; // play, loop once, then hold the final frame

const CURSOR_CSS = `
@keyframes omm-cursor { 0% { opacity: 1 } 50% { opacity: 0 } }
.omm-cursor {
  display: inline-block;
  width: 1ch;
  height: 1.15em;
  vertical-align: text-bottom;
  background-color: var(--accent);
  animation: omm-cursor 600ms step-end infinite;
}
@media (prefers-reduced-motion: reduce) { .omm-cursor { animation: none } }
`;

const BODY_MASK =
  "linear-gradient(180deg, transparent 0, #000 40px, #000 calc(100% - 20px), transparent 100%)";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const noop = () => {};
const isServer = () => false;
const isClient = () => true;
const subscribeNever = () => noop;
const prefersReduced = () => window.matchMedia(REDUCED_MOTION).matches;
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const A11Y_LABEL =
  "Terminal recording. omm scan reports the machine and three installed runners; " +
  "omm install downloads a 4.4 GB quantised Mistral 7B and links it; " +
  "omm list shows the single file linked into Ollama, LM Studio and Jan.";

export default function Terminal() {
  const [rawStep, setStep] = useState(0);
  const [rawTick, setTick] = useState(0);
  const [run, setRun] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const started = useSyncExternalStore(subscribeNever, isClient, isServer);
  const reduced = useSyncExternalStore(subscribeReducedMotion, prefersReduced, isServer);

  // DIRECTION.md §3: under prefers-reduced-motion the terminal renders its
  // final frame immediately and no timer ever runs.
  const step = reduced ? EVENTS.length : rawStep;
  const tick = reduced ? 0 : rawTick;

  useEffect(() => {
    if (!started || reduced) return;
    const event = EVENTS[step];

    const advance = (delay: number) =>
      window.setTimeout(() => {
        setStep((s) => s + 1);
        setTick(0);
      }, delay);

    let timer = 0;
    if (!event) {
      if (run >= RUNS - 1) return;
      timer = window.setTimeout(() => {
        setRun((r) => r + 1);
        setStep(0);
        setTick(0);
      }, RESTART_MS);
    } else if (event.k === "cmd") {
      timer =
        tick < event.text.length
          ? window.setTimeout(
              () => setTick((t) => t + 1),
              CHAR_MS + (Math.random() * 2 - 1) * JITTER_MS,
            )
          : advance(PAUSE_MS);
    } else if (event.k === "block") {
      timer = advance(event.delay);
    } else {
      timer =
        tick < DOWNLOAD_TICKS
          ? window.setTimeout(() => setTick((t) => t + 1), event.duration / DOWNLOAD_TICKS)
          : advance(420);
    }
    return () => window.clearTimeout(timer);
  }, [started, reduced, step, tick, run]);

  const lines: Line[] = [];
  for (let i = 0; i <= step && i < EVENTS.length; i += 1) {
    const event = EVENTS[i];
    if (event.k === "cmd") {
      if (i > 0) lines.push([]);
      lines.push([
        { t: PROMPT, tone: "accent" },
        { t: i < step ? event.text : event.text.slice(0, tick), tone: "cmd" },
      ]);
    } else if (event.k === "block") {
      if (i < step) lines.push(...event.lines);
    } else if (i < step) {
      lines.push(downloadLine(1, 0));
    } else if (tick > 0) {
      lines.push(downloadLine(tick / DOWNLOAD_TICKS, tick));
    }
  }
  if (step >= EVENTS.length) {
    lines.push([], [{ t: PROMPT, tone: "accent" }]);
  }

  // Follow the newest line, exactly like a real scrollback buffer.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [step, tick]);

  const last = lines.length - 1;

  return (
    <div
      role="img"
      aria-label={A11Y_LABEL}
      className="relative overflow-hidden rounded-lg border border-line-1 bg-bg-1"
    >
      <style href="omm-terminal-cursor" precedence="default">
        {CURSOR_CSS}
      </style>

      <div className="flex h-[34px] items-center gap-2 border-b border-line-0 bg-bg-2 px-4">
        <span className="h-2 w-2 rounded-full bg-ink-3" />
        <span className="h-2 w-2 rounded-full bg-line-1" />
        <span className="h-2 w-2 rounded-full bg-line-1" />
        <span className="ml-3 font-mono text-[11px] text-ink-3">ahseo@workstation</span>
        <span className="ml-auto font-mono text-[11px] text-ink-3">pwsh 7.4</span>
      </div>

      <div
        ref={bodyRef}
        aria-hidden="true"
        className="h-[380px] overflow-x-auto overflow-y-hidden px-5 py-5 [scrollbar-width:none] md:h-[520px] [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: BODY_MASK, WebkitMaskImage: BODY_MASK }}
      >
        <pre className="w-max text-terminal text-[11px] md:text-[13.5px]">
          {lines.map((parts, index) => (
            <div key={index}>
              {parts.length === 0 ? " " : null}
              {parts.map((part, partIndex) => (
                <span key={partIndex} className={TONE[part.tone]}>
                  {part.t}
                </span>
              ))}
              {started && index === last ? <span className="omm-cursor" /> : null}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
