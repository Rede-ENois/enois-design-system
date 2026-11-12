// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NetworkNodeData } from "../../types/domain/network/network-node-data.js";

import { NetworkNodesSection } from "./network-nodes-section.js";

const node: NetworkNodeData = {
  id: "nd_abc123",
  displayName: "no-media-1",
  ownerUserId: "user_1",
  status: "PENDING_APPROVAL",
  profiles: ["NODE_MEDIA"],
  region: "southamerica-east1",
  runtimeVersion: "1.0.0",
  lastSeenAtLabel: null,
  keyPrefix: null,
  keyUsed: false,
  operable: false,
  degraded: false,
  latencyMs: null,
  failureStreak: 0,
  quarantineReason: null,
};

function render(props: Partial<Parameters<typeof NetworkNodesSection>[0]> = {}) {
  return renderToStaticMarkup(
    <NetworkNodesSection
      nodes={[node]}
      onRefresh={() => {}}
      onIssueKey={() => {}}
      onRevokeKey={() => {}}
      onApprove={() => {}}
      onChangeStatus={() => {}}
      issuedKey={null}
      onDismissIssuedKey={() => {}}
      {...props}
    />,
  );
}

describe("NetworkNodesSection", () => {
  it("mostra o nó pendente com o botão de aprovar e sem chave", () => {
    const html = render();

    expect(html).toContain("no-media-1");
    expect(html).toContain("Aguardando aprovação");
    expect(html).toContain("Aprovar");
    expect(html).toContain("Sem chave de API");
    expect(html).toContain("Nunca conectou");
  });

  it("mostra o prefixo da chave e se ela já foi usada, nunca a chave em claro", () => {
    const html = render({
      nodes: [{ ...node, status: "ACTIVE", keyPrefix: "enk_nd_abc", keyUsed: true }],
    });

    expect(html).toContain("enk_nd_abc");
    expect(html).toContain("Chave já usada");
    expect(html).toContain("Gerar nova chave");
    expect(html).not.toContain("Aprovar");
  });

  it("mostra a chave recém-gerada uma vez, com o aviso de que não aparece de novo", () => {
    const html = render({
      issuedKey: { nodeId: "nd_abc123", apiKey: "enk_nd_abc_segredo", prefix: "enk_nd_abc" },
    });

    expect(html).toContain("enk_nd_abc_segredo");
    expect(html).toContain("Copie agora");
    expect(html).toContain("Já copiei, fechar");
  });

  it("não oferece revogar nem suspender um nó já revogado", () => {
    const html = render({ nodes: [{ ...node, status: "REVOKED" }] });

    expect(html).toContain("Revogado");
    expect(html).not.toContain("Revogar nó");
    expect(html).not.toContain("Suspender");
  });

  it("mostra o estado vazio quando não há nó", () => {
    const html = render({ nodes: [] });

    expect(html).toContain("Nenhum nó cadastrado");
  });

  it("mostra a saúde medida separada do estado administrativo: ativo e degradado ao mesmo tempo", () => {
    const html = render({
      nodes: [
        {
          ...node,
          status: "ACTIVE",
          keyPrefix: "enk_nd_abc",
          keyUsed: true,
          operable: true,
          degraded: true,
          quarantineReason: null,
          latencyMs: 41200,
          failureStreak: 3,
        },
      ],
    });

    expect(html).toContain("Ativo");
    expect(html).toContain("Degradado");
    expect(html).toContain("41200 ms");
    expect(html).toContain("3 falhas seguidas");
  });

  it("nó saudável mostra Operando e latência medida", () => {
    const html = render({
      nodes: [
        {
          ...node,
          status: "ACTIVE",
          operable: true,
          degraded: false,
          latencyMs: 120,
          failureStreak: 0,
        },
      ],
    });

    expect(html).toContain("Operando");
    expect(html).toContain("120 ms");
    expect(html).not.toContain("Degradado");
  });

  it("quarentena vigente explica o motivo na faixa de saúde", () => {
    const html = render({
      nodes: [
        {
          ...node,
          status: "QUARANTINED",
          degraded: true,
          quarantineReason: "Falha repetida em tarefas designadas",
        },
      ],
    });

    expect(html).toContain("Degradado: Falha repetida em tarefas designadas");
  });
});
