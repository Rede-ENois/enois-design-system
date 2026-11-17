// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NetworkNodeObservabilityPanel } from "../../types/domain/network/network-node-observability-panel.js";

import { NetworkNodeObservability } from "./network-node-observability.js";

const panel = (
  overrides: Partial<NetworkNodeObservabilityPanel> = {},
): NetworkNodeObservabilityPanel => ({
  nodeId: "nd_a",
  generatedAt: "2026-11-15T12:00:05Z",
  series: [
    {
      sampledAt: "12:00",
      cpuPercent: 10,
      memoryMb: 1024,
      diskFreeMb: 2048,
      runningTasks: 0,
      mode: "NORMAL",
      activity: null,
    },
    {
      sampledAt: "12:01",
      cpuPercent: 40,
      memoryMb: 2048,
      diskFreeMb: 2048,
      runningTasks: 1,
      mode: "NORMAL",
      activity: null,
    },
  ],
  console: [{ id: "nl_1", at: "12:01", level: "INFO", message: "tarefa concluida" }],
  summary: {
    cpuAvgPercent: 25,
    cpuMaxPercent: 40,
    memoryMbLatest: 2048,
    diskFreeMbLatest: 2048,
    runningTasksLatest: 1,
    sampleCount: 2,
  },
  consoleLevels: { INFO: 1 },
  ...overrides,
});

const render = (props: Parameters<typeof NetworkNodeObservability>[0]) =>
  renderToStaticMarkup(<NetworkNodeObservability {...props} />);

describe("NetworkNodeObservability", () => {
  it("mostra o resumo, as amostras e o console do nó", () => {
    const html = render({ panel: panel() });

    expect(html).toContain("25%");
    expect(html).toContain("40%");
    expect(html).toContain("2048 MB");
    expect(html).toContain("tarefa concluida");
    expect(html).toContain("2 amostras");
    // A janela curta é declarada na tela: quem olha não confunde com histórico.
    expect(html).toContain("Janela curta");
  });

  it("medida ausente vira 'não medido', nunca zero", () => {
    const semMedida = panel({
      summary: {
        cpuAvgPercent: null,
        cpuMaxPercent: null,
        memoryMbLatest: null,
        diskFreeMbLatest: null,
        runningTasksLatest: null,
        sampleCount: 0,
      },
      series: [],
      console: [],
    });

    const html = render({ panel: semMedida });

    expect(html).toContain("não medido");
    // Zero seria uma medida (nó ocioso) e não a ausência dela.
    expect(html).not.toContain(">0%<");
  });

  it("nó sem amostra diz que ainda não enviou, em vez de gráfico vazio", () => {
    const html = render({
      panel: panel({
        series: [],
        console: [],
        consoleLevels: {},
        summary: { ...panel().summary, sampleCount: 0 },
      }),
    });

    expect(html).toContain("ainda não enviou");
  });

  it("lacuna entre medidas quebra a linha em vez de cruzá-la", () => {
    const base = panel().series[0]!;
    const comLacuna = panel({
      series: [
        base,
        { ...base, sampledAt: "12:01", cpuPercent: null },
        { ...base, sampledAt: "12:02", cpuPercent: 50 },
      ],
    });

    const html = render({ panel: comLacuna });

    // Duas polilinhas — o trecho antes e o depois da lacuna —, não uma ligando os dois lados.
    const polylines = html.split("<polyline").length - 1;
    expect(polylines).toBe(2);
  });

  it("erro aparece como erro, não como carregando", () => {
    const html = render({ panel: null, error: "Servidor não encontrado." });

    expect(html).toContain("Servidor não encontrado.");
    expect(html).not.toContain("Carregando o quadro");
  });

  it("antes de carregar mostra o carregamento, não zeros", () => {
    const html = render({ panel: null, loading: true });

    expect(html).toContain("Carregando o quadro");
  });
});
