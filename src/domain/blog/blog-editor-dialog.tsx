import { useEffect, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { BlogEditorDialogProps } from "../../types/domain/blog/blog-editor-dialog-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Criar/editar o blog: nome, descrição e o tema em HTML/CSS.
 *
 * O tema é o mesmo editor (e o mesmo quadro isolado) das páginas do perfil — HTML e CSS livres,
 * sanitizados no backend. Vazio = cabeçalho padrão do blog.
 */
export function BlogEditorDialog({
  open,
  onOpenChange,
  blog,
  pending = false,
  error,
  onSave,
  renderHtmlFrame,
}: BlogEditorDialogProps) {
  const messages = useMessages().blogEditorDialog;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeHtml, setThemeHtml] = useState("");

  // Abriu o diálogo: parte do que já existe (edição) ou do zero (criação).
  useEffect(() => {
    if (!open) return;
    setTitle(blog?.title ?? "");
    setDescription(blog?.description ?? "");
    setThemeHtml(blog?.themeHtml ?? "");
  }, [open, blog]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">
            {blog ? messages.edit : messages.create}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <p className="text-sm font-normal text-text-subtle">{messages.blogTitle}</p>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-normal text-text-subtle">{messages.blogDescription}</p>

            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <HtmlEditor
            id="blog-theme-html"
            value={themeHtml}
            onChange={setThemeHtml}
            label={messages.theme}
            description={messages.themeHint}
            placeholder={messages.themePlaceholder}
            emptyPreview={messages.emptyPreview}
            maxLength={20_000}
            previewClassName="-mx-3 -mb-3 mt-3 h-[280px] w-full"
            preview={renderHtmlFrame({
              html: themeHtml,
              title: messages.frameTitle,
              className: "h-full",
              // A prévia é uma janela do editor (área fixa): aqui a rolagem de dentro é o esperado,
              // e o primeiro filho é conteúdo de página — esticá-lo empurraria o resto da página
              // para fora do quadro.
              autoHeight: false,
              stretchFirstChild: false,
            })}
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              {messages.cancel}
            </Button>

            <Button
              size="sm"
              onClick={() => onSave({ title, description, themeHtml })}
              disabled={!title.trim() || pending}
            >
              {pending ? messages.saving : messages.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
