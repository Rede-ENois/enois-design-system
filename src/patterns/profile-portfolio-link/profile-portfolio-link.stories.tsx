import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProfilePortfolioLink } from "./profile-portfolio-link.js";

const meta = {
  title: "Patterns/ProfilePortfolioLink",
  component: ProfilePortfolioLink,
} satisfies Meta<typeof ProfilePortfolioLink>;

export default meta;

/** Quem visita o perfil: o atalho abre a vitrine publicada. */
export const Visitor: StoryObj<typeof meta> = {
  args: { href: "/portfolio/ana" },
};

/** O dono do perfil: o mesmo atalho abre o editor. */
export const Owner: StoryObj<typeof meta> = {
  args: { href: "/portfolio/editar", owner: true },
};
