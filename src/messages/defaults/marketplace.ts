import type { MarketplaceMessages } from "../../types/messages/marketplace-messages.js";

export const marketplaceMessages: MarketplaceMessages = {
  marketplaceContentDialog: {
    fallbackTitle: "Conteúdo comprado",
    description:
      "Edite os textos abaixo antes de usar. O arquivo original continua na sua compra; esta edição é só para copiar o HTML já personalizado.",
    loading: "Carregando…",
    error: "Não foi possível abrir o conteúdo desta compra.",
    download: "Baixar .html",
    copy: "Copiar HTML",
    copied: "HTML copiado. Cole onde quiser usar.",
    copyError: "Não deu para copiar. Selecione o texto e copie à mão.",
  },
  marketplaceSellDialog: {
    title: "Vender no marketplace",
    description:
      "Escolha a categoria, cole o conteúdo e defina o preço em faíscas. Quem compra recebe o material em “Minhas compras”, pode editar os textos e copiar o HTML.",
    kind: "Categoria",
    titleField: "Título",
    titlePlaceholder: "Ex.: Banner de portfólio minimalista",
    descriptionField: "Descrição (opcional)",
    serviceContent: "O que está incluído no serviço",
    content: "Conteúdo (HTML ou texto)",
    servicePlaceholder: "Descreva o serviço, prazo e o que a pessoa recebe.",
    contentPlaceholder: '<section style="...">Cole aqui o HTML do template...</section>',
    price: "Preço em faíscas",
    minPrice: "Mínimo de 50 faíscas.",
    publishing: "Publicando…",
    publish: "Publicar e vender",
  },
};
