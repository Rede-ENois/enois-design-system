// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { GroupAdminCandidate } from "../../types/domain/messages/group-admin-candidate.js";
import type { GroupAdminParticipantData } from "../../types/domain/messages/group-admin-participant-data.js";
import type { GroupAdminSectionProps } from "../../types/domain/messages/group-admin-section-props.js";

import { GroupAdminSection } from "./group-admin-section.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PEOPLE: GroupAdminParticipantData[] = [
  { userId: "u1", name: "Ana Souza", role: "OWNER", avatar: null },
  { userId: "u2", name: "Beto Lima", role: "ADMIN", avatar: null },
  { userId: "u3", name: "Cris Dias", role: "MEMBER", avatar: null },
];

const CANDIDATES: GroupAdminCandidate[] = [
  { id: "u9", name: "Duda Reis", avatar: null },
  { id: "u3", name: "Cris Dias", avatar: null, alreadyMember: true },
];

describe("GroupAdminSection", () => {
  let root: Root;
  let host: HTMLDivElement;

  const handlers = () => ({
    onSearchCandidates: vi.fn(),
    onAddMembers: vi.fn().mockResolvedValue(undefined),
    onPromote: vi.fn().mockResolvedValue(undefined),
    onDemote: vi.fn().mockResolvedValue(undefined),
    onRemove: vi.fn().mockResolvedValue(undefined),
  });

  const render = (props: Partial<GroupAdminSectionProps> = {}) => {
    const merged = {
      groupTitle: "Jogatina de sexta",
      participants: PEOPLE,
      isOwner: true,
      canManage: true,
      candidates: [],
      ...handlers(),
      ...props,
    } satisfies GroupAdminSectionProps;
    act(() =>
      root.render(
        <EnoisProvider>
          <GroupAdminSection {...merged} />
        </EnoisProvider>,
      ),
    );
    return merged;
  };

  const byLabel = (label: string) =>
    host.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
  const byText = (text: string) =>
    [...host.querySelectorAll("button")].find((b) => (b.textContent ?? "").includes(text));
  const typeInto = (input: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("dono vê o papel de cada um e não tem ação na própria linha", () => {
    render();
    expect(host.textContent).toContain("3 pessoas");
    expect(host.textContent).toContain("Dono");
    expect(host.textContent).toContain("Administrador");

    // O dono não pode ser promovido, rebaixado nem removido.
    expect(byLabel("Remover Ana Souza do grupo")).toBeNull();
    expect(byLabel("Tornar Ana Souza administrador")).toBeNull();
    expect(byLabel("Remover Beto Lima do grupo")).not.toBeNull();
  });

  it("adicionar coleta as pessoas marcadas e some com quem já está no grupo", () => {
    const props = render({ candidates: CANDIDATES });
    const search = host.querySelector<HTMLInputElement>(
      '[aria-label="Buscar pessoas"]',
    ) as HTMLInputElement;
    typeInto(search, "du");
    expect(props.onSearchCandidates).toHaveBeenCalledWith("du");

    const already = byText("Cris Dias") as HTMLButtonElement;
    expect(already.disabled).toBe(true);

    const submit = byText("Adicionar") as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    act(() => (byText("Duda Reis") as HTMLButtonElement).click());
    expect(submit.disabled).toBe(false);
    expect(submit.textContent).toContain("1 pessoa");

    act(() => submit.click());
    expect(props.onAddMembers).toHaveBeenCalledWith(["u9"]);
  });

  it("membro comum não vê gestão nem formulário", () => {
    render({ isOwner: false, canManage: false });
    expect(byLabel("Remover Cris Dias do grupo")).toBeNull();
    expect(host.querySelector('[aria-label="Buscar pessoas"]')).toBeNull();
    expect(host.textContent).not.toContain("Adicionar ao grupo");
  });

  it("administrador administra membros mas não mexe em outro administrador", () => {
    render({ isOwner: false, canManage: true });
    // Outro administrador não é alvo do administrador: nem aparece a ação, nem a remoção.
    expect(byLabel("Voltar Beto Lima a membro")).toBeNull();
    expect(byLabel("Remover Beto Lima do grupo")).toBeNull();
    expect(byLabel("Remover Ana Souza do grupo")).toBeNull();
    const onMember = byLabel("Remover Cris Dias do grupo") as HTMLButtonElement;
    expect(onMember.disabled).toBe(false);
    expect(byLabel("Tornar Cris Dias administrador")).not.toBeNull();
  });

  it("remover pede confirmação e só então chama a aplicação", async () => {
    const props = render();
    act(() => byLabel("Remover Cris Dias do grupo")!.click());
    expect(props.onRemove).not.toHaveBeenCalled();
    expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain("Cris Dias");

    await act(async () => (byText("Remover") as HTMLButtonElement).click());
    expect(props.onRemove).toHaveBeenCalledWith("u3");
  });

  it("promover e rebaixar chamam a aplicação", async () => {
    const props = render();
    await act(async () => byLabel("Tornar Cris Dias administrador")!.click());
    expect(props.onPromote).toHaveBeenCalledWith("u3");
    await act(async () => byLabel("Voltar Beto Lima a membro")!.click());
    expect(props.onDemote).toHaveBeenCalledWith("u2");
  });

  it("erro do servidor aparece com role=alert", () => {
    render({ error: "Só o dono administra o grupo." });
    expect(host.querySelector('[role="alert"]')?.textContent).toBe("Só o dono administra o grupo.");
  });
});
