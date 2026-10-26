import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input.js";
import { Label } from "./label.js";
import { PasswordInput } from "./password-input.js";
import { Switch } from "./switch.js";
import { Textarea } from "./textarea.js";

const meta: Meta = {
  title: "UI/Form fields",
};

export default meta;

export const TextInput: StoryObj = {
  render: () => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="name">Nome</Label>

      <Input id="name" placeholder="Seu nome" maxLength={40} />
    </div>
  ),
};

export const TextArea: StoryObj = {
  render: () => <Textarea className="max-w-md" placeholder="Escreva algo" maxLength={280} />,
};

export const Password: StoryObj = {
  render: function PasswordStory() {
    const [revealed, setRevealed] = useState(false);

    return (
      <div className="max-w-sm">
        <PasswordInput revealed={revealed} onToggle={() => setRevealed((value) => !value)} />
      </div>
    );
  },
};

export const Toggle: StoryObj = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="push" />

      <Label htmlFor="push">Notificações</Label>
    </div>
  ),
};
