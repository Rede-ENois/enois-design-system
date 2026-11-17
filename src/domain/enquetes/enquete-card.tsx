import { useEffect, useState } from "react";

import { CalendarClock, Check, ListChecks } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { EnqueteCardProps } from "../../types/domain/enquetes/enquete-card-props.js";

/** Dia e mês curtos ("12 nov.") — o prazo não conta segundos, só situa no tempo. */
function diaCurto(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(iso));
}

/**
 * A enquete no post: antes do voto são alternativas clicáveis (a escolha única vota no clique;
 * a múltipla marca e confirma); depois, o resultado com as escolhas marcadas. Enquanto está
 * aberta dá para TROCAR o voto ("Trocar voto" volta às alternativas); passado o prazo o
 * resultado congela e o rodapé mostra a data de encerramento. A escrita é de quem renderiza:
 * o card só avisa onVotar/onVotarMultiplo.
 */
export function EnqueteCard({ enquete, pendente, onVotar, onVotarMultiplo }: EnqueteCardProps) {
  const messages = useMessages().enqueteCard;
  // "Trocar voto" e a seleção da múltipla são estado de tela: o dado vem de fora.
  const [editando, setEditando] = useState(false);
  const [selecao, setSelecao] = useState<number[]>([]);

  // Uma enquete nova no lugar (voto confirmado, feed atualizado) volta ao estado de tela limpo.
  useEffect(() => {
    setEditando(false);
    setSelecao([]);
  }, [enquete]);

  if (enquete.opcoes.length === 0) return null;

  const encerrada =
    enquete.terminaEm != null && new Date(enquete.terminaEm).getTime() <= Date.now();
  const temVoto = enquete.meusVotos.length > 0;
  const escolhendo = !encerrada && (!temVoto || editando);

  const alternar = (posicao: number) => {
    setSelecao((atual) =>
      atual.includes(posicao) ? atual.filter((p) => p !== posicao) : [...atual, posicao],
    );
  };

  return (
    <div className="mt-3 rounded-2xl border border-border-soft bg-surface-1 p-3">
      <ul className="flex flex-col gap-1.5">
        {enquete.opcoes.map((opcao, posicao) => {
          const contagem = enquete.contagens[posicao] ?? 0;
          const percentual =
            enquete.totalVotos === 0 ? 0 : Math.round((contagem / enquete.totalVotos) * 100);
          const minha = enquete.meusVotos.includes(posicao);
          const marcada = selecao.includes(posicao);
          return (
            <li key={`${posicao}-${opcao}`}>
              {escolhendo ? (
                <button
                  type="button"
                  aria-pressed={enquete.multiplaEscolha ? marcada : undefined}
                  disabled={pendente}
                  onClick={() => (enquete.multiplaEscolha ? alternar(posicao) : onVotar(posicao))}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    enquete.multiplaEscolha && marcada
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-soft text-text-strong hover:border-primary hover:text-primary"
                  } disabled:opacity-60`}
                >
                  {opcao}
                </button>
              ) : (
                <div
                  className={`relative overflow-hidden rounded-xl border px-3 py-2 ${
                    minha ? "border-primary bg-primary/10" : "border-border-soft"
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="enquete-barra absolute inset-y-0 left-0 bg-primary/15"
                    style={{ "--enquete-barra": `${percentual}%` }}
                  />

                  <div className="relative flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-1.5 text-text-strong">
                      {minha && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}

                      <span className="min-w-0 break-words">{opcao}</span>
                    </span>

                    <span className="shrink-0 tabular-nums text-text-subtle">
                      {contagem} · {percentual}%
                    </span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {escolhendo && enquete.multiplaEscolha && (
        <button
          type="button"
          disabled={pendente || selecao.length === 0}
          onClick={() => onVotarMultiplo([...selecao].sort((a, b) => a - b))}
          className="mt-2 rounded-full bg-primary px-3 py-1.5 text-sm font-normal text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {pendente ? messages.votando : messages.confirmarVoto}
        </button>
      )}

      {escolhendo && temVoto && (
        <button
          type="button"
          onClick={() => {
            setEditando(false);
            setSelecao([]);
          }}
          className="mt-2 block text-xs text-text-subtle underline-offset-2 transition hover:underline"
        >
          {messages.manterVoto}
        </button>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-text-subtle">
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>
            {enquete.totalVotos === 0 ? messages.semVotos : messages.votos(enquete.totalVotos)}
          </span>

          {enquete.multiplaEscolha && (
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3 w-3" aria-hidden="true" />

              {messages.multipla}
            </span>
          )}
        </span>

        <span className="inline-flex items-center gap-2">
          {encerrada ? (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3 w-3" aria-hidden="true" />

              {enquete.terminaEm != null && messages.encerradaEm(diaCurto(enquete.terminaEm))}
            </span>
          ) : (
            <>
              {enquete.terminaEm != null && (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" aria-hidden="true" />

                  {messages.terminaEm(diaCurto(enquete.terminaEm))}
                </span>
              )}

              {temVoto && !escolhendo && (
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="font-normal text-primary underline-offset-2 transition hover:underline"
                >
                  {messages.trocarVoto}
                </button>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
