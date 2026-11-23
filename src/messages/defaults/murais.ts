import type { MuraisMessages } from "../../types/messages/murais-messages.js";

export const muraisMessages: MuraisMessages = {
  muraisLista: {
    loading: "Carregando os murais…",
    error: "Não foi possível abrir os murais. Tente de novo.",
    empty: "Nenhum mural por aqui ainda. Reúna as melhores publicações em um.",
    loadMore: "Carregar mais murais",
    openMural: "Abrir mural",
    contributions: (count) => `${count} publicações`,
  },
  muraisFormulario: {
    criarTitulo: "Criar mural",
    editarTitulo: "Editar mural",
    titleLabel: "Título",
    titlePlaceholder: "Como esse mural se chama?",
    descriptionLabel: "Descrição (opcional)",
    descriptionPlaceholder: "Que publicações moram aqui?",
    salvar: "Salvar",
    salvando: "Salvando…",
  },
  muraisQuadro: {
    contributions: (count) => `${count} publicações coladas`,
    compartilhar: "Compartilhar mural",
    editar: "Editar mural",
    remover: "Remover mural",
    removerConfirmTitle: "Remover este mural?",
    removerConfirmBody:
      "O quadro sai do ar. As publicações coladas continuam no feed de quem publicou.",
    colarPlaceholder: "Link ou id da publicação para colar",
    colar: "Colar",
    colando: "Colando…",
    coladas: "Publicações do mural",
    vazio: "Ninguém colou nada ainda. Cole a primeira publicação.",
    coladoPor: (name) => `colado por ${name}`,
    tirar: "Tirar do mural",
    tirarConfirmTitle: "Tirar esta publicação do mural?",
    tirarConfirmBody: "A publicação continua no feed. Ela só sai deste quadro.",
  },
};
