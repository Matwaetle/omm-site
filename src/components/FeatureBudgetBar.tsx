/**
 * Feature 2 visual — DIRECTION.md §4.4.2.
 * Localfit's memory budget, drawn to scale against the real scan machine in
 * design/FACTS.md (Intel Core Ultra 7 155H, 15.5 GB RAM, Windows 11).
 *
 * The arithmetic is the one in omm-hippo/src/omm/hardware.py
 * `calculate_memory_budget`:
 *   reserve   = max(RAM_SAFETY_RESERVE_MIN_GB 1.0, total * 0.10)  → 1.55 GB
 *   totalCap  = total * RAM_MODEL_CAP_RATIO 0.80                  → 12.4 GB
 *   liveCap   = available - reserve                               → 8.25 GB
 *   budget    = min(totalCap, liveCap)                            → 8.2 GB
 * Available (9.8 GB) is the re-derived figure design/FACTS.md sanctions for a
 * scan where a model actually fits; total/CPU/OS are the captured values.
 */

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const TOTAL_GB = 15.5;
const IN_USE_GB = 5.7; // 15.5 total - 9.8 available
const RESERVE_GB = 1.55; // max(1.0, 10% of 15.5)
const BUDGET_GB = 8.25; // min(12.4 cap, 9.8 - 1.55)
const MODEL_GB = 4.37; // mistral-7b-instruct-v0.2.Q4_K_M.gguf

const pct = (gb: number) => `${((gb / TOTAL_GB) * 100).toFixed(3)}%`;

/** Geometry and readouts; the labels come from the dictionary. */
const SEGMENTS = [
  { key: "inUse", gb: IN_USE_GB, read: "5.7 GB", fill: "bg-bg-3" },
  { key: "reserve", gb: RESERVE_GB, read: "1.6 GB+", fill: "bg-bg-2" },
  { key: "budget", gb: BUDGET_GB, read: "8.2 GB", fill: "bg-line-1" },
] as const;

export default function FeatureBudgetBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).featureVisuals.budget;

  return (
    <figure className="rounded-lg border border-line-0 bg-bg-1 p-6">
      <figcaption className="text-label">{t.caption}</figcaption>

      {/* model-footprint tick, above the bar so the 1px rule stays readable */}
      <div className="relative mt-6 h-6">
        <div
          className="absolute bottom-0 top-3 w-px bg-accent"
          style={{ left: pct(IN_USE_GB + RESERVE_GB + MODEL_GB) }}
        />
        <div
          className="absolute bottom-3 -translate-x-full pr-2 text-label text-accent"
          style={{ left: pct(IN_USE_GB + RESERVE_GB + MODEL_GB) }}
        >
          {t.model}
        </div>
      </div>

      <div className="flex h-8 w-full overflow-hidden rounded-sm border border-line-0">
        {SEGMENTS.map((segment) => (
          <div
            key={segment.key}
            className={segment.fill}
            style={{ width: pct(segment.gb) }}
          />
        ))}
      </div>

      <dl className="mt-6 text-table">
        {SEGMENTS.map((segment) => (
          <div
            key={segment.key}
            className="flex justify-between border-t border-line-0 py-2"
          >
            <dt className="text-ink-2">{t[segment.key]}</dt>
            <dd className="text-ink-0">{segment.read}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-line-0 py-2">
          <dt className="text-ink-3">{t.cap}</dt>
          <dd className="text-ink-3">12.4 GB</dd>
        </div>
      </dl>
    </figure>
  );
}
