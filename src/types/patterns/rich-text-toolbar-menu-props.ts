import type { RichTextToolbarProps } from "./rich-text-toolbar-props.js";

/** A barra de formatação recolhida: as mesmas ações, abertas pelo botão de três pontos. */
export type RichTextToolbarMenuProps = Omit<RichTextToolbarProps, "className"> & {
  /** Posiciona o botão que abre o menu (o campo o coloca no canto superior direito). */
  className?: string;
};
