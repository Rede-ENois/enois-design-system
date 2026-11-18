import { cn } from "../../lib/utils.js";
import type { TermometroEmocao } from "../../types/domain/termometro/termometro-emocao.js";
import type { TermometroJanelaPainel } from "../../types/domain/termometro/termometro-janela-painel.js";
import type { TermometroWindowProps } from "../../types/domain/termometro/termometro-window-props.js";

/** As cores por emoção: barra do painel. Clima, não diagnóstico — cores de sensação, não de
 * valor (pesada não é "ruim": é tenso). */
const COR_EMOCOES: Record<TermometroEmocao, string> = {
  ALEGRE: "bg-amber-400",
  PESADA: "bg-rose-500",
  CANSADA: "bg-stone-400",
  PRECISANDO: "bg-sky-500",
  CURIOSA: "bg-violet-400",
  CELEBRANDO: "bg-emerald-500",
};

/** A janela aberta do painel: barras por emoção, contagens e o recorte de amostra. A janela
 * sem gente suficiente NÃO mostra indicador — mostra por que está calada (privacidade antes
 * de estatística). */
export function TermometroWindow({
  janela,
  janelaAnterior,
  rotuloEmocao,
  manifestacoes,
  participantes,
  amostraInsuficiente,
  semManifestacoes,
  dominante,
  semDominante,
  comparacaoComJanelaAnterior,
  semComparacao,
}: TermometroWindowProps) {
  if (janela === null || !janela.amostraSuficiente) {
    return (
      <p className="rounded-xl bg-surface-2 p-3 text-sm text-text-subtle">{amostraInsuficiente}</p>
    );
  }
  if (janela.manifestacoes === 0) {
    return <p className="text-sm text-text-subtle">{semManifestacoes}</p>;
  }

  const emocoes = [...janela.emocoes].sort((a, b) => b.porcentagem - a.porcentagem);
  const deltaDominante = deltaDaDominante(janela, janelaAnterior);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-sm font-medium text-text">
          {manifestacoes(janela.manifestacoes)} · {participantes(janela.participantes)}
        </p>
        {janela.dominante !== null && (
          <p className="text-sm text-text-subtle">
            {dominante}:{" "}
            <span className="font-medium text-text">{rotuloEmocao(janela.dominante)}</span>
          </p>
        )}
        {janela.dominante === null && <p className="text-sm text-text-subtle">{semDominante}</p>}
      </div>

      {deltaDominante !== null && (
        <p
          className={cn(
            "text-xs font-medium",
            deltaDominante > 0 ? "text-text" : "text-text-subtle",
          )}
        >
          {deltaDominante === 0 ? semComparacao : comparacaoComJanelaAnterior(deltaDominante)}
        </p>
      )}

      <ul className="space-y-2">
        {emocoes.map((emocao) => (
          <li key={emocao.emocao} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="text-text">{rotuloEmocao(emocao.emocao)}</span>

              <span className="tabular-nums text-text-subtle">
                {emocao.porcentagem}%{emocao.contagem > 0 ? ` · ${emocao.contagem}` : ""}
              </span>
            </div>

            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={emocao.porcentagem}
              aria-label={rotuloEmocao(emocao.emocao)}
              className="h-2 overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className={cn(
                  "h-full w-[var(--preenchimento)] rounded-full",
                  COR_EMOCOES[emocao.emocao],
                )}
                style={{ "--preenchimento": `${emocao.porcentagem}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A variação da emoção dominante contra a janela mais larga (a anterior): pontos percentuais. */
function deltaDaDominante(
  janela: TermometroJanelaPainel,
  anterior: TermometroJanelaPainel | null,
): number | null {
  if (janela.dominante === null || anterior === null || !anterior.amostraSuficiente) {
    return null;
  }
  const agora = janela.emocoes.find((e) => e.emocao === janela.dominante)?.porcentagem ?? 0;
  const antes = anterior.emocoes.find((e) => e.emocao === janela.dominante)?.porcentagem ?? 0;
  return agora - antes;
}
