import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { SanctionData } from "../../types/domain/moderation/sanction-data.js";
import type { SanctionsViewProps } from "../../types/domain/moderation/sanctions-view-props.js";
import { Button } from "../../ui/button.js";

import { SanctionsView } from "./sanctions-view.js";

const now = Date.parse("2026-11-14T12:00:00Z");
const sanction: SanctionData = {
  id: "penalidade-demonstracao",
  type: "SUSPENDED",
  status: "ACTIVE",
  reason: "Motivo fictício para demonstrar a transparência da decisão.",
  createdAt: "2026-11-14T10:00:00Z",
  deadline: { kind: "APPEAL", at: "2026-11-14T14:30:00Z" },
  evidence: { kind: "TEXT", text: "Trecho seguro e inteiramente fictício usado na demonstração." },
  canAppeal: true,
};
const appeal = {
  id: "recurso-demonstracao",
  sanctionId: sanction.id,
  message: "Gostaria de solicitar a revisão desta decisão fictícia.",
  status: "PENDING" as const,
  createdAt: "2026-11-14T11:00:00Z",
};

function Demo(args: SanctionsViewProps) {
  const [appealMessage, setMessage] = useState(args.appealMessage);
  const [appealSanctionId, setTarget] = useState(args.appealSanctionId);
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto w-full max-w-2xl">
      <SanctionsView
        {...args}
        appealMessage={appealMessage}
        onAppealMessageChange={setMessage}
        appealSanctionId={appealSanctionId}
        onAppealSanctionChange={(id) => {
          setTarget(id);
          setMessage("");
        }}
        onAppeal={() => setSent(true)}
        appeals={
          sent
            ? [
                ...args.appeals,
                {
                  ...appeal,
                  sanctionId:
                    appealSanctionId ??
                    args.sanctions.find((item) => item.canAppeal)?.id ??
                    sanction.id,
                },
              ]
            : args.appeals
        }
      />
    </div>
  );
}
const meta = {
  title: "Domain/Moderation/Sanctions",
  component: SanctionsView,
  render: (args) => (
    <Demo key={`${args.mode}-${args.appealMessage}-${args.appealSanctionId}`} {...args} />
  ),
  args: {
    mode: "suspended",
    sanctions: [sanction],
    appeals: [],
    now,
    loading: false,
    error: false,
    refreshing: false,
    appealMessage: "",
    onAppealMessageChange: () => {},
    onAppeal: () => {},
    appealSubmitting: false,
    appealError: false,
    onRetry: () => {},
    backHref: "#voltar-demonstracao",
    loginHref: "#login-demonstracao",
  },
} satisfies Meta<typeof SanctionsView>;
export default meta;

export const Suspended: StoryObj<typeof meta> = {};
export const History: StoryObj<typeof meta> = {
  args: {
    mode: "history",
    sanctions: [
      sanction,
      {
        ...sanction,
        id: "restricao-removida-demo",
        type: "RESTRICTION",
        status: "REMOVED",
        canAppeal: false,
        deadline: { kind: "END", at: "2026-11-13T12:00:00Z" },
      },
    ],
  },
};
export const EffectiveEnd: StoryObj<typeof meta> = {
  args: {
    sanctions: [
      { ...sanction, type: "RESTRICTION", deadline: { kind: "END", at: "2026-11-14T14:30:00Z" } },
    ],
  },
};
export const NoDeadline: StoryObj<typeof meta> = {
  args: { sanctions: [{ ...sanction, deadline: { kind: "NONE", at: null } }] },
};
export const Permanent: StoryObj<typeof meta> = {
  args: {
    sanctions: [
      { ...sanction, type: "BAN", canAppeal: false, deadline: { kind: "NONE", at: null } },
      {
        ...sanction,
        id: "permanente-demo",
        type: "PERMABAN",
        canAppeal: false,
        deadline: { kind: "NONE", at: null },
      },
    ],
  },
};
export const UnavailableEvidence: StoryObj<typeof meta> = {
  args: {
    sanctions: [{ ...sanction, reason: null, evidence: { kind: "UNAVAILABLE", text: null } }],
  },
};
export const Behavioral: StoryObj<typeof meta> = {
  args: {
    sanctions: [
      {
        ...sanction,
        evidence: {
          kind: "BEHAVIOR",
          text: "Descrição fictícia de uma sequência de condutas, sem atribuir a origem a um único post.",
        },
      },
    ],
  },
};
export const MediaDescription: StoryObj<typeof meta> = {
  args: {
    sanctions: [
      {
        ...sanction,
        evidence: {
          kind: "MEDIA",
          text: "Descrição segura de uma mídia fictícia. O arquivo original não é reproduzido.",
        },
      },
    ],
  },
};
export const LongContent: StoryObj<typeof meta> = {
  args: {
    sanctions: [
      {
        ...sanction,
        reason: "Motivo fictício detalhado. ".repeat(40) + "sequenciasemespacos".repeat(30),
        evidence: { kind: "TEXT", text: "Trecho fictício seguro e extenso. ".repeat(40) },
      },
    ],
  },
};
export const Loading: StoryObj<typeof meta> = { args: { loading: true } };
export const Empty: StoryObj<typeof meta> = { args: { mode: "history", sanctions: [] } };
export const LoadError: StoryObj<typeof meta> = { args: { error: true } };
export const AppealError: StoryObj<typeof meta> = {
  args: { appealError: true, appealMessage: appeal.message },
};
export const Submitting: StoryObj<typeof meta> = {
  args: { appealSubmitting: true, appealMessage: appeal.message },
};
export const Pending: StoryObj<typeof meta> = { args: { appeals: [appeal] } };
export const Approved: StoryObj<typeof meta> = {
  args: {
    appeals: [{ ...appeal, status: "APPROVED" }],
    sanctions: [{ ...sanction, status: "REMOVED", canAppeal: false }],
  },
};
export const Denied: StoryObj<typeof meta> = {
  args: {
    appeals: [{ ...appeal, status: "DENIED" }],
    sanctions: [{ ...sanction, canAppeal: false }],
  },
};
export const Expired: StoryObj<typeof meta> = {
  args: { now: Date.parse("2026-11-14T14:30:00Z"), sanctions: [{ ...sanction, canAppeal: false }] },
};
export const Refreshing: StoryObj<typeof meta> = {
  args: { now: Date.parse("2026-11-14T14:30:00Z"), refreshing: true, appeals: [appeal] },
};
export const InvalidDeadline: StoryObj<typeof meta> = {
  args: { sanctions: [{ ...sanction, deadline: { kind: "APPEAL", at: null } }] },
};
export const MultipleSanctions: StoryObj<typeof meta> = {
  args: {
    mode: "history",
    sanctions: [
      sanction,
      { ...sanction, id: "segunda-penalidade-demonstracao", type: "RESTRICTION" },
    ],
  },
};
export const LimitReached: StoryObj<typeof meta> = { args: { appealMessage: "a".repeat(1000) } };

function ClockDemo(args: SanctionsViewProps) {
  const [clock, setClock] = useState(Date.parse("2026-11-14T14:29:59Z"));
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Button variant="outline" onClick={() => setClock(Date.parse("2026-11-14T14:30:00Z"))}>
        Avançar o horário recebido até o prazo
      </Button>

      <SanctionsView {...args} now={clock} />
    </div>
  );
}
export const ClockTransition: StoryObj<typeof meta> = { render: (args) => <ClockDemo {...args} /> };
