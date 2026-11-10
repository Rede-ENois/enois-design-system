/**
 * O iOS não pinta nenhum quadro de um vídeo parado com `preload="metadata"` — o card fica preto.
 * O fragmento de mídia (`#t=0.001`) pede o primeiro quadro e é ignorado pelo servidor, então não
 * mexe no arquivo nem na URL assinada.
 */
export function firstFrameSrc(src: string): string {
  if (src.includes("#") || src.includes(".m3u8")) return src;
  return `${src}#t=0.001`;
}
