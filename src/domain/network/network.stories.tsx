import type { Meta, StoryObj } from "@storybook/react-vite";

import type { NetworkRequest } from "../../types/domain/network/network-request.js";

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
  dateLabel: "há 2 dias",
  status: "pending",
  ...patch,
});

const requests: NetworkRequest[] = [
  person({}),
  person({ userId: "u2", name: "Caio Lima", username: "caio", headline: null, dateLabel: "ontem" }),
  person({ userId: "u3", name: "Bia Rocha", status: "accepted", dateLabel: "há 5 dias" }),
  person({ userId: "u4", name: "Davi Alves", status: "accepting", dateLabel: "há 1 semana" }),
  person({ userId: "u5", name: "Eva Nunes", status: "failed", dateLabel: "há 2 semanas" }),
  person({ userId: "u6", name: "Fabi Melo", direction: "OUTGOING", dateLabel: "há 3 horas" }),
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
