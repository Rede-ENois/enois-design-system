import { useState } from "react";

import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { LinkProps } from "../../types/adapters/link-props.js";
import type { WrappedExperienciaProps } from "../../types/domain/wrapped/wrapped-experiencia-props.js";
import type { WrappedRetrospectiva } from "../../types/domain/wrapped/wrapped-retrospectiva.js";
import type { WrappedSlide } from "../../types/domain/wrapped/wrapped-slide.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { LoadingState } from "../../ui/loading-state.js";

import { useWrappedLabels } from "./use-wrapped-labels.js";
import { WrappedSection, WrappedStat } from "./wrapped-view.js";

/**
 * A experiência completa do Énóis Wrapped: uma sequência de seções (abertura, assuntos, posts,
 * tretas, interações, ritmo, perfil, impacto, encerramento) que a pessoa avança e volta.
 *
 * Só desenha o que o backend entregou: seção sem dado é omitida; conta sem histórico mostra o
 * estado "sem dados" honesto; fora da janela ou ainda não processada, um aviso claro (sem
 * processamento sob demanda). O compartilhamento é um callback do container — a view nunca
 * chama `navigator`.
 */
export function WrappedExperience({
  state,
  nome,
  onRetry,
  onShare,
  LinkComponent,
}: WrappedExperienciaProps) {
  const messages = useMessages().wrapped;
  const [indice, setIndice] = useState(0);

  if (state.kind === "loading") {
    return <LoadingState label={messages.carregando} />;
  }
  if (state.kind === "error") {
    return (
      <EmptyState title={messages.erro} description={state.message}>
        {onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            {messages.tentarDeNovo}
          </Button>
        ) : null}
      </EmptyState>
    );
  }
  if (state.kind === "sem-dados") {
    return <EmptyState title={messages.semDadosTitulo} description={messages.semDadosTexto} />;
  }
  if (state.kind === "nao-pronta") {
    return <EmptyState title={messages.naoProntaTitulo} description={messages.naoProntaTexto} />;
  }
  if (state.kind === "fora-da-janela") {
    return (
      <EmptyState title={messages.foraDaJanelaTitulo} description={messages.foraDaJanelaTexto} />
    );
  }

  const slides = montarSlides({ retrospectiva: state.retrospectiva, nome, LinkComponent });
  const atual = Math.min(indice, slides.length - 1);
  const slide = slides[atual];
  const ultimo = atual === slides.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-text-subtle">{messages.etapa(atual + 1, slides.length)}</span>

        <div className="flex items-center gap-1" aria-hidden>
          {slides.map((s, i) => (
            <span
              key={s.key}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === atual ? "w-6 bg-primary" : "w-1.5 bg-surface-3",
              )}
            />
          ))}
        </div>
      </div>

      {slide.render()}

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          disabled={atual === 0}
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {messages.voltar}
        </Button>

        <div className="flex items-center gap-2">
          {onShare ? (
            <Button variant="secondary" onClick={onShare}>
              <Share2 className="h-4 w-4" aria-hidden />
              {messages.compartilhar}
            </Button>
          ) : null}
          {!ultimo ? (
            <Button onClick={() => setIndice((i) => Math.min(slides.length - 1, i + 1))}>
              {messages.avancar}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function montarSlides({
  retrospectiva,
  nome,
  LinkComponent,
}: {
  retrospectiva: WrappedRetrospectiva;
  nome: string;
  LinkComponent?: React.ComponentType<LinkProps>;
}): WrappedSlide[] {
  const slides: WrappedSlide[] = [
    { key: "abertura", render: () => <Abertura r={retrospectiva} nome={nome} /> },
  ];
  if (retrospectiva.assuntosPublicados.length > 0 || retrospectiva.assuntosComentados.length > 0) {
    slides.push({ key: "assuntos", render: () => <Assuntos r={retrospectiva} /> });
  }
  if (retrospectiva.publicacoesMarcantes.length > 0) {
    slides.push({
      key: "marcantes",
      render: () => <Marcantes r={retrospectiva} LinkComponent={LinkComponent} />,
    });
  }
  if (retrospectiva.tretas.length > 0) {
    slides.push({
      key: "tretas",
      render: () => <Tretas r={retrospectiva} LinkComponent={LinkComponent} />,
    });
  }
  if (retrospectiva.interacoes.length > 0) {
    slides.push({
      key: "interacoes",
      render: () => <Interacoes r={retrospectiva} LinkComponent={LinkComponent} />,
    });
  }
  slides.push({ key: "ritmo", render: () => <Ritmo r={retrospectiva} /> });
  if (retrospectiva.perfil.caracteristicas.length > 0) {
    slides.push({ key: "perfil", render: () => <Perfil r={retrospectiva} /> });
  }
  slides.push({ key: "impacto", render: () => <Impacto r={retrospectiva} /> });
  slides.push({ key: "encerramento", render: () => <Encerramento r={retrospectiva} /> });
  return slides;
}

function Abertura({ r, nome }: { r: WrappedRetrospectiva; nome: string }) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.abertura(nome, r.ano)} subtitle={m.aberturaSub}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <WrappedStat value={r.metricas.publicacoes} label={m.publicacoes(r.metricas.publicacoes)} />
        <WrappedStat value={r.metricas.comentarios} label={m.comentarios(r.metricas.comentarios)} />
        <WrappedStat
          value={r.metricas.interacoesFeitas}
          label={m.interacoesFeitas(r.metricas.interacoesFeitas)}
        />
        <WrappedStat
          value={r.metricas.interacoesRecebidas}
          label={m.interacoesRecebidas(r.metricas.interacoesRecebidas)}
        />
        <WrappedStat value={r.metricas.comunidades} label={m.comunidades(r.metricas.comunidades)} />
        <WrappedStat value={r.metricas.diasAtivos} label={m.diasAtivos(r.metricas.diasAtivos)} />
      </div>
    </WrappedSection>
  );
}

function Assuntos({ r }: { r: WrappedRetrospectiva }) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.assuntosTitulo}>
      {r.assuntosPublicados.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-subtle">{m.assuntosPublicados}</h3>

          <Tags itens={r.assuntosPublicados.map((a) => `${a.expressao} (${a.ocorrencias})`)} />
        </div>
      ) : null}
      {r.assuntosComentados.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-subtle">{m.assuntosComentados}</h3>

          <Tags itens={r.assuntosComentados.map((a) => `${a.expressao} (${a.ocorrencias})`)} />
        </div>
      ) : null}
    </WrappedSection>
  );
}

function Tags({ itens }: { itens: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {itens.map((texto) => (
        <li key={texto} className="rounded-full bg-surface-2 px-3 py-1 text-sm text-text-strong">
          {texto}
        </li>
      ))}
    </ul>
  );
}

function Marcantes({
  r,
  LinkComponent,
}: {
  r: WrappedRetrospectiva;
  LinkComponent?: React.ComponentType<LinkProps>;
}) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.marcantesTitulo}>
      <ul className="space-y-3">
        {r.publicacoesMarcantes.map((p) => (
          <li key={p.id} className="rounded-2xl border border-border-soft p-3">
            <p className="text-sm text-text-strong">{p.trecho ?? p.autorNome}</p>

            <p className="mt-1 text-xs text-text-subtle">
              {p.motivo === "PROPRIA" ? m.marcantePropria : m.marcanteParticipacao} · {p.metrica}
            </p>
            {p.href ? <InternoLink href={p.href} LinkComponent={LinkComponent} /> : null}
          </li>
        ))}
      </ul>
    </WrappedSection>
  );
}

function Tretas({
  r,
  LinkComponent,
}: {
  r: WrappedRetrospectiva;
  LinkComponent?: React.ComponentType<LinkProps>;
}) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.tretasTitulo} subtitle={m.tretasSub}>
      <ul className="space-y-3">
        {r.tretas.map((t) => (
          <li key={t.publicacaoId} className="rounded-2xl border border-border-soft p-3">
            <p className="text-sm text-text-strong">
              {t.trecho ?? m.tretaComentarios(t.comentarios)}
            </p>

            <p className="mt-1 text-xs text-text-subtle">
              {m.tretaComentarios(t.comentarios)} · {m.tretaDuracao(t.duracaoDias)}
            </p>
            {t.href ? <InternoLink href={t.href} LinkComponent={LinkComponent} /> : null}
          </li>
        ))}
      </ul>
    </WrappedSection>
  );
}

function Interacoes({
  r,
  LinkComponent,
}: {
  r: WrappedRetrospectiva;
  LinkComponent?: React.ComponentType<LinkProps>;
}) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.interacoesTitulo}>
      <ul className="space-y-2">
        {r.interacoes.map((i) => (
          <li
            key={`${i.tipo}-${i.userId}`}
            className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm text-text-strong">
                {i.nome || i.username}
              </span>

              <span className="text-xs text-text-subtle">
                {i.tipo === "INTERAGI" ? m.interagi : m.interagiram}
              </span>
            </span>

            <span className="shrink-0 tabular-nums text-sm text-text-subtle">{i.vezes}</span>
            {i.href ? <InternoLink href={i.href} LinkComponent={LinkComponent} /> : null}
          </li>
        ))}
      </ul>
    </WrappedSection>
  );
}

function Ritmo({ r }: { r: WrappedRetrospectiva }) {
  const m = useMessages().wrapped;
  const labels = useWrappedLabels();
  const max = Math.max(...r.ritmo.porMes, 1);
  const mes = labels.mes(r.ritmo.mesMaisAtivo);
  const dia = labels.dia(r.ritmo.diaSemanaMaisAtivo);
  const hora = r.ritmo.horaMaisAtiva;
  return (
    <WrappedSection title={m.ritmoTitulo}>
      <ul className="space-y-1 text-sm text-text-subtle">
        {mes ? <li>{m.ritmoMes(mes)}</li> : null}
        {dia ? <li>{m.ritmoDia(dia)}</li> : null}
        {hora != null ? <li>{m.ritmoHora(hora)}</li> : null}
      </ul>

      <div className="flex h-32 items-end gap-1" aria-hidden>
        {r.ritmo.porMes.map((valor, i) => {
          const pct = Math.round((valor / max) * 100);
          return (
            <div
              key={`${i}-${pct}`}
              className="flex-1 rounded-t bg-primary/70"
              style={{ "--wrapped-fill": `${pct}%` }}
            />
          );
        })}
      </div>
    </WrappedSection>
  );
}

function Perfil({ r }: { r: WrappedRetrospectiva }) {
  const m = useMessages().wrapped;
  const labels = useWrappedLabels();
  return (
    <WrappedSection title={m.perfilTitulo}>
      <ul className="space-y-2">
        {r.perfil.caracteristicas.map((c) => (
          <li key={c.chave} className="rounded-2xl bg-surface-2 px-3 py-2">
            <span className="block text-sm font-medium text-text-strong">
              {labels.perfil[c.chave]}
            </span>

            <span className="text-xs text-text-subtle">{c.motivo}</span>
          </li>
        ))}
      </ul>
    </WrappedSection>
  );
}

function Impacto({ r }: { r: WrappedRetrospectiva }) {
  const m = useMessages().wrapped;
  return (
    <WrappedSection title={m.impactoTitulo}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <WrappedStat
          value={r.impacto.publicacoesComConversa}
          label={m.impactoConversas(r.impacto.publicacoesComConversa)}
        />
        <WrappedStat
          value={r.impacto.interacoesRecebidas}
          label={m.impactoRecebidas(r.impacto.interacoesRecebidas)}
        />
      </div>

      <p className="text-xs text-text-subtle">{m.impactoCredibilidade(r.impacto.credibilidade)}</p>
    </WrappedSection>
  );
}

function Encerramento({ r }: { r: WrappedRetrospectiva }) {
  const m = useMessages().wrapped;
  const labels = useWrappedLabels();
  return (
    <WrappedSection title={m.encerramentoTitulo}>
      <p className="text-base text-text-strong">{m.encerramentoFrase}</p>
      {r.encerramento.temaPrincipal ? (
        <p className="text-sm text-text-subtle">
          {m.encerramentoTema(r.encerramento.temaPrincipal)}
        </p>
      ) : null}
      {r.encerramento.caracteristica ? (
        <p className="text-sm text-text-strong">{labels.perfil[r.encerramento.caracteristica]}</p>
      ) : null}
      {r.encerramento.estatistica ? (
        <p className="text-sm text-text-subtle">{r.encerramento.estatistica}</p>
      ) : null}
      <p className="text-sm text-text-subtle">{m.encerramentoObrigado}</p>
    </WrappedSection>
  );
}

function InternoLink({
  href,
  LinkComponent,
}: {
  href: string;
  LinkComponent?: React.ComponentType<LinkProps>;
}) {
  if (!LinkComponent) {
    return null;
  }
  const Link = LinkComponent;
  return (
    <Link
      href={href}
      className="mt-1 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
    >
      {href}
    </Link>
  );
}
