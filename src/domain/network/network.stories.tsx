import type { Meta, StoryObj } from "@storybook/react-vite";

import type { NetworkRequest } from "../../types/domain/network/network-request.js";

import { NetworkNodeObservability } from "./network-node-observability.js";
import { NetworkRequests } from "./network-requests.js";

const meta: Meta<typeof NetworkRequests> = {
  title: "Domain/Network",
  component: NetworkRequests,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl p-4">
        <Story />
      </div>
    ),
  ],
  args: { loading: false, onAccept: () => {}, onDecline: () => {}, onCancel: () => {} },
};

export default meta;

const person = (patch: Partial<NetworkRequest>): NetworkRequest => ({
  userId: "u1",
  direction: "INCOMING",
  name: "Ana Souza",
  username: "ana.souza",
  headline: "Dev front-end e estudante de design",
  profileHref: "#",
  dateLabel: "28 de out.",
  status: "pending",
  ...patch,
});

const requests: NetworkRequest[] = [
  person({}),
  person({
    userId: "u2",
    name: "Caio Lima",
    username: "caio",
    headline: null,
    dateLabel: "29 de out.",
  }),
  person({ userId: "u3", name: "Bia Rocha", status: "accepted", dateLabel: "25 de out." }),
  person({ userId: "u4", name: "Davi Alves", status: "accepting", dateLabel: "23 de out." }),
  person({ userId: "u5", name: "Eva Nunes", status: "failed", dateLabel: "16 de out." }),
  person({ userId: "u6", name: "Fabi Melo", direction: "OUTGOING", dateLabel: "30 de out." }),
];

export const Received: StoryObj<typeof NetworkRequests> = { args: { requests } };

export const OnlySent: StoryObj<typeof NetworkRequests> = {
  args: { requests: requests.filter((r) => r.direction === "OUTGOING") },
};

export const Empty: StoryObj<typeof NetworkRequests> = { args: { requests: [] } };

export const Loading: StoryObj<typeof NetworkRequests> = { args: { requests: [], loading: true } };

export const LoadError: StoryObj<typeof NetworkRequests> = {
  args: { requests: [], error: true, onRetry: () => {} },
};

/** O quadro de um nó com 12 pontos e três linhas de console: o caso que se vê em produção. */
const observabilityPanel = {
  nodeId: "nd_casa",
  generatedAt: "2026-11-15T12:12:00Z",
  series: Array.from({ length: 12 }, (_, index) => ({
    // Uma lacuna no meio: o nó não mediu naquele minuto, e o gráfico não pode ligar os lados.
    sampledAt: `12:${String(index).padStart(2, "0")}`,
    cpuPercent: index === 5 ? null : 8 + index * 3,
    memoryMb: 1024 + index * 64,
    diskFreeMb: 20480,
    runningTasks: index % 3,
    mode: "NORMAL",
    activity: null,
  })),
  console: [
    { id: "nl_3", at: "12:11", level: "WARN", message: "disco abaixo de 20 GB livres" },
    { id: "nl_2", at: "12:08", level: "INFO", message: "tarefa tk_91 concluída" },
    {
      id: "nl_1",
      at: "12:03",
      level: "INFO",
      message: "aceito pela rede — status=ACTIVE modo=NORMAL",
    },
  ],
  summary: {
    cpuAvgPercent: 24.5,
    cpuMaxPercent: 41,
    memoryMbLatest: 1728,
    diskFreeMbLatest: 20480,
    runningTasksLatest: 0,
    sampleCount: 12,
  },
  consoleLevels: { INFO: 2, WARN: 1 },
};

export const NodeObservability: StoryObj<typeof NetworkNodeObservability> = {
  render: () => (
    <NetworkNodeObservability
      panel={observabilityPanel}
      refreshedAtLabel="12:12"
      onRefresh={() => {}}
    />
  ),
};

export const NodeObservabilityEmpty: StoryObj<typeof NetworkNodeObservability> = {
  render: () => <NetworkNodeObservability panel={null} />,
};
