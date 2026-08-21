import Link from "next/link";

const REPO = "https://github.com/omm-hippo/omm";

type FooterLink = {
  readonly label: string;
  readonly href: string;
  /** Route on this site rather than a link out to the omm repo. */
  readonly internal?: boolean;
};
type FooterColumn = {
  readonly title: string;
  readonly mono?: boolean;
  readonly links: readonly FooterLink[];
};

/** Every href points at a file, section, or tab that exists in the omm repo. */
const COLUMNS: readonly FooterColumn[] = [
  {
    title: "Docs",
    links: [
      { label: "Windows install guide", href: "/install/windows", internal: true },
      { label: "macOS install guide", href: "/install/macos", internal: true },
      { label: "Linux install guide", href: "/install/linux", internal: true },
      { label: "README", href: `${REPO}#readme` },
      { label: "Supported platforms", href: `${REPO}#supported-platforms` },
      { label: "Storage location", href: `${REPO}#storage-location` },
      { label: "Scripting", href: `${REPO}#scripting` },
      {
        label: "Compatible programs",
        href: `${REPO}/wiki/Compatible-Programs`,
      },
    ],
  },
  {
    title: "Commands",
    mono: true,
    links: [
      { label: "omm scan", href: `${REPO}#usage` },
      { label: "omm install", href: `${REPO}#usage` },
      { label: "omm list", href: `${REPO}#usage` },
      { label: "omm benchmark", href: `${REPO}#self-hosted-benchmark-data` },
      { label: "omm setting", href: `${REPO}#signed-recommendation-data` },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Contributing", href: `${REPO}/blob/main/CONTRIBUTING.md` },
      { label: "Code of conduct", href: `${REPO}/blob/main/CODE_OF_CONDUCT.md` },
      { label: "Security policy", href: `${REPO}/blob/main/SECURITY.md` },
      {
        label: "Third-party notices",
        href: `${REPO}/blob/main/THIRD_PARTY_NOTICES.md`,
      },
      { label: "License", href: `${REPO}/blob/main/LICENSE` },
    ],
  },
  {
    title: "Source",
    links: [
      { label: "Repository", href: REPO },
      { label: "Issues", href: `${REPO}/issues` },
      { label: "Releases", href: `${REPO}/releases` },
      { label: "Wiki", href: `${REPO}/wiki` },
    ],
  },
];

export default function Footer() {
  /* DIRECTION.md §4.7: the bottom row carries the build's real commit
     short-SHA. Vercel injects it at build time; locally it is absent, and the
     row then renders repo + license only rather than a fake placeholder. */
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  return (
    <footer className="border-t border-line-0 bg-bg-0 py-16">
      <div className="mx-auto w-full max-w-page px-5 md:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="shrink-0 lg:w-64">
            <p className="font-mono font-medium lowercase text-ink-0">omm</p>
            <p className="text-small mt-2">
              MIT · Python 3.10+ · Windows, macOS, Linux
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-label">{column.title}</h3>
                <ul className="mt-4 flex flex-col gap-2">
                  {column.links.map((link) => {
                    const className = `text-small text-ink-2 transition-colors duration-[120ms] ease-[var(--ease-micro)] hover:text-ink-0 ${
                      column.mono ? "font-mono" : ""
                    }`;
                    return (
                      <li key={link.label}>
                        {link.internal ? (
                          <Link href={link.href} className={className}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} className={className}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-0 pt-6">
          <span className="text-label">github.com/omm-hippo/omm</span>
          <span className="text-label">MIT license</span>
          {sha ? <span className="text-label">build {sha}</span> : null}
        </div>
      </div>
    </footer>
  );
}
