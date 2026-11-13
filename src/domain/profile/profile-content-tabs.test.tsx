// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ProfileContentTab } from "../../types/domain/profile/profile-content-tab.js";

import { ProfileContentTabs } from "./profile-content-tabs.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function render(overrides: { activeTab?: ProfileContentTab; isOwner?: boolean } = {}) {
  const onTabChange = vi.fn<(tab: ProfileContentTab) => void>();
  act(() =>
    root.render(
      <ProfileContentTabs
        activeTab={overrides.activeTab ?? "ALL"}
        onTabChange={onTabChange}
        isOwner={overrides.isOwner ?? true}
      />,
    ),
  );
  return onTabChange;
}

const tabs = () => container.querySelectorAll<HTMLButtonElement>("[role=tab]");
const tab = (label: string) => [...tabs()].find((el) => el.textContent?.includes(label));

describe("ProfileContentTabs", () => {
  it("renders all five tabs", () => {
    render();
    expect(tabs()).toHaveLength(5);
    for (const label of ["Todos", "Posts", "Respostas", "Reposts", "Mídia"]) {
      expect(tab(label), label).toBeTruthy();
    }
  });

  it("marks the active tab with aria-selected and an underline indicator", () => {
    render({ activeTab: "MEDIA" });
    const media = tab("Mídia")!;
    expect(media.getAttribute("aria-selected")).toBe("true");
    expect(media.querySelector("[aria-hidden]")).toBeTruthy();

    const posts = tab("Posts")!;
    expect(posts.getAttribute("aria-selected")).toBe("false");
    expect(posts.querySelector("[aria-hidden]")).toBeNull();
  });

  it("fires onTabChange when a tab is clicked", () => {
    const onTabChange = render();
    act(() => tab("Reposts")!.click());
    expect(onTabChange).toHaveBeenCalledWith("REPOSTS");
  });

  it("disables REPLIES for non-owners with a lock icon", () => {
    render({ isOwner: false });
    const replies = tab("Respostas")!;
    expect(replies.disabled).toBe(true);
    expect(replies.getAttribute("aria-disabled")).toBe("true");
    expect(replies.querySelector("svg")).toBeTruthy();
  });

  it("enables REPLIES for owners", () => {
    render({ isOwner: true });
    const replies = tab("Respostas")!;
    expect(replies.disabled).toBe(false);
    expect(replies.querySelector("svg")).toBeNull();
  });
});
