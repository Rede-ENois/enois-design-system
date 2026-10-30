// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { streakWeek } from "../../lib/streak/streak-week.js";
import type { StreakCardProps } from "../../types/domain/streak/streak-card-props.js";
import type { StreakData } from "../../types/domain/streak/streak-data.js";

import { StreakCard } from "./streak-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const TODAY = "2026-10-30";
const streak: StreakData = {
  currentDays: 4,
  longestDays: 9,
  todayDone: true,
  freezesAvailable: 0,
  lastFrozenDay: "2026-10-28",
};

function render(props: Partial<StreakCardProps>) {
  act(() => root.render(<StreakCard today={TODAY} streak={streak} {...props} />));
  return container;
}

describe("streakWeek", () => {
  it("spends counted days walking back and skips the frozen day without counting it", () => {
    expect(streakWeek(streak, TODAY).map((d) => `${d.date.slice(8)}:${d.state}`)).toEqual([
      "24:missed",
      "25:missed",
      "26:done",
      "27:done",
      "28:frozen",
      "29:done",
      "30:done",
    ]);
  });

  it("leaves today open when it has not counted yet", () => {
    const week = streakWeek(
      { ...streak, todayDone: false, lastFrozenDay: null, currentDays: 2 },
      TODAY,
    );
    expect(week.map((d) => d.state)).toEqual([
      "missed",
      "missed",
      "missed",
      "missed",
      "done",
      "done",
      "today",
    ]);
  });

  it("crosses month boundaries", () => {
    expect(streakWeek(streak, "2026-11-02")[0]!.date).toBe("2026-10-27");
  });
});

describe("StreakCard", () => {
  it("shows the days, record, today status and the used rest day", () => {
    const text = render({}).textContent;

    expect(text).toContain("4 dias seguidos");
    expect(text).toContain("Seu recorde: 9 dias");
    expect(text).toContain("Hoje já conta");
    expect(text).toContain("Descanso usado em 28/10");
    expect(text).not.toContain("Que bom ter você");
    expect(container.querySelector("ol")!.getAttribute("aria-label")).toBe("Últimos 7 dias");
    expect(container.querySelectorAll("ol li")).toHaveLength(7);
  });

  it("hints what counts while today is open and announces the available rest day", () => {
    const text = render({
      streak: { ...streak, todayDone: false, freezesAvailable: 1, lastFrozenDay: null },
    }).textContent;

    expect(text).toContain("Para contar hoje");
    expect(text).toContain("1 descanso disponível nesta semana");
    expect(text).toContain("hoje, ainda em aberto");
  });

  it("celebrates a week quietly", () => {
    expect(render({ streak: { ...streak, currentDays: 7 } }).textContent).toContain(
      "Uma semana seguida",
    );
  });

  it("invites to start without guilt at zero", () => {
    const text = render({
      streak: { ...streak, currentDays: 0, todayDone: false },
    }).textContent;

    expect(text).toContain("Comece hoje");
    expect(container.querySelector("ol")).toBeNull();
  });

  it("renders loading and error with retry", () => {
    expect(render({ loading: true }).querySelector('[role="status"]')).not.toBeNull();

    const onRetry = vi.fn();
    render({ error: true, onRetry });
    expect(container.querySelector('[role="alert"]')!.textContent).toContain(
      "Não deu para carregar",
    );
    act(() => container.querySelector("button")!.click());
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("compact variant carries the full meaning in its label", () => {
    render({ variant: "compact" });
    expect(container.querySelector('[role="img"]')!.getAttribute("aria-label")).toBe(
      "Sequência de 4 dias, hoje já conta",
    );
  });
});
