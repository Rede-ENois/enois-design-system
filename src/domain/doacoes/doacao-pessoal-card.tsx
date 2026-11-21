import { Copy, HeartHandshake, QrCode } from "lucide-react";

import { formatBrlCents } from "../../lib/format-brl-cents.js";
import { useMessages } from "../../messages/messages-context.js";
import type { DoacaoPessoalCardProps } from "../../types/domain/doacoes/doacao-pessoal-card-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";

const VALORES = [500, 1000, 2000, 5000];

/**
 * O QR Code pessoal do Pix: quem está logado escolhe o valor, paga e confirma com o comprovante
 * para receber o selo de apoiador. O card só desenha e reporta intenção — a requisição é da app.
 */
export function DoacaoPessoalCard({
  apoiador,
  codigo,
  qrCodeDataUrl,
  valorCents,
  comprovante,
  erro,
  erroConfirmar,
  abrindo,
  confirmando,
  confirmada,
  copiado,
  onValorChange,
  onAbrir,
  onComprovanteChange,
  onConfirmar,
  onCopiar,
  onMudarValor,
}: DoacaoPessoalCardProps) {
  const messages = useMessages().doacaoPessoal;
  const valorEscolhido = valorCents !== null && VALORES.includes(valorCents) ? valorCents : null;

  const lerOutroValor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitos = event.target.value.replace(/\D/g, "");
    if (!digitos) {
      onValorChange(null);
      return;
    }
    onValorChange(Math.min(Number(digitos), 1_000_000));
  };

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border-soft bg-surface-card p-4">
      <header className="flex min-w-0 items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-text-subtle">
          <HeartHandshake aria-hidden className="size-4" />
        </span>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-strong">{messages.titulo}</h2>

          <p className="text-xs leading-snug text-text-subtle">
            {apoiador ? messages.descricaoApoiador : messages.descricao}
          </p>
        </div>
      </header>

      {apoiador ? <p className="text-sm font-medium text-primary">{messages.seloAtivo}</p> : null}

      {confirmada ? (
        <p role="status" className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
          {messages.seloGanho}
        </p>
      ) : null}

      {codigo ? (
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-sm font-medium text-text-strong">
            {formatBrlCents(codigo.amountCents)}
          </p>

          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt=""
              className="size-48 self-center rounded-xl bg-surface-2 p-2"
            />
          ) : null}

          <code className="block min-w-0 break-all rounded-lg bg-surface-2 px-2 py-1.5 text-xs text-text-strong">
            {codigo.pixCopyAndPaste}
          </code>

          <p className="text-xs leading-snug text-text-subtle">{messages.validade}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={confirmando}
              onClick={onCopiar}
            >
              <Copy aria-hidden className="size-3.5" />
              {messages.copiar}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={confirmando}
              onClick={onMudarValor}
            >
              {messages.mudarValor}
            </Button>

            {copiado ? (
              <span role="status" className="text-xs text-text-subtle">
                {messages.copiado}
              </span>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-border-soft p-3">
            <p className="text-sm font-medium text-text-strong">{messages.comprovanteTitulo}</p>

            <p className="text-xs leading-snug text-text-subtle">{messages.comprovanteAjuda}</p>

            <Textarea
              value={comprovante}
              maxLength={4000}
              placeholder={messages.comprovantePlaceholder}
              aria-label={messages.comprovanteTitulo}
              onChange={(event) => onComprovanteChange(event.target.value)}
            />

            {erroConfirmar ? (
              <p role="alert" className="text-sm text-destructive">
                {erroConfirmar}
              </p>
            ) : null}

            <div className="flex justify-start">
              <Button
                type="button"
                size="sm"
                className="rounded-full"
                disabled={confirmando || comprovante.trim().length === 0}
                onClick={onConfirmar}
              >
                {confirmando ? messages.confirmando : messages.confirmar}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-3">
          <PillRow label={messages.escolherValor}>
            {VALORES.map((centavos) => (
              <Pill
                key={centavos}
                size="sm"
                active={valorCents === centavos}
                onClick={() => onValorChange(valorCents === centavos ? null : centavos)}
              >
                {formatBrlCents(centavos)}
              </Pill>
            ))}
          </PillRow>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="doacao-outro-valor">{messages.outroValor}</Label>

            <Input
              id="doacao-outro-valor"
              inputMode="numeric"
              maxLength={9}
              value={valorEscolhido === null && valorCents !== null ? valorCents : ""}
              onChange={lerOutroValor}
            />
          </div>

          <p className="text-xs leading-snug text-text-subtle">{messages.semObrigacao}</p>

          {erro ? (
            <p role="alert" className="text-sm text-destructive">
              {erro}
            </p>
          ) : null}

          <div className="flex justify-start">
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              disabled={abrindo || !valorCents}
              onClick={onAbrir}
            >
              <QrCode aria-hidden className="size-3.5" />
              {abrindo ? messages.gerandoCodigo : messages.gerarCodigo}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
