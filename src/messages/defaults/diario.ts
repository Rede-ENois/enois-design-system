import type { DiarioMessages } from "../../types/messages/diario-messages.js";

/** Diário do perfil: linha do tempo do que a pessoa publicou, comentou e repostou. */
export const diarioMessages: DiarioMessages = {
  diario: {
    publicacao: "Publicação",
    comentario: "Comentário",
    repost: "Repost",
    vazio: "Nada por aqui ainda. Quando houver atividade, ela aparece nesta linha do tempo.",
    carregarMais: "Carregar mais",
    carregandoMais: "Carregando…",
    contextoDe: (autorNome) => `por ${autorNome}`,
  },
};
