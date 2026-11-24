import type { ReactNode } from "react";

import type { EditorSticker } from "./editor-sticker.js";

export type RichTextProps = {
  content: string;
  className?: string;
  /**
   * Classe dos links e das menções. Existe porque o mesmo texto aparece em fundos diferentes (a
   * bolha da mensagem, por exemplo, é colorida) — o padrão é o azul do app.
   */
  linkClassName?: string;
  /**
   * Mídias anexadas à publicação (item 9): quando o texto tem marcadores `{{media:<id>}}`, cada
   * um cujo id está aqui vira a mídia no ponto exato do texto; anexo sem marcador segue como
   * bloco no fim (quem decide a lista é quem chama, filtrando os que foram inseridos inline).
   */
  mediaIds?: string[] | null;
  /** Oculta imagens e vídeos anexados/inline até a pessoa revelar o conteúdo. */
  mediaSpoiler?: boolean;
  /**
   * Figurinhas que o texto pode citar por código (ex.: `:enois_feliz:`), na mesma resolução que o
   * campo de escrita usa. As chaves incluem os dois-pontos: só `:codigo:` vira a imagem inline do
   * tamanho do texto, e a chave solta nunca casa, para palavra comum que também é código continuar
   * palavra. Sem o mapa, a imagem da casa é desenhada como mídia (o caso de uma foto colada no
   * corpo).
   */
  inlineStickers?: Record<string, EditorSticker>;
  /**
   * Como desenhar a figurinha inline quando ela não vem do `inlineStickers`. O tamanho é decisão do
   * app, que conhece os endereços do catálogo dele; aqui só entra a classe e a regra de endereço.
   */
  figurinha?: {
    /** Classe aplicada à imagem da figurinha. */
    classe: string;
    /** Decide se o endereço é figurinha (e não mídia anexada), com o `isOwnMediaUrl` do app. */
    ehFigurinha: (url: string, ehMidiaNossa: (url: string) => boolean) => boolean;
  };
  /** Profile address of a `@username` mention. */
  mentionHref: (username: string) => string;
  /** Renders the media behind an inline `{{media:<id>}}` marker (the app loads it). */
  renderMedia?: (mediaId: string, mediaSpoiler: boolean) => ReactNode;
};
