import type { Meta, StoryObj } from "@storybook/react-vite";

import type { AdminHistoryRowData } from "../../types/domain/moderation/admin-history-row-data.js";
import type { AdminMemberRowData } from "../../types/domain/moderation/admin-member-row-data.js";

import { AdminEntityActionsSection } from "./admin-entity-actions-section.js";
import { AdminMembersSection } from "./admin-members-section.js";
import { AdminProfileActionsSection } from "./admin-profile-actions-section.js";
import { AdminRemovePostAction } from "./admin-remove-post-action.js";

const meta: Meta = {
  title: "Domain/Moderation",
};

export default meta;

const resolved = async () => true;

const history: AdminHistoryRowData[] = [
  {
    id: "warn_1",
    kind: "WARNING",
    typeLabel: "Advertência",
    reason: "Publicações repetidas fora das diretrizes da rede.",
    active: true,
    createdAtLabel: "18/10/2026, 10:31",
  },
  {
    id: "sanction_1",
    kind: "SANCTION",
    typeLabel: "Suspensão",
    reason: "Golpe contra membros da comunidade.",
    active: true,
    createdAtLabel: "17/10/2026, 09:00",
    dueAtLabel: "24/10/2026, 09:00",
  },
  {
    id: "sanction_2",
    kind: "SANCTION",
    typeLabel: "Restrição",
    reason: "Revisão da decisão anterior pela administração.",
    active: false,
    createdAtLabel: "10/10/2026, 08:00",
  },
];

export const DirectAdminActions: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <AdminProfileActionsSection
        profile={{ username: "alvo", displayName: "Alvo Teste", activeWarnings: 1 }}
        history={history}
        onWarn={resolved}
        onSanction={resolved}
        onRevokeWarning={resolved}
      />
      <AdminProfileActionsSection
        profile={{ username: "outra-conta", displayName: null, activeWarnings: 0 }}
        history={[]}
        onWarn={resolved}
        onSanction={resolved}
        onRevokeWarning={resolved}
      />
      <AdminProfileActionsSection
        profile={{ username: "alvo", displayName: "Alvo Teste", activeWarnings: 0 }}
        history={[]}
        loading
        onWarn={resolved}
        onSanction={resolved}
        onRevokeWarning={resolved}
      />
      <AdminRemovePostAction
        label="Remover publicação"
        title="Remover esta publicação (administração)"
        description="A publicação sai do ar na hora, com motivo registrado e auditoria. O autor não é banido por esta ação."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        reasonPlaceholder="Motivo (mínimo 10 caracteres)"
        reasonTooShort="O motivo precisa de pelo menos 10 caracteres."
        onRemove={resolved}
      />
    </div>
  ),
};

const members: AdminMemberRowData[] = [
  {
    userId: "u1",
    username: "ana",
    name: "Ana Souza",
    avatar: null,
    roleLabel: "Dono",
    joinedAtLabel: "18/10/2025",
  },
  {
    userId: "u2",
    username: "bruno",
    name: "Bruno Lima",
    avatar: null,
    roleLabel: "Admin",
    joinedAtLabel: "02/03/2026",
  },
  {
    userId: "u3",
    username: "carla",
    name: "Carla Dias",
    avatar: null,
    roleLabel: "Membro",
    joinedAtLabel: "11/07/2026",
  },
];

export const AdminEntityManagement: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <AdminEntityActionsSection
        kind="community"
        entityName="Comunidade Front-end"
        title="Administração da plataforma"
        deleteLabel="Excluir comunidade"
        description="Decisões da administração da plataforma sobre esta comunidade."
        onDelete={resolved}
      />
      <AdminEntityActionsSection
        kind="group"
        entityName="Grupo Estudos"
        title="Administração da plataforma"
        deleteLabel="Excluir grupo"
        description="Decisões da administração da plataforma sobre este grupo."
        onDelete={resolved}
        onClose={resolved}
      />
      <AdminMembersSection
        entityName="Grupo Estudos"
        items={members}
        total={340}
        page={0}
        pages={12}
        query=""
        onQuery={() => {}}
        onPage={() => {}}
        onRemove={resolved}
      />
      <AdminMembersSection
        entityName="Grupo Estudos"
        items={[]}
        total={0}
        page={0}
        pages={0}
        query="ninguém"
        onQuery={() => {}}
        onPage={() => {}}
      />
    </div>
  ),
};
