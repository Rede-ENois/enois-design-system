import type { NotificationPreferenceKey } from "../domain/notifications/notification-preference-key.js";

export type NotificationsMessages = {
  notificationsPopover: {
    title: string;
    markAllRead: string;
    overflowCount: string;
    tabs: { new: string; history: string; requests: string };
    emptyNew: string;
    emptyHistory: string;
    emptyRequests: string;
    unreadLabel: (count: number) => string;
  };
  notificationItem: {
    markRead: string;
    accept: string;
    openActorProfile: (name: string) => string;
  };
  connectionRequestItem: { someone: string; accept: string; reject: string };
  notificationPreferences: {
    emailTitle: string;
    pushTitle: string;
    pushHint: string;
    items: Record<NotificationPreferenceKey, { label: string; hint: string }>;
    pushOff: string;
    enablePush: string;
    enablingPush: string;
    securityNote: string;
    loading: string;
    loadError: string;
    retry: string;
    saving: string;
    saved: string;
    saveError: string;
  };
};
