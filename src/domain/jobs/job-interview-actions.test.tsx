// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { JobInterviewActionsProps } from "../../types/domain/jobs/job-interview-actions-props.js";

import { JobInterviewActions } from "./job-interview-actions.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.jobInterviewActions;

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<JobInterviewActionsProps> = {}) => {
  act(() =>
    root.render(
      <JobInterviewActions
        onSchedule={() => {}}
        onReschedule={() => {}}
        onCancel={() => {}}
        {...props}
      />,
    ),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("ações de entrevista da candidatura", () => {
  it("sem entrevista, oferece marcar", () => {
    render();

    expect(text()).toContain(messages.schedule);
    expect(button(messages.reschedule)).toBeUndefined();
    expect(button(messages.cancel)).toBeUndefined();
  });

  it("com entrevista, mostra o horário no fuso em que foi marcada e oferece reagendar e cancelar", () => {
    render({
      interview: {
        id: "i1",
        startsAt: "2027-03-10T17:00:00Z",
        endsAt: "2027-03-10T18:00:00Z",
        timeZoneId: "America/Sao_Paulo",
        notes: null,
      },
    });

    // 17:00 UTC é 14:00 em São Paulo: a linha mostra a hora da agenda, não a do runtime.
    expect(text()).toContain("14:00");
    expect(button(messages.reschedule)).toBeDefined();
    expect(button(messages.cancel)).toBeDefined();
    expect(button(messages.schedule)).toBeUndefined();
  });

  it("cada ação chama o callback correspondente", () => {
    const onSchedule = vi.fn();
    const onReschedule = vi.fn();
    const onCancel = vi.fn();

    render({ onSchedule });
    act(() => button(messages.schedule)?.click());
    expect(onSchedule).toHaveBeenCalledTimes(1);

    render({
      interview: {
        id: "i1",
        startsAt: "2027-03-10T17:00:00Z",
        endsAt: "2027-03-10T18:00:00Z",
        timeZoneId: "America/Sao_Paulo",
        notes: null,
      },
      onReschedule,
      onCancel,
    });
    act(() => button(messages.reschedule)?.click());
    act(() => button(messages.cancel)?.click());
    expect(onReschedule).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("mostra o erro quando a última requisição falhou", () => {
    render({ error: "Não foi possível salvar a entrevista." });

    expect(text()).toContain("Não foi possível salvar a entrevista.");
  });
});
