// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GroupComposer } from "./group-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CONTACTS = [
  { id: "u1", name: "Ana Souza", headline: "Dev", avatar: null },
  { id: "u2", name: "Beto Lima", headline: null, avatar: "https://cdn/beto.png" },
  { id: "u3", name: "Cris Dias", headline: "Designer", avatar: null },
];

describe("GroupComposer", () => {
  let root: Root;
  let host: HTMLDivElement;
  let onSearch: ReturnType<typeof vi.fn>;
  let onCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    onSearch = vi.fn();
    onCreate = vi.fn();
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = () => {
    act(() =>
      root.render(<GroupComposer contacts={CONTACTS} onSearch={onSearch} onCreate={onCreate} />),
    );
    return host;
  };

  const byLabel = (host: HTMLElement, label: string) =>
    host.querySelector<HTMLInputElement | HTMLButtonElement>(`[aria-label="${label}"]`);
  const byText = (host: ParentNode, text: string) =>
    [...host.querySelectorAll("button")].find((b) => (b.textContent ?? "").includes(text));
  const createButton = (host: HTMLElement) => byText(host, "Criar grupo com");

  it("marcar pessoas liga o botão com a contagem, sem gente não liga", () => {
    const host = render();
    expect(createButton(host)?.disabled).toBe(true);

    act(() => byText(host, "Ana Souza")!.click());
    // Sem título (3+ caracteres), marcar gente sozinha não liga: grupo sem nome não é grupo.
    expect(createButton(host)?.disabled).toBe(true);
    const name = byLabel(host, "Nome do grupo") as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(name, "Jogatina");
      name.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(createButton(host)?.disabled).toBe(false);
    expect(createButton(host)?.textContent).toContain("1 pessoa");

    act(() => byText(host, "Beto Lima")!.click());
    expect(createButton(host)?.textContent).toContain("2 pessoas");

    // Desmarcar devolve o botão para desligado quando ninguém resta.
    act(() => byText(host, "Ana Souza")!.click());
    act(() => byText(host, "Beto Lima")!.click());
    expect(createButton(host)?.disabled).toBe(true);
  });

  it("título curto também mantém o botão desligado", () => {
    const host = render();
    act(() => byText(host, "Ana Souza")!.click());
    const name = byLabel(host, "Nome do grupo") as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(name, "ab");
      name.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(createButton(host)?.disabled).toBe(true);
    act(() => {
      setter.call(name, "Jogatina de sexta");
      name.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(createButton(host)?.disabled).toBe(false);
  });

  it("buscar repassa o termo e criar devolve título + ids marcados", () => {
    const host = render();
    const name = byLabel(host, "Nome do grupo") as HTMLInputElement;
    const nameSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      nameSetter.call(name, "Jogatina de sexta");
      name.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => byText(host, "Ana Souza")!.click());
    act(() => byText(host, "Cris Dias")!.click());
    const search = byLabel(host, "Buscar contatos...") as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(search, "ana");
      search.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(onSearch).toHaveBeenCalledWith("ana");

    act(() => createButton(host)!.click());
    expect(onCreate).toHaveBeenCalledWith("Jogatina de sexta", ["u1", "u3"]);
  });

  it("sem contatos mostra o vazio com o botão desligado", () => {
    act(() => root.render(<GroupComposer contacts={[]} onSearch={onSearch} onCreate={onCreate} />));
    expect(host.textContent).toContain("Nenhum contato encontrado");
  });
});
