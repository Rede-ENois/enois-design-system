import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioExploreSection } from "./portfolio-explore-section.js";

const meta: Meta = {
  title: "Domain/Portfolio",
};

export default meta;

export const SectionNoExplorar: StoryObj = {
  render: () => (
    <div className="mx-auto w-full max-w-3xl">
      <PortfolioExploreSection
        mine={null}
        cards={[
          {
            username: "bia",
            name: "Bia",
            avatarUrl: null,
            headline: "Ilustração e cerâmica.",
            href: "/portfolio/bia",
          },
          {
            username: "caio",
            name: "Caio",
            avatarUrl: null,
            headline: null,
            href: "/portfolio/caio",
          },
        ]}
        editorHref="/portfolio/editar"
      >
        <section className="min-w-0">
          <h2 className="px-2 pb-2 pt-3 text-[13px] font-bold text-text-date">Comunidades</h2>
        </section>
      </PortfolioExploreSection>
    </div>
  ),
};
