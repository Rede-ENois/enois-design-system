import type { EmotesMessages } from "../../types/messages/emotes-messages.js";

export const emotesMessages: EmotesMessages = {
  emotePickerDialog: {
    title: "Figurinhas",
    trigger: "Figurinhas",
    searchPlaceholder: "Buscar figurinha",
    tabRecent: "Recentes",
    tabEnois: "É Nóis",
    tabThirdParty: "De terceiros",
    loading: "Carregando figurinhas...",
    empty: "Nenhuma figurinha com esse nome.",
    error: "Não foi possível carregar as figurinhas agora.",
    hint: "As mais usadas primeiro. A figurinha entra no texto como :codigo:, e quem lê vê a imagem.",
    count: (total: number) => `${total} ${total === 1 ? "figurinha" : "figurinhas"}`,
    page: (page: number, totalPages: number) => `Página ${page} de ${totalPages}`,
    previous: "Página anterior",
    next: "Próxima página",
    holdHint: "Segure para denunciar ou banir",
  },
  emoteActionDialog: {
    title: "Figurinha",
    description: "Segurou a figurinha. O que você quer fazer com ela?",
    report: "Denunciar",
    reportDone: "Você já denunciou esta figurinha.",
    reports: (denunciantes: number, limiar: number) =>
      `${denunciantes} de ${limiar} denúncias tiram a figurinha do ar`,
    ban: "Banir figurinha",
    unban: "Desfazer o banimento",
    banned: "Esta figurinha está fora do ar.",
    reasonLabel: "Motivo",
    reasonPlaceholder: "Por que esta figurinha sai do ar? (pelo menos 10 caracteres)",
    reasonRequired: "Escreva o motivo (pelo menos 10 caracteres).",
    cancel: "Cancelar",
    error: "Não foi possível concluir. Tente de novo.",
    official: "As figurinhas do É Nóis não podem ser denunciadas nem banidas.",
  },
};
