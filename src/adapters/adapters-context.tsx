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

export const defaultAdapters: Adapters = {
  Link: PlainLink,
  resolveMediaUrl: (url) => url || undefined,
  resolveMediaOriginalUrl: (url) => url || undefined,
  isOwnMediaUrl: isSameHostUrl,
};

export const AdaptersContext = createContext<Adapters>(defaultAdapters);

export function useAdapters(): Adapters {
  return useContext(AdaptersContext);
}
