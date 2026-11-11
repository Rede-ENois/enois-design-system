import { useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";
import type { MentionTextareaHandle } from "../../../types/domain/post/mention-textarea-handle.js";

import { MentionTextarea } from "./mention-textarea.js";

const meta: Meta = {
  title: "Domain/Post/Mention textarea",
};

export default meta;

/** Flat placeholder art; real stickers come from the app as URLs. */
function face(color: string, mouth: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="${color}"/><circle cx="11" cy="13" r="2"/><circle cx="21" cy="13" r="2"/><path d="${mouth}" stroke="black" stroke-width="2" fill="none"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const stickers: Record<string, EditorSticker> = {
  KEKW: { url: face("#fbbf24", "M9 20 Q16 28 23 20"), alt: "KEKW" },
  Sadge: { url: face("#93c5fd", "M10 24 Q16 18 22 24"), alt: "Sadge" },
};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
  initial,
  withStickers = true,
  maxLength,
}: {
  initial: string;
  withStickers?: boolean;
  maxLength?: number;
}) {
  const [value, setValue] = useState(initial);
  const field = useRef<MentionTextareaHandle>(null);
  return (
    <div className="mx-auto max-w-md space-y-2">
      <MentionTextarea
        ref={field}
        value={value}
        onChange={(next) => setValue(next)}
        placeholder="Escreva algo..."
        className={fieldClass}
        maxLength={maxLength}
        toolbar
        stickers={withStickers ? stickers : undefined}
        mentionResults={[]}
        onMentionQueryChange={() => {}}
      />

      <div className="flex gap-2">
        {Object.keys(stickers).map((code) => (
          <button
            key={code}
            type="button"
            className="rounded-full border border-border px-3 py-1 text-xs"
            onClick={() => field.current?.insertAtCaret(code)}
          >
            Inserir {code}
          </button>
        ))}
      </div>

      <p className="break-all text-xs text-muted-foreground">Valor: {JSON.stringify(value)}</p>
    </div>
  );
}

export const WithStickers: StoryObj = {
  render: () => <Field initial="Que jogo KEKW mas depois Sadge" />,
};

export const WithoutStickers: StoryObj = {
  render: () => (
    <Field initial="Sem mapa de figurinhas: KEKW continua texto" withStickers={false} />
  ),
};

export const Empty: StoryObj = {
  render: () => <Field initial="" />,
};

export const NearLimit: StoryObj = {
  render: () => <Field initial="KEKW KEKW KEKW" maxLength={20} />,
};
