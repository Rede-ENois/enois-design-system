import { useEffect, useState } from "react";

import { ImageIcon } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { ProfileBannerDialogProps } from "../../types/domain/profile/profile-banner-dialog-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Pill } from "../../ui/pill.js";

/**
 * Capa do perfil: foto OU HTML/CSS, sempre com as duas opções na mão.
 *
 * A capa em HTML ocupa exatamente o mesmo espaço da foto (a altura da capa, não uma caixa própria) —
 * é o que o editor já mostra na pré-visualização, para ninguém descobrir o recorte depois de salvar.
 */
export function ProfileBannerDialog({
  open,
  onOpenChange,
  initialHtml,
  onPickPhoto,
  maxLength,
  savePending = false,
  onSave,
  shopBanner = null,
  onUseOwnCover,
  renderHtmlFrame,
}: ProfileBannerDialogProps) {
  const messages = useMessages().profileBannerDialog;
  const [html, setHtml] = useState(initialHtml ?? "");
  // A escolha fica na cara: "selecionar nova foto" ou "digitar código HTML" — nada de esconder uma
  // das duas atrás de um botão secundário.
  const [mode, setMode] = useState<"photo" | "html">(initialHtml ? "html" : "photo");

  // O diálogo é reaproveitado ao navegar entre perfis: sem este reset ele abria com o HTML da
  // pessoa anterior (relato: "o código da capa da Gabriela apareceu na minha edição").
  useEffect(() => {
    if (!open) return;
    setHtml(initialHtml ?? "");
    setMode(initialHtml ? "html" : "photo");
  }, [open, initialHtml]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{messages.title}</DialogTitle>
        </DialogHeader>

        {shopBanner && (
          <div className="space-y-2 rounded-2xl border border-border-soft bg-surface-1 p-3">
            <p className="text-[12px] font-normal text-text-subtle">
              {messages.shopBanner(shopBanner)}
            </p>

            {onUseOwnCover && (
              <Button
                variant="outline"
                className="rounded-full"
                disabled={savePending}
                onClick={onUseOwnCover}
              >
                {messages.useOwnCover}
              </Button>
            )}
          </div>
        )}

        <p className="text-[12px] font-normal text-text-subtle">{messages.choiceHint}</p>

        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={messages.title}>
          <Pill active={mode === "photo"} onClick={() => setMode("photo")}>
            <>
              <ImageIcon className="mr-1.5 inline h-3.5 w-3.5" />

              <>{messages.photoTab}</>
            </>
          </Pill>

          <Pill active={mode === "html"} onClick={() => setMode("html")}>
            <>{messages.htmlTab}</>
          </Pill>
        </div>

        {mode === "photo" && (
          <div className="space-y-2 rounded-2xl border border-border-soft bg-surface-1 p-3">
            <p className="text-[12px] font-normal text-text-subtle">{messages.photoHint}</p>

            <Button
              className="rounded-full gap-2"
              onClick={() => {
                onOpenChange(false);
                onPickPhoto();
              }}
            >
              <ImageIcon className="h-4 w-4" />

              <>{messages.photo}</>
            </Button>

            {initialHtml && (
              <Button
                variant="ghost"
                className="rounded-full gap-2"
                disabled={savePending}
                onClick={() => onSave("")}
              >
                <>{messages.remove}</>
              </Button>
            )}
          </div>
        )}

        {mode === "html" && (
          <div className="rounded-2xl border border-border-soft bg-surface-1 p-3">
            <HtmlEditor
              id="profile-banner-html"
              value={html}
              onChange={setHtml}
              label={messages.label}
              description={messages.description}
              placeholder={messages.placeholder}
              emptyPreview={messages.empty}
              maxLength={maxLength}
              // Mesma altura da capa de verdade: o autor vê o recorte antes de salvar.
              previewClassName="mt-3 h-40 w-full sm:h-52"
              preview={renderHtmlFrame({
                html,
                title: messages.frameTitle,
                className: "h-full",
                // A prévia é uma janela do editor (área fixa): aqui a rolagem de dentro é o esperado.
                autoHeight: false,
                stretchFirstChild: false,
              })}
            />
          </div>
        )}

        {mode === "html" && (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
