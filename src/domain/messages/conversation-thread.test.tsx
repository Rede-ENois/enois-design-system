// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConversationThread } from "./conversation-thread.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function renderThread(
  onSend: () => Promise<void>,
  extra: Partial<ComponentProps<typeof ConversationThread>> = {},
) {
  act(() =>
    root.render(
      <ConversationThread
        profileHref="/perfil/ana"
        loading={false}
        empty
        newestMessageId={null}
        hasOlderMessages={false}
        loadingOlder={false}
        onLoadOlder={() => {}}
        selecting={false}
        selectedCount={0}
        onStartSelecting={() => {}}
        onCancelSelection={() => {}}
        deletePending={false}
        onDeleteSelected={() => {}}
        sendPending={false}
        onSend={onSend}
        servicesOpen={false}
        onServicesOpenChange={() => {}}
        servicesLoading={false}
        services={[]}
        serviceHref={(id) => `/servicos#oferta-${id}`}
        {...extra}
      />,
    ),
  );
}

async function typeAndSend(value: string) {
  const textarea = container.querySelector("textarea")!;
  const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
  act(() => {
    setValue.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => {
    container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true }));
  });
}

describe("ConversationThread", () => {
  it("envia o texto aparado e limpa o campo", async () => {
    const onSend = vi.fn(() => Promise.resolve());
    renderThread(onSend);

    await typeAndSend("  oi  ");

    expect(onSend).toHaveBeenCalledWith({ text: "oi", files: [], mediaSpoiler: false });
    expect(container.querySelector("textarea")!.value).toBe("");
  });

  it("mostra o erro da subida no compositor", async () => {
    renderThread(() => Promise.reject(new Error("Arquivo grande demais")));

    await typeAndSend("oi");

    expect(container.textContent).toContain("Arquivo grande demais");
  });

  it("falha no envio devolve a citação ao compositor para a resposta não sair sem ela", async () => {
    const onSend = vi.fn<() => Promise<void>>(() => Promise.reject(new Error("rede caiu")));
    const onCancelReply = vi.fn();
    const onRestoreReply = vi.fn();
    renderThread(onSend, {
      replyingTo: { id: "m-7", from: "ana", text: "que horas?" },
      onCancelReply,
      onRestoreReply,
    });

    await typeAndSend("agora");

    expect(onCancelReply).toHaveBeenCalled();
    expect(onRestoreReply).toHaveBeenCalledWith({ id: "m-7", from: "ana", text: "que horas?" });
    expect(container.textContent).toContain("que horas?");
    expect(container.textContent).toContain("rede caiu");

    onSend.mockReturnValue(Promise.resolve());
    await typeAndSend("agora");

    expect(onSend).toHaveBeenLastCalledWith(
      expect.objectContaining({ text: "agora", replyToId: "m-7" }),
    );
    expect(onCancelReply).toHaveBeenCalledTimes(2);
    expect(onRestoreReply).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain("rede caiu");
  });

  it("falha no envio sem citação não chama onRestoreReply", async () => {
    const onRestoreReply = vi.fn();
    renderThread(() => Promise.reject(new Error("fora do ar")), { onRestoreReply });

    await typeAndSend("oi");

    expect(onRestoreReply).not.toHaveBeenCalled();
  });

  it("o gate E2E esconde o histórico e o compositor e mostra o banner com o aviso", () => {
    renderThread(() => Promise.resolve(), { e2eRequired: true, banner: <p>banner</p> });

    expect(container.textContent).toContain("banner");
    expect(container.textContent).toContain("Ative a criptografia ponta a ponta");
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).not.toContain("Nenhuma mensagem ainda");
  });
});
