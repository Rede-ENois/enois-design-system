import { type ComponentProps, useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ConfirmDialog } from "./index.js";

const meta = {
  title: "UI/Diálogo de confirmação",
  args: {
    title: "Confirmar alteração fictícia?",
    description: "Demonstração local, sem requisição ou alteração de dados reais.",
    confirmLabel: "Confirmar",
  },
  render: function Demonstracao(args) {
    const [open, setOpen] = useState(false);
    const [recovered, setRecovered] = useState(false);
    const [result, setResult] = useState("");
    const destination = useRef<HTMLButtonElement>(null);
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            setRecovered(false);
            setResult("");
            setOpen(true);
          }}
        >
          Abrir confirmação fictícia
        </Button>

        <Button ref={destination} variant="outline">
          Destino de foco do exemplo
        </Button>

        <p role="status">{result}</p>

        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          error={recovered ? undefined : args.error}
          onConfirm={() => {
            if (args.error && !recovered) {
              setRecovered(true);
              setResult("Erro removido pelo consumidor fictício. É possível confirmar novamente.");
              return;
            }
            setResult("Confirmação recebida somente nesta demonstração.");
            setOpen(false);
          }}
          onCloseAutoFocus={
            args.onCloseAutoFocus
              ? (event) => {
                  args.onCloseAutoFocus?.(event);
                  destination.current?.focus();
                }
              : undefined
          }
        />
      </div>
    );
  },
} satisfies Meta<Omit<ComponentProps<typeof ConfirmDialog>, "open" | "onOpenChange" | "onConfirm">>;

export default meta;

export const Padrao: StoryObj<typeof meta> = { name: "Opcionais ausentes e cancelar padrão" };
export const RotulosProprios: StoryObj<typeof meta> = {
  args: { confirmLabel: "Aplicar", cancelLabel: "Voltar", destructive: true },
};
export const Desabilitado: StoryObj<typeof meta> = { args: { disabled: true } };
export const Pendente: StoryObj<typeof meta> = { args: { pending: true } };
export const PendenteDesabilitado: StoryObj<typeof meta> = {
  args: { pending: true, disabled: true },
};
export const ErroRecuperavel: StoryObj<typeof meta> = {
  args: {
    error: "Não foi possível concluir o exemplo fictício. Confirme para simular a recuperação.",
  },
};
export const DescricaoLonga: StoryObj<typeof meta> = {
  args: { description: `Identificador fictício sem espaços: ${"exemplo".repeat(80)}` },
};
export const FocoPersonalizado: StoryObj<typeof meta> = {
  name: "Fechamento com foco escolhido pelo consumidor",
  args: { onCloseAutoFocus: (event: Event) => event.preventDefault() },
};
