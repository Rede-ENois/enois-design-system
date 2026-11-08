import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Joystick,
  Puzzle,
  ShoppingBag,
} from "lucide-react";

import { ExploreHub } from "./explore-hub.js";

const meta: Meta = {
  title: "Domain/Explore",
};

export default meta;

export const Hub: StoryObj = {
  render: () => (
    <ExploreHub
      sections={[
        {
          id: "play",
          title: "Brincar",
          items: [
            {
              href: "/jogos",
              label: "Jogos",
              description: "Jogos indie da comunidade",
              icon: Joystick,
              color: "#7c5cf6",
              signal: { kind: "new" },
            },
            {
              href: "/jogos/desafio",
              label: "Desafio do dia",
              description: "8 pessoas jogaram",
              icon: Puzzle,
              color: "#be185d",
              signal: { kind: "today" },
            },
          ],
        },
        {
          id: "build",
          title: "Construir",
          items: [
            {
              href: "/projetos",
              label: "Projetos",
              description: "O que a galera tá fazendo",
              icon: FolderKanban,
              color: "#0f766e",
            },
            {
              href: "/carteira",
              label: "Loja",
              description: "Cosméticos com faíscas",
              icon: ShoppingBag,
              color: "#b45309",
            },
          ],
        },
        {
          id: "work",
          title: "Trabalho",
          items: [
            {
              href: "/vagas",
              label: "Vagas",
              description: "Oportunidades da comunidade",
              icon: Briefcase,
              color: "#4338ca",
            },
            {
              href: "/mentorias",
              label: "Mentoria",
              description: "Aprenda com quem já fez",
              icon: GraduationCap,
              color: "#c2410c",
            },
          ],
        },
      ]}
    />
  ),
};
