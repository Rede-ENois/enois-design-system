import type { BlogMessages } from "../../types/messages/blog-messages.js";

export const blogMessages: BlogMessages = {
  blogEditorDialog: {
    create: "Criar meu blog",
    edit: "Editar blog",
    blogTitle: "Nome do blog",
    blogDescription: "Descrição",
    theme: "Tema do blog (HTML/CSS)",
    themeHint:
      "Opcional: o HTML/CSS abaixo vira a cara da sua página de blog (mesmo quadro isolado das páginas e da bio). Vazio volta ao cabeçalho padrão.",
    themePlaceholder:
      '<style>\n.capa { background: #151515; }\n</style>\n<div class="capa">...</div>',
    emptyPreview: "Cole um HTML para ver a pré-visualização.",
    frameTitle: "Blogs",
    cancel: "Cancelar",
    saving: "Salvando...",
    save: "Salvar",
  },
  blogPostEditor: {
    back: "Blogs",
    newPost: "Novo post",
    editPost: "Editar post",
    postTitle: "Título do post",
    modeText: "Texto",
    modeHtml: "HTML/CSS",
    write: "Escrever",
    preview: "Prévia",
    textHint:
      "Escreva como no Word: # vira título, **negrito**, *itálico*, - vira lista, > vira citação. A prévia mostra como fica.",
    htmlHint: "Cole HTML e CSS livres. É o mesmo editor das páginas do perfil.",
    htmlPlaceholder:
      '<style>\n.post { color: #f4efff; }\n</style>\n<article class="post">...</article>',
    emptyPreview: "Cole um HTML para ver a pré-visualização.",
    frameTitle: "Novo post",
    notifySubscribers: "Avisar os assinantes por e-mail",
    notifySubscribersHint:
      "Quem assina o seu blog recebe um e-mail com este post (além da notificação no app). Dá para desativar só para este post.",
    cancel: "Cancelar",
    publishing: "Publicando...",
    savePost: "Salvar post",
    publish: "Publicar",
  },
};
