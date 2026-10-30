import type { NetworkMessages } from "../../types/messages/network-messages.js";

export const networkMessages: NetworkMessages = {
  networkRequests: {
    title: "Convites de conexão",
    summary: (incoming) =>
      incoming === 0
        ? "Ninguém esperando a sua resposta."
        : incoming === 1
          ? "1 pessoa quer se conectar com você."
          : `${incoming} pessoas querem se conectar com você.`,
    tabsLabel: "Tipo de convite",
    received: (count) => `Recebidos (${count})`,
    sent: (count) => `Enviados (${count})`,
    receivedAt: (date) => `Convidou você ${date}`,
    sentAt: (date) => `Você convidou ${date}`,
    accept: "Aceitar",
    acceptFrom: (name) => `Aceitar o convite de ${name}`,
    decline: "Recusar",
    declineFrom: (name) => `Recusar o convite de ${name}`,
    cancel: "Cancelar convite",
    cancelTo: (name) => `Cancelar convite para ${name}`,
    accepted: "Agora vocês estão conectados",
    declined: "Convite recusado",
    cancelled: "Convite cancelado",
    failed: "Não deu certo. Tente de novo.",
    viewProfile: "Ver perfil",
    emptyReceived: "Nenhum convite esperando por você agora.",
    emptySent: "Nenhum convite seu aguardando resposta.",
    showAll: (count) => `Ver todos os ${count}`,
    showLess: "Mostrar menos",
    loading: "Carregando convites",
    loadError: "Não foi possível carregar os convites.",
    retry: "Tentar de novo",
  },
};
