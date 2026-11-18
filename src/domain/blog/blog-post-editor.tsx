import { useState } from "react";

import { ArrowLeft, Eye, PenLine } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { BlogPostEditorProps } from "../../types/domain/blog/blog-post-editor-props.js";
import type { BlogPostFormat } from "../../types/domain/blog/blog-post-format.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Pill } from "../../ui/pill.js";

/**
 * Escrever ou editar um post do blog, em tela cheia (`/blog/post/new` e `/blog/post/{id}`).
 * Com `post` é edição (preenche e salva por cima); sem ele publica um post novo. Dois formatos: "Texto" (markdown simples, com barra e prévia) e "HTML/CSS" (editor
 * livre). O backend guarda o que a pessoa escreveu (markdown como markdown, HTML sanitizado).
 */
export function BlogPostEditor({
  post,
  backHref,
  pending = false,
  error,
  onSubmit,
  renderMentionTextarea,
  renderRichText,
  renderHtmlFrame,
}: BlogPostEditorProps) {
  const messages = useMessages().blogPostEditor;
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [format, setFormat] = useState<BlogPostFormat>(post?.bodyFormat ?? "MARKDOWN");
  const [preview, setPreview] = useState(false);
  const [avisar, setAvisar] = useState(true);

  const canPublish = title.trim().length > 0 && body.trim().length > 0 && !pending;

  return (
    <div className="space-y-4">
      <AppLink
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-text-strong"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />

        <>{messages.back}</>
      </AppLink>

      <h1 className="text-xl font-semibold tracking-tight text-text-strong">
        {post ? messages.editPost : messages.newPost}
      </h1>

      <div className="space-y-3">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={messages.postTitle}
          maxLength={200}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Pill active={format === "MARKDOWN"} onClick={() => setFormat("MARKDOWN")} size="md">
            {messages.modeText}
          </Pill>

          <Pill active={format === "HTML"} onClick={() => setFormat("HTML")} size="md">
            {messages.modeHtml}
          </Pill>

          {format === "MARKDOWN" && (
            <Pill active={preview} onClick={() => setPreview((current) => !current)} size="md">
              {preview ? (
                <span className="inline-flex items-center gap-1.5">
                  <PenLine className="h-3.5 w-3.5" aria-hidden />

                  <>{messages.write}</>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" aria-hidden />

                  <>{messages.preview}</>
                </span>
              )}
            </Pill>
          )}
        </div>

        {format === "MARKDOWN" ? (
          <div className="space-y-2">
            {preview ? (
              <div className="min-h-[60vh] rounded-2xl border border-border bg-muted/40 px-3 py-2">
                {renderRichText({
                  content: body,
                  className:
                    "whitespace-pre-line break-words text-sm font-normal leading-relaxed text-text-strong",
                })}
              </div>
            ) : (
              renderMentionTextarea({
                value: body,
                onChange: (value) => setBody(value),
                placeholder: messages.textHint,
                className:
                  "min-h-[60vh] rounded-2xl border border-border bg-muted/40 px-3 py-2 text-sm font-normal",
                maxLength: 20_000,
                toolbar: true,
              })
            )}

            <p className="text-xs font-normal text-text-subtle">{messages.textHint}</p>
          </div>
        ) : (
          <HtmlEditor
            id="blog-post-html"
            value={body}
            onChange={setBody}
            label={messages.modeHtml}
            description={messages.htmlHint}
            placeholder={messages.htmlPlaceholder}
            emptyPreview={messages.emptyPreview}
            maxLength={20_000}
            previewClassName="-mx-3 -mb-3 mt-3 h-[60vh] w-full"
            preview={renderHtmlFrame({
              html: body,
              title: messages.frameTitle,
              className: "h-full",
              // A prévia é uma janela do editor (área fixa): aqui a rolagem de dentro é o esperado,
              // e o primeiro filho é conteúdo de página — esticá-lo empurraria o resto da página
              // para fora do quadro.
              autoHeight: false,
              stretchFirstChild: false,
            })}
          />
        )}

        {!post && (
          <label className="flex items-start gap-2 text-xs font-normal text-text-subtle">
            <input
              type="checkbox"
              checked={avisar}
              onChange={(event) => setAvisar(event.target.checked)}
              className="mt-0.5"
            />

            <span>
              <span className="block font-medium text-text-strong">
                {messages.notifySubscribers}
              </span>

              {messages.notifySubscribersHint}
            </span>
          </label>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <AppLink href={backHref}>
            <Button size="sm" variant="outline">
              {messages.cancel}
            </Button>
          </AppLink>

          <Button
            size="sm"
            onClick={() => onSubmit({ title, body, format, notifySubscribers: avisar })}
            disabled={!canPublish}
          >
            {pending ? messages.publishing : post ? messages.savePost : messages.publish}
          </Button>
        </div>
      </div>
    </div>
  );
}
