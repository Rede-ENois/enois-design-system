import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox } from "lucide-react";

import { Button } from "./button.js";
import { EmptyState } from "./empty-state.js";
import { LoadingState } from "./loading-state.js";
import { useToast } from "./toast.js";

const meta: Meta = {
  title: "UI/Feedback",
};

export default meta;

export const Empty: StoryObj = {
  render: () => (
    <EmptyState
      icon={Inbox}
      title="Nada por aqui"
      description="Quando houver novidades, elas aparecem aqui."
    >
      <Button size="sm">Criar post</Button>
    </EmptyState>
  ),
};

export const Loading: StoryObj = {
  render: () => <LoadingState label="Carregando..." />,
};

export const Toast: StoryObj = {
  render: function ToastStory() {
    const { toast } = useToast();

    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => toast("Post publicado.")}>
          Sucesso
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => toast("Falha ao publicar.", "error")}
        >
          Erro
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast("Post excluído.", "success", { label: "Desfazer", onClick: () => {} })
          }
        >
          Com ação
        </Button>
      </div>
    );
  },
};
