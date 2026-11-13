// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProfileReplyCard } from "./profile-reply-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("ProfileReplyCard", () => {
  it("shows the comment content and reply context", () => {
    act(() =>
      root.render(
        <ProfileReplyCard
          authorName="Pedro"
          authorAvatar={null}
          content="Boa observação!"
          replyToAuthor="Ana"
          replyToSnippet="Post original da Ana sobre tech..."
        />,
      ),
    );
    expect(container.textContent).toContain("Em resposta a Ana");
    expect(container.textContent).toContain("Post original da Ana sobre tech...");
    expect(container.textContent).toContain("Boa observação!");
    expect(container.textContent).toContain("Pedro");
  });

  it("hides context when replyToAuthor is null", () => {
    act(() =>
      root.render(
        <ProfileReplyCard
          authorName="Pedro"
          authorAvatar={null}
          content="Comentário"
          replyToAuthor={null}
          replyToSnippet={null}
        />,
      ),
    );
    expect(container.textContent).not.toContain("Em resposta a");
    expect(container.textContent).toContain("Comentário");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    act(() =>
      root.render(
        <ProfileReplyCard
          authorName="Pedro"
          authorAvatar={null}
          content="Test"
          replyToAuthor={null}
          replyToSnippet={null}
          onClick={onClick}
        />,
      ),
    );
    act(() => container.querySelector("button")!.click());
    expect(onClick).toHaveBeenCalledOnce();
  });
});
