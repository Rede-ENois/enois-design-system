import type { ConfessionarioMessages } from "../../types/messages/confessionario-messages.js";

export const confessionarioMessages: ConfessionarioMessages = {
  confessionarioFeed: {
    loading: "Abrindo as histórias…",
    error: "Não foi possível abrir o Confessionário. Tente de novo.",
    empty: "Ninguém contou nada ainda. Sua história pode começar esse espaço.",
    loadMore: "Ver mais histórias",
  },
  confessionarioComposer: {
    hint: "Ninguém fica sabendo quem contou. E o que você escrever aqui fica só no Confessionário, fora do feed principal.",
    placeholder: "Que história você nunca contou?",
    publish: "Contar",
    publishing: "Enviando…",
    needText: "Escreva a história antes de publicar.",
  },
  confessionarioCard: {
    anonymous: "Alguém",
    comments: (count) => (count === 1 ? "1 comentário" : `${count} comentários`),
    reactLaugh: "Reagir com risada",
    reactWow: "Reagir com surpresa",
    reactSupport: "Reagir com apoio",
    remove: "Remover minha história",
    report: "Denunciar história",
  },
  confessionarioComments: {
    anonymous: "Alguém",
    empty: "Ninguém comentou ainda.",
    loading: "Carregando os comentários…",
    error: "Não foi possível abrir os comentários. Tente de novo.",
    placeholder: "Comente sem se identificar…",
    send: "Comentar",
    sending: "Enviando…",
    remove: "Remover comentário",
  },
};
