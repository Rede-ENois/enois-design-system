import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioCard } from "./portfolio-card.js";

const meta: Meta = {
  title: "Domain/Portfolio",
};

export default meta;

export const CardComVitrine: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <PortfolioCard
        card={{
          username: "ana",
          name: "Ana Beatriz",
          avatarUrl: null,
          headline: "Desenho e construo interfaces para projetos comunitários.",
          href: "/portfolio/ana",
        }}
        editorHref="/portfolio/editar"
      />
    </div>
  ),
};

export const CardSemVitrine: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <PortfolioCard card={null} editorHref="/portfolio/editar" />
    </div>
  ),
};
