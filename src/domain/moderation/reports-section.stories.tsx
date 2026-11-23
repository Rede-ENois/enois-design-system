import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";

import { ReportsSection } from "./reports-section.js";
import { reportsStoryData } from "./reports.fixture.js";

function Demonstracao({
  reports: iniciais = reportsStoryData,
  loading = false,
  error: falha = false,
  pending = false,
}: Partial<ReportsSectionProps>) {
  const [reports, setReports] = useState(iniciais);
  const [error, setError] = useState(falha);
  return (
    <div className="mx-auto max-w-3xl p-4">
      <ReportsSection
        reports={reports}
        admin={false}
        loading={loading}
        error={error}
        pending={pending}
        onRetry={() => setError(false)}
        onVote={(reportId, vote) =>
          setReports((current) =>
            current.map((report) =>
              report.reportId === reportId ? { ...report, myVote: vote } : report,
            ),
          )
        }
      />
    </div>
  );
}

const meta = {
  title: "Domain/Moderação/Fila de denúncias",
  parameters: { layout: "fullscreen" },
  args: {
    reports: reportsStoryData,
    admin: false,
    loading: false,
    error: false,
    pending: false,
    onRetry: () => undefined,
    onVote: () => undefined,
  },
} satisfies Meta;

export default meta;

export const Principal: StoryObj<typeof ReportsSection> = {
  render: () => <Demonstracao />,
};

export const Carregando: StoryObj<typeof ReportsSection> = {
  render: () => <Demonstracao reports={[]} loading />,
};

export const Falha: StoryObj<typeof ReportsSection> = {
  render: () => <Demonstracao reports={[]} error />,
};

export const FilaVazia: StoryObj<typeof ReportsSection> = {
  render: () => <Demonstracao reports={[]} />,
};

export const Enviando: StoryObj<typeof ReportsSection> = {
  render: () => <Demonstracao pending />,
};

export const Mobile: StoryObj<typeof ReportsSection> = {
  render: () => (
    <div className="mx-auto max-w-sm p-3">
      <Demonstracao />
    </div>
  ),
};

export const TextoLongo: StoryObj<typeof ReportsSection> = {
  render: () => (
    <Demonstracao
      reports={[
        {
          ...reportsStoryData[0],
          reportId: "denuncia-ficticia-com-identificador-muito-longo-para-quebrar",
          reporter: "Nome fictício extremamente longo para exercitar a quebra dentro do cartão",
          author:
            "Outro nome fictício igualmente longo, sem espaços, paraforçar-que-bra-de-palavra",
          content: "Conteúdo sintético longo. ".repeat(40),
        },
      ]}
    />
  ),
};
