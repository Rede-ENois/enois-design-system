// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { MyNetworkNodeData } from "../../types/domain/network/my-network-node-data.js";

import { MyNetworkNodes } from "./my-network-nodes.js";

const node: MyNetworkNodeData = {
  id: "nd_abc123",
  displayName: "meu-servidor",
  status: "ACTIVE",
  profiles: ["NODE_WORKER"],
  region: "southamerica-east1",
  country: "BR",
  runtimeVersion: "1.0.0",
  lastSeenAtLabel: "11 de nov. às 14:02",
  declaredCpuCores: 4,
  declaredMemoryMb: 8192,
  declaredDiskMb: 51200,
  declaredBandwidthMbps: 100,
  observedCpuPercent: 42.0,
  observedMemoryMb: 2048,
  observedRunningTasks: 1,
  tasksDone: 128,
  operable: true,
  quarantineReason: null,
};

function render(props: Partial<Parameters<typeof MyNetworkNodes>[0]> = {}) {
  return renderToStaticMarkup(
    <MyNetworkNodes nodes={[node]} onRefresh={() => {}} onDisconnect={() => {}} {...props} />,
  );
}

describe("MyNetworkNodes", () => {
  it("mostra o nó do participante com a contribuição medida e o que cedeu vs. o que foi observado", () => {
    const html = render();

    expect(html).toContain("meu-servidor");
    expect(html).toContain("Ativo");
    expect(html).toContain("128 tarefas concluídas");
    expect(html).toContain("42% de 4 vCPU");
    expect(html).toContain("2048 MB de 8192 MB");
    expect(html).toContain("11 de nov. às 14:02");
  });

  it("nó nunca visto mostra o que cedeu, sem inventar medição", () => {
    const html = render({
      nodes: [{ ...node, lastSeenAtLabel: null, observedCpuPercent: null, observedMemoryMb: null }],
    });

    expect(html).toContain("Nunca conectou");
    expect(html).toContain("(cedido: 4 vCPU)");
  });

  it("nó pendente não oferece desconexão antes de operar — e o revogado também não", () => {
    const pending = render({ nodes: [{ ...node, status: "PENDING_APPROVAL" }] });
    expect(pending).toContain("Aguardando aprovação");
    expect(pending).not.toContain("Desconectar");

    const revoked = render({ nodes: [{ ...node, status: "REVOKED" }] });
    expect(revoked).not.toContain("Desconectar");
  });

  it("quarentena vigente explica o motivo", () => {
    const html = render({
      nodes: [{ ...node, status: "QUARANTINED", quarantineReason: "Falha repetida" }],
    });

    expect(html).toContain("Em quarentena: Falha repetida");
  });

  it("mostra o estado vazio quando não há servidor", () => {
    const html = render({ nodes: [] });

    expect(html).toContain("Você ainda não disponibilizou nenhum servidor");
  });

  it("com onJoin, oferece o botão de disponibilizar servidor; sem onJoin, não oferece", () => {
    expect(render({ onJoin: () => {} })).toContain("Disponibilizar servidor");
    expect(render()).not.toContain("Disponibilizar servidor");
  });
});
