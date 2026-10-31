import type { ReleaseNotesMessages } from "../../types/messages/release-notes-messages.js";

export const releaseNotesMessages: ReleaseNotesMessages = {
  releaseNotesEditor: {
    title: "Novidades da plataforma",
    description:
      'O que aparece no popup "O que há de novo no Énóis", uma vez para cada pessoa. Publicar de novo reabre o popup para todo mundo.',
    none: "Nenhuma novidade no ar.",
    live: (since) => `No ar desde ${since}.`,
    itemLabel: (position) => `Novidade ${position}`,
    itemTitle: "Título",
    itemTitlePlaceholder: "Ex.: Par de estudo",
    itemDescription: "Descrição",
    itemDescriptionPlaceholder: "Uma frase sobre o que a pessoa ganha com isso.",
    remove: (position) => `Remover a novidade ${position}`,
    add: "Adicionar novidade",
    count: (count, max) => `${count} de ${max}`,
    preview: "Ver como fica",
    publish: "Publicar novidades",
    republish: "Republicar novidades",
    publishing: "Publicando...",
    retire: "Tirar do ar",
    retiring: "Tirando do ar...",
  },
};
