import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button.js";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Publicar" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
};

export default meta;

export const Default: StoryObj<typeof Button> = {};

export const Variants: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button size="sm">Default</Button>

      <Button size="sm" variant="secondary">
        Secondary
      </Button>

      <Button size="sm" variant="outline">
        Outline
      </Button>

      <Button size="sm" variant="ghost">
        Ghost
      </Button>

      <Button size="sm" variant="destructive">
        Destructive
      </Button>

      <Button size="sm" variant="link">
        Link
      </Button>
    </div>
  ),
};
