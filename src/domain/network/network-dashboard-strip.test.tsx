// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NetworkDashboardData } from "../../types/domain/network/network-dashboard-data.js";

import { NetworkDashboardStrip } from "./network-dashboard-strip.js";

const dashboard: NetworkDashboardData = {
  total: 12,
  active: 8,
  unavailable: 3,
  quarantined: 1,
  alive: 7,
  degraded: 2,
  declaredCpuCores: 48,
  declaredMemoryMb: 98304,
  freeSlots: 5,
  avgCpuPercent: 34.7,
  cpuSamples: 9,
  avgMemoryMb: 20480,
  memorySamples: 9,
  runtimeVersions: { "1.2.0": 10, "1.1.0": 2 },
};

function render(props: Partial<Parameters<typeof NetworkDashboardStrip>[0]> = {}) {
  return renderToStaticMarkup(<NetworkDashboardStrip dashboard={dashboard} {...props} />);
}

describe("NetworkDashboardStrip", () => {
  it("mostra a fotografia da rede: contagens, capacidade e médias com amostras", () => {
    const html = render();

    expect(html).toContain("12");
    expect(html).toContain("8");
    expect(html).toContain("5");
    expect(html).toContain("48 vCPU");
    expect(html).toContain("98304 MB");
    expect(html).toContain("35% (9 amostras)");
    expect(html).toContain("20480 MB");
  });

  it("expõe as versões de runtime em campo — mais de uma versão é sinal de atualização pendente", () => {
    const html = render();

    expect(html).toContain("1.2.0 × 10");
    expect(html).toContain("1.1.0 × 2");
  });

  it("média sem amostra é 'Sem amostras', nunca 0 ou vazio", () => {
    const html = render({
      dashboard: {
        ...dashboard,
        avgCpuPercent: null,
        cpuSamples: 0,
        avgMemoryMb: null,
        memorySamples: 0,
      },
    });

    expect(html).toContain("Sem amostras");
    expect(html).not.toContain("% (");
  });
});
