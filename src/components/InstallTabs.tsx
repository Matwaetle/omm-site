"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type Platform = {
  readonly id: string;
  readonly label: string;
  /** Shell prompt glyph shown before the command; not part of what is copied. */
  readonly prompt: string;
  /** Verbatim from the omm README install section. */
  readonly command: string;
  readonly notes: readonly string[];
};

const PLATFORMS: readonly Platform[] = [
  {
    id: "unix",
    label: "macOS / Linux",
    prompt: "$",
    command:
      "curl -fsSL https://raw.githubusercontent.com/omm-hippo/omm/main/install.sh | sh",
    notes: [
      "Open a new shell afterward so your PATH picks up omm.",
      "Requires Python 3.10+. The script bootstraps python3, git, and pipx when they are missing, via apt on Debian/Ubuntu or Homebrew on macOS.",
    ],
  },
  {
    id: "windows",
    label: "Windows",
    prompt: "PS >",
    command:
      "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; irm https://raw.githubusercontent.com/omm-hippo/omm/main/install.ps1 | iex",
    notes: [
      "This must run before irm: script-internal TLS settings are too late for its first download.",
      "Open a new PowerShell window afterward so your PATH picks up omm.",
      "Requires Python 3.10+. The script bootstraps Python and git via winget when they are missing.",
    ],
  },
];

const COPIED_MS = 1200;

export default function InstallTabs() {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string>(PLATFORMS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(
    () => () => {
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    },
    [],
  );

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  const copy = useCallback(async (platform: Platform) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(platform.command);
    } catch {
      return;
    }
    if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    setCopiedId(platform.id);
    copyTimer.current = setTimeout(() => setCopiedId(null), COPIED_MS);
  }, []);

  const onTabListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (step === 0) return;
      event.preventDefault();
      const current = PLATFORMS.findIndex((p) => p.id === activeId);
      const next =
        PLATFORMS[(current + step + PLATFORMS.length) % PLATFORMS.length];
      setActiveId(next.id);
      tabRefs.current[next.id]?.focus();
    },
    [activeId],
  );

  return (
    <div>
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Operating system"
          onKeyDown={onTabListKeyDown}
          className="inline-flex gap-1 rounded-md border border-line-1 bg-bg-0 p-1"
        >
          {PLATFORMS.map((platform) => {
            const active = platform.id === activeId;
            return (
              <button
                key={platform.id}
                ref={(node) => {
                  tabRefs.current[platform.id] = node;
                }}
                type="button"
                role="tab"
                id={tabId(platform.id)}
                aria-selected={active}
                aria-controls={panelId(platform.id)}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveId(platform.id)}
                className={`text-small rounded-md border-b-2 px-4 py-2 transition-colors duration-[120ms] ease-[var(--ease-micro)] ${
                  active
                    ? "border-accent bg-bg-2 text-ink-0"
                    : "border-transparent text-ink-2 hover:bg-bg-3 hover:text-ink-0"
                }`}
              >
                {platform.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Both panels occupy the same grid cell, so the block reserves the height
          of the taller one and the 180ms crossfade never moves the layout. */}
      <div className="mt-8 grid">
        {PLATFORMS.map((platform) => {
          const active = platform.id === activeId;
          const copied = copiedId === platform.id;
          return (
            <div
              key={platform.id}
              id={panelId(platform.id)}
              role="tabpanel"
              aria-labelledby={tabId(platform.id)}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 transition-opacity duration-[180ms] ease-[var(--ease-micro)] ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex items-start gap-4 rounded-lg border border-line-0 bg-bg-1 p-4">
                <pre className="text-terminal min-w-0 flex-1 overflow-x-auto py-2 text-left">
                  <code>
                    <span className="text-accent select-none">
                      {platform.prompt}{" "}
                    </span>
                    <span className="text-ink-0">{platform.command}</span>
                  </code>
                </pre>
                <button
                  type="button"
                  onClick={() => void copy(platform)}
                  aria-label={`Copy the ${platform.label} install command`}
                  className="text-label shrink-0 rounded-md border border-line-1 px-3 py-2 text-ink-2 transition-colors duration-[120ms] ease-[var(--ease-micro)] hover:bg-bg-3 hover:text-ink-0"
                >
                  <span aria-live="polite">{copied ? "copied" : "copy"}</span>
                </button>
              </div>

              <ul className="mt-4 flex flex-col gap-2 text-left">
                {platform.notes.map((note) => (
                  <li key={note} className="text-small text-ink-2">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
