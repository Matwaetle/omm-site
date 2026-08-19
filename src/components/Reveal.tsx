"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Entrance motion — DIRECTION.md §3, implemented against the `.rise-init` /
 * `.rise` contract in src/app/globals.css (opacity 0→1 + translateY(8px→0),
 * 320ms, entrance easing, played once).
 *
 * `rise-init` is never rendered into the HTML: it is added from JS in a layout
 * effect, before the browser paints. A visitor without JS — or the frame before
 * hydration — therefore sees the content rather than an element stuck at
 * opacity 0, and the server and client markup stay identical.
 *
 * The observer disconnects the moment it fires, so nothing re-arms on
 * scroll-back. Reduced motion is handled entirely in CSS (both classes flatten
 * to opacity 1 / no animation), so no media query is needed here.
 *
 * Not used above the fold: DIRECTION.md §3 says nothing in the hero animates.
 */

const THRESHOLD = 0.2;
/** Ratios are floats; a threshold crossing can report a hair under the mark. */
const EPSILON = 0.001;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Props = {
  children: ReactNode;
  /** Classes for the wrapper, which replaces the element it wraps. */
  className?: string;
};

export default function Reveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    ref.current?.classList.add("rise-init");
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find(
          (candidate) =>
            candidate.isIntersecting &&
            candidate.intersectionRatio >= THRESHOLD - EPSILON,
        );
        if (!entry) return;
        observer.disconnect();
        entry.target.classList.remove("rise-init");
        entry.target.classList.add("rise");
      },
      { threshold: THRESHOLD },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
