import type { Meta, StoryObj } from "@storybook/react-vite";

import type { StudyPairIcebreakerField } from "../../types/domain/study-pairs/study-pair-icebreaker-field.js";
import type { StudyPairProposal } from "../../types/domain/study-pairs/study-pair-proposal.js";

import { StudyPairProposals } from "./study-pair-proposals.js";

const meta: Meta = {
  title: "Domain/StudyPairProposals",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

const noop = () => {};

const fields: StudyPairIcebreakerField[] = [
  { id: "why_now", question: "Por que esse objetivo agora?", required: true, options: [] },
  {
    id: "weekly_time",
    question: "Quanto tempo por semana?",
    required: false,
    options: ["Até 1 hora", "2 a 3 horas", "4 a 5 horas"],
  },
];

const waiting: StudyPairProposal = {
  id: "sp-1",
  goal: "Aprender Rust do zero até fazer um CLI",
  partner: { id: "u-2", username: "marina.dev", name: "Marina Souza", href: "/u/marina.dev" },
  myAccepted: false,
  partnerAccepted: false,
  partnerIcebreaker: null,
  deadlineLabel: "26 nov",
};

export const Pendente: StoryObj = {
  render: () => (
    <StudyPairProposals proposals={[waiting]} fields={fields} onAccept={noop} onDecline={noop} />
  ),
};

export const Aceitei: StoryObj = {
  render: () => (
    <StudyPairProposals
      proposals={[{ ...waiting, myAccepted: true }]}
      fields={fields}
      onAccept={noop}
      onDecline={noop}
    />
  ),
};

export const DoisAceitaram: StoryObj = {
  render: () => (
    <StudyPairProposals
      proposals={[
        {
          ...waiting,
          myAccepted: true,
          partnerAccepted: true,
          partnerIcebreaker: {
            why_now: "Quero trocar de área no ano que vem.",
            weekly_time: "2 a 3 horas",
          },
        },
      ]}
      fields={fields}
      onAccept={noop}
      onDecline={noop}
    />
  ),
};
