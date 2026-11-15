import { describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PostType } from "../../types/domain/post/post-type.js";

import { POST_TYPE_META } from "./post-type-meta.js";

describe("POST_TYPE_META", () => {
  it("cada tipo de post tem meta e rótulo — inclusive o novo COMPLAINT", () => {
    const types = Object.keys(POST_TYPE_META) as PostType[];
    for (const type of types) {
      expect(POST_TYPE_META[type], `meta de ${type}`).toBeTruthy();
      expect(defaultMessages.postCard.types[type], `rótulo de ${type}`).toBeTruthy();
    }
    expect(POST_TYPE_META.COMPLAINT.className).toContain("text-opportunity-foreground");
    expect(defaultMessages.postCard.types.COMPLAINT).toBe("Reclamação");
  });
});
