// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { NotificationsPopoverProps } from "../../types/domain/notifications/notifications-popover-props.js";

import { NotificationsPopover } from "./notifications-popover.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function render(props: Partial<NotificationsPopoverProps> = {}) {
  act(() =>
    root.render(
      <NotificationsPopover
        open
        onOpenChange={() => {}}
        notifications={[]}
        requests={[]}
        requestsLoading={false}
        acceptingActorId={null}
        rejectingActorId={null}
        markAllPending={false}
        onMarkAllRead={() => {}}
        onMarkAsRead={() => {}}
        onAcceptConnection={() => {}}
        onRejectConnection={() => {}}
        onOpenNotification={() => {}}
        {...props}
      />,
    ),
  );
}

const preferencesLink = () =>
  document.body.querySelector<HTMLAnchorElement>('a[aria-label="Preferências de notificação"]');

describe("NotificationsPopover: preferences link", () => {
  it("links to the preferences page when preferencesHref is set", () => {
    render({ preferencesHref: "/configuracoes/notificacoes" });

    expect(preferencesLink()?.getAttribute("href")).toBe("/configuracoes/notificacoes");
  });

  it("renders no link without preferencesHref", () => {
    render();

    expect(document.body.textContent).toContain("Notificações");
    expect(preferencesLink()).toBeNull();
  });
});
