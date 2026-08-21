/**
 * Problem strip — DIRECTION.md §4.3.
 * 56px band (py-14), --bg-1 inset, full-bleed hairlines top and bottom, 5/7 split.
 * Right column is an `ls -la`-style listing of one GGUF duplicated across four
 * runner directories.
 *
 * Every path below is a real omm linker default (omm-hippo/src/omm/linker.py):
 *   ollama       ~/.ollama/models                  (OLLAMA_MODELS overrides)
 *   lmstudio     ~/.lmstudio/models
 *   jan          <app data>/Jan/data/llamacpp/models/<model_id>/  (linker.py:18)
 *   anythingllm  <app data>/anythingllm-desktop/storage/models/ollama
 * `<app data>` on Linux is ~/.config/<Product>, hence the caption.
 * File is the curated default `mistral-7b-instruct-q4`
 * (TheBloke/Mistral-7B-Instruct-v0.2-GGUF, mistral-7b-instruct-v0.2.Q4_K_M.gguf).
 */

import Reveal from "@/components/Reveal";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const GGUF = "mistral-7b-instruct-v0.2.Q4_K_M.gguf";
const SIZE = "4.37 GB";

const COPIES = [
  { runner: "ollama", dir: "~/.ollama/models/" },
  { runner: "lmstudio", dir: "~/.lmstudio/models/" },
  { runner: "jan", dir: "~/.config/Jan/data/llamacpp/models/<model-id>/" },
  {
    runner: "anythingllm",
    dir: "~/.config/anythingllm-desktop/storage/models/ollama/",
  },
];

export default function Problem({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).problem;

  return (
    <section id="problem" className="border-y border-line-0 bg-bg-1 py-14">
      <div className="mx-auto w-full max-w-page px-5 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-5">
            <p className="text-label">{t.label}</p>
            <h2 className="mt-4 text-h3">{t.heading}</h2>
            <p className="mt-4 max-w-[46ch]">{t.body}</p>
          </Reveal>

          <div className="md:col-span-7">
            <div className="overflow-x-auto">
              <div className="min-w-[34rem] text-terminal">
                <p className="text-ink-0">{GGUF}</p>
                <ul className="mt-2">
                  {COPIES.map((copy) => (
                    <li key={copy.runner} className="flex gap-3">
                      <span className="w-24 shrink-0 text-ink-3">
                        -rw-r--r--
                      </span>
                      <span className="w-20 shrink-0 text-right whitespace-nowrap text-ink-1">
                        {SIZE}
                      </span>
                      <span className="text-ink-2">{copy.dir}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-3 border-t border-line-0 pt-2">
                  <span className="w-24 shrink-0" aria-hidden="true" />
                  <span className="w-20 shrink-0 text-right whitespace-nowrap text-ink-0">
                    17.48 GB
                  </span>
                  <span className="text-ink-2">{t.total}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-label">{t.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
