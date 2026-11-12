// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarAnswer } from "../../types/domain/calendar/calendar-answer.js";
import type { CalendarPendingInvitationData } from "../../types/domain/calendar/calendar-pending-invitation-data.js";

import { CalendarPendingInvitations } from "./calendar-pending-invitations.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar;
const SP = "America/Sao_Paulo";

const invitation: CalendarPendingInvitationData = {
  id: "cal_convite",
  scope: "PROFESSIONAL",
  kind: "INTERVIEW",
  title: "Entrevista na Aurora",
  startsAt: "2026-11-14T13:00:00Z",
  endsAt: "2026-11-14T14:00:00Z",
  allDay: false,
  timeZoneId: SP,
};

let host: HTMLDivElement;
let root: Root;
let answers: { entryId: string; answer: CalendarAnswer }[];

const render = (props: Partial<Parameters<typeof CalendarPendingInvitations>[0]> = {}) => {
  act(() =>
    root.render(
      <CalendarPendingInvitations
        invitations={[invitation]}
        timeZoneId={SP}
        onRespond={(entryId, answer) => answers.push({ entryId, answer })}
        {...props}
      />,
    ),
  );
  return host;
};

const button = (label: string) =>
  [...document.body.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
};

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  answers = [];
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("CalendarPendingInvitations", () => {
  it("draws nothing when there is no invitation waiting", () => {
    render({ invitations: [] });

    expect(document.body.textContent).not.toContain(messages.pendingInvitations.title);
    expect(document.body.querySelector("section")).toBeNull();
  });

  it("shows the invitation with its own day and time, outside the period on screen", () => {
    render();

    expect(document.body.textContent).toContain(messages.pendingInvitations.title);
    expect(document.body.textContent).toContain(invitation.title);
    // 13:00Z is 10:00 in São Paulo; the day is the reader's, not the organizer's.
    expect(document.body.textContent).toContain("10:00");
    expect(document.body.textContent).toContain("11:00");
    expect(document.body.textContent).toContain("14");
  });

  it("answers with the entry id and the chosen answer", () => {
    render();

    click(button(messages.accept));
    click(button(messages.tentative));
    click(button(messages.decline));

    expect(answers).toEqual([
      { entryId: invitation.id, answer: "ACCEPTED" },
      { entryId: invitation.id, answer: "TENTATIVE" },
      { entryId: invitation.id, answer: "DECLINED" },
    ]);
  });

  it("waits for the server while the answer is being sent", () => {
    render({ respondingId: invitation.id });

    expect(button(messages.accept)?.disabled).toBe(true);
    expect(document.body.textContent).toContain(messages.responding);
  });

  it("shows the refusal without hiding the invitation", () => {
    render({ respondError: true });

    expect(document.body.querySelector("[role=alert]")?.textContent).toBe(messages.respondError);
    expect(document.body.textContent).toContain(invitation.title);
  });

  it("links the title to the entry when the app knows how to open it", () => {
    render({ itemHref: (id) => `/agenda/${id}` });

    const link = document.body.querySelector("a");
    expect(link?.getAttribute("href")).toBe(`/agenda/${invitation.id}`);
    expect(link?.getAttribute("aria-label")).toBe(messages.openEntry(invitation.title));
  });

  it("shows an all-day invitation as all day, not as a midnight range", () => {
    render({
      invitations: [{ ...invitation, allDay: true }],
    });

    expect(document.body.textContent).toContain(messages.allDay);
  });
});
