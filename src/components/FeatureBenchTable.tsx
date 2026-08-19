/**
 * Feature 3 visual — DIRECTION.md §4.4.3.
 * The versioned eight-item bilingual arithmetic smoke pack, verbatim from
 * omm-hippo/src/omm/data/quality-pack-v1.json
 * (pack_id localfit-gsm8k-bilingual-smoke, pack_version 1.1.0).
 *
 * No timing column: DIRECTION asked for `median ms`, but no real capture of
 * this pack exists to quote and design/FACTS.md §Banned forbids inventing one.
 * The columns that are real — item id, prompt, expected answer, language —
 * carry the table instead.
 */

type Item = {
  id: string;
  locale: "en" | "ko";
  expected: string;
  prompt: string;
  short: string;
};

const ITEMS: Item[] = [
  {
    id: "gsm8k-test-0000-en",
    locale: "en",
    expected: "18",
    prompt:
      "Janet's ducks lay 16 eggs per day. She eats three for breakfast every morning and uses four to bake muffins. She sells each remaining egg for $2. How many dollars does she make each day?",
    short: "Janet's ducks lay 16 eggs per day. She eats three for…",
  },
  {
    id: "gsm8k-test-0001-en",
    locale: "en",
    expected: "3",
    prompt:
      "A robe takes 2 bolts of blue fiber and half that much white fiber. How many bolts in total does it take?",
    short: "A robe takes 2 bolts of blue fiber and half that much…",
  },
  {
    id: "gsm8k-test-0002-en",
    locale: "en",
    expected: "70000",
    prompt:
      "Josh buys a house for $80,000 and spends $50,000 on repairs. The repairs increase the original value of the house by 150%. How many dollars of profit does he make when he sells at the new value?",
    short: "Josh buys a house for $80,000 and spends $50,000 on…",
  },
  {
    id: "gsm8k-test-0003-en",
    locale: "en",
    expected: "540",
    prompt:
      "James runs 3 sprints, 3 times a week. Each sprint is 60 meters. How many meters does he run in a week?",
    short: "James runs 3 sprints, 3 times a week. Each sprint is…",
  },
  {
    id: "gsm8k-test-0004-ko",
    locale: "ko",
    expected: "20",
    prompt:
      "웬디는 매일 닭 한 마리당 사료 3컵을 세 끼로 나누어 준다. 닭은 20마리이고, 아침에 15컵, 오후에 25컵을 주었다. 마지막 끼니에는 사료를 몇 컵 주어야 하는가?",
    short: "웬디는 매일 닭 한 마리당 사료 3컵을 세 끼로 나누어 준다. 닭은…",
  },
  {
    id: "gsm8k-test-0005-ko",
    locale: "ko",
    expected: "64",
    prompt:
      "카일라는 유리잔 16개를 산다. 일반 가격은 한 개에 5달러이고, 매 두 번째 잔은 일반 가격의 60%이다. 모두 얼마를 내야 하는가?",
    short: "카일라는 유리잔 16개를 산다. 일반 가격은 한 개에 5달러이고, 매…",
  },
  {
    id: "gsm8k-test-0006-ko",
    locale: "ko",
    expected: "260",
    prompt:
      "시애틀에는 양이 20마리 있다. 찰스턴에는 시애틀의 4배가 있고, 툴루즈에는 찰스턴의 2배가 있다. 세 곳의 양은 모두 몇 마리인가?",
    short: "시애틀에는 양이 20마리 있다. 찰스턴에는 시애틀의 4배가 있고,…",
  },
  {
    id: "gsm8k-test-0007-ko",
    locale: "ko",
    expected: "160",
    prompt:
      "칼라는 200GB 파일을 분당 2GB로 받는다. 40%를 받은 순간 윈도우 업데이트로 재시작하며 20분이 걸렸고, 그 뒤 처음부터 다시 받아야 했다. 전체 소요 시간은 몇 분인가?",
    short: "칼라는 200GB 파일을 분당 2GB로 받는다. 40%를 받은 순간…",
  },
];

export default function FeatureBenchTable() {
  return (
    <figure className="overflow-hidden rounded-lg border border-line-0 bg-bg-1">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-table">
          <caption className="sr-only">
            localfit-gsm8k-bilingual-smoke, pack version 1.1.0 — all eight items
          </caption>
          <thead>
            <tr className="border-b border-line-1 bg-bg-2 text-ink-2">
              <th scope="col" className="px-4 py-2 text-left font-normal">
                #
              </th>
              <th scope="col" className="px-4 py-2 text-left font-normal">
                prompt
              </th>
              <th scope="col" className="px-4 py-2 text-right font-normal">
                expected
              </th>
              <th scope="col" className="px-4 py-2 text-right font-normal">
                locale
              </th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 1 ? "bg-bg-2" : undefined}
              >
                <td className="px-4 py-2 text-ink-3">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-2 text-ink-1" title={item.prompt}>
                  {item.short}
                </td>
                <td className="px-4 py-2 text-right text-ink-0">
                  {item.expected}
                </td>
                <td className="px-4 py-2 text-right text-ink-3">
                  {item.locale}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="border-t border-line-0 px-4 py-3 text-small text-ink-3">
        localfit-gsm8k-bilingual-smoke 1.1.0 · temperature 0, seed 0, Ollama
        only. Eight items. Not a leaderboard.
      </figcaption>
    </figure>
  );
}
