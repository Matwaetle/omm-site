import InstallTabs from "@/components/InstallTabs";
import Reveal from "@/components/Reveal";

/** README: "Both installers clone to a versioned staging directory, verify the
 *  signed commit against a bootstrap trust anchor, and only then switch pipx to it." */
const INSTALLER_STEPS: readonly { step: string; title: string; body: string }[] =
  [
    {
      step: "01",
      title: "staging clone",
      body: "The release is cloned into a versioned staging directory, never over the copy you are currently running.",
    },
    {
      step: "02",
      title: "signed commit verified",
      body: "The staged commit is checked against a bootstrap trust anchor before any of it is executed.",
    },
    {
      step: "03",
      title: "pipx switch",
      body: "Only after that does pipx switch to the staged tree, so omm stays an isolated CLI.",
    },
  ];

export default function Install() {
  return (
    <section
      id="install"
      className="relative border-t border-line-0 bg-bg-0 py-32"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto w-full max-w-page px-5 md:px-8">
        <div className="mx-auto max-w-[880px]">
          <Reveal className="text-center">
            <p className="text-label">Install</p>
            <h2 className="text-h2 mt-4">
              One line. It verifies the signed commit before it installs
              anything.
            </h2>
            <p className="text-lede mx-auto mt-6 max-w-[640px]">
              Requires Python 3.10+ on Windows 10 22H2 or later, macOS, or
              Linux. The script bootstraps whatever is missing, then installs
              omm as an isolated pipx CLI.
            </p>
          </Reveal>

          <div className="mt-12">
            <InstallTabs />
          </div>

          <div className="mt-16 border-t border-line-0">
            <p className="text-label pt-8">What the installer does</p>
            <ol className="mt-6 flex flex-col">
              {INSTALLER_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-line-0 py-4 first:border-t"
                >
                  <span className="text-terminal text-ink-3" aria-hidden>
                    {item.step}
                  </span>
                  <span className="text-terminal text-left">
                    <span className="text-ink-0">{item.title}</span>
                    <span className="text-ink-2"> — {item.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
