import type { DesabafosMessages } from "../../types/messages/desabafos-messages.js";

export const desabafosMessages: DesabafosMessages = {
  desabafosFeed: {
    loading: "Abrindo os desabafos…",
    error: "Não foi possível abrir os Desabafos. Tente de novo.",
    empty: "Ninguém desabafou ainda. Sua palavra pode começar esse cuidado.",
    loadMore: "Ver mais desabafos",
  },
  desabafosComposer: {
    hint: "Sem pressa e sem julgamento. O que você escrever aqui fica só nos Desabafos, fora do feed principal.",
    placeholder: "O que está pesando hoje?",
    publish: "Desabafar",
    publishing: "Enviando…",
    needText: "Escreva o que está sentindo antes de publicar.",
  },
  desabafosCard: {
    anonymous: "Anônimo",
    acolhidas: (count) => (count === 1 ? "1 acolhida" : `${count} acolhidas`),
    reactLove: "Reagir com carinho",
    reactSupport: "Reagir com apoio",
    remove: "Remover meu desabafo",
    report: "Denunciar desabafo",
  },
  desabafosComments: {
    anonymous: "Anônimo",
    empty: "Ninguém acolheu ainda. Sua palavra pode ajudar.",
    loading: "Carregando as acolhidas…",
    error: "Não foi possível abrir as acolhidas. Tente de novo.",
    placeholder: "Acolha com palavras…",
    send: "Acolher",
    sending: "Enviando…",
    remove: "Remover acolhida",
  },
};
