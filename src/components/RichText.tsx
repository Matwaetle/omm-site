import { Fragment } from "react";

import type { RichSegment } from "@/i18n/dictionaries";

/**
 * Renders a dictionary body: plain strings as text, `{ code }` segments as an
 * inline `<code>`. Keeping the code runs in the dictionary rather than in JSX
 * lets a translation move `catalog-rollback` to wherever the Korean sentence
 * needs it without forking the component.
 */
export default function RichText({
  segments,
  codeClassName = "rounded-sm bg-bg-1 px-1 font-mono text-ink-0",
}: {
  readonly segments: readonly RichSegment[];
  readonly codeClassName?: string;
}) {
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {typeof segment === "string" ? (
            segment
          ) : (
            <code className={codeClassName}>{segment.code}</code>
          )}
        </Fragment>
      ))}
    </>
  );
}
