import { describe, expect, it } from "vitest";

import { defaultMessages } from "./default-messages.js";

/**
 * Same copy guards the app runs over its own `texts`: most UI copy now lives here, so the checks
 * moved with it. Only string values are scanned; the key path is English and is not copy.
 */

const ENGLISH_MARKERS = [
  /\bthe\b/i,
  /\byour\b/i,
  /\byou're\b/i,
  /\bwe're\b/i,
  /\bdon't\b/i,
  /\bdoesn't\b/i,
  /\bnot found\b/i,
  /\bpage not found\b/i,
  /\btry again\b/i,
  /\bgo home\b/i,
  /\bsomething went wrong\b/i,
  /\bthis page\b/i,
  /\bloading\b/i,
];

function stringValues(node: unknown, keyPath = "messages"): { keyPath: string; value: string }[] {
  if (typeof node === "string") return [{ keyPath, value: node }];
  // Template messages are functions: their source holds the literal copy.
  if (typeof node === "function") return [{ keyPath, value: node.toString() }];
  if (Array.isArray(node)) return node.flatMap((item, i) => stringValues(item, `${keyPath}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) => stringValues(value, `${keyPath}.${key}`));
  }
  return [];
}

const flagged = (test: (value: string) => boolean): string[] =>
  stringValues(defaultMessages)
    .filter(({ value }) => test(value))
    .map(({ keyPath, value }) => `${keyPath} = ${value}`);

// Keys whose emoji or symbol is content (an icon or a legal mark), not decoration.
const PICTOGRAPHIC_ALLOWLIST = new Set([
  "messages.embedPlayer.icons.cinema",
  "messages.embedPlayer.icons.television",
  "messages.embedPlayer.icons.play",
  "messages.linkPreviews.webIcon",
  "messages.legalLayout.copyright",
]);

describe("default messages copy", () => {
  it("has no English UI copy", () => {
    expect(flagged((value) => ENGLISH_MARKERS.some((marker) => marker.test(value)))).toEqual([]);
  });

  it("does not call Énóis a professional network", () => {
    expect(
      flagged((value) => /rede profissional/i.test(value) || /jornada profissional/i.test(value)),
    ).toEqual([]);
  });

  it("uses the brand's masculine article (o Énóis)", () => {
    expect(flagged((value) => /\ba Énóis\b/.test(value) || /\bda Énóis\b/.test(value))).toEqual([]);
  });

  it("has no em/en dashes", () => {
    expect(flagged((value) => /[–—]/.test(value))).toEqual([]);
  });

  it("has no emojis outside the content allowlist", () => {
    const pictographic = stringValues(defaultMessages).filter(({ value }) =>
      /\p{Extended_Pictographic}/u.test(value),
    );

    expect(
      pictographic
        .filter(({ keyPath }) => !PICTOGRAPHIC_ALLOWLIST.has(keyPath))
        .map(({ keyPath, value }) => `${keyPath} = ${value}`),
    ).toEqual([]);
    // A stale allowlist entry would silently allow an emoji back in later.
    expect(pictographic.map(({ keyPath }) => keyPath).sort()).toEqual(
      [...PICTOGRAPHIC_ALLOWLIST].sort(),
    );
  });
});
