import type { RichTextFormat } from "../lib/rich-text/rich-text-format.js";

export type EditorMessages = {
  richTextToolbar: { actions: Record<RichTextFormat, string>; emoji: string; menu: string };
  htmlEditor: { editHtml: string; preview: string; previewLabel: string };
  imageCropDialog: {
    loading: string;
    unsupported: string;
    zoom: string;
    cancel: string;
    save: string;
    saving: string;
  };
};
