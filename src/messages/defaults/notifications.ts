import type { NotificationsMessages } from "../../types/messages/notifications-messages.js";

export const notificationsMessages: NotificationsMessages = {
  notificationsPopover: {
    title: "Notificações",
    markAllRead: "Ler tudo",
    preferences: "Preferências de notificação",
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
  notificationPreferences: {
    emailTitle: "E-mail",
    pushTitle: "Avisos no navegador",
    pushHint: "Escolha o que merece um aviso na hora.",
    items: {
      weeklyDigest: {
        label: "Resumo semanal",
        hint: "Chega na segunda de manhã com o que rolou na sua rede, só quando houver novidade.",
      },
      pushSocial: {
        label: "Interações",
        hint: "Conexões, comentários, respostas, reações e menções.",
      },
      pushMessages: { label: "Mensagens", hint: "Mensagens diretas." },
      pushGroups: {
        label: "Grupos, blogs e jogos",
        hint: "Novidades dos espaços que você acompanha.",
      },
      pushJobs: { label: "Vagas", hint: "Andamento das suas candidaturas." },
      pushSystem: { label: "Énóis", hint: "Suporte, microprojetos e avisos do Énóis." },
    },
    pushOff:
      "Os avisos estão desligados neste dispositivo. Suas escolhas ficam guardadas e passam a valer quando você ligar.",
    enablePush: "Ligar avisos",
    enablingPush: "Ligando…",
    securityNote: "Avisos de segurança e moderação sempre chegam.",
    loading: "Carregando suas preferências",
    loadError: "Não foi possível carregar suas preferências.",
    retry: "Tentar de novo",
    saving: "Salvando…",
    saved: "Preferência salva.",
    saveError: "Não foi possível salvar. Tente de novo.",
  },
};
