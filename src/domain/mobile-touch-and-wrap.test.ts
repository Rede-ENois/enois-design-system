import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { TOUCH_TARGET_28, TOUCH_TARGET_32, TOUCH_TARGET_36 } from "../lib/touch-target.js";

/**
 * Mobile layout audit at 390–430px (issue #199). Three defects, each pinned where it was found:
 * controls drawn smaller than 44px with no larger tap area, a dynamic value with `shrink-0`
 * squeezing the truncated text next to it, and user text with no break point pushing the page
 * sideways.
 */
const source = (file: string): string => readFileSync(join(__dirname, file), "utf8");

/** The `className`/`buttonClassName` values in a file that draw a control of the given size. */
function controls(file: string, size: RegExp): string[] {
  const values = source(file).match(
    /(?:c|buttonC)lassName=(?:"[^"]*"|\{`[^`]*`\}|\{cn\([\s\S]*?\)\s*\})/g,
  );
  return (values ?? []).filter((value) => size.test(value));
}

const TAILWIND_UNIT_PX = 4;

/** Height of the tap area: the drawn height plus what the pseudo-element adds above and below. */
function tapHeight(drawnPx: number, classes: string): number {
  const inset = classes.match(/before:-inset(?:-y)?-([\d.]+)(?:\s|$)/);
  if (!inset) throw new Error(`no vertical inset in "${classes}"`);
  return drawnPx + 2 * Number(inset[1]) * TAILWIND_UNIT_PX;
}

describe("touch target constants", () => {
  it.each([
    [28, TOUCH_TARGET_28],
    [32, TOUCH_TARGET_32],
    [36, TOUCH_TARGET_36],
  ])("a %ipx control takes taps on at least 44px of height", (drawn, classes) => {
    expect(tapHeight(drawn, classes)).toBeGreaterThanOrEqual(44);
    // The pseudo-element is positioned against the control and needs content to exist.
    expect(classes).toContain("relative");
    expect(classes).toContain("before:absolute");
    expect(classes).toContain("before:content-['']");
  });
});

describe("controls smaller than 44px carry a touch target", () => {
  it.each([
    // reply, pin, edit, delete, report + react, who-reacted, accept
    ["post/comments/comment-item.tsx", /\bh-7\b/, "TOUCH_TARGET_28", 8],
    // attach media, attach service, emoji, send
    ["messages/conversation-thread.tsx", /\bh-8 w-8\b/, "TOUCH_TARGET_32", 4],
    // back, drawn only on mobile
    ["messages/conversation-header.tsx", /\bh-8 w-8\b/, "TOUCH_TARGET_32", 1],
    // previous, next, today
    ["calendar/calendar-agenda.tsx", /\bh-8\b/, "TOUCH_TARGET_32", 3],
    // edit and remove a list item
    ["profile/edit-profile-dialog.tsx", /\bh-8 w-8\b/, "TOUCH_TARGET_32", 2],
    // composer tools
    ["post/comments/post-comments.tsx", /\bh-9 w-9\b/, "TOUCH_TARGET_36", 1],
  ])("%s", (file, size, constant, count) => {
    const found = controls(file, size);

    expect(found).toHaveLength(count);
    for (const control of found) expect(control).toContain(constant);
  });
});

describe("a dynamic value does not squeeze the truncated text beside it", () => {
  it("the service category is capped on its full-width row", () => {
    const classes =
      source("messages/conversation-thread.tsx").match(
        /className="([^"]*)"\s*>\s*\{listing\.category\}/,
      )?.[1] ?? "";

    expect(classes).toContain("truncate");
    expect(classes).toMatch(/\bmax-w-/);
  });

  it("the study topic shrinks with the goal inside its chip", () => {
    // The chip is as wide as its content, so a percentage cap would cut a short topic too.
    const classes =
      source("study-pairs/study-pairs-view.tsx").match(
        /className="([^"]*)"\s*>\s*\{item\.topic\}/,
      )?.[1] ?? "";

    expect(classes).toContain("truncate");
    expect(classes).toContain("min-w-0");
    expect(classes).not.toContain("shrink-0");
    expect(classes).not.toMatch(/\bmax-w-/);
  });
});

describe("user text breaks a long word instead of widening the page", () => {
  it.each([
    ["post/rich-text.tsx", /<code className="([^"]*)">\{block\.text\}/],
    ["games/game-detail.tsx", /<p className="([^"]*)">\s*\{achievement\.texto\}/],
    ["games/game-detail.tsx", /<p className="([^"]*)">\s*\{g\.description\}/],
    ["games/game-detail.tsx", /<p className="([^"]*)">\s*\{update\.body\}/],
    ["moderation/games-review-section.tsx", /<p className="([^"]*)">\s*\{g\.description\}/],
    ["post/post-seal-picker.tsx", /<span className="([^"]*)">\{label\}/],
  ])("%s", (file, pattern) => {
    const match = source(file).match(pattern);

    expect(match, `element not found in ${file}`).not.toBeNull();
    expect(match?.[1]).toContain("break-words");
  });

  it("legal sections break long words in their paragraphs", () => {
    expect(source("legal/legal-layout.tsx")).toContain("[&_p]:break-words");
  });
});
