import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { postMessages } from "../../messages/defaults/post.js";
import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ComposerMediaDraft } from "../../types/domain/post/composer-media-draft.js";
import { Button } from "../../ui/button.js";

import { ComposerMediaPicker } from "./composer-media-picker.js";

const meta: Meta = { title: "Domain/Post/ComposerMediaPicker" };
export default meta;

export const MediaPickerTransport: StoryObj = {
  name: "Envio por anexo (simulação)",
  render: function MediaPickerTransportStory() {
    const [files, setFiles] = useState<ComposerMediaDraft[]>([
      {
        id: "sending",
        preview: new URL("../../assets/kenney/tree-03.webp", import.meta.url).href,
        transport: { phase: "sending", bytesRemaining: 1248576 },
      },
      {
        id: "waiting",
        preview: null,
        status: "checking",
        transport: { phase: "sending" },
      },
      { id: "failed", preview: null, transport: { phase: "failed" } },
      { id: "refused", preview: null, status: "prohibited" },
    ]);
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm text-text-strong">Demonstração com anexos fictícios</p>

        <Button
          type="button"
          onClick={() =>
            setFiles((current) =>
              current.map((item) =>
                item.id === "waiting"
                  ? { ...item, transport: { phase: "awaiting-response" } }
                  : item,
              ),
            )
          }
        >
          Concluir transferência do segundo anexo
        </Button>

        <ComposerMediaPicker
          items={files.map((file) => {
            if (file.transport?.phase === "sending") {
              const onCancel = () =>
                setFiles((current) => current.filter(({ id }) => id !== file.id));
              return { ...file, transport: { ...file.transport, onCancel } };
            }
            if (file.transport?.phase !== "failed") return file;
            const onRetry = () =>
              setFiles((current) =>
                current.map((item) =>
                  item.id === file.id ? { ...item, transport: { phase: "sending" } } : item,
                ),
              );
            return { ...file, transport: { phase: "failed", onRetry } };
          })}
          onFiles={() => {}}
          onRemove={(index) =>
            setFiles((current) => current.filter((_, position) => position !== index))
          }
          canAddMore={false}
        />
      </div>
    );
  },
};

export const MediaPickerLongCopy: StoryObj = {
  name: "Mensagem longa no anexo (simulação)",
  render: () => (
    <EnoisProvider
      messages={{
        composerMediaPicker: {
          ...postMessages.composerMediaPicker,
          transport: {
            ...postMessages.composerMediaPicker.transport,
            failed:
              "Não foi possível enviar este anexo. Verifique a conexão e tente novamente quando estiver pronto. ProvaDeQueUmaPalavraMuitoLongaNaoEstouraOCartao",
          },
        },
      }}
    >
      <ComposerMediaPicker
        items={[{ id: "failed", preview: null, transport: { phase: "failed" } }]}
        onFiles={() => {}}
        onRemove={() => {}}
        canAddMore={false}
      />
    </EnoisProvider>
  ),
};
