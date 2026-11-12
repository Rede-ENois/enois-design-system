import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NetworkJoinDialogProps } from "../../types/domain/network/network-join-dialog-props.js";

import { NetworkJoinDialog } from "./network-join-dialog.js";

function render(props: Partial<NetworkJoinDialogProps> = {}) {
  return renderToStaticMarkup(
    <NetworkJoinDialog
      open
      onOpenChange={() => {}}
      onRequestJoin={() => {}}
      issuedToken={null}
      onDismissToken={() => {}}
      {...props}
    />,
  );
}

describe("NetworkJoinDialog", () => {
  it("fechado não renderiza nada — a view não deixa resto no DOM", () => {
    expect(render({ open: false })).toBe("");
  });

  it("sem token, compõe o formulário de ingresso com nome do servidor, dica e ações", () => {
    const html = render();

    expect(html).toContain('role="dialog"');
    expect(html).toContain("Ingressar na rede Énóis");
    expect(html).toContain(">Nome do servidor<");
    expect(html).toContain('placeholder="vps-da-minha-casa"');
    expect(html).toContain("Pedir ingresso");
    expect(html).toContain("Cancelar");
    expect(html).not.toContain("Token de ingresso gerado");
  });

  it("enquanto o pedido corre, o envio fica desabilitado", () => {
    const html = render({ joinPending: true });

    expect(html).toContain('type="submit" disabled=""');
  });

  it("em erro, mostra a mensagem que veio do servidor", () => {
    const html = render({ joinError: "Limite de 3 tokens vivos por conta" });

    expect(html).toContain("Limite de 3 tokens vivos por conta");
  });

  it("com token emitido, troca para o painel de cópia: token, validade, próximo passo e ações", () => {
    const html = render({
      issuedToken: {
        token: "tok_ABCDEF123456",
        expiresAtLabel: "16:30 de hoje",
        nextStep: "Cole o token no instalador do servidor.",
      },
    });

    expect(html).toContain("Token de ingresso gerado");
    expect(html).toContain("tok_ABCDEF123456");
    expect(html).toContain("Vale até 16:30 de hoje.");
    expect(html).toContain("Cole o token no instalador do servidor.");
    expect(html).toContain("Copiar token");
    expect(html).toContain("Já copiei, fechar");
    expect(html).not.toContain(">Nome do servidor<");
  });
});
