// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { LocalCommunitiesSectionProps } from "../../types/domain/communities/local-communities-section-props.js";

import { CommunityCard } from "./community-card.js";
import { CommunityLocationFilter } from "./community-location-filter.js";
import { LocalCommunitiesSection } from "./local-communities-section.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
const setSelect = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;

const buttonByText = (text: string) =>
  [...container.querySelectorAll("button")].find((button) => button.textContent === text);

const section = (patch: Partial<LocalCommunitiesSectionProps>) =>
  act(() =>
    root.render(
      <LocalCommunitiesSection
        viewerCity="Belo Horizonte"
        viewerState="MG"
        items={[]}
        loading={false}
        error={false}
        onRetry={() => undefined}
        onSetCity={() => undefined}
        {...patch}
      />,
    ),
  );

describe("LocalCommunitiesSection", () => {
  it("invites to set the city when the profile has none", () => {
    const onSetCity = vi.fn();
    section({ viewerCity: null, viewerState: null, loading: true, onSetCity });

    expect(container.querySelector('[role="status"]')).toBeNull();
    act(() => buttonByText("Informar minha cidade")!.click());
    expect(onSetCity).toHaveBeenCalledOnce();
  });

  it("shows loading, error with retry, and empty states", () => {
    section({ loading: true });
    expect(container.querySelector('[role="status"]')).not.toBeNull();

    const onRetry = vi.fn();
    section({ error: true, onRetry });
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    act(() => buttonByText("Tentar de novo")!.click());
    expect(onRetry).toHaveBeenCalledOnce();

    section({});
    expect(container.textContent).toContain("Nenhuma comunidade na sua região ainda");
  });

  it("lists communities with their location and link", () => {
    section({
      items: [
        {
          id: "c1",
          name: "Devs BH",
          avatar: null,
          members: 42,
          city: "Belo Horizonte",
          state: "MG",
          href: "/comunidades/c1",
        },
      ],
    });

    const link = container.querySelector("a")!;
    expect(link.getAttribute("href")).toBe("/comunidades/c1");
    expect(link.textContent).toContain("Devs BH");
    expect(link.textContent).toContain("Belo Horizonte, MG");
    expect(link.textContent).toContain("42 membros");
  });
});

describe("CommunityLocationFilter", () => {
  const fill = (city: string, state: string) => {
    const input = container.querySelector("input")!;
    const select = container.querySelector("select")!;
    act(() => {
      setInput.call(input, city);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => {
      setSelect.call(select, state);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };
  const submit = () =>
    act(() => {
      container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true }));
    });

  it("asks for the state before filtering by city", () => {
    const onApply = vi.fn();
    act(() =>
      root.render(
        <CommunityLocationFilter
          value={{ city: "", state: "" }}
          onApply={onApply}
          onClear={() => undefined}
        />,
      ),
    );
    expect(buttonByText("Limpar filtro")).toBeUndefined();

    fill("Contagem", "");
    submit();
    expect(onApply).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Escolha o estado para filtrar por cidade.");

    fill(" Contagem ", "MG");
    submit();
    expect(onApply).toHaveBeenCalledWith({ city: "Contagem", state: "MG" });
  });

  it("filters by state alone and clears an active filter", () => {
    const onApply = vi.fn();
    const onClear = vi.fn();
    act(() =>
      root.render(
        <CommunityLocationFilter
          value={{ city: "", state: "SP" }}
          onApply={onApply}
          onClear={onClear}
        />,
      ),
    );

    submit();
    expect(onApply).toHaveBeenCalledWith({ city: "", state: "SP" });
    act(() => buttonByText("Limpar filtro")!.click());
    expect(onClear).toHaveBeenCalledOnce();
  });
});

describe("CommunityCard location", () => {
  const community = {
    id: "c1",
    name: "Devs BH",
    description: null,
    topicLabel: null,
    members: 3,
    joined: false,
    cover: null,
    avatar: null,
  };
  const card = (extra: object) =>
    act(() =>
      root.render(
        <CommunityCard
          community={{ ...community, ...extra }}
          href="#"
          joinPending={false}
          leavePending={false}
          ownerBlocked={false}
          onJoin={() => undefined}
          onLeave={() => undefined}
        />,
      ),
    );

  it("shows the location only when present", () => {
    card({ city: "Belo Horizonte", state: "MG" });
    expect(container.textContent).toContain("Belo Horizonte, MG");
    expect(container.querySelector("svg.lucide-map-pin")).not.toBeNull();

    card({});
    expect(container.querySelector("svg.lucide-map-pin")).toBeNull();
  });
});
