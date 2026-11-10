import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { NotificationData } from "../../types/domain/notifications/notification-data.js";
import type { NotificationPreferenceKey } from "../../types/domain/notifications/notification-preference-key.js";
import type { NotificationPreferencesProps } from "../../types/domain/notifications/notification-preferences-props.js";
import type { NotificationPreferencesSaveStatus } from "../../types/domain/notifications/notification-preferences-save-status.js";
import type { NotificationPreferencesValues } from "../../types/domain/notifications/notification-preferences-values.js";

import { NotificationPreferences } from "./notification-preferences.js";
import { NotificationsPanel } from "./notifications-panel.js";
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
          preferencesHref="#"
        />
      </div>
    );
  },
};

const preferenceValues: NotificationPreferencesValues = {
  weeklyDigest: true,
  pushSocial: true,
  pushMessages: true,
  pushGroups: false,
  pushJobs: true,
  pushSystem: true,
};

const noop = () => {};

const preferencesBase: NotificationPreferencesProps = {
  values: preferenceValues,
  onRetry: noop,
  onChange: noop,
  pushEnabled: true,
};

/** Interactive: each toggle "saves" for 1s, like the optimistic mutation in the app. */
export const Preferences: StoryObj = {
  render: function PreferencesStory() {
    const [current, setCurrent] = useState(preferenceValues);
    const [pending, setPending] = useState<Partial<Record<NotificationPreferenceKey, boolean>>>({});
    const [status, setStatus] = useState<NotificationPreferencesSaveStatus>("idle");

    return (
      <NotificationPreferences
        {...preferencesBase}
        values={current}
        pending={pending}
        saveStatus={status}
        onChange={(key, value) => {
          setCurrent((prev) => ({ ...prev, [key]: value }));
          setPending((prev) => ({ ...prev, [key]: true }));
          setStatus("saving");
          setTimeout(() => {
            setPending((prev) => ({ ...prev, [key]: false }));
            setStatus("saved");
          }, 1000);
        }}
      />
    );
  },
};

export const PreferencesLoading: StoryObj = {
  render: () => <NotificationPreferences {...preferencesBase} values={null} loading />,
};

export const PreferencesLoadError: StoryObj = {
  render: () => <NotificationPreferences {...preferencesBase} values={null} loadError />,
};

export const PreferencesPushDisabled: StoryObj = {
  render: () => (
    <NotificationPreferences {...preferencesBase} pushEnabled={false} onEnablePush={noop} />
  ),
};

export const PreferencesSaving: StoryObj = {
  render: () => (
    <NotificationPreferences
      {...preferencesBase}
      pending={{ pushGroups: true }}
      saveStatus="saving"
    />
  ),
};

export const PreferencesSaveFailed: StoryObj = {
  render: () => <NotificationPreferences {...preferencesBase} saveStatus="error" />,
};

const pageNotifications: NotificationData[] = [
  { ...notifications[0], dayLabel: "Hoje" },
  {
    ...base,
    id: "n3",
    kind: "GROUP_NEW_POST",
    actorId: null,
    actorName: null,
    actorHref: null,
    place: { name: "Bancos de Dados", color: "#0f766e" },
    title: "Bancos de Dados tem 4 conversas novas",
    body: "",
    read: false,
    dayLabel: "Hoje",
  },
  {
    ...base,
    id: "n4",
    kind: "EVENT_NEXT_OCCURRENCE",
    actorId: null,
    actorName: null,
    actorHref: null,
    eventDay: "03",
    title: "Live de Kotlin começa amanhã às 19h",
    body: "",
    read: true,
    dayLabel: "Ontem",
  },
  { ...notifications[1], dayLabel: "Ontem" },
];

export const Page: StoryObj = {
  render: () => (
    <div className="mx-auto max-w-xl p-4">
      <NotificationsPanel
        variant="page"
        notifications={pageNotifications}
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
        preferencesHref="#preferencias"
        hasMore
        onLoadMore={() => {}}
      />
    </div>
  ),
};
