import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SandboxedHtmlFrame } from "../html-frame/sandboxed-html-frame.js";

import { HtmlEditor } from "./html-editor.js";
import { ImageCropDialog } from "./image-crop-dialog.js";
import { RichTextToolbar } from "./rich-text-toolbar.js";

const meta: Meta = {
  title: "Patterns/Editor",
};

export default meta;

export const Toolbar: StoryObj = {
  render: () => <RichTextToolbar label="Formatar texto" onFormat={() => {}} onEmoji={() => {}} />,
};

export const ImageCropUploadError: StoryObj = {
  render: function ImageCropUploadErrorStory() {
    const [open, setOpen] = useState(true);

    return (
      <ImageCropDialog
        open={open}
        onOpenChange={setOpen}
        imageSrc={new URL("../../assets/kenney/tree-03.webp", import.meta.url).href}
        aspect={1}
        title="Recortar imagem"
        onCropComplete={async () => {
          throw new Error("Simulated upload failure");
        }}
      />
    );
  },
};

export const HtmlWithPreview: StoryObj = {
  render: function HtmlEditorStory() {
    const [value, setValue] = useState("<p>Olá, <strong>Énóis</strong>!</p>");

    return (
      <div className="max-w-md">
        <HtmlEditor
          id="story-html"
          value={value}
          onChange={setValue}
          label="HTML da página"
          description="Scripts não rodam dentro do quadro."
          placeholder="Cole aqui o HTML da sua página..."
          emptyPreview="Cole um HTML para ver a pré-visualização."
          maxLength={20000}
          previewClassName="mt-3 h-64"
          preview={
            <SandboxedHtmlFrame
              html={value}
              title="Página publicada no post"
              theme="light"
              className="h-full"
              autoHeight={false}
              stretchFirstChild={false}
            />
          }
        />
      </div>
    );
  },
};
