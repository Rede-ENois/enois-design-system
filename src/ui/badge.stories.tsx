import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge.js";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Mentoria" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "destructive", "outline"] },
  },
};

export default meta;

export const Default: StoryObj<typeof Badge> = {};
