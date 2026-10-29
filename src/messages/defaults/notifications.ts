import type { NotificationsMessages } from "../../types/messages/notifications-messages.js";

export const notificationsMessages: NotificationsMessages = {
  notificationsPopover: {
    title: "Notificações",
    markAllRead: "Ler tudo",
    overflowCount: "9+",
    tabs: {
      new: "Novas",
      history: "Histórico",
      requests: "Solicitações",
    },
    emptyNew: "Nenhuma notificação nova.",
    emptyHistory: "Nenhum histórico ainda.",
    emptyRequests: "Nenhuma solicitação pendente.",
    unreadLabel: (count) =>
      `${count} ${count === 1 ? "notificação não lida" : "notificações não lidas"}`,
  },
  notificationItem: {
    markRead: "Lida",
    accept: "Aceitar",
    openActorProfile: (name) => `Abrir o perfil de ${name || "quem interagiu"}`,
  },
  connectionRequestItem: { someone: "Alguém", accept: "Aceitar", reject: "Recusar" },
};
