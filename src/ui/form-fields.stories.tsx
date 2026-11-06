import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { MentionTextarea } from "../domain/post/editor/mention-textarea.js";

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

export const MobileTypography: StoryObj = {
  render: () => (
    <div className="grid w-full max-w-md min-w-0 gap-4">
      <label>
        Input compacto (xs)
        <Input aria-label="Input xs" className="h-9 text-xs" defaultValue="Texto compacto" />
      </label>

      <label>
        Input compacto (sm)
        <Input aria-label="Input sm" className="h-10 text-sm" defaultValue="Texto compacto" />
      </label>

      <label>
        Texto maior
        <Input aria-label="Input large" className="text-lg" defaultValue="Texto maior" />
      </label>

      <label>
        Área de texto
        <Textarea
          aria-label="Textarea sm"
          className="text-sm"
          defaultValue="Texto em várias linhas"
        />
      </label>

      <label>
        Compositor
        <MentionTextarea
          value="Texto do compositor"
          onChange={() => undefined}
          className="rounded-md border p-2 text-sm"
          mentionResults={[]}
          onMentionQueryChange={() => undefined}
        />
      </label>

      <label>
        Checkbox
        <Input aria-label="Checkbox" type="checkbox" className="h-4 w-4 p-0 text-xs shadow-none" />
      </label>

      <label>
        Campo nativo independente
        <input aria-label="Unrelated input" className="block w-full border text-xs" />
      </label>

      <label>
        Seletor nativo
        <select aria-label="Unrelated select" className="block w-full border text-sm">
          <option>Opção</option>
        </select>
      </label>
    </div>
  ),
};
