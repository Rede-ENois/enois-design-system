import type { Meta, StoryObj } from "@storybook/react-vite";

import { ANIMATED_FRAMES } from "./avatar-frames.js";
import { UserAvatar } from "./user-avatar.js";

const meta: Meta<typeof UserAvatar> = {
  title: "Domain/Avatar",
  component: UserAvatar,
  args: { alt: "Avatar de demonstração", fallback: "EN", className: "h-20 w-20" },
  argTypes: {
    frame: {
      control: "select",
      options: [
        "moldura-ambar",
        "moldura-esmeralda",
        "moldura-violeta",
        "moldura-coral",
        ...ANIMATED_FRAMES,
      ],
    },
  },
};

export default meta;

export const Playground: StoryObj<typeof UserAvatar> = {
  args: { frame: "moldura-mare" },
};

export const ElementosETecnologia: StoryObj<typeof UserAvatar> = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-12 p-8 sm:grid-cols-4">
      {[
        ["moldura-mare", "Maré"],
        ["moldura-trepadeira", "Trepadeira"],
        ["moldura-vendaval", "Vendaval"],
        ["moldura-vaga-lumes", "Vaga-lumes"],
        ["moldura-fliperama", "Fliperama"],
        ["moldura-circuito", "Circuito"],
        ["moldura-neon", "Neon"],
        ["moldura-radar", "Radar"],
      ].map(([frame, label]) => (
        <div key={frame} className="flex flex-col items-center gap-8">
          <UserAvatar {...args} frame={frame} />

          <span>{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Halloween: StoryObj<typeof UserAvatar> = {
  args: { className: "h-32 w-32" },
  render: (args) => (
    <div className="grid grid-cols-2 gap-16 p-12 sm:grid-cols-4">
      {[
        ["moldura-caixao", "Caixão"],
        ["moldura-bruxa", "Voo da bruxa"],
        ["moldura-lanterna", "Lanterna de abóbora"],
        ["moldura-uivo", "Lua de lobisomem"],
        ["moldura-lacraia", "Lacraia"],
      ].map(([frame, label]) => (
        <div key={frame} className="flex flex-col items-center gap-10">
          <UserAvatar {...args} frame={frame} />

          <span>{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Compacto: StoryObj<typeof UserAvatar> = {
  args: { frame: "moldura-vendaval", frameOverflow: "hidden", className: "h-8 w-8" },
};
