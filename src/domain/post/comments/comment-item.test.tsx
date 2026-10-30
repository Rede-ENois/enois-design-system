// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CommentItem } from "./comment-item.js";

const emojis = { LIKE: "👍", LOVE: "❤️" };
const comment = { authorName: "Ana", authorAvatar: null };

const renderItem = (props: Partial<Parameters<typeof CommentItem<"LIKE" | "LOVE">>[0]> = {}) =>
  renderToStaticMarkup(
    <CommentItem
      comment={comment}
      content="Oi"
      edited={false}
      timeLabel="há 2 min"
      isOwner={false}
      canPin={false}
      emojis={emojis}
      reaction="LOVE"
      onReact={() => {}}
      onReply={() => {}}
      onTogglePin={() => {}}
      onDelete={() => {}}
      onReport={() => {}}
      onSaveEdit={async () => true}
      onCancelEdit={() => {}}
      renderRichText={({ content }) => <p>{content}</p>}
      renderMediaGrid={() => null}
      renderEditField={() => null}
      {...props}
    />,
  );

describe("CommentItem", () => {
  it("draws the reaction pills and turns the total into a who-reacted button", () => {
    const html = renderItem({ reactionSummary: { LOVE: 2, LIKE: 1 }, onShowReactions: () => {} });

    expect(html).toContain('aria-label="Remover reação ❤️"');
    expect(html).toContain('aria-label="Reagir com 👍"');
    expect(html).toContain('aria-label="Ver quem reagiu (3 reações)"');
  });

  it("keeps the plain count when there is no who-reacted dialog", () => {
    const html = renderItem({ comment: { ...comment, reactionCount: 1 } });

    expect(html).not.toContain("Ver quem reagiu");
    expect(html).toContain('<span class="text-xs tabular-nums">1</span>');
  });

  it("hands avatar and name to the app trigger instead of the profile link", () => {
    const html = renderItem({
      profileHref: "/perfil/ana",
      renderAuthorTrigger: (content, part) => <button data-part={part}>{content}</button>,
    });

    expect(html).toContain('data-part="avatar"');
    expect(html).toContain('data-part="name"');
    expect(html).not.toContain('href="/perfil/ana"');
  });

  it("marks the accepted answer", () => {
    expect(renderItem({ comment: { ...comment, accepted: true } })).toContain("Resposta aceita");
    expect(renderItem()).not.toContain("Resposta aceita");
  });

  it("offers mark/unmark only when canAccept is true", () => {
    expect(renderItem({ onAccept: () => {} })).not.toContain("Marcar como resposta");
    expect(renderItem({ canAccept: true, onAccept: () => {} })).toContain("Marcar como resposta");
    expect(
      renderItem({
        canAccept: true,
        onUnaccept: () => {},
        comment: { ...comment, accepted: true },
      }),
    ).toContain("Desmarcar");
  });
});
