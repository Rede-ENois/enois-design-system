import type { Area } from "react-easy-crop";

/**
 * Em que formato o recorte sai? Um JPEG não tem canal alfa: fonte com transparência sai em PNG
 * — reencodar para JPEG achataria o alfa no fundo preto, e a foto de perfil de um PNG nasceria
 * com fundo preto. Fonte opaca segue em JPEG, que comprime muito melhor foto.
 */

const JPEG_TYPE = "image/jpeg";
const PNG_TYPE = "image/png";

/**
 * Há transparência no recorte? A decisão é binária (o JPEG simplesmente não tem alfa). A sonda é
 * um canvas reduzido (a varredura é sobre uma miniatura, não sobre o recorte inteiro) e falha
 * fechando em JPEG: canvas envenenado ou ilegível devolve o comportamento de antes, não um erro.
 */
export function croppedImageType(
  img: HTMLImageElement,
  crop: Area,
  probeDocument: Document = document,
): string {
  const longSide = Math.max(crop.width, crop.height);
  const scale = longSide > 0 ? Math.min(1, 64 / longSide) : 1;
  const width = Math.max(1, Math.round(crop.width * scale));
  const height = Math.max(1, Math.round(crop.height * scale));
  const probe = probeDocument.createElement("canvas");
  probe.width = width;
  probe.height = height;
  const ctx = probe.getContext("2d");
  if (!ctx) return JPEG_TYPE;
  try {
    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return PNG_TYPE;
    }
  } catch {
    // Canvas envenenado (fonte de outra origem): sem leitura de pixels, JPEG como sempre foi.
  }
  return JPEG_TYPE;
}
