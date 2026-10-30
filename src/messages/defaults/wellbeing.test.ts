import { describe, expect, it } from "vitest";

import { wellbeingMessages } from "./wellbeing.js";

// Mirror of the backend `ContentTaxonomy.MODULES`: a module missing here has no switch in the UI.
const BACKEND_MODULES = [
  "COMMUNITIES",
  "GROUPS",
  "MESSAGES",
  "BLOGS",
  "JOBS",
  "COMPANIES",
  "MENTORING",
  "EVENTS",
  "DAILY_GAMES",
  "COMMUNITY_GAMES",
  "COMMUNITY_PROJECTS",
];

describe("wellbeing messages", () => {
  it("lists a switch for every backend module", () => {
    const ids = wellbeingMessages.healthyUsageDialog.modules.map((module) => module.id);

    expect(ids).toEqual(expect.arrayContaining(BACKEND_MODULES));
  });

  it("has no em/en dashes or emojis in the copy", () => {
    expect(JSON.stringify(wellbeingMessages)).not.toMatch(/[–—]|\p{Extended_Pictographic}/u);
  });
});
