import type { Meta, StoryObj } from "@storybook/react-vite";

import { WhatsNewDialog } from "./whats-new-dialog.js";

const meta: Meta = {
  title: "Domain/WhatsNew",
};

export default meta;

export const Dialog: StoryObj = {
  render: () => (
    <WhatsNewDialog
      open
      onOpenChange={() => {}}
      items={[
        {
          id: "study-pairs",
          title: "Par de estudo",
          description: "Encontre alguém com os mesmos objetivos para estudar junto.",
        },
        {
          id: "local-communities",
          title: "Comunidades da sua cidade",
          description: "Veja e participe das comunidades de quem mora perto de você.",
        },
        {
          id: "weekly-digest",
          title: "Resumo semanal por e-mail",
          description: "O melhor da sua rede, uma vez por semana. Ajuste nas preferências.",
        },
      ]}
    />
  ),
};
