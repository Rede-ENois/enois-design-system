import type { ThemeName } from "./theme-name.js";

export type SandboxedHtmlFrameProps = {
  /** HTML a renderizar. Pode vir cru (preview do autor) ou sanitizado (post publicado). */
  html: string;
  /** Altura/classe do quadro; o padrão é uma altura de "mini página". */
  className?: string;
  /** Descrição do quadro para leitores de tela. */
  title: string;
  /** Permite scripts apenas nos iframes SoundCloud aprovados pela CSP; a origem do HTML segue opaca. */
  allowSoundCloudPlayer?: boolean;
  /**
   * Folga interna em volta do conteúdo (o "papel" da página). `false` faz o HTML começar na borda
   * do quadro, para quem quer usar o espaço inteiro — é o caso da bio do perfil, onde o quadro
   * ocupa a largura do card e uma margem branca em volta parecia sobra.
   */
  innerPadding?: boolean;
  /**
   * O quadro cresce até a altura do conteúdo (padrão) em vez de rolar por dentro. Quem é janela —
   * a prévia do editor, a página em tela cheia e o quadro embutido no post — passa `false` e
   * mantém a rolagem própria.
   */
  autoHeight?: boolean;
  /**
   * Teto da altura, em pixels, para o quadro que cresce. Bateu no teto, ele para de crescer e o
   * que sobra passa a rolar por dentro (nada se perde).
   *
   * Sem teto, um `height: 100vh` no HTML do autor realimenta a medida — o `vh` é a altura do
   * quadro, e o quadro é a altura do conteúdo — e a página vira uma faixa que cresce sem fim.
   */
  maxHeight?: number;
  /**
   * Recorta o que passar da altura em vez de crescer ou rolar. É o caso das CAPAS: o HTML é uma
   * faixa, não uma página, e o que o autor mandar a mais é cortado na borda (como o `object-cover`
   * faz com a foto). Implica não crescer.
   */
  clip?: boolean;
  /** App theme: written into the frame so author CSS follows the app instead of the OS. */
  theme: ThemeName;
  /**
   * Id of the `<style>` element where the app writes its theme CSS. The frame watches it to copy
   * the computed tokens again when the theme changes.
   */
  themeStyleElementId?: string;
  /** Lite mode: the frame stops delegating autoplay. */
  lite?: boolean;
  /**
   * Hands the frame document to the caller once it loads (and null before there is one). The
   * document is readable because the sandbox keeps same-origin; reading it is how callers that
   * decorate the frame from the author's own CSS work (the notice modal reads `--notice-*`
   * properties). Writing to the document from here is forbidden by the same reasoning.
   */
  onFrameDocument?: (document: Document | null) => void;
};
