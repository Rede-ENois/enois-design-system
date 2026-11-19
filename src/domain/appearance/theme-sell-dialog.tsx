import { useEffect, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ThemeSellDialogProps } from "../../types/domain/appearance/theme-sell-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

import { ThemePreview } from "./theme-preview.js";

/**
 * "Vender no marketplace" da APARÊNCIA ATUAL.
 *
 * O marketplace não vende só tema de coleção: vende a personalização como um pacote de cores —
 * a coleção ativa, o destaque livre e o fundo de página entram nos mesmos cinco pares de cor da
 * galeria. O fluxo é um só: publica o pacote na galeria (o que o comprador instala) e já o lista
 * à venda em faíscas. Quem compra recebe o tema pela galeria e pode exportar o arquivo
 * `.enois-theme` como qualquer outro.
 */
export function ThemeSellDialog({
  open,
  onOpenChange,
  defaultName,
  parsePrice,
  formatPrice,
  pending = false,
  onSubmit,
}: ThemeSellDialogProps) {
  const messages = useMessages().themeSellDialog;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("50");

  useEffect(() => {
    if (!open) return;
    setName(defaultName);
    setDescription("");
    setPrice("50");
  }, [open, defaultName]);

  const faiscas = parsePrice(price) ?? 0;
  const valid = name.trim().length >= 3 && faiscas >= 50_000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>

          <DialogDescription>
            {messages.description}
            <span className="font-mono"> {messages.fileExtension}</span> {messages.descriptionEnd}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* Amostra ao vivo: o que se vende é a aparência ATIVA, e o ThemePreview desenha com os
              tokens reais dela — não maquete. Quem vende vê o resultado antes de publicar. */}
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-text-strong">{messages.previewLabel}</h3>

            <ThemePreview />
          </section>

          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-text-subtle">{messages.name}</Label>

            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder={messages.namePlaceholder}
              className="bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-text-subtle">
              {messages.descriptionLabel}
            </Label>

            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              maxLength={500}
              className="bg-muted"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-text-subtle">{messages.price}</Label>

            <Input
              type="number"
              min={50}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="bg-muted"
            />

            <p className="text-xs text-text-subtle">{messages.payout(formatPrice(faiscas))}</p>
          </div>

          <Button
            className="w-full rounded-full"
            disabled={!valid || pending}
            onClick={() => onSubmit({ name, description, price })}
          >
            {pending ? messages.submitting : messages.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
