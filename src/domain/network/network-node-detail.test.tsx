// @vitest-environment node
import type { ReactNode } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { NetworkNodeDetailData } from "../../types/domain/network/network-node-detail-data.js";
import type { NetworkNodeHistoryEntry } from "../../types/domain/network/network-node-detail-data.js";

import { NetworkNodeDetail } from "./network-node-detail.js";

// The Radix portal renders nothing on the server: the sheet parts become plain wrappers here.
vi.mock("../../ui/sheet.js", () => {
  const Plain = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    Sheet: Plain,
    SheetContent: Plain,
    SheetDescription: Plain,
    SheetHeader: Plain,
    SheetTitle: Plain,
  };
});

const detail: NetworkNodeDetailData = {
  node: {
    id: "nd_abc123",
    displayName: "no-media-1",
    ownerUserId: "user_1",
    status: "ACTIVE",
    profiles: ["NODE_MEDIA"],
    region: "southamerica-east1",
    runtimeVersion: "1.0.0",
    lastSeenAtLabel: null,
    keyPrefix: "enk_nd_abc",
    keyUsed: true,
    operable: true,
    degraded: false,
    latencyMs: 120,
    failureStreak: 0,
    quarantineReason: null,
  },
  declaredCpuCores: 4,
  declaredMemoryMb: 8192,
  declaredDiskMb: 51200,
  declaredBandwidthMbps: 100,
  availableProfiles: ["NODE_EDGE", "NODE_MEDIA", "NODE_WORKER"],
};

const history: NetworkNodeHistoryEntry[] = [
  {
    id: "aud_1",
    actorId: "user_admin",
    action: "NODE_CAPACITY_CHANGED",
    metadata: '{"cpuCores":2}',
    dateLabel: "11 de nov.",
  },
];

function render(props: Partial<Parameters<typeof NetworkNodeDetail>[0]> = {}) {
  return renderToStaticMarkup(
    <NetworkNodeDetail
      detail={detail}
      history={history}
      onSaveCapacity={() => {}}
      onSaveProfiles={() => {}}
      onOpenChange={() => {}}
      {...props}
    />,
  );
}

describe("NetworkNodeDetail", () => {
  it("abre o painel do nó com a capacidade vigente nos campos — o admin edita o que está lá", () => {
    const html = render();

    expect(html).toContain("no-media-1");
    expect(html).toContain('value="4"');
    expect(html).toContain('value="8192"');
    expect(html).toContain('value="51200"');
    expect(html).toContain('value="100"');
    expect(html).toContain("Salvar capacidade");
  });

  it("mostra o histórico lido da trilha de auditoria, com ação e ator", () => {
    const html = render();

    expect(html).toContain("NODE_CAPACITY_CHANGED");
    expect(html).toContain("user_admin");
    expect(html).toContain("11 de nov.");
    // Metadata chega escapada no HTML estático; o que importa é que ela é mostrada, não interpretada.
    expect(html).toContain("&quot;cpuCores&quot;:2");
  });

  it("fechado, não renderiza nada do painel", () => {
    const html = render({ detail: null });

    expect(html).not.toContain("no-media-1");
    expect(html).not.toContain("Salvar capacidade");
  });

  it("histórico vazio diz que não há ação registrada, não mostra lista vazia", () => {
    const html = render({ history: [] });

    expect(html).toContain("Nenhuma ação registrada");
    expect(html).not.toContain("NODE_CAPACITY_CHANGED");
  });
});
