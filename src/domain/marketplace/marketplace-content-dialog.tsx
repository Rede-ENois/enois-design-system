import { useEffect, useState } from "react";

import { Copy, Download } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { MarketplaceContentDialogProps } from "../../types/domain/marketplace/marketplace-content-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Textarea } from "../../ui/textarea.js";
import { useToast } from "../../ui/toast-context.js";

/**
 * Conteúdo de uma compra: o comprador edita os textos aqui mesmo e copia o HTML.
 *
 * A edição é local (o material comprado não muda no servidor): o objetivo é adaptar o template
 * antes de colar no perfil, no post, na página ou no blog.
 */
export function MarketplaceContentDialog({
  title,
  data,
  loading = false,
  error = false,
  onClose,
}: MarketplaceContentDialogProps) {
  const messages = useMessages().marketplaceContentDialog;
  const { toast } = useToast();

  const [text, setText] = useState("");

  useEffect(() => {
    if (data) {
      setText(data.content ?? "");
    }
  }, [data]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast(messages.copied, "success");
    } catch {
      toast(messages.copyError, "error");
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title ?? "conteudo").replace(/[^\w-]+/g, "-").toLowerCase()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data?.title ?? title ?? messages.fallbackTitle}</DialogTitle>

          <DialogDescription>{messages.description}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-8 text-center text-sm text-text-subtle">{messages.loading}</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-destructive">{messages.error}</p>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={text}
              rows={16}
              maxLength={200_000}
              onChange={(event) => setText(event.target.value)}
              className="font-mono text-xs"
            />

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" className="gap-2 rounded-full" onClick={download}>
                <Download className="h-4 w-4" />

                <>{messages.download}</>
              </Button>

              <Button className="gap-2 rounded-full" onClick={copy}>
                <Copy className="h-4 w-4" />

                <>{messages.copy}</>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
