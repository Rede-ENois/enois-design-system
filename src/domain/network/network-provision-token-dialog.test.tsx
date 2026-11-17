// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { NetworkProvisionTokenDialogProps } from "../../types/domain/network/network-provision-token-dialog-props.js";

import { NetworkProvisionTokenDialog } from "./network-provision-token-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const PROFILES = [
  { id: "NODE_WORKER", label: "Trabalho geral" },
  { id: "NODE_MEDIA", label: "Mídia" },
];

function render(props: Partial<NetworkProvisionTokenDialogProps> = {}) {
  const onProvision = props.onProvision ?? (() => {});
  act(() =>
    root.render(
      <NetworkProvisionTokenDialog
        open
        onOpenChange={() => {}}
        onProvision={onProvision}
        issuedToken={null}
        onDismissToken={() => {}}
        profileOptions={PROFILES}
        {...props}
      />,
    ),
  );
  return container;
}

function button(label: string): HTMLButtonElement {
  const found = [...container.querySelectorAll("button")].find((item) =>
    item.textContent?.includes(label),
  );
  if (!found) throw new Error(`botão "${label}" não existe`);
  return found;
}

function field(label: string): HTMLInputElement {
  const labels = [...container.querySelectorAll("label")];
  const found = labels.find((item) => item.textContent?.includes(label));
  const input = found?.querySelector("input");
  if (!input) throw new Error(`campo "${label}" não existe`);
  return input;
}

async function type(input: HTMLInputElement, value: string) {
  await act(async () => {
    // O React lê o value setter do protótipo: atribuir direto não dispara onChange.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

async function fillForm(profiles: string[] = ["NODE_WORKER"]) {
  await type(field("Nome do servidor"), "vps-da-casa");
  await type(field("Conta responsável"), "luna");
  for (const id of profiles) {
    await click(button(PROFILES.find((profile) => profile.id === id)!.label));
  }
}

describe("NetworkProvisionTokenDialog", () => {
  it("fechado não renderiza nada — a view não deixa resto no DOM", () => {
    expect(render({ open: false }).textContent).toBe("");
  });

  it("o envio nasce desabilitado: um nó sem dono ou sem perfil não tem o que provisionar", () => {
    render();

    expect(button("Gerar token").disabled).toBe(true);
  });

  it("sem perfil escolhido o envio continua travado (o backend recusa NODE_PROFILES_REQUIRED)", async () => {
    render();
    await fillForm([]);

    expect(button("Gerar token").disabled).toBe(true);
  });

  it("sem a conta do dono o envio continua travado (o backend recusa NODE_OWNER_REQUIRED)", async () => {
    render();
    await type(field("Nome do servidor"), "vps-da-casa");
    await click(button("Trabalho geral"));

    expect(button("Gerar token").disabled).toBe(true);
  });

  it("com nome, dono e ao menos um perfil, entrega o que o admin digitou", async () => {
    let entregue: unknown = null;
    render({ onProvision: (input) => (entregue = input) });
    await fillForm(["NODE_WORKER", "NODE_MEDIA"]);

    expect(button("Gerar token").disabled).toBe(false);

    await click(button("Gerar token"));

    expect(entregue).toEqual({
      serverName: "vps-da-casa",
      ownerUsername: "luna",
      profiles: ["NODE_WORKER", "NODE_MEDIA"],
    });
  });

  it("enquanto a emissão corre, o envio fica travado para não emitir dois tokens", async () => {
    render({ provisionPending: true });
    await fillForm();

    expect(button("Gerando…").disabled).toBe(true);
  });

  it("em erro, mostra a mensagem que veio do app sem perder o formulário", async () => {
    render({ provisionError: "Conta @ninguem não encontrada." });

    expect(container.textContent).toContain("Conta @ninguem não encontrada.");
    expect(container.querySelector('input[placeholder="luna"]')).not.toBeNull();
  });

  it("com token emitido, troca para o painel de cópia e diz que o nó ainda depende da aprovação", () => {
    render({
      issuedToken: { token: "npt_ABCDEF123456", expiresAtLabel: "16:30 de hoje" },
    });

    expect(container.textContent).toContain("Token gerado");
    expect(container.textContent).toContain("npt_ABCDEF123456");
    expect(container.textContent).toContain("Vale até 16:30 de hoje.");
    expect(container.textContent).toContain("Aprove o nó aqui");
    expect(button("Copiar token")).toBeTruthy();
    expect(button("Já copiei, fechar")).toBeTruthy();
    expect(container.querySelector("input")).toBeNull();
  });
});
