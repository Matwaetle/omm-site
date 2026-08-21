"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COPIED_MS = 1200;

type Props = {
  /** Shell prompt glyph shown before the command; not part of what is copied. */
  readonly prompt: string;
  readonly command: string;
  /** Describes the command for screen readers on the copy button. */
  readonly label: string;
};

/**
 * The command + copy control from the landing page's InstallTabs, extracted so
 * the guide pages present commands in exactly the same block rather than in a
 * second, docs-flavoured style. Same 1.2s `copied` label, no toast, no icon.
 */
export default function CommandBlock({ prompt, command, label }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    if (timer.current !== null) clearTimeout(timer.current);
    setCopied(true);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }, [command]);

  return (
    <div className="flex items-start gap-4 rounded-lg border border-line-0 bg-bg-1 p-4">
      <pre className="text-terminal min-w-0 flex-1 overflow-x-auto py-2 text-left">
        <code>
          <span className="text-accent select-none">{prompt} </span>
          <span className="text-ink-0">{command}</span>
        </code>
      </pre>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy: ${label}`}
        className="text-label shrink-0 rounded-md border border-line-1 px-3 py-2 text-ink-2 transition-colors duration-[120ms] ease-[var(--ease-micro)] hover:bg-bg-3 hover:text-ink-0"
      >
        <span aria-live="polite">{copied ? "copied" : "copy"}</span>
      </button>
    </div>
  );
}
