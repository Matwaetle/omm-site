/**
 * Features — DIRECTION.md §4.4.
 * Four alternating full-width rows (5/7, then 7/5), separated by full-bleed
 * hairlines. No icon cards, no 3-column grid: every row carries one
 * purpose-built visual built from real omm behaviour.
 */

import type { ReactNode } from "react";
import FeatureLinkDiagram from "@/components/FeatureLinkDiagram";
import FeatureBudgetBar from "@/components/FeatureBudgetBar";
import FeatureBenchTable from "@/components/FeatureBenchTable";
import FeatureCatalogDiff from "@/components/FeatureCatalogDiff";

type Row = {
  id: string;
  eyebrow: string;
  title: string;
  body: ReactNode;
  visual: ReactNode;
  /** true → text on the left in a 5/7 split, false → visual left in 7/5 */
  textFirst: boolean;
};

const ROWS: Row[] = [
  {
    id: "hub",
    eyebrow: "One hub",
    title: "One file on disk. Seven runners think they own it.",
    body: (
      <>
        omm writes the GGUF once into <code className="rounded-sm bg-bg-1 px-1 font-mono text-ink-0">~/.omm/models</code> and links it
        into every runner directory it can resolve on the machine. Runners that
        are not installed are skipped rather than guessed at, and Windows falls
        back from hard link to symlink to an owned copy with a free-space check.
      </>
    ),
    visual: <FeatureLinkDiagram />,
    textFirst: true,
  },
  {
    id: "localfit",
    eyebrow: "Localfit",
    title: "It checks whether the model fits before it spends your bandwidth.",
    body: (
      <>
        A scan reads total RAM, live availability and GPU memory, then holds
        back 10% of total RAM — never less than 1 GB — for the OS and the apps
        opened after the scan. The safe budget is whichever is smaller: that
        live figure, or 80% of total RAM. Rerunning the scan re-derives both.
      </>
    ),
    visual: <FeatureBudgetBar />,
    textFirst: false,
  },
  {
    id: "benchmarks",
    eyebrow: "Benchmarks",
    title: "Eight problems, fixed seed, median of repeated samples.",
    body: (
      <>
        The quality pack is versioned and bilingual, runs through Ollama at
        temperature 0, and grades one number per item against a known answer.
        Generated text is never stored, and the result it reports is a median
        over repeated samples rather than a single lucky pass.
      </>
    ),
    visual: <FeatureBenchTable />,
    textFirst: true,
  },
  {
    id: "catalogs",
    eyebrow: "Signed catalogs",
    title: "Every catalog it replaces is kept, hash and all.",
    body: (
      <>
        <code className="rounded-sm bg-bg-1 px-1 font-mono text-ink-0">catalog-trust</code> pins an Ed25519 public key and a manifest
        URL, and refuses any recommendation artifact whose hash or signature
        does not match. The replaced snapshot is archived under its own sha256,
        so <code className="rounded-sm bg-bg-1 px-1 font-mono text-ink-0">catalog-rollback</code> puts the previous catalog back.
      </>
    ),
    visual: <FeatureCatalogDiff />,
    textFirst: false,
  },
];

export default function Features() {
  return (
    <section id="features">
      {ROWS.map((row, index) => (
        <div
          key={row.id}
          /* Problem's own bottom rule opens the section, so the first row does
             not draw a second one. Row padding 96px + 32px at the two outer
             edges makes the section read 128px top and bottom (§3 rhythm). */
          className={index === 0 ? undefined : "border-t border-line-0"}
        >
          <div
            className={`mx-auto w-full max-w-page px-5 py-24 md:px-8 ${
              index === 0 ? "pt-32" : index === ROWS.length - 1 ? "pb-32" : ""
            }`}
          >
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-6">
              <div
                className={
                  row.textFirst
                    ? "md:col-span-5 md:col-start-1"
                    : "md:col-span-5 md:col-start-8 md:row-start-1"
                }
              >
                <p className="text-label">{row.eyebrow}</p>
                <h2 className="mt-4 text-h2">{row.title}</h2>
                <p className="mt-6 max-w-[52ch]">{row.body}</p>
              </div>

              <div
                className={
                  row.textFirst
                    ? "md:col-span-7 md:col-start-6"
                    : "md:col-span-7 md:col-start-1 md:row-start-1"
                }
              >
                {row.visual}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
