import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ModeratorWorkspaceProps } from "../../types/domain/moderation/moderator-workspace-props.js";

import { ModeratorWorkspace } from "./moderator-workspace.js";
import { ReportsSection } from "./reports-section.js";
import { reportsStoryData } from "./reports.fixture.js";

const groups = [
  {
    id: "revisao",
    label: "Revisão da comunidade",
    tabs: [
      { id: "denuncias", label: "Denúncias" },
      { id: "recursos", label: "Recursos de penalidades" },
      { id: "conteudos", label: "Conteúdos suspeitos" },
    ],
  },
  {
    id: "atendimento",
    label: "Atendimento",
    tabs: [
      { id: "suporte", label: "Chamados de suporte" },
      { id: "contribuicoes", label: "Contribuições" },
    ],
  },
  {
    id: "gestao",
    label: "Administração",
    tabs: [
      { id: "contas", label: "Contas e permissões" },
      { id: "monitoramento", label: "Monitorabilidade" },
      { id: "identidade", label: "Verificação de identidade" },
    ],
  },
];
const reportsProps = {
  reports: reportsStoryData,
  admin: true,
  loading: false,
  error: false,
  pending: false,
  actionError: false,
  onRetry: () => {},
  onVote: () => {},
  onAdminAction: async () => true,
};

function Demonstracao(props: ModeratorWorkspaceProps) {
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const label = props.groups
    .flatMap((group) => group.tabs)
    .find((tab) => tab.id === activeTab)?.label;
  return (
    <ModeratorWorkspace {...props} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "denuncias" ? (
        props.children
      ) : (
        <section className="surface-card space-y-2 p-4">
          <h2 className="text-lg font-semibold">{label}</h2>

          <p>Área fictícia selecionada. Use a navegação para voltar às denúncias.</p>
        </section>
      )}
    </ModeratorWorkspace>
  );
}

const meta = {
  title: "Domain/Moderation/Espaço de trabalho",
  component: ModeratorWorkspace,
  args: {
    groups,
    activeTab: "denuncias",
    onTabChange: () => {},
    children: <ReportsSection {...reportsProps} />,
  },
  render: (args) => <Demonstracao {...args} />,
} satisfies Meta<typeof ModeratorWorkspace>;
export default meta;
export const Principal: StoryObj<typeof meta> = {};
export const DispositivoMovel: StoryObj<typeof meta> = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
export const Vazio: StoryObj<typeof meta> = {
  args: { children: <ReportsSection {...reportsProps} reports={[]} /> },
};
export const Erro: StoryObj<typeof meta> = {
  args: { children: <ReportsSection {...reportsProps} error /> },
};
export const Carregando: StoryObj<typeof meta> = {
  args: { children: <ReportsSection {...reportsProps} loading /> },
};
export const TextoLongo: StoryObj<typeof meta> = {
  args: {
    groups: groups.map((group) => ({
      ...group,
      label: `${group.label} com nome de grupo longo para demonstração`,
      tabs: group.tabs.map((tab) => ({
        ...tab,
        label: `${tab.label} com nome extenso de uma área administrativa`,
      })),
    })),
    children: (
      <ReportsSection
        {...reportsProps}
        reports={[{ ...reportsStoryData[0], content: "conteudoficticiosemespacos".repeat(100) }]}
      />
    ),
  },
};
