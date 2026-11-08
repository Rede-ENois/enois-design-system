import type { EditorMessages } from "../../types/messages/editor-messages.js";

export const editorMessages: EditorMessages = {
  richTextToolbar: {
    actions: {
      bold: "Negrito",
      italic: "Itálico",
      strike: "Riscado",
      heading: "Título",
      bulletList: "Lista",
      quote: "Citação",
      code: "Código",
      link: "Link",
      spoiler: "Spoiler",
    },
    emoji: "Emoji",
    menu: "Formatação",
  },
  htmlEditor: {
    editHtml: "Editar HTML",
    preview: "Pré-visualizar",
    previewLabel: "Pré visualização",
  },
  imageCropDialog: {
    loading: "Carregando a imagem...",
    unsupported:
      "Não foi possível abrir esta imagem. Use JPG, PNG ou WebP (fotos HEIC do iPhone precisam ser convertidas).",
    zoom: "Zoom do recorte",
    cancel: "Cancelar",
    save: "Salvar",
    saving: "Salvando...",
  },
};
