import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
};

export default meta;

export const WithFallback: StoryObj<typeof Avatar> = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="" alt="" />

      <AvatarFallback>MS</AvatarFallback>
    </Avatar>
  ),
};
