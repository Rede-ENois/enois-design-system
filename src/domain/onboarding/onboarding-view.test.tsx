// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { OnboardingViewProps } from "../../types/domain/onboarding/onboarding-view-props.js";

import { OnboardingView } from "./onboarding-view.js";

const messages = defaultMessages.onboardingView;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const community = (id: string) => ({
  id,
  name: `Comunidade ${id}`,
  description: null,
  topicLabel: "Tecnologia",
  avatar: null,
  memberCount: 10,
});

function props(overrides: Partial<OnboardingViewProps> = {}): OnboardingViewProps {
  return {
    step: "interests",
    onStepChange: vi.fn(),
    topics: [
      { value: "TECNOLOGIA", label: "Tecnologia" },
      { value: "DESIGN", label: "Design" },
    ],
    selectedTopics: [],
    onToggleTopic: vi.fn(),
    skills: [],
    skillSuggestions: ["React", "Go"],
    onAddSkill: vi.fn(),
    onRemoveSkill: vi.fn(),
    packLoading: false,
    packError: false,
    onRetryPack: vi.fn(),
    communities: [community("c1"), community("c2"), community("c3")],
    groups: [],
    people: [{ id: "p1", username: "ana", name: "Ana Exemplo", headline: null, avatar: null }],
    selectedCommunityIds: [],
    selectedGroupIds: [],
    selectedPersonIds: [],
    onToggleCommunity: vi.fn(),
    onToggleGroup: vi.fn(),
    onTogglePerson: vi.fn(),
    submitting: false,
    onComplete: vi.fn(),
    onSkip: vi.fn(),
    ...overrides,
  };
}

const render = (all: OnboardingViewProps) => act(() => root.render(<OnboardingView {...all} />));

const button = (label: string) =>
  [...host.querySelectorAll("button")].find((b) => b.textContent?.trim() === label) as
    HTMLButtonElement | undefined;

const click = (element: HTMLElement | undefined) => {
  expect(element).toBeDefined();
  act(() => element!.click());
};

describe("OnboardingView", () => {
  it("toggles topics and adds skills by Enter and by suggestion", () => {
    const all = props();
    render(all);

    click(button("Design"));
    expect(all.onToggleTopic).toHaveBeenCalledWith("DESIGN");

    const input = host.querySelector("input")!;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, "  Figma  ");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(all.onAddSkill).toHaveBeenCalledWith("Figma");

    click(button("Go"));
    expect(all.onAddSkill).toHaveBeenCalledWith("Go");
  });

  it("stops adding skills at the cap and hides the suggestions", () => {
    const all = props({ skills: ["React", "Go"], maxSkills: 2 });
    render(all);

    expect(host.querySelector("input")!.disabled).toBe(true);
    expect(host.textContent).toContain(messages.skillsFull);
    expect(host.textContent).toContain(messages.skillsCount(2, 2));
    expect(button("React")).toBeUndefined();
  });

  it("toggles starter pack cards and blocks new picks past the cap", () => {
    const all = props({ step: "pack", selectedCommunityIds: ["c1", "c2"], maxCommunities: 2 });
    render(all);

    const card = (name: string) =>
      [...host.querySelectorAll<HTMLButtonElement>("button[aria-pressed]")].find((b) =>
        b.textContent?.includes(name),
      )!;

    expect(card("Comunidade c1").getAttribute("aria-pressed")).toBe("true");
    expect(card("Comunidade c3").disabled).toBe(true);
    expect(host.textContent).toContain(messages.limitReached);

    click(card("Comunidade c3"));
    expect(all.onToggleCommunity).not.toHaveBeenCalled();

    click(card("Comunidade c1"));
    expect(all.onToggleCommunity).toHaveBeenCalledWith("c1");

    click(card("Ana Exemplo"));
    expect(all.onTogglePerson).toHaveBeenCalledWith("p1");
    expect(host.textContent).toContain(messages.groupsEmpty);
  });

  it("calls skip on every step and complete on the last one", () => {
    const all = props();
    render(all);
    click(button(messages.skip));
    click(button(messages.next));
    expect(all.onStepChange).toHaveBeenCalledWith("pack");

    render({ ...all, step: "pack" });
    click(button(messages.skip));
    click(button(messages.complete));
    expect(all.onSkip).toHaveBeenCalledTimes(2);
    expect(all.onComplete).toHaveBeenCalledTimes(1);
  });

  it("disables every action while submitting", () => {
    render(props({ step: "pack", submitting: true }));

    expect(button(messages.submitting)?.disabled).toBe(true);
    expect(button(messages.skip)?.disabled).toBe(true);
    expect(button(messages.back)?.disabled).toBe(true);
  });

  it("shows the pack error with a retry", () => {
    const all = props({ step: "pack", packError: true });
    render(all);

    expect(host.textContent).toContain(messages.error);
    click(button(messages.retry));
    expect(all.onRetryPack).toHaveBeenCalled();
  });

  it("moves focus to the heading on step change, not on mount", () => {
    const all = props();
    render(all);
    const heading = () => host.querySelector("h1")!;
    expect(document.activeElement).not.toBe(heading());

    render({ ...all, step: "pack" });
    expect(document.activeElement).toBe(heading());
    expect(heading().textContent).toBe(messages.packTitle);
    expect(host.textContent).toContain(messages.progress(2, 2));
  });
});
