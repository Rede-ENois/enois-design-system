import { useEffect, useState } from "react";

import { Copy, Heart, X } from "lucide-react";
import QRCode from "qrcode";

import { useMessages } from "../../messages/messages-context.js";
import { useToast } from "../../ui/toast-context.js";

import { PIX_KEY, pixCopiaECola } from "./pix.js";

/**
 * O convite de doação no topo da home: o Énóis é gratuito e livre, e quem quiser ajuda
 * a manter assim com Pix. A chave é do Apoie o Énóis — o QR é o mesmo BR Code ESTÁTICO do
 * cartão de apoio (sem vencimento). Só Pix, como foi pedido; o recolher fica guardado,
 * mas volta sempre para quem não fechou.
 */
const DISMISS_KEY = "apoie-enois-fechado";

export function ApoieBanner() {
  const messages = useMessages().apoieBanner;
  const { toast } = useToast();
  const [fechado, setFechado] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setFechado(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!aberto || qr) return;
    QRCode.toDataURL(pixCopiaECola(), {
      width: 320,
      margin: 1,
      color: { dark: "#0b0d12", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [aberto, qr]);

  if (fechado) return null;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(pixCopiaECola());
      setCopiado(true);
      toast(messages.copySuccess, "success");
      setTimeout(() => setCopiado(false), 4000);
    } catch {
      toast(messages.copyError, "error");
    }
  };

  return (
    <div className="border-b border-border-soft bg-primary/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Heart className="h-4 w-4 shrink-0 text-primary" />

        <p className="min-w-0 flex-1 text-sm text-text-strong">
          {messages.inviteBefore} <span className="font-semibold">{messages.inviteHighlight}</span>
          {messages.inviteAfter}
        </p>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? messages.hide : messages.show}
        </button>

        <button
          type="button"
          aria-label={messages.dismiss}
          title={messages.dismiss}
          className="shrink-0 rounded-full p-1 text-text-subtle transition hover:bg-muted"
          onClick={() => {
            setFechado(true);
            localStorage.setItem(DISMISS_KEY, "1");
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {aberto && (
        <div className="mx-auto max-w-6xl px-4 pb-5 sm:px-6">
          <div className="grid gap-5 rounded-2xl border border-border-soft bg-surface-card p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-6">
            <div className="mx-auto w-fit rounded-xl bg-white p-2">
              {qr ? (
                <img src={qr} alt={messages.qrAlt} className="h-44 w-44" />
              ) : (
                <div className="h-44 w-44 animate-pulse rounded bg-muted" />
              )}
              <p className="mt-1 text-center text-[11px] text-gray-500">{messages.qrCaption}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-text-strong">{messages.instructions}</p>

              <div className="flex items-start gap-2">
                <code className="block min-w-0 flex-1 break-all rounded-lg border border-border-soft bg-surface-1 px-3 py-2 font-mono text-xs text-text-strong">
                  {pixCopiaECola()}
                </code>

                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-soft px-3 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
                  onClick={copiar}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiado ? messages.copied : messages.copy}
                </button>
              </div>

              <p className="text-xs text-text-subtle">
                <>{messages.keyLabel}</>

                <span className="font-mono">{PIX_KEY}</span>

                <>{messages.keyFooter}</>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
