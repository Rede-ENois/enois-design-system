import type { ColecoesMessages } from "../../types/messages/colecoes-messages.js";

export const colecoesMessages: ColecoesMessages = {
  colecoesLista: {
    loading: "Abrindo suas coleções…",
    error: "Não foi possível abrir suas coleções. Tente de novo.",
    empty: "Nenhuma coleção ainda. Crie uma pasta para organizar o que você salvou.",
    loadMore: "Carregar mais coleções",
    openColecao: "Abrir coleção",
    posts: (count) => `${count} posts`,
  },
  colecoesFormulario: {
    criarTitulo: "Criar coleção",
    editarTitulo: "Editar coleção",
    titleLabel: "Título",
    titlePlaceholder: "Como essa pasta se chama?",
    descriptionLabel: "Descrição (opcional)",
    descriptionPlaceholder: "Que posts moram aqui?",
    salvar: "Salvar",
    salvando: "Salvando…",
  },
  colecoesQuadro: {
    posts: (count) => `${count} posts guardados`,
    editar: "Editar coleção",
    remover: "Remover coleção",
    removerConfirmTitle: "Remover esta coleção?",
    removerConfirmBody:
      "A pasta sai do ar de verdade. Os posts continuam salvos no seu perfil; só saem desta lista.",
    guardarPlaceholder: "Link ou id do post salvo para guardar",
    guardar: "Guardar",
    guardando: "Guardando…",
    guardados: "Posts da coleção",
    vazio: "Nada guardado ainda. Guarde um post que você tenha salvo.",
    guardadoEm: (dia) => `guardado em ${dia}`,
    tirar: "Tirar da coleção",
    tirarConfirmTitle: "Tirar este post da coleção?",
    tirarConfirmBody: "O post continua salvo no seu perfil. Ele só sai desta pasta.",
  },
};
