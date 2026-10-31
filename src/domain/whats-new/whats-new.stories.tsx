import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ReleaseNotesEditor } from "./release-notes-editor.js";
import { WhatsNewDialog } from "./whats-new-dialog.js";

const meta: Meta = {
  title: "Domain/WhatsNew",
};

export default meta;

export const Dialog: StoryObj = {
  render: () => (
    <WhatsNewDialog
      open
      onOpenChange={() => {}}
      items={[
        {
          id: "study-pairs",
          title: "Par de estudo",
          description: "Encontre alguém com os mesmos objetivos para estudar junto.",
        },
        {
          id: "local-communities",
          title: "Comunidades da sua cidade",
          description: "Veja e participe das comunidades de quem mora perto de você.",
        },
        {
          id: "weekly-digest",
          title: "Resumo semanal por e-mail",
          description: "O melhor da sua rede, uma vez por semana. Ajuste nas preferências.",
        },
      ]}
    />
  ),
};

function EditorStory({ live }: { live: boolean }) {
  const [items, setItems] = useState([
    {
      id: "study-pairs",
      title: "Par de estudo",
      description: "Encontre alguém com os mesmos objetivos para estudar junto.",
    },
    { id: "draft", title: "", description: "" },
  ]);

  return (
    <div className="max-w-2xl p-4">
      <ReleaseNotesEditor
        items={items}
        onItemsChange={setItems}
        liveSince={live ? "31/10/2026" : null}
        onPublish={() => {}}
        onRetire={() => {}}
      />
    </div>
  );
}

export const Editor: StoryObj = { render: () => <EditorStory live={false} /> };

export const EditorLive: StoryObj = { render: () => <EditorStory live /> };
