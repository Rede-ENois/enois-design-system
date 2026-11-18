import type { PostDestinosMessages } from "../../types/messages/post-destinos-messages.js";

export const postDestinosMessages: PostDestinosMessages = {
  postDestinos: {
    title: "Para onde vai este post",
    description:
      "Colar em um mural espalha para quem visita o quadro; guardar em uma coleção fica só com você.",
    tabMurais: "Murais",
    tabColecoes: "Coleções",
    colar: "Colar",
    colado: "Colado",
    guardar: "Guardar",
    guardado: "Guardado",
    itens: (count) => (count === 1 ? "1 publicação" : `${count} publicações`),
    loading: "Carregando seus destinos…",
    error: "Não foi possível carregar. Tente de novo.",
    vazioMurais: "Você ainda não tem murais. Crie um na página de Murais.",
    vazioColecoes: "Você ainda não tem coleções. Crie uma na página de Coleções.",
    acaoFalhou: "Não deu. Tente de novo.",
    fechar: "Fechar",
  },
};
