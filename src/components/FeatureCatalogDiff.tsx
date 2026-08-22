/**
 * Feature 4 visual — DIRECTION.md §4.4.4.
 * Command names and output strings are the real ones:
 *   omm-hippo/src/omm/cli.py     `omm setting catalog-trust --manifest-url … --public-key …`
 *                                "Signed catalog verification enabled (key {fingerprint})."
 *                                "Rolled back recommendation catalog from {name}."
 *   omm-hippo/src/omm/catalog.py snapshots to CATALOG_HISTORY_DIR/{sha256}.json,
 *                                error "catalog artifact hash does not match manifest"
 *   omm-hippo/published/recommend-model.manifest.json — schema_version, hash,
 *                                signed_at reproduced verbatim.
 * `<fingerprint>` stays a placeholder: the real value is sha256(public key)[:16]
 * and no public key ships in the repo, so printing digits would invent a number.
 */

import RichText from "@/components/RichText";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const ARTIFACT_SHA256 =
  "a07e9a5993b711ad86460e6e7f17d7c26755b2c670d837804f0d466b3e4211fa";

type Line = { gutter: " " | "+" | "-" | "$"; text: string; tone?: "dim" };

const LINES: Line[] = [
  { gutter: "$", text: "omm setting catalog-trust \\" },
  {
    gutter: " ",
    text: "    --manifest-url https://raw.githubusercontent.com/omm-hippo/omm/main/published/recommend-model.manifest.json \\",
  },
  { gutter: " ", text: "    --public-key <base64 ed25519 public key>" },
  {
    gutter: " ",
    text: "Signed catalog verification enabled (key <fingerprint>).",
    tone: "dim",
  },
  { gutter: " ", text: "" },
  { gutter: " ", text: "~/.omm/recommend-model.json" },
  { gutter: "-", text: `artifact_sha256 ${ARTIFACT_SHA256}` },
  { gutter: "-", text: "signed_at       2026-08-19T03:43:59Z · schema_version 1" },
  { gutter: "+", text: "artifact_sha256 <incoming artifact>" },
  { gutter: "+", text: "signature       checked against the pinned key" },
  {
    gutter: " ",
    text: `archived        ~/.omm/catalog-history/${ARTIFACT_SHA256}.json`,
    tone: "dim",
  },
  { gutter: " ", text: "" },
  { gutter: "$", text: "omm setting catalog-rollback" },
  {
    gutter: " ",
    text: `Rolled back recommendation catalog from ${ARTIFACT_SHA256}.json.`,
    tone: "dim",
  },
];

function gutterClass(gutter: Line["gutter"]) {
  if (gutter === "$") return "text-accent";
  if (gutter === "+") return "text-ink-0";
  if (gutter === "-") return "text-ink-3";
  return "text-ink-3";
}

export default function FeatureCatalogDiff({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).featureVisuals.catalog;

  return (
    <figure className="overflow-hidden rounded-lg border border-line-0 bg-bg-1">
      <div className="overflow-x-auto p-6">
        <pre className="w-max text-terminal">
          {LINES.map((line, index) => (
            <div key={index} className="flex gap-3">
              <span
                className={`w-4 shrink-0 select-none ${gutterClass(line.gutter)}`}
                aria-hidden="true"
              >
                {line.gutter === " " ? "" : line.gutter}
              </span>
              <span
                className={
                  line.gutter === "$"
                    ? "text-ink-0"
                    : line.tone === "dim"
                      ? "text-ink-3"
                      : "text-ink-1"
                }
              >
                {line.text === "" ? " " : line.text}
              </span>
            </div>
          ))}
        </pre>
      </div>
      <figcaption className="border-t border-line-0 px-6 py-3 text-small text-ink-3">
        <RichText
          segments={t.footnote}
          codeClassName="rounded-sm bg-bg-2 px-1 font-mono text-ink-2"
        />
      </figcaption>
    </figure>
  );
}
