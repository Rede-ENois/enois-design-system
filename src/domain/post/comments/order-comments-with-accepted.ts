import type { PostCommentNode } from "../../../types/domain/post/post-comment-node.js";

/**
 * Moves the thread holding the accepted answer to the top, keeping every other comment in order.
 * When the accepted comment is a reply, its root comment goes first so the thread stays intact.
 */
export function orderCommentsWithAccepted<C extends PostCommentNode>(
  comments: C[],
  acceptedId: string | null | undefined,
): C[] {
  if (!acceptedId) return comments;
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  let root = byId.get(acceptedId);
  const seen = new Set<string>();
  while (root?.parentCommentId && byId.has(root.parentCommentId) && !seen.has(root.id)) {
    seen.add(root.id);
    root = byId.get(root.parentCommentId);
  }
  if (!root) return comments;
  return [root, ...comments.filter((comment) => comment !== root)];
}
