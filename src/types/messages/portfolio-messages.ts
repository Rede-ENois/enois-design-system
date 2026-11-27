/**
 * Texto fixo da vitrine profissional: rótulos de tipo de peça, estados vazios e os avisos do
 * editor. O que o autor escreveu (título, texto, HTML) vem pelo app, nunca daqui.
 */
export type PortfolioMessages = {
  portfolioShowcase: {
    /** Rótulo de cada tipo de peça no card. */
    kinds: { PROJECT: string; TEXT: string; MEDIA: string; PDF: string; LINK: string };
    /** A peça de mídia sem imagem para mostrar (arquivo ainda em análise, ou removido). */
    mediaUnavailable: string;
    /** Peça de mídia sem identificador resolvido: o app não achou o arquivo. */
    mediaMissing: string;
    /** Botão que abre o PDF inteiro. */
    openPdf: string;
    /** Botão que abre a impressão do navegador, onde a vitrine também sai em PDF. */
    print: string;
    openLink: string;
    empty: string;
    unavailable: string;
    publishedOn: (date: string) => string;
    /** "Ver perfil de {nome}". */
    profileLink: (name: string) => string;
  };
  portfolioEditor: {
    title: string;
    description: string;
    loading: string;
    error: string;
    pageTitle: string;
    pageDescription: string;
    pagePlaceholder: string;
    emptyPreview: string;
    editHtml: string;
    preview: string;
    savePage: string;
    saving: string;
    blocksTitle: string;
    blocksEmpty: string;
    addBlock: string;
    newBlock: string;
    editBlock: string;
    blockFields: {
      kind: string;
      title: string;
      text: string;
      linkUrl: string;
      project: string;
      mediaId: string;
    };
    blockPlaceholders: { title: string; text: string; linkUrl: string; mediaId: string };
    kinds: { PROJECT: string; TEXT: string; MEDIA: string; PDF: string; LINK: string };
    outroState: { available: string; used: string; full: string };
    /** Nome acessível da peça na lista, que é só título quando ela tem um. */
    blockLabel: (kind: string, title: string) => string;
    removeBlock: (title: string) => string;
    saveBlock: string;
    cancel: string;
    remove: string;
    editing: string;
    moveUp: string;
    moveDown: string;
    unpublished: string;
    published: string;
    neverPublished: string;
    publish: string;
    publishing: string;
    publishHint: string;
    publishedOn: (date: string) => string;
  };
};
