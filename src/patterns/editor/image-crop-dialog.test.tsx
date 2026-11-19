// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import type { Area } from "react-easy-crop";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ImageCropDialogProps } from "../../types/patterns/image-crop-dialog-props.js";

import { ImageCropDialog } from "./image-crop-dialog.js";

vi.mock("react-easy-crop", async () => {
  const { useEffect } = await import("react");
  return {
    default: function MockCropper({
      onCropComplete,
    }: {
      onCropComplete: (area: Area, pixels: Area) => void;
    }) {
      useEffect(() => {
        const area = { x: 0, y: 0, width: 64, height: 64 };
        onCropComplete(area, area);
      }, [onCropComplete]);
      return <div data-testid="cropper" />;
    },
  };
});

const messages = defaultMessages.imageCropDialog;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("Image", function () {
    const image = document.createElement("img");
    queueMicrotask(() => image.dispatchEvent(new Event("load")));
    return image;
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray([0, 0, 0, 255]) }),
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
    callback(new Blob(["image"], { type: "image/jpeg" }));
  });
  root = createRoot(document.createElement("div"));
});

afterEach(() => {
  act(() => root.unmount());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function renderAndSave(onCropComplete: ImageCropDialogProps["onCropComplete"]) {
  const onOpenChange = vi.fn();
  await act(async () => {
    root.render(
      <ImageCropDialog
        open
        onOpenChange={onOpenChange}
        imageSrc="image"
        aspect={1}
        title="Crop image"
        onCropComplete={onCropComplete}
      />,
    );
  });
  const save = [...document.body.querySelectorAll("button")].find(
    (button) => button.textContent === messages.save,
  )!;
  await act(async () => save.click());
  return { save, onOpenChange };
}

describe("ImageCropDialog", () => {
  it("preserves the crop and reports upload failures until retry", async () => {
    const onCropComplete = vi
      .fn<ImageCropDialogProps["onCropComplete"]>()
      .mockRejectedValueOnce(new Error("Upload failed"))
      .mockResolvedValue(undefined);
    const { save, onOpenChange } = await renderAndSave(onCropComplete);

    expect(document.querySelector('[data-testid="cropper"]')).not.toBeNull();
    expect(save.disabled).toBe(false);
    expect(document.querySelector('[role="dialog"] [role="alert"]')?.textContent).toBe(
      "Não foi possível enviar a imagem. Tente novamente.",
    );
    expect(document.body.textContent).not.toContain(messages.unsupported);
    expect(onOpenChange).not.toHaveBeenCalled();

    await act(async () => save.click());

    expect(onCropComplete).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.querySelector('[role="alert"]')).toBeNull();
  });

  it("reports crop generation failures as unsupported images", async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce((callback) => {
      callback(null);
    });
    const onCropComplete = vi.fn<ImageCropDialogProps["onCropComplete"]>();
    const { save, onOpenChange } = await renderAndSave(onCropComplete);

    expect(document.body.textContent).toContain(messages.unsupported);
    expect(save.disabled).toBe(true);
    expect(onCropComplete).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
