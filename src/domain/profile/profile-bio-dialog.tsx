import { useState } from "react";

import { Code2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { ProfileBioDialogProps } from "../../types/domain/profile/profile-bio-dialog-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";

/**
 * Bio do perfil em HTML/CSS.
 *
 * Deixar vazio é uma ação legítima: limpa o HTML e o perfil volta a mostrar a bio de texto — por
 * isso o botão de limpar existe, em vez de o campo "não deixar" apagar.
 */
export function ProfileBioDialog({
  open,
  onOpenChange,
  trigger = true,
  initialHtml,
  maxLength,
  savePending = false,
  onSave,
  renderHtmlFrame,
}: ProfileBioDialogProps) {
  const messages = useMessages().profileBioDialog;
  const [html, setHtml] = useState(initialHtml ?? "");
  // Every opening starts from the saved HTML, whoever opened the dialog.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setHtml(initialHtml ?? "");
  }

  return (
    <>
      {trigger && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5"
          onClick={() => onOpenChange(true)}
        >
          <Code2 className="h-4 w-4" />

          <>{messages.action}</>
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{messages.title}</DialogTitle>
          </DialogHeader>

          <p className="text-xs font-normal text-text-subtle">{messages.hint}</p>

          <HtmlEditor
            id="profile-bio-html"
            value={html}
            onChange={setHtml}
            label={messages.label}
            description={messages.description}
            placeholder={messages.placeholder}
            emptyPreview={messages.empty}
            maxLength={maxLength}
            previewClassName="mt-3 h-[280px]"
            preview={renderHtmlFrame({
              html,
              title: messages.frameTitle,
              className: "h-full",
              innerPadding: false,
              // A prévia é uma janela do editor (área fixa): aqui a rolagem de dentro é o esperado.
              autoHeight: false,
            })}
          />

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
              {messages.cancel}
            </Button>

            <Button
              className="rounded-full"
              disabled={savePending || html === (initialHtml ?? "")}
              onClick={() => onSave(html)}
            >
              {savePending ? messages.saving : messages.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
