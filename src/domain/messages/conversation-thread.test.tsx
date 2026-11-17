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

  it("envio que falha devolve o rascunho ao compositor", async () => {
    const onSend = vi.fn(() => Promise.reject(new Error("Falha na subida")));
    renderThread(onSend);

    await typeAndSend("texto que não pode sumir");

    expect(container.querySelector("textarea")!.value).toBe("texto que não pode sumir");
  });

  it("envio que falha devolve mídia, spoiler e a citação ao compositor", async () => {
    const onSend = vi.fn(() => Promise.reject(new Error("Falha na subida")));
    const onRestoreReply = vi.fn();
    renderThread(onSend, {
      replyingTo: { id: "message_1", from: "Bia", text: "pergunta" },
      onRestoreReply,
    });

    // jsdom não tem createObjectURL; o componente usa para a prévia do anexo.
    URL.createObjectURL = vi.fn(() => "blob:preview") as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;

    const input = container.querySelector('input[type="file"]')!;
    const file = new File(["x"], "foto.png", { type: "image/png" });
    Object.defineProperty(input, "files", { value: [file] });
    await act(async () => {
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    const spoiler = container.querySelector(
      'button[aria-label^="Marcar"], button[title^="Marcar"]',
    );
    if (spoiler) act(() => spoiler.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await typeAndSend("com anexo");

    expect(onSend).toHaveBeenCalledWith(
      expect.objectContaining({ mediaSpoiler: true, replyToId: "message_1" }),
    );
    expect(onRestoreReply).toHaveBeenCalledWith({ id: "message_1", from: "Bia", text: "pergunta" });
    expect(container.querySelector("textarea")!.value).toBe("com anexo");
    // Spoiler voltou marcado e a citação de volta no compositor.
    expect(container.textContent).toContain("Mídias marcadas como spoiler");
    expect(container.textContent).toContain("Respondendo a Bia");
  });

  it("o gate E2E esconde o histórico e o compositor e mostra o banner com o aviso", () => {
    renderThread(() => Promise.resolve(), { e2eRequired: true, banner: <p>banner</p> });

    expect(container.textContent).toContain("banner");
    expect(container.textContent).toContain("Ative a criptografia ponta a ponta");
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).not.toContain("Nenhuma mensagem ainda");
  });
});
