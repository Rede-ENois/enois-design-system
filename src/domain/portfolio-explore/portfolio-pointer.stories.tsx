import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioPointer } from "./portfolio-pointer.js";

const meta: Meta = {
  title: "Domain/Portfolio",
};

export default meta;

export const PostPortaDaVitrine: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <PortfolioPointer
        name="Ana Beatriz"
        avatarUrl={null}
        title="Ana Souza"
        headline="Desenho e construo interfaces para projetos comunitários."
        href="/portfolio/ana"
      />
    </div>
  ),
};

export const PostPortaEmEspera: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <PortfolioPointer
        name="Ana Beatriz"
        avatarUrl={null}
        headline={null}
        href="/portfolio/ana"
        loading
      />
    </div>
  ),
};
