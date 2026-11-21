// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ConversationTopicFilterProps } from "../../types/domain/messages/conversation-topic-filter-props.js";
import type { GroupTopicData } from "../../types/domain/messages/group-topic-data.js";

import { ConversationTopicFilter } from "./conversation-topic-filter.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const TOPICS: GroupTopicData[] = [{ id: "t1", name: "Jogatina", status: "OPEN" }];

const MANAGER: Pick<
  ConversationTopicFilterProps,
  "onCreateTopic" | "onRenameTopic" | "onArchiveTopic" | "onReorderTopics"
> = {
  onCreateTopic: async () => null,
  onRenameTopic: async () => null,
  onArchiveTopic: async () => null,
  onReorderTopics: async () => null,
};

describe("ConversationTopicFilter", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = (props: Partial<ConversationTopicFilterProps> = {}) =>
    act(() =>
      root.render(
        <EnoisProvider>
          <ConversationTopicFilter
            topics={TOPICS}
            activeTopicId={null}
            onSelectTopic={() => {}}
            {...props}
          />
        </EnoisProvider>,
      ),
    );

  const button = (text: string) =>
    [...host.querySelectorAll("button")].find((b) => (b.textContent ?? "").includes(text));

  it("membro só vê a fileira, sem a gestão", () => {
    render();

    expect(host.querySelector("nav")).not.toBeNull();
    expect(button("Todos os assuntos")).toBeDefined();
    expect(button("Jogatina")).toBeDefined();
    expect(button("Tópicos")).toBeUndefined();
  });

  it("dono e administradores ganham a gestão na fileira, fechada", () => {
    render({ manager: true, ...MANAGER });

    expect(button("Jogatina")).toBeDefined();
    const toggle = button("Tópicos")!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    act(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(host.querySelector('[aria-label="Nome do tópico"]')).not.toBeNull();
  });

  it("esperando a chave local, a fileira some: ainda não há mensagem para filtrar", () => {
    render({ e2eRequired: true, manager: true, ...MANAGER });

    expect(host.querySelector("nav")).toBeNull();
    expect(host.querySelector("button")).toBeNull();
  });

  it("carregando mostra o esqueleto em vez da fileira vazia", () => {
    render({ loading: true, topics: [] });

    expect(host.querySelector("[aria-busy='true']")).not.toBeNull();
  });
});
