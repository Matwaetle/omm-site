"use client";

import Link from "next/link";
import { useState } from "react";

/** Real published version — omm-hippo/pyproject.toml `version = "0.2.106"`. */
const VERSION = "v0.2.106";
const REPO = "https://github.com/omm-hippo/omm";
const WIKI = `${REPO}/wiki`;

/** Section ids are owned by the other section components. */
/* Absolute so the same nav works from /install/* as well as from "/". */
const SECTIONS = [
  { label: "Problem", href: "/#problem" },
  { label: "Features", href: "/#features" },
  { label: "Runners", href: "/#runners" },
  { label: "Install", href: "/#install" },
] as const;

const LINK =
  "border-b border-transparent pb-0.5 text-small text-ink-2 transition-colors duration-[120ms] ease-micro hover:border-accent hover:text-ink-0";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line-0 bg-bg-0/92">
      <div className="mx-auto flex h-14 max-w-page items-center px-5 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-mono text-[15px] font-medium lowercase text-ink-0">omm</span>
          <span className="rounded-sm border border-line-1 px-1.5 py-0.5 font-mono text-[11px] leading-none text-ink-3">
            {VERSION}
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className={LINK}>
              {s.label}
            </a>
          ))}
          <Link href="/install" className={LINK}>
            Guides
          </Link>
          <a href={WIKI} className={LINK} target="_blank" rel="noreferrer">
            Docs
          </a>
        </nav>

        <div className="ml-auto hidden items-center gap-6 md:flex">
          <a href={REPO} className={LINK} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link
            href="/#install"
            className="focus-ring-neutral rounded-md bg-accent px-4 py-1.5 text-small font-medium text-accent-ink transition-colors duration-[120ms] ease-micro hover:bg-accent-press"
          >
            Install
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-md border border-line-1 px-3 py-2 text-label text-ink-2 md:hidden"
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {/* Mobile: plain full-width panel. No slide, no hamburger morph. */}
      {open ? (
        <div id="nav-panel" className="border-t border-line-0 bg-bg-0 md:hidden">
          <nav className="mx-auto flex max-w-page flex-col px-5 py-2">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-0 py-3 text-small text-ink-2"
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/install"
              onClick={() => setOpen(false)}
              className="border-b border-line-0 py-3 text-small text-ink-2"
            >
              Guides
            </Link>
            <a
              href={WIKI}
              target="_blank"
              rel="noreferrer"
              className="border-b border-line-0 py-3 text-small text-ink-2"
            >
              Docs
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="border-b border-line-0 py-3 text-small text-ink-2"
            >
              GitHub
            </a>
            <Link
              href="/#install"
              onClick={() => setOpen(false)}
              className="focus-ring-neutral mt-4 mb-2 rounded-md bg-accent px-4 py-2 text-center text-small font-medium text-accent-ink"
            >
              Install
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
