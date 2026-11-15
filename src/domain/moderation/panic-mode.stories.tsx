import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { EnoisProvider } from "../../index.js";
import type { PanicModeSectionProps } from "../../types/domain/moderation/panic-mode-section-props.js";

import { PanicModeSection } from "./panic-mode-section.js";

function Demonstracao(props: PanicModeSectionProps) {
  const [active, setActive] = useState(props.active);
  return (
    <div className="max-w-2xl">
      <PanicModeSection
        {...props}
        active={active}
        onActivate={() => setActive(true)}
        onDeactivate={() => setActive(false)}
      />
    </div>
  );
}

const meta = {
  title: "Domain/Moderation/Modo pânico",
  component: PanicModeSection,
  args: {
    active: false,
    envLocked: false,
    onActivate: () => {},
    onDeactivate: () => {},
  },
  render: (args) => <Demonstracao {...args} />,
} satisfies Meta<typeof PanicModeSection>;

export default meta;
export const Padrao: StoryObj<typeof meta> = {};
export const Compacto: StoryObj<typeof meta> = { args: { compact: true } };
export const CompactoAtivo: StoryObj<typeof meta> = { args: { compact: true, active: true } };
export const CompactoTravado: StoryObj<typeof meta> = { args: { compact: true, envLocked: true } };
export const CompactoCarregando: StoryObj<typeof meta> = { args: { compact: true, loading: true } };
export const CompactoPendente: StoryObj<typeof meta> = { args: { compact: true, pending: true } };
export const CompactoComErro: StoryObj<typeof meta> = {
  args: { compact: true, error: true, onRetry: () => {} },
};
export const TextoLongo: StoryObj<typeof meta> = {
  args: { compact: true },
  render: (args) => (
    <EnoisProvider
      messages={{
        panicModeSection: {
          title: "Modo de emergência com título extenso para demonstração de quebra de linhas",
          description: "Descrição sintética longa dos controles de emergência. ".repeat(12),
        },
      }}
    >
      <Demonstracao {...args} />
    </EnoisProvider>
  ),
};
