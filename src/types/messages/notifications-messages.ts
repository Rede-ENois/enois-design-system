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
};
