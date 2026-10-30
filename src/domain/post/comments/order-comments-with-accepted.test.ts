import { describe, expect, it } from "vitest";

import { orderCommentsWithAccepted } from "./order-comments-with-accepted.js";

const node = (id: string, parentCommentId: string | null = null) => ({
  id,
  parentCommentId,
  authorName: id,
});
const ids = (list: { id: string }[]) => list.map((comment) => comment.id);

describe("orderCommentsWithAccepted", () => {
  const comments = [node("a"), node("b"), node("b1", "b"), node("b2", "b1"), node("c")];

  it("keeps the order when nothing is accepted or the id is not loaded", () => {
    expect(orderCommentsWithAccepted(comments, null)).toBe(comments);
    expect(ids(orderCommentsWithAccepted(comments, "zz"))).toEqual(ids(comments));
  });

  it("moves an accepted root comment first", () => {
    expect(ids(orderCommentsWithAccepted(comments, "c"))).toEqual(["c", "a", "b", "b1", "b2"]);
  });

  it("moves the root of an accepted reply first", () => {
    expect(ids(orderCommentsWithAccepted(comments, "b2"))).toEqual(["b", "a", "b1", "b2", "c"]);
  });
});
