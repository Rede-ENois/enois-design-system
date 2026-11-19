import { MessageCircle, RefreshCcw } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PapoIntervaloView } from "../../types/domain/paporeto/papo-intervalo-view.js";
import type { PapoPanelProps } from "../../types/domain/paporeto/papo-panel-props.js";
import type { PapoPublicacaoView } from "../../types/domain/paporeto/papo-publicacao-view.js";
import type { PapoStatus } from "../../types/domain/paporeto/papo-status.js";
import type { PapoSubjectView } from "../../types/domain/paporeto/papo-subject-view.js";
import type { PaporetoMessages } from "../../types/messages/paporeto-messages.js";

import { PapoPublicacoesRelacionadas } from "./papo-publicacoes.js";
import { PapoTimeline } from "./papo-timeline.js";

const STATUS: PapoStatus[] = ["EMERGENTE", "HOT", "PERSISTENTE"];

const ROTULO_STATUS: Record<PapoStatus, keyof PaporetoMessages["papoPanel"]> = {
  EMERGENTE: "statusEmergente",
  HOT: "statusHot",
  PERSISTENTE: "statusPersistente",
};

const FILTRO_LABEL: Record<PapoStatus, keyof PaporetoMessages["papoPanel"]> = {
  EMERGENTE: "filtroEmergente",
  HOT: "filtroHot",
  PERSISTENTE: "filtroPersistente",
};

/** A cor da trajetória: nascendo, no pico, sustentada. */
const COR_DO_STATUS: Record<PapoStatus, string> = {
  EMERGENTE: "text-growth",
  HOT: "text-opportunity",
  PERSISTENTE: "text-primary",
};

/**
 * O painel do Papo Reto: os assuntos que nomeiam a conversa da rede, agregados do que já é
 * público. Desenha SÓ o que o backend agregou — subject dobrado, status de trajetória,
 * contagens e crescimento — e nada aqui identifica ninguém: o tipo nem teria campo para isso.
 */
export function PapoPanel({
  assuntos,
  estado,
  falasAnalisadas,
  filtro,
  onFiltroChange,
  subjectAberto,
  onSubjectChange,
  timeline,
  janela,
  onJanelaChange,
  publicacoes,
  publicacoesEstado,
  onPublicacoesRetry,
  onRetry,
}: PapoPanelProps) {
  const messages = useMessages().papoPanel;
  const messagesDaTimeline = useMessages().papoTimeline;

  const rotuloFiltro = (s: PapoStatus): string => messages[FILTRO_LABEL[s]] as string;

  return (
    <section aria-label={messages.title} className="space-y-4 rounded-2xl border border-border p-4">
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-text-subtle"
        >
          <MessageCircle className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-text">{messages.title}</h2>

          <p className="text-sm text-text-subtle">{messages.subtitle}</p>
        </div>
      </header>

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

      {estado === "ready" && assuntos !== null && (
        <>
          {falasAnalisadas !== null && (
            <p className="text-xs text-text-subtle">{messages.falasAnalisadas(falasAnalisadas)}</p>
          )}

          {assuntos.length === 0 ? (
            <p className="text-sm text-text-subtle">{messages.semAssuntos}</p>
          ) : (
            <>
              <div role="tablist" aria-label={messages.title} className="flex flex-wrap gap-1">
                <button
                  role="tab"
                  aria-selected={filtro === null}
                  onClick={() => onFiltroChange(null)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    filtro === null
                      ? "bg-primary text-primary-contrast"
                      : "bg-surface-2 text-text-subtle hover:text-text",
                  )}
                >
                  {messages.filtroTodos}
                </button>
                {STATUS.map((s) => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={filtro === s}
                    onClick={() => onFiltroChange(s)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      filtro === s
                        ? "bg-primary text-primary-contrast"
                        : "bg-surface-2 text-text-subtle hover:text-text",
                    )}
                  >
                    {rotuloFiltro(s)}
                  </button>
                ))}
              </div>

              <ol className="space-y-2">
                {visiveis(assuntos, filtro).map((assunto) => (
                  <PapoAssuntoItem
                    key={assunto.subject}
                    assunto={assunto}
                    aberto={subjectAberto === assunto.subject}
                    messages={messages}
                    onToggle={() =>
                      onSubjectChange(subjectAberto === assunto.subject ? null : assunto.subject)
                    }
                    timeline={subjectAberto === assunto.subject ? timeline : null}
                    janela={janela}
                    onJanelaChange={onJanelaChange}
                    messagesDaTimeline={messagesDaTimeline}
                    publicacoes={subjectAberto === assunto.subject ? (publicacoes ?? null) : null}
                    publicacoesEstado={publicacoesEstado}
                    onPublicacoesRetry={onPublicacoesRetry}
                  />
                ))}
              </ol>
            </>
          )}
        </>
      )}

      <footer className="border-t border-border pt-3">
        <p className="text-xs text-text-subtle">{messages.privacidade}</p>
      </footer>
    </section>
  );
}

/** O filtro é da tela: o backend manda o ranking completo ordenado; a tela recorta. */
function visiveis(assuntos: PapoSubjectView[], filtro: PapoStatus | null): PapoSubjectView[] {
  if (filtro === null) {
    return assuntos;
  }
  return assuntos.filter((a) => a.status === filtro);
}

function PapoAssuntoItem({
  assunto,
  aberto,
  messages,
  onToggle,
  timeline,
  janela,
  onJanelaChange,
  messagesDaTimeline,
  publicacoes,
  publicacoesEstado,
  onPublicacoesRetry,
}: {
  assunto: PapoSubjectView;
  aberto: boolean;
  messages: PaporetoMessages["papoPanel"];
  onToggle: () => void;
  timeline: PapoIntervaloView[] | null;
  janela: PapoPanelProps["janela"];
  onJanelaChange: PapoPanelProps["onJanelaChange"];
  messagesDaTimeline: PaporetoMessages["papoTimeline"];
  publicacoes: PapoPublicacaoView[] | null;
  publicacoesEstado?: PapoPanelProps["publicacoesEstado"];
  onPublicacoesRetry?: PapoPanelProps["onPublicacoesRetry"];
}) {
  return (
    <li className="space-y-2 rounded-xl bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={aberto}
          aria-label={
            aberto
              ? messages.fecharTimeline(assunto.subject)
              : messages.abrirTimeline(assunto.subject)
          }
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm font-semibold text-text">{assunto.subject}</span>

          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-subtle">
            <span className={cn("font-medium", COR_DO_STATUS[assunto.status])}>
              {messages[ROTULO_STATUS[assunto.status]] as string}
            </span>

            <span aria-hidden>·</span>

            <span>{messages.pessoas(assunto.pessoas)}</span>

            <span aria-hidden>·</span>

            <span>
              {messages.falasPost(assunto.falasPost)} ·{" "}
              {messages.falasComentario(assunto.falasComentario)}
            </span>
          </span>
        </button>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-text">
            {assunto.crescimento > 0
              ? messages.crescimento(assunto.crescimento)
              : messages.semCrescimento}
          </p>

          <p className="text-xs text-text-subtle">
            {messages.falasUltimaHora(assunto.falasUltimaHora)}
          </p>
        </div>
      </div>

      {aberto && (
        <>
          <PapoTimeline
            subject={assunto.subject}
            rotulo={assunto.subject}
            intervalos={timeline}
            janela={janela}
            onJanelaChange={onJanelaChange}
            rotuloJanela={messagesDaTimeline.rotuloJanela}
            falas={messagesDaTimeline.falas}
            semFalas={messagesDaTimeline.semFalas}
            carregando={messagesDaTimeline.carregando}
            eixo={messagesDaTimeline.eixo}
          />
          {publicacoesEstado !== undefined && (
            <PapoPublicacoesRelacionadas
              subject={assunto.subject}
              publicacoes={publicacoes}
              estado={publicacoesEstado}
              onRetry={onPublicacoesRetry ?? (() => {})}
            />
          )}
        </>
      )}
    </li>
  );
}
