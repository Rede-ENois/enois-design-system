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
        badgeKits={[]}
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

describe("EditProfileDialog order in the info tab", () => {
  // No celular "Sou recrutador" é a mais longa das chaves e estourava a largura: fora da linha, ela
  // desce para baixo do ranking, e no desktop volta para o fim da linha.
  it("puts the recruiter switch after the ranking one on the phone and back in the row on desktop", async () => {
    await render(async () => "x");

    const recruiter = [...document.body.querySelectorAll("label")].find(
      (label) => label.textContent === "Sou recrutador",
    )!;
    const ranking = [...document.body.querySelectorAll("label")].find((label) =>
      label.textContent?.startsWith("Mostrar o ranking"),
    )!;

    expect(recruiter.className).toContain("order-first");
    expect(recruiter.className).toContain("md:order-none");
    expect(ranking.className).toContain("order-last");
    expect(ranking.className).toContain("md:order-none");
    expect(ranking.nextElementSibling).toBe(recruiter);
  });
});

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
