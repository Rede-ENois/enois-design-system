import type { Meta, StoryObj } from "@storybook/react-vite";

import { PanicModeSection } from "./panic-mode-section.js";

const noop = () => {};

const meta = {
  title: "Domain/Moderation/Modo pânico",
  component: PanicModeSection,
  args: {
    active: false,
    envLocked: false,
    onActivate: noop,
    onDeactivate: noop,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanicModeSection>;
export default meta;

export const Expandido: StoryObj<typeof meta> = {};

export const Compacto: StoryObj<typeof meta> = {
  args: { compact: true },
};

export const CompactoAtivo: StoryObj<typeof meta> = {
  args: { compact: true, active: true },
};

export const CompactoTravadoPeloAmbiente: StoryObj<typeof meta> = {
  args: { compact: true, envLocked: true },
};

export const CompactoCarregando: StoryObj<typeof meta> = {
  args: { compact: true, loading: true },
};

export const CompactoPendente: StoryObj<typeof meta> = {
  args: { compact: true, pending: true },
};

export const CompactoComFalha: StoryObj<typeof meta> = {
  args: { compact: true, error: true, onRetry: noop },
};

export const FalhaEComAtivo: StoryObj<typeof meta> = {
  args: { compact: true, active: true, error: true, onRetry: noop },
};
