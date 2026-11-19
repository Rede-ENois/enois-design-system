import { RefreshCcw } from "lucide-react";

import { safeHref } from "../../lib/safe-href.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PapoFonteView } from "../../types/domain/paporeto/papo-fonte-view.js";
import type { PapoPublicacoesProps } from "../../types/domain/paporeto/papo-publicacoes-props.js";
import type { PaporetoMessages } from "../../types/messages/paporeto-messages.js";
import { AppLink } from "../../ui/app-link.js";

const ROTULO_FONTE: Record<PapoFonteView, keyof PaporetoMessages["papoPublicacoes"]> = {
  POST: "fontePost",
  COMMENT: "fonteComentario",
  DESABAFO: "fonteDesabafo",
  CONFISSAO: "fonteConfissao",
};

/**
 * As publicações que falaram do assunto aberto — o Papo Reto visto por dentro. Só o que já era
 * público entra aqui: quem falou aparece pelo nome (ou não aparece, quando a fonte é anônima),
 * nunca pelo id interno, e o assunto é da expressão, não uma palavra solta.
 */
export function PapoPublicacoesRelacionadas({
  subject,
  publicacoes,
  estado,
  onRetry,
}: PapoPublicacoesProps) {
  const messages = useMessages().papoPublicacoes;

  return (
    <section
      aria-label={messages.tituloDoAssunto(subject)}
      className="space-y-2 border-t border-border pt-2"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <h4 className="text-xs font-semibold tracking-wide text-text-subtle uppercase">
          {messages.titulo}
        </h4>

        {estado === "ready" && publicacoes !== null && publicacoes.length > 0 && (
          <span className="text-xs text-text-subtle">{messages.contagem(publicacoes.length)}</span>
        )}
      </div>

      {estado === "loading" && <p className="text-xs text-text-subtle">{messages.carregando}</p>}

      {estado === "error" && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-text-subtle">{messages.erro}</p>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text hover:bg-surface-3"
          >
            <RefreshCcw aria-hidden className="h-3 w-3" />
            {messages.retry}
          </button>
        </div>
      )}

      {estado === "ready" && publicacoes !== null && publicacoes.length === 0 && (
        <p className="text-xs text-text-subtle">{messages.vazio}</p>
      )}

      {estado === "ready" && publicacoes !== null && publicacoes.length > 0 && (
        <ul className="space-y-1.5">
          {publicacoes.map((publicacao) => {
            const href = safeHref(publicacao.href);

            return (
              <li
                key={`${publicacao.fonte}:${publicacao.id}`}
                className={cn("rounded-lg bg-surface p-2.5", "ring-1 ring-border/60")}
              >
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-text-subtle">
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium text-text-subtle">
                    {messages[ROTULO_FONTE[publicacao.fonte]] as string}
                  </span>

                  <span className="font-medium text-text">
                    {publicacao.autor ?? messages.semAutor}
                  </span>

                  {publicacao.handle !== null && <span>@{publicacao.handle}</span>}

                  <span aria-hidden>·</span>

                  <span>{publicacao.quando}</span>
                </div>

                <p className="mt-1 line-clamp-6 whitespace-pre-line break-words text-sm text-text">
                  {publicacao.texto}
                </p>

                {href !== null && (
                  <AppLink
                    href={href}
                    className="mt-1 inline-flex text-xs font-medium text-primary hover:underline"
                  >
                    {messages.abrir}
                  </AppLink>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
