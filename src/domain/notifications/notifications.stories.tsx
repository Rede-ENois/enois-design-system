import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { NotificationData } from "../../types/domain/notifications/notification-data.js";

import { NotificationsPopover } from "./notifications-popover.js";

const meta: Meta = {
  title: "Domain/Notifications",
};

export default meta;

const base = {
  actorId: "u1",
  actorName: "Ana Souza",
  actorAvatar: null,
  actorHref: "#",
  timeLabel: "há 5 minutos",
  href: "/feed",
  ctaLabel: "",
};

const notifications: NotificationData[] = [
  {
    ...base,
    id: "n1",
    kind: "NEW_REACTION",
    title: "Curtiu seu post",
    body: "Bom dia!",
    read: false,
  },
  {
    ...base,
    id: "n2",
    kind: "NEW_COMMENT",
    title: "Comentou no seu post",
    body: "Concordo demais.",
    preview:
      "Hoje aprendi a usar query factories no TanStack Query e o cache ficou muito mais claro…",
    read: true,
  },
];

export const Popover: StoryObj = {
  render: function PopoverStory() {
    const [open, setOpen] = useState(true);

    return (
      <div className="flex justify-end">
        <NotificationsPopover
          open={open}
          onOpenChange={setOpen}
          notifications={notifications}
          requests={[
            {
              id: "r1",
              fromUserId: "u2",
              dateLabel: "26 de out.",
              profileHref: "#",
              profile: { name: "Bruno Lima", username: "bruno", headline: "Designer" },
            },
          ]}
          requestsLoading={false}
          acceptingActorId={null}
          rejectingActorId={null}
          markAllPending={false}
          onMarkAllRead={() => {}}
          onMarkAsRead={() => {}}
          onAcceptConnection={() => {}}
          onRejectConnection={() => {}}
          onOpenNotification={() => setOpen(false)}
        />
      </div>
    );
  },
};
