import type { Meta, StoryObj } from "@storybook/react-vite";

import type { AdminHistoryRowData } from "../../types/domain/moderation/admin-history-row-data.js";

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
