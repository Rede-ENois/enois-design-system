import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { EmoteActionDialogViewProps } from "../../types/domain/emotes/emote-action-dialog-view-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

import { EMOTE_ACTION_MOTIVO_MINIMO } from "./index.js";

/**
 * Ações da figurinha SEGURADA no seletor: denunciar (qualquer conta) e, para admin, banir com
 * motivo ou desfazer o banimento.
 *
 * A view não sabe o que a figurinha é: o app diz o que oferecer por `onReport`/`onBan`/`onUnban`.
 * O pacote É Nóis chega sem nenhuma das três e o diálogo diz por quê, em vez de abrir vazio.
 * Banir exige motivo, e o botão só libera quando ele chega ao mínimo — a mesma regra do backend,
 * mostrada aqui para a pessoa não descobrir por erro.
 */
export function EmoteActionDialogView({
  open,
  onOpenChange,
  item,
  onReport,
  onBan,
  onUnban,
  banned = false,
  pending = false,
}: EmoteActionDialogViewProps) {
  const messages = useMessages().emoteActionDialog;
  const [motivo, setMotivo] = useState("");
  const [curto, setCurto] = useState(false);
  const depurado = motivo.trim();
  const podeBanir = depurado.length >= EMOTE_ACTION_MOTIVO_MINIMO && !pending;
  const semAcao = !onReport && !onBan && !onUnban;

  const fechar = (proximo: boolean) => {
    if (!proximo) {
      setMotivo("");
      setCurto(false);
    }
    onOpenChange(proximo);
  };

  return (
    <Dialog open={open} onOpenChange={fechar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {item?.src ? (
              <img
                src={item.src}
                alt={item.code}
                className="h-9 w-9 shrink-0 object-contain"
                decoding="async"
              />
            ) : null}

            <div className="min-w-0 text-left">
              <DialogTitle className="truncate">{item?.code ?? messages.title}</DialogTitle>

              <DialogDescription className="text-xs">
                {banned ? messages.banned : messages.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {semAcao ? (
          <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-text-subtle">
            {messages.official}
          </p>
        ) : null}

        {onBan && !banned ? (
          <div className="space-y-1.5">
            <Label htmlFor="figurinha-motivo" className="text-xs">
              {messages.reasonLabel}
            </Label>

            <Textarea
              id="figurinha-motivo"
              value={motivo}
              onChange={(event) => {
                setMotivo(event.target.value);
                if (curto && event.target.value.trim().length >= EMOTE_ACTION_MOTIVO_MINIMO) {
                  setCurto(false);
                }
              }}
              placeholder={messages.reasonPlaceholder}
              maxLength={280}
              disabled={pending}
              aria-invalid={curto}
            />

            {curto ? <p className="text-xs text-destructive">{messages.reasonRequired}</p> : null}
          </div>
        ) : null}

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={() => fechar(false)}>
            {messages.cancel}
          </Button>

          {onReport ? (
            <Button type="button" variant="outline" size="sm" onClick={onReport} disabled={pending}>
              {messages.report}
            </Button>
          ) : null}

          {onUnban && banned ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onUnban}
              disabled={pending}
            >
              {messages.unban}
            </Button>
          ) : null}

          {onBan ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (!podeBanir) {
                  setCurto(true);
                  return;
                }
                onBan(depurado);
              }}
              disabled={pending}
            >
              {messages.ban}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
