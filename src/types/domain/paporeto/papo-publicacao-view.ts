import type { PapoFonteView } from "./papo-fonte-view.js";

/**
 * Uma publicação relacionada ao assunto aberto, pronta para a tela — só o que já é público: o
 * texto que falou do assunto. O autor vem nulo quando a fonte é anônima (desabafo, confissão),
 * e a data chega como rótulo pronto, porque quem formata é a tela.
 */
export type PapoPublicacaoView = {
  id: string;
  fonte: PapoFonteView;
  texto: string;
  autor: string | null;
  handle: string | null;
  quando: string;
  href: string;
};
