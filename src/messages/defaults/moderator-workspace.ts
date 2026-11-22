import type { ModeratorWorkspaceMessages } from "../../types/messages/moderator-workspace-messages.js";

export const moderatorWorkspaceMessages: ModeratorWorkspaceMessages = {
  moderatorWorkspace: {
    navigation: "Áreas do painel",
    destination: "Ir para uma área",
    search: "Buscar área do painel",
    searchPlaceholder: "Nome da área ou grupo",
    noDestinations: "Nenhuma área encontrada.",
    results: (count) => (count === 1 ? "1 área encontrada" : `${count} áreas encontradas`),
    clear: "Limpar busca",
    chooseDestination: "Escolha uma área",
  },
};
