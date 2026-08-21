import type { Metadata } from "next";
import Link from "next/link";

import { GUIDE_LINKS } from "@/components/install/guides";

const title = "Install omm";
const description =
  "Pick your operating system for a step-by-step omm install guide: which terminal application to open, the exact command, what the installer verifies, and what every error message means.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/install" },
  openGraph: {
    type: "article",
    siteName: "omm",
    url: "/install",
    locale: "en_US",
    title,
    description,
  },
};

export default function InstallChooser() {
  return (
    <main className="relative border-b border-line-0 bg-bg-0">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-page px-5 pt-16 pb-32 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-4">
            <p className="text-label">Install</p>
            <h1 className="text-h2 mt-4">Pick the system you are installing on.</h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              Each guide starts by naming the exact application to open, because
              the install command for one system does not run on another. After
              that: the command, what it verifies before installing anything,
              what to run first, and every message the installer can print with
              what to do about it.
            </p>

            <ul className="mt-12 flex flex-col border-t border-line-0">
              {GUIDE_LINKS.map((link) => (
                <li key={link.slug} className="border-b border-line-0">
                  <Link
                    href={link.href}
                    className="grid grid-cols-1 gap-2 px-2 py-6 transition-colors duration-[120ms] ease-[var(--ease-micro)] hover:bg-bg-1 sm:grid-cols-[minmax(0,16ch)_minmax(0,1fr)] sm:gap-6"
                  >
                    <span className="text-h3">{link.os}</span>
                    <span className="text-small max-w-[62ch]">
                      {link.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-small mt-8 max-w-[62ch]">
              Already comfortable at a terminal? The one-line commands are on
              the{" "}
              <Link
                href="/#install"
                className="border-b border-line-1 text-ink-1 transition-colors duration-[120ms] ease-[var(--ease-micro)] hover:border-accent hover:text-ink-0"
              >
                landing page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
