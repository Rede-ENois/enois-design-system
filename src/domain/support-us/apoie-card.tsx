import { useEffect, useState } from "react";

import { Copy, Heart } from "lucide-react";
import QRCode from "qrcode";

import { useMessages } from "../../messages/messages-context.js";
import { useToast } from "../../ui/toast-context.js";

import { PIX_KEY, pixCopiaECola } from "./pix.js";

/**
 * O convite de doação no menu direito do feed (versão compacta do banner da home).
 *
 * O Énóis é gratuito e livre; quem quiser ajuda a manter assim com Pix. A chave é o CNPJ da
 * Apoie o Énóis — o payload é o mesmo BR Code do banner da home, gerado pelo mesmo algoritmo
 * (estático, sem vencimento).
 * Aparece para todo mundo, logado ou não: apoiar não exige conta.
 */
export function ApoieCard() {
  const messages = useMessages().apoieCard;
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!aberto || qr) return;
    QRCode.toDataURL(pixCopiaECola(), {
      width: 220,
      margin: 1,
      color: { dark: "#0b0d12", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [aberto, qr]);

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
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-card">
      <div className="h-10" style={{ background: "var(--gradient-primary)" }} />

      <div className="space-y-2 px-4 pb-4">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-card px-2 py-1 text-xs font-semibold text-primary">
          <Heart className="h-3.5 w-3.5" />
          {messages.title}
        </p>

        <p className="text-xs text-text-subtle">
          <>{messages.textBefore}</>

          <span className="font-medium text-text-strong">{messages.textHighlight}</span>

          <>{messages.textAfter}</>
        </p>

        <button
          type="button"
          className="w-full rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? messages.hide : messages.show}
        </button>

        {aberto && (
          <div className="space-y-2 pt-1">
            <div className="mx-auto w-fit rounded-lg bg-white p-1.5">
              {qr ? (
                <img src={qr} alt={messages.qrAlt} className="h-40 w-40" />
              ) : (
                <div className="h-40 w-40 animate-pulse rounded bg-muted" />
              )}
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
              onClick={copiar}
            >
              <Copy className="h-3 w-3" />
              {copiado ? messages.copied : messages.copy}
            </button>

            <p className="text-[11px] text-text-subtle">
              <>{messages.keyLabel}</>

              <span className="font-mono">{PIX_KEY}</span>

              <>{messages.keyFooter}</>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
