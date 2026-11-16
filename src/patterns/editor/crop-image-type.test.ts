// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { croppedImageType } from "./crop-image-type.js";

/** Área de recorte genérica: os valores só precisam ser coerentes para a sonda escalar. */
const CROP = { x: 0, y: 0, width: 800, height: 800 };

function fakeImage(): HTMLImageElement {
  return {} as unknown as HTMLImageElement;
}

/**
 * jsdom não implementa canvas: a sonda recebe um documento falso cujo canvas devolve os pixels
 * que o teste manda. O contrato aqui é de decisão (PNG só quando há alfa), não de decodificação.
 */
function probeDocumentWithPixels(data: Uint8ClampedArray): {
  probeDocument: Document;
  canvas: { width: number; height: number };
} {
  const ctx = {
    drawImage: () => {},
    getImageData: () => ({ data }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ctx,
  };
  const probeDocument = {
    createElement: (tag: string) => (tag === "canvas" ? canvas : {}),
  } as unknown as Document;
  return { probeDocument, canvas };
}

function opaquePixels(): Uint8ClampedArray {
  return new Uint8ClampedArray([1, 2, 3, 255, 4, 5, 6, 255]);
}

function transparentPixels(): Uint8ClampedArray {
  return new Uint8ClampedArray([1, 2, 3, 255, 4, 5, 6, 128]);
}

describe("croppedImageType", () => {
  it("keeps JPEG for an opaque source", () => {
    expect(
      croppedImageType(fakeImage(), CROP, probeDocumentWithPixels(opaquePixels()).probeDocument),
    ).toBe("image/jpeg");
  });

  it("keeps JPEG when the canvas cannot be read", () => {
    // jsdom sem canvas: getContext devolve null — o caminho de quem não pode ler pixels.
    expect(croppedImageType(fakeImage(), CROP)).toBe("image/jpeg");
  });

  it("keeps JPEG when drawing onto the probe fails", () => {
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        drawImage: () => {
          throw new DOMException("tainted");
        },
        getImageData: () => ({ data: transparentPixels() }),
      }),
    };
    const probeDocument = {
      createElement: (tag: string) => (tag === "canvas" ? canvas : {}),
    } as unknown as Document;
    expect(croppedImageType(fakeImage(), CROP, probeDocument)).toBe("image/jpeg");
  });

  it("picks PNG as soon as one pixel carries alpha", () => {
    expect(
      croppedImageType(
        fakeImage(),
        CROP,
        probeDocumentWithPixels(transparentPixels()).probeDocument,
      ),
    ).toBe("image/png");
  });

  it("probes on a thumbnail, never on the full crop", () => {
    const wide = { ...CROP, width: 2400, height: 800 };
    const { probeDocument, canvas } = probeDocumentWithPixels(opaquePixels());
    croppedImageType(fakeImage(), wide, probeDocument);
    // Lado maior da sonda é 64: a varredura não cresce com o tamanho do recorte.
    expect(canvas.width).toBe(64);
    expect(canvas.height).toBe(Math.round((800 / 2400) * 64));
  });
});
