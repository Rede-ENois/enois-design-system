// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { EditProfileDialog } from "./edit-profile-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const render = (onUploadBadge: (file: File) => Promise<string>) =>
  act(() =>
    root.render(
      <EditProfileDialog
        profile={{ username: "ana", name: "Ana", openToWork: false, isMentor: false }}
        open
        onOpenChange={() => undefined}
        tab="info"
        onTabChange={() => undefined}
        onSave={async () => null}
        onUploadBadge={onUploadBadge}
        experiences={[]}
        education={[]}
        certifications={[]}
        listPending={{ experiences: false, education: false, certifications: false }}
        onCreateItem={async () => undefined}
        onUpdateItem={async () => undefined}
        onDeleteItem={() => undefined}
      >
        <button type="button">Editar perfil</button>
      </EditProfileDialog>,
    ),
  );

const pickBadge = async () => {
  const input = document.body.querySelector<HTMLInputElement>('input[type="file"]')!;
  Object.defineProperty(input, "files", {
    configurable: true,
    value: [new File(["x"], "badge.png", { type: "image/png" })],
  });
  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

describe("EditProfileDialog badge upload", () => {
  it("shows why the upload was refused", async () => {
    await render(() => Promise.reject(new Error("Este tipo de arquivo não é aceito aqui.")));
    await pickBadge();
    expect(document.body.textContent).toContain("Este tipo de arquivo não é aceito aqui.");
  });

  it("falls back to the generic text when there is no reason to show", async () => {
    await render(() => Promise.reject("boom"));
    await pickBadge();
    expect(document.body.textContent).toContain("Não foi possível enviar a imagem");
  });
});
