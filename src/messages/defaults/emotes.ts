import type { EmotesMessages } from "../../types/messages/emotes-messages.js";

export const emotesMessages: EmotesMessages = {
  emotePickerDialog: {
    title: "Figurinhas",
    trigger: "Figurinhas",
    searchPlaceholder: "Buscar figurinha",
    tabRecent: "Recentes",
    tabEnois: "É Nóis",
    tabAll: "Todas",
    loading: "Carregando figurinhas...",
    empty: "Nenhuma figurinha com esse nome.",
    error: "Não foi possível carregar as figurinhas agora.",
    hint: "As mais usadas primeiro. A figurinha entra no texto como :codigo:, e quem lê vê a imagem.",
    count: (total: number) => `${total} ${total === 1 ? "figurinha" : "figurinhas"}`,
    page: (page: number, totalPages: number) => `Página ${page} de ${totalPages}`,
    previous: "Página anterior",
    next: "Próxima página",
  },
};
