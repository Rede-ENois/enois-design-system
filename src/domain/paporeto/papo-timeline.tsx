import { cn } from "../../lib/utils.js";
import type { PapoIntervaloView } from "../../types/domain/paporeto/papo-intervalo-view.js";
import type { PapoJanela } from "../../types/domain/paporeto/papo-janela.js";
import type { PapoTimelineProps } from "../../types/domain/paporeto/papo-timeline-props.js";

const JANELAS: PapoJanela[] = ["24h", "7d", "30d"];

/** A altura da barra do bucket, em fração do maior — a escala é do conjunto, nunca por barra. */
function alturaDaBarra(falas: number, maior: number): string {
  if (maior === 0) {
    return "0%";
  }
  return `${Math.max(8, Math.round((falas / maior) * 100))}%`;
}

/** A hora do bucket em rótulo curto da hora local ("18h"), sem inventar dia — a tela é de
 * janela curta e o eixo diz "por hora". */
function horaDoBucket(hora: string): string {
  const data = new Date(hora);
  if (Number.isNaN(data.getTime())) {
    return "";
  }
  return `${data.getHours()}h`;
}

/**
 * A timeline do assunto: os buckets da janela como barras de hora — série histórica de verdade,
 * porque a timeline é reconciliada (o mesmo bucket volta sempre ao mesmo número, e conteúdo
 * removido sai dela). Nada aqui identifica ninguém: é contagem do conjunto por hora.
 */
export function PapoTimeline({
  subject,
  rotulo,
  intervalos,
  janela,
  onJanelaChange,
  rotuloJanela,
  falas,
  semFalas,
  carregando,
  eixo,
}: PapoTimelineProps) {
  const barras = intervalos ?? [];
  const maior = Math.max(0, ...barras.map((b: PapoIntervaloView) => b.falas));

  return (
    <div className="space-y-3 rounded-xl bg-surface-2 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text">{rotulo}</p>

        <div role="tablist" aria-label={eixo} className="flex gap-1">
          {JANELAS.map((j) => (
            <button
              key={j}
              type="button"
              role="tab"
              aria-selected={j === janela}
              onClick={() => onJanelaChange(j)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors",
                j === janela
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-card text-text-subtle hover:text-text",
              )}
            >
              {rotuloJanela(j)}
            </button>
          ))}
        </div>
      </div>

      {intervalos === null && <p className="text-sm text-text-subtle">{carregando}</p>}

      {intervalos !== null && barras.length === 0 && (
        <p className="text-sm text-text-subtle">{semFalas}</p>
      )}

      {intervalos !== null && barras.length > 0 && (
        <>
          <div
            role="img"
            aria-label={`${eixo} — ${subject}`}
            className="flex h-20 items-end gap-[2px]"
          >
            {barras.map((bucket) => (
              <div
                key={bucket.hora}
                title={`${horaDoBucket(bucket.hora)} · ${falas(bucket.falas)}`}
                className="min-w-[4px] flex-1 rounded-t-sm bg-primary/70 transition [height:var(--altura)] hover:bg-primary"
                style={{ "--altura": alturaDaBarra(bucket.falas, maior) }}
              />
            ))}
          </div>

          <p className="text-[11px] text-text-subtle">
            {barras[0].hora.slice(0, 10)} · {eixo}
          </p>
        </>
      )}
    </div>
  );
}
