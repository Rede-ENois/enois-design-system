import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";

import { ReportsSection } from "./reports-section.js";
import { reportsStoryData } from "./reports.fixture.js";

function Demonstracao(props: ReportsSectionProps & { failAction?: boolean }) {
  const [reports, setReports] = useState(props.reports);
  const [pending, setPending] = useState(false);

  const [error, setError] = useState(props.error);
  return (
    <ReportsSection
      {...props}
      reports={reports}
      error={error}
      pending={props.pending || pending}
      actionError={props.actionError}
      onRetry={() => setError(false)}
      onVote={(reportId, vote) => {
        setReports((current) =>
          current.map((report) =>
            report.reportId === reportId ? { ...report, myVote: vote } : report,
          ),
        );
      }}
      onAdminAction={async (reportId) => {
        setPending(true);

        await new Promise((resolve) => setTimeout(resolve, 600));
        setPending(false);
        if (props.failAction) return false;
        setReports((current) => current.filter((report) => report.reportId !== reportId));
        return true;
      }}
    />
  );
}

const meta = {
  title: "Domain/Moderation/Denúncias",
  component: ReportsSection,
  args: {
    reports: reportsStoryData,
    admin: true,
    loading: false,
    error: false,
    pending: false,
    actionError: false,
    onRetry: () => {},
    onVote: () => {},
    onAdminAction: async () => true,
  },
  render: (args) => <Demonstracao {...args} />,
} satisfies Meta<typeof ReportsSection>;
export default meta;
export const Principal: StoryObj<typeof meta> = {};
export const DispositivoMovel: StoryObj<typeof meta> = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
export const SemPermissaoAdministrativa: StoryObj<typeof meta> = { args: { admin: false } };
export const Vazio: StoryObj<typeof meta> = { args: { reports: [] } };
export const Erro: StoryObj<typeof meta> = { args: { error: true } };
export const Carregando: StoryObj<typeof meta> = { args: { loading: true } };
export const Pendente: StoryObj<typeof meta> = { args: { pending: true } };
export const FalhaNaAcao: StoryObj<typeof meta> = {
  render: (args) => <Demonstracao {...args} failAction />,
};
export const TextoLongo: StoryObj<typeof meta> = {
  args: {
    reports: [
      {
        ...reportsStoryData[0],
        reportId: "referencia-ficticia-".repeat(14),
        author: "Responsável fictício com nome extenso ".repeat(7),
        reporter: "pessoa-ficticia-".repeat(20),
        content: "conteudosinteticosemespacos".repeat(100),
        description:
          "Relato fictício longo para verificar a leitura, a quebra de linhas e as ações. ".repeat(
            20,
          ),
      },
    ],
  },
};
