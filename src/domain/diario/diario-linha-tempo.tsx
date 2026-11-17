import { FileText, MessageCircle, Repeat2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { DiarioEvento } from "../../types/domain/diario/diario-evento.js";
import type { DiarioLinhaTempoProps } from "../../types/domain/diario/diario-linha-tempo-props.js";

const ICONES = { PUBLICACAO: FileText, COMENTARIO: MessageCircle, REPOST: Repeat2 } as const;

const diaPorExtenso = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const chaveDoDia = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Agrupa os eventos por dia (fuso de quem lê), do mais recente para o mais antigo. */
function agruparPorDia(
  eventos: DiarioEvento[],
): { chave: string; dia: string; eventos: DiarioEvento[] }[] {
  const grupos = new Map<string, DiarioEvento[]>();
  for (const evento of eventos) {
    const chave = chaveDoDia.format(new Date(evento.quando));
    const doDia = grupos.get(chave);
    if (doDia) {
      doDia.push(evento);
    } else {
      grupos.set(chave, [evento]);
    }
  }
  return [...grupos.entries()]
    .map(([chave, doDia]) => ({
      chave,
      dia: diaPorExtenso.format(new Date(doDia[0].quando)),
      eventos: doDia,
    }))
    .sort((a, b) => b.chave.localeCompare(a.chave));
}

/**
 * Linha do tempo do diário do perfil: os eventos cheiam agrupados por dia com um ponto na
 * linha, o selo do tipo (publicação, comentário ou repost), o excerto clicável e, quando
 * existe, a linha de contexto do post original. A escrita é de quem renderiza: o componente
 * só avisa onAbrirEvento/onCarregarMais.
 */
export function DiarioLinhaTempo({
  eventos,
  temMais,
  carregandoMais,
  onCarregarMais,
  onAbrirEvento,
}: DiarioLinhaTempoProps) {
  const messages = useMessages().diario;
  const dias = agruparPorDia(eventos);

  if (dias.length === 0) {
    return <p className="py-4 text-sm font-normal text-text-subtle">{messages.vazio}</p>;
  }

  const rotulos = {
    PUBLICACAO: messages.publicacao,
    COMENTARIO: messages.comentario,
    REPOST: messages.repost,
  } as const;

  return (
    <div className="flex flex-col gap-4">
      {dias.map((dia) => (
        <section key={dia.chave} className="diario-dia" aria-label={dia.dia}>
          <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {dia.dia}
          </h4>

          <ol className="diario-linha flex flex-col">
            {dia.eventos.map((evento, indice) => {
              const Icone = ICONES[evento.tipo];
              return (
                <li
                  key={`${evento.tipo}-${evento.postId}-${evento.quando}-${indice}`}
                  className="relative flex gap-3 pb-4 last:pb-0"
                >
                  <span
                    className={cn(
                      "z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface-1",
                      evento.tipo === "PUBLICACAO" && "text-primary",
                      evento.tipo === "COMENTARIO" && "text-muted-foreground",
                      evento.tipo === "REPOST" && "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    <Icone className="size-3.5" />
                  </span>

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {rotulos[evento.tipo]}
                    </span>

                    <button
                      type="button"
                      onClick={() => onAbrirEvento(evento)}
                      className="text-left text-sm font-normal text-text-body hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {evento.trecho}
                    </button>
                    {evento.contexto?.trecho != null && (
                      <p className="truncate text-xs font-normal text-muted-foreground">
                        {evento.contexto.autorNome != null
                          ? `${messages.contextoDe(evento.contexto.autorNome)}: `
                          : ""}
                        {evento.contexto.trecho}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {temMais && onCarregarMais != null && (
        <button
          type="button"
          onClick={onCarregarMais}
          disabled={carregandoMais}
          className="mx-auto rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
        >
          {carregandoMais ? messages.carregandoMais : messages.carregarMais}
        </button>
      )}
    </div>
  );
}
