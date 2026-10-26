import type { Meta, StoryObj } from "@storybook/react-vite";

import { CharCounter } from "./char-counter.js";

const meta: Meta<typeof CharCounter> = {
  title: "UI/CharCounter",
  component: CharCounter,
  args: { length: 850, max: 1200 },
};

export default meta;

export const Default: StoryObj<typeof CharCounter> = {};

export const NearLimit: StoryObj<typeof CharCounter> = { args: { length: 1185 } };

export const LimitReached: StoryObj<typeof CharCounter> = { args: { length: 1200 } };
