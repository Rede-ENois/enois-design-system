import { useState } from "react";

import { Code2, Eye } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { HtmlEditorProps } from "../../types/patterns/html-editor-props.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Campo de HTML/CSS com pré-visualização ao vivo.
 *
 * É o mesmo editor no post de página, na bio do perfil e na edição de um post: um lugar só decide
 * o aviso do limite, o texto de ajuda e como a pré-visualização aparece — e ela usa o MESMO quadro
 * isolado do render final, então o que o autor vê aqui é o que os outros veem depois.
 */
export function HtmlEditor({
  id,
  value,
  onChange,
  label,
  description,
  placeholder,
  emptyPreview,
  maxLength,
  previewClassName,
  preview: previewFrame,
}: HtmlEditorProps) {
  const messages = useMessages().htmlEditor;
  const [preview, setPreview] = useState(true);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="inline-flex items-center gap-1.5 text-xs font-normal text-text-subtle"
        >
          <Code2 className="h-3.5 w-3.5" />

          <>{label}</>
        </label>

        <button
          type="button"
          onClick={() => setPreview((current) => !current)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-soft px-3 py-1 text-xs font-normal text-text-subtle transition hover:border-primary hover:text-primary"
        >
          <Eye className="h-3.5 w-3.5" />

          <>{preview ? messages.editHtml : messages.preview}</>
        </button>
      </div>

      <p className="mt-1 text-xs font-normal text-text-subtle">{description}</p>

      <Textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[160px] font-mono text-xs"
      />

      {preview &&
        (value.trim() ? (
          // O wrapper recebe a altura do chamador (h-64, h-[60vh]...) e o quadro costuma vir com
          // `h-full`: se a cadeia até o iframe não preservar essa altura, a porcentagem resolve
          // para `auto` e o iframe colapsa na altura padrão do navegador (~150px), cortando a
          // prévia na metade. flex + flex-1 repassa a altura do wrapper ao quadro em qualquer
          // unidade, descontando o rótulo.
          <div className={cn("flex flex-col overflow-hidden", previewClassName)}>
            <label
              htmlFor="preview"
              className="inline-flex items-center gap-1.5 text-xs font-normal text-text-subtle"
            >
              <>{messages.previewLabel}</>
            </label>

            <div id="preview" className="flex min-h-0 flex-1 flex-col [&>*]:min-h-0 [&>*]:flex-1">
              {previewFrame}
            </div>
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-border-soft px-3 py-6 text-center text-xs font-normal text-text-subtle">
            {emptyPreview}
          </p>
        ))}
    </div>
  );
}
