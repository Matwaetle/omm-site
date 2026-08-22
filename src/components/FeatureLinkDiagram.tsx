/**
 * Feature 1 visual — DIRECTION.md §4.4.1.
 * One hub file on the left, the seven runner model directories on the right,
 * joined by 1px orthogonal connectors. Linked runners are drawn in
 * --accent-line; runners that are not installed are dashed --line-0.
 * Static: no animation, no gradients, no icons.
 *
 * Directories are the real defaults from omm-hippo/src/omm/linker.py.
 * `<app data>` is ~/.config/<Product> on Linux, which is the variant shown.
 */

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Runner = { name: string; dir: string; linked: boolean };

const RUNNERS: Runner[] = [
  { name: "ollama", dir: "~/.ollama/models", linked: true },
  { name: "lmstudio", dir: "~/.lmstudio/models", linked: true },
  {
    name: "jan",
    /* linker.py:1500 returns the models dir, but linker.py:18 notes Jan only
       picks the file up from a per-model subdirectory under it. */
    dir: "~/.config/Jan/data/llamacpp/models/<model-id>/",
    linked: true,
  },
  {
    name: "anythingllm",
    dir: "~/.config/anythingllm-desktop/storage/models/ollama",
    linked: false,
  },
  { name: "msty", dir: "~/.config/MstyStudio/models", linked: false },
  { name: "koboldcpp", dir: "~/Applications/koboldcpp/models", linked: false },
  {
    name: "textgen-webui",
    dir: "~/Applications/text-generation-webui/user_data/models",
    linked: false,
  },
];

const ROW_0 = 22;
const ROW_STEP = 34;
const HUB_RIGHT = 250;
const LANE_BASE = 262;
const LANE_STEP = 7;
const LABEL_X = 336;
const PATH_X = 440;
const CENTER_INDEX = 3;
const HUB_Y = ROW_0 + CENTER_INDEX * ROW_STEP;

function rowY(index: number) {
  return ROW_0 + index * ROW_STEP;
}

function laneX(index: number) {
  return LANE_BASE + Math.abs(index - CENTER_INDEX) * LANE_STEP;
}

function connector(index: number) {
  const y = rowY(index);
  const lane = laneX(index);
  return `M ${HUB_RIGHT} ${HUB_Y} H ${lane} V ${y} H ${LABEL_X - 8}`;
}

export default function FeatureLinkDiagram({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).featureVisuals.link;

  return (
    <figure className="overflow-x-auto rounded-lg border border-line-0 bg-bg-1 p-6">
      <svg
        viewBox="0 0 800 268"
        role="img"
        aria-label={t.alt}
        className="h-auto w-full min-w-[40rem]"
      >
        {/* hub */}
        <rect
          x="1"
          y={HUB_Y - 26}
          width={HUB_RIGHT - 1}
          height="52"
          rx="5"
          className="fill-bg-2 stroke-line-1"
          strokeWidth="1"
        />
        <text
          x="16"
          y={HUB_Y - 6}
          fontSize="11"
          className="fill-ink-3 font-mono"
        >
          ~/.omm/models/
        </text>
        <text
          x="16"
          y={HUB_Y + 12}
          fontSize="10"
          className="fill-ink-0 font-mono"
        >
          mistral-7b-instruct-v0.2.Q4_K_M.gguf
        </text>

        {/* unlinked connectors first so linked ones win any shared pixel */}
        {RUNNERS.map((runner, index) =>
          runner.linked ? null : (
            <path
              key={`c-${runner.name}`}
              d={connector(index)}
              fill="none"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="stroke-line-0"
            />
          ),
        )}
        {RUNNERS.map((runner, index) =>
          runner.linked ? (
            <path
              key={`c-${runner.name}`}
              d={connector(index)}
              fill="none"
              strokeWidth="1"
              className="stroke-accent-line"
            />
          ) : null,
        )}

        {/* runner rows */}
        {RUNNERS.map((runner, index) => {
          const y = rowY(index);
          return (
            <g key={runner.name}>
              <text
                x={LABEL_X}
                y={y + 4}
                fontSize="12"
                fontWeight="500"
                className={
                  runner.linked
                    ? "fill-ink-0 font-sans"
                    : "fill-ink-2 font-sans"
                }
              >
                {runner.name}
              </text>
              <text
                x={PATH_X}
                y={y + 4}
                fontSize="11"
                className={
                  runner.linked
                    ? "fill-ink-2 font-mono"
                    : "fill-ink-3 font-mono"
                }
              >
                {runner.dir}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <line
          x1={LABEL_X}
          y1="252"
          x2={LABEL_X + 22}
          y2="252"
          strokeWidth="1"
          className="stroke-accent-line"
        />
        <text
          x={LABEL_X + 30}
          y="256"
          fontSize="11"
          className="fill-ink-2 font-mono"
        >
          {t.linked}
        </text>
        <line
          x1={LABEL_X + 96}
          y1="252"
          x2={LABEL_X + 118}
          y2="252"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="stroke-line-0"
        />
        <text
          x={LABEL_X + 126}
          y="256"
          fontSize="11"
          className="fill-ink-3 font-mono"
        >
          {t.skipped}
        </text>
      </svg>
    </figure>
  );
}
