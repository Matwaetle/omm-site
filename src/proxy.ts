import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "@/i18n/config";

/**
 * Locale routing.
 *
 * The app tree is `app/[locale]/…`, but English is published without a prefix,
 * so this file is the seam between the two:
 *
 *   `/install/windows`     → rewritten to `/en/install/windows` (URL unchanged)
 *   `/en/install/windows`  → 308 to `/install/windows` (one canonical URL)
 *   `/ko/install/windows`  → served as-is
 *   `/` with `Accept-Language: ko` and no cookie → 307 to `/ko`, once
 *
 * The redirect fires only while the visitor has no `omm_locale` cookie. The
 * language toggle sets that cookie, so an explicit choice is never overridden
 * by the browser's header on a later visit.
 */

export const config = {
  /* Everything except Next's internals, API routes and files with an
     extension (favicon.ico, /public assets): a rewrite or redirect on those
     would break the asset rather than translate it. */
  matcher: ["/((?!_next/|api/|.*\\.[^/]*$).*)"],
};

/** Highest-q supported language in `Accept-Language`, else the default. */
function preferredLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...parameters] = part.trim().split(";");
      const q = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        q: q === undefined ? 1 : Number.parseFloat(q.slice(2)),
      };
    })
    .filter((entry) => entry.tag !== "" && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const entry of ranked) {
    if (entry.tag === "*") return DEFAULT_LOCALE;
    const base = entry.tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === base);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

function withPrefix(pathname: string, locale: Locale): string {
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    const rest = pathname.slice(`/${DEFAULT_LOCALE}`.length);
    url.pathname = rest === "" ? "/" : rest;
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen === undefined) {
    const preferred = preferredLocale(request.headers.get("accept-language"));
    if (preferred !== DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = withPrefix(pathname, preferred);
      return NextResponse.redirect(url, 307);
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = withPrefix(pathname, DEFAULT_LOCALE);
  return NextResponse.rewrite(url);
}
