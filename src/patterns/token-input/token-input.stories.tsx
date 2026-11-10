import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TokenInputProps } from "../../types/patterns/token-input-props.js";

import { TokenInput } from "./token-input.js";

const meta: Meta<typeof TokenInput> = { title: "Patterns/TokenInput", component: TokenInput };
export default meta;

function Field(
  props: Pick<
    TokenInputProps,
    "label" | "max" | "maxLength" | "suggestions" | "disabled" | "allowMultiple"
  > & {
    initial?: string[];
  },
) {
  const [values, setValues] = useState(props.initial ?? []);
  return (
    <div className="w-full max-w-md">
      <TokenInput
        {...props}
        values={values}
        onAdd={(token) => setValues((current) => [...current, token])}
        onRemove={(token) => setValues((current) => current.filter((value) => value !== token))}
      />
    </div>
  );
}

export const Skills: StoryObj = {
  render: () => (
    <Field
      label="Habilidades e ferramentas"
      max={20}
      maxLength={60}
      allowMultiple={false}
      suggestions={["Comunicação", "Design", "Fotografia", "React"]}
    />
  ),
};
export const ProjectStack: StoryObj = {
  render: () => (
    <Field
      label="Tecnologias do projeto"
      max={10}
      maxLength={40}
      initial={["React", "TypeScript"]}
    />
  ),
};
export const AtLimit: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Remove a focused chip with Enter or Space. Focus returns to the input after removal enables it below the item limit.",
      },
    },
  },
  render: () => (
    <Field
      label="Tecnologias do projeto"
      max={2}
      maxLength={40}
      initial={["React", "TypeScript"]}
    />
  ),
};
export const Disabled: StoryObj = {
  render: () => (
    <Field label="Tecnologias do projeto" max={10} maxLength={40} initial={["React"]} disabled />
  ),
};
