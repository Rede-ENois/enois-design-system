import { RefreshCcw, Thermometer } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { TermometroEmocao } from "../../types/domain/termometro/termometro-emocao.js";
import type { TermometroPanelProps } from "../../types/domain/termometro/termometro-panel-props.js";
import type { TermometroPeriodo } from "../../types/domain/termometro/termometro-periodo.js";

import { TermometroWindow } from "./termometro-window.js";

const PERIODOS: TermometroPeriodo[] = ["HOJE", "ULTIMAS_24H", "ULTIMOS_7D", "ULTIMOS_30D"];

const ROTULO_EMOCOES: Record<
  TermometroEmocao,
  keyof ReturnType<typeof useMessages>["termometroPanel"]
> = {
  ALEGRE: "emocaoAlegre",
  PESADA: "emocaoPesada",
  CANSADA: "emocaoCansada",
  PRECISANDO: "emocaoPrecisando",
  CURIOSA: "emocaoCuriosa",
  CELEBRANDO: "emocaoCelebrando",
};

/**
 * O painel do Termômetro: o clima coletivo por janela de tempo. O que ele desenha é SÓ o que o
 * backend agregou — porcentagem por emoção, contagem de manifestações e de pessoas distintas —
 * e, com amostra pequena, o aviso honesto em vez de indicador. Nada aqui identifica ninguém:
 * o componente nem receberia esse dado.
 */
export function TermometroPanel({
  janelas,
  estado,
  periodo,
  onPeriodoChange,
  onRetry,
}: TermometroPanelProps) {
  const messages = useMessages().termometroPanel;

  const rotuloPeriodo = (p: TermometroPeriodo): string =>
    p === "HOJE"
      ? messages.periodoHoje
      : p === "ULTIMAS_24H"
        ? messages.periodo24h
        : p === "ULTIMOS_7D"
          ? messages.periodo7d
          : messages.periodo30d;

  return (
    <section aria-label={messages.title} className="space-y-4 rounded-2xl border border-border p-4">
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-text-subtle"
        >
          <Thermometer className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-text">{messages.title}</h2>

          <p className="text-sm text-text-subtle">{messages.subtitle}</p>
        </div>
      </header>

      <div role="tablist" aria-label={messages.title} className="flex flex-wrap gap-1">
        {PERIODOS.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={p === periodo}
            onClick={() => onPeriodoChange(p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              p === periodo
                ? "bg-primary text-primary-contrast"
                : "bg-surface-2 text-text-subtle hover:text-text",
            )}
          >
            {rotuloPeriodo(p)}
          </button>
        ))}
      </div>

      {estado === "loading" && <p className="text-sm text-text-subtle">{messages.loading}</p>}
      {estado === "error" && (
        <div className="space-y-2">
          <p className="text-sm text-text-subtle">{messages.error}</p>

          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-3"
          >
            <RefreshCcw aria-hidden className="h-3.5 w-3.5" />
            {messages.retry}
          </button>
        </div>
      )}
      {estado === "ready" && janelas !== null && (
        <TermometroWindow
          janela={janelas.find((j) => j.periodo === periodo) ?? null}
          janelaAnterior={janelaAnteriorDe(PERIODOS, periodo, janelas)}
          rotuloEmocao={(emocao) => messages[ROTULO_EMOCOES[emocao]] as string}
          manifestacoes={messages.manifestacoes}
          participantes={messages.participantes}
          amostraInsuficiente={messages.amostraInsuficiente}
          semManifestacoes={messages.semManifestacoes}
          dominante={messages.dominante}
          semDominante={messages.semDominante}
          comparacaoComJanelaAnterior={messages.comparacaoComJanelaAnterior}
          semComparacao={messages.semComparacao}
        />
      )}

      <footer className="border-t border-border pt-3">
        <p className="text-xs text-text-subtle">{messages.privacidade}</p>
      </footer>
    </section>
  );
}

/** A janela imediatamente mais larga que a selecionada — a base da comparação de evolução. */
function janelaAnteriorDe(
  periodos: TermometroPeriodo[],
  atual: TermometroPeriodo,
  janelas: NonNullable<TermometroPanelProps["janelas"]>,
) {
  const indice = periodos.indexOf(atual);
  const anterior = indice < periodos.length - 1 ? periodos[indice + 1] : null;
  if (anterior === null) {
    return null;
  }
  return janelas.find((j) => j.periodo === anterior) ?? null;
}
