import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmojiPicker } from "./emoji-picker.js";
import { ReadMore } from "./read-more.js";

const meta: Meta = {
  title: "UI/Content",
};

export default meta;

export const ReadMoreStory: StoryObj = {
  name: "ReadMore",
  render: () => (
    <div className="max-w-sm text-sm">
      <ReadMore clampClassName="line-clamp-3">
        {"Um texto longo que passa do corte de três linhas. ".repeat(12)}
      </ReadMore>
    </div>
  ),
};

export const Emoji: StoryObj = {
  render: function EmojiStory() {
    const [text, setText] = useState("");

    return (
      <div className="flex items-center gap-3 pt-80">
        <EmojiPicker
          onPick={(emoji) => setText((current) => current + emoji)}
          buttonTitle="Emoji"
          buttonClassName="rounded-full p-2 hover:bg-surface-2"
        />

        <span className="text-lg">{text}</span>
      </div>
    );
  },
};
