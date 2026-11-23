import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ModeratorWorkspaceProps } from "../../types/domain/moderation/moderator-workspace-props.js";

import { ModeratorWorkspace } from "./moderator-workspace.js";

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

function AreaFicticia({ titulo }: { titulo: string }) {
  return (
    <section className="space-y-2 rounded-2xl border border-border-soft bg-surface-card p-4">
      <h2 className="text-lg font-semibold text-text-strong">{titulo}</h2>

      <p className="text-sm text-text-subtle">
        Área fictícia. O aplicativo é quem carrega o conteúdo de cada destino.
      </p>
    </section>
  );
}

function Demonstracao({ groups: grupos, activeTab }: ModeratorWorkspaceProps) {
  const [atual, setAtual] = useState(activeTab);
  const titulo = grupos.flatMap((grupo) => grupo.tabs).find((aba) => aba.id === atual)?.label;

  return (
    <ModeratorWorkspace groups={grupos} activeTab={atual} onTabChange={setAtual}>
      <AreaFicticia titulo={titulo ?? "Área"} />
    </ModeratorWorkspace>
  );
}

const meta = {
  title: "Domain/Moderation/Navegação do painel",
  component: ModeratorWorkspace,
  args: {
    groups,
    activeTab: "denuncias",
    onTabChange: () => {},
    children: <AreaFicticia titulo="Denúncias" />,
  },
  render: (args) => <Demonstracao {...args} />,
} satisfies Meta<typeof ModeratorWorkspace>;
export default meta;
export const Principal: StoryObj<typeof meta> = {};
export const DispositivoMovel: StoryObj<typeof meta> = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
export const AreaForaDoGrupoAtivo: StoryObj<typeof meta> = {
  args: { activeTab: "monitoramento" },
};
export const SemAreas: StoryObj<typeof meta> = {
  args: { groups: [] },
};
export const TextoLongo: StoryObj<typeof meta> = {
  args: {
    groups: groups.map((grupo) => ({
      ...grupo,
      label: `${grupo.label} com nome de grupo longo para demonstração`,
      tabs: grupo.tabs.map((aba) => ({
        ...aba,
        label: `${aba.label} com nome extenso de uma área administrativa`,
      })),
    })),
  },
};
