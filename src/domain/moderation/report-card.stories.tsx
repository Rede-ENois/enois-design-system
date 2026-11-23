import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ReportCardProps } from "../../types/domain/moderation/report-card-props.js";

import { ReportCard } from "./report-card.js";
import { reportsStoryData } from "./reports.fixture.js";

function Demonstracao(props: ReportCardProps) {
  const [report, setReport] = useState(props.report);
  return (
    <ul className="max-w-3xl">
      <ReportCard
        {...props}
        report={report}
        onVote={(_reportId, vote) => {
          setReport((current) => ({ ...current, myVote: vote }));
          props.onVote(_reportId, vote);
        }}
      />
    </ul>
  );
}

const meta = {
  title: "Domain/Moderation/Denúncia (cartão)",
  component: ReportCard,
  args: {
    report: reportsStoryData[0],
    admin: true,
    pending: false,
    onVote: () => {},
  },
  render: (args) => <Demonstracao {...args} />,
} satisfies Meta<typeof ReportCard>;
export default meta;

export const Principal: StoryObj<typeof meta> = {};

export const VotoRegistrado: StoryObj<typeof meta> = {
  args: { report: reportsStoryData[1] },
};

export const SemAcaoAdministrativa: StoryObj<typeof meta> = {
  args: { admin: false },
};

export const DadosAusentes: StoryObj<typeof meta> = {
  args: { report: reportsStoryData[2] },
};

export const Enviando: StoryObj<typeof meta> = {
  args: { pending: true },
};

export const TextoLongo: StoryObj<typeof meta> = {
  args: {
    report: {
      ...reportsStoryData[0],
      reportId: "denuncia-ficticia-texto-longo-sem-quebras-".repeat(4),
      content: "Conteúdo sintético muito longo para verificar rolagem. ".repeat(40),
      description: "Relato sintético longo com espaço e sem espaço: ".repeat(20),
      author: "Nome fictício bastante longo para verificar que a quebra de texto funciona",
    },
  },
};
