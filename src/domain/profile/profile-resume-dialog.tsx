import { useRef, useState } from "react";

import { FileText, Upload, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileResumeDialogProps } from "../../types/domain/profile/profile-resume-dialog-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { useToast } from "../../ui/toast-context.js";

/** Teto do arquivo: currículo é texto; acima disso é portfólio disfarçado. */
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/**
 * Currículo do perfil: subir um PDF, baixar o que está lá e remover.
 *
 * O arquivo vive no storage de mídia (como avatar e emblema) e o perfil guarda só o endereço e o
 * nome original — é o nome que faz o download sair como "curriculo-ana.pdf" em vez de um id do CDN.
 *
 * Nada disso aparece no perfil público: quem lê a página não vê que existe currículo. Ele é da
 * pessoa, e ela decide quando entregar (no envio de uma candidatura, por exemplo).
 */
export function ProfileResumeDialog({
  open: controlledOpen,
  onOpenChange,
  resumeUrl,
  resumeName,
  busy = false,
  onUpload,
  onRemove,
}: ProfileResumeDialogProps) {
  const messages = useMessages().profileResumeDialog;
  const { resolveMediaUrl } = useAdapters();
  const { toast } = useToast();
  const [ownOpen, setOwnOpen] = useState(false);
  const controlled = controlledOpen !== undefined;
  const open = controlled ? controlledOpen : ownOpen;
  const setOpen = controlled ? (next: boolean) => onOpenChange?.(next) : setOwnOpen;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast(messages.wrongType, "error");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      toast(messages.tooBig, "error");
      return;
    }
    onUpload(file);
  };

  // Baixar de verdade (com o nome do arquivo) quando o storage permite ler daqui; se não permitir,
  // abre o PDF numa aba — o navegador oferece salvar de qualquer jeito.
  const download = async () => {
    const url = resolveMediaUrl(resumeUrl);
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = resumeName || "curriculo.pdf";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {!controlled && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5"
          onClick={() => setOpen(true)}
        >
          <FileText className="h-4 w-4" />

          <>{messages.action}</>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-normal">{messages.title}</DialogTitle>
          </DialogHeader>

          <p className="text-xs font-normal text-text-subtle">{messages.hint}</p>

          <div className="flex flex-wrap items-center gap-2">
            {resumeUrl ? (
              <>
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-normal text-text-strong">
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />

                  <span className="truncate">{resumeName || "curriculo.pdf"}</span>
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy}
                  onClick={() => void download()}
                >
                  {messages.download}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full gap-1.5 text-destructive hover:text-destructive"
                  disabled={busy}
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />

                  <>{messages.remove}</>
                </Button>
              </>
            ) : (
              <span className="text-sm font-normal text-text-subtle">{messages.empty}</span>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              handleFile(file);
            }}
          />

          <Button
            className="rounded-full gap-1.5"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />

            <>{busy ? messages.sending : messages.upload}</>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
