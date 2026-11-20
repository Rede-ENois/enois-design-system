import { createContext, useContext } from "react";

import type { Adapters } from "../types/adapters/adapters.js";

import { PlainLink } from "./plain-link.js";

function isSameHostUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return true;
  try {
    return typeof window !== "undefined" && new URL(url).host === window.location.host;
  } catch {
    return false;
  }
}

/** Base for relative paths when there is no page (SSR, node tests): it only matches itself. */
const NO_PAGE_BASE = "https://app.invalid/";

function sameHostPath(url: string): string | null {
  if (!/^(https?:\/\/|\/)/i.test(url)) return null;
  const base = typeof window === "undefined" ? NO_PAGE_BASE : window.location.href;
  try {
    const parsed = new URL(url, base);
    if (parsed.host !== new URL(base).host) return null;
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    // `https://app//other.site` is on the app host, but its path alone is protocol-relative.
    return /^\/[/\\]/.test(path) ? null : path;
  } catch {
    return null;
  }
}

export const defaultAdapters: Adapters = {
  Link: PlainLink,
  resolveMediaUrl: (url) => url || undefined,
  resolveMediaOriginalUrl: (url) => url || undefined,
  isOwnMediaUrl: isSameHostUrl,
  appPathOf: sameHostPath,
};

export const AdaptersContext = createContext<Adapters>(defaultAdapters);

export function useAdapters(): Adapters {
  return useContext(AdaptersContext);
}
