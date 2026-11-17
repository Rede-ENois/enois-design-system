import { CalendarClock, ListChecks, Plus, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { EnqueteComposerProps } from "../../types/domain/enquetes/enquete-composer-props.js";

/** ISO UTC -> valor de <input type="datetime-local"> (horário local, "YYYY-MM-DDTHH:mm"). */
const paraCampo = (iso?: string) => {
  if (!iso) return "";
  const data = new Date(iso);
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

/** Valor do campo -> ISO UTC (vazio = sem prazo). */
const deCampo = (valor: string) => (valor ? new Date(valor).toISOString() : undefined);

/**
 * Alternativas da enquete no composer: 2 a 6 opções, que são o que a pessoa vota (o título do
 * post fica no campo de cima). A múltipla escolha e o prazo são opcionais: sem eles a enquete
 * é de escolha única e sem prazo. O componente só edita os valores — quem publica normaliza e
 * o backend valida de novo.
 */
export function EnqueteComposer({
  opcoes,
  onOpcoesChange,
  multiplaEscolha,
  onMultiplaEscolhaChange,
  terminaEm,
  onTerminaEmChange,
}: EnqueteComposerProps) {
  const messages = useMessages().enqueteComposer;

  const atualizar = (posicao: number, valor: string) => {
    onOpcoesChange(opcoes.map((opcao, indice) => (indice === posicao ? valor : opcao)));
  };

  const agoraCampo = paraCampo(new Date().toISOString());

  return (
    <div className="mt-3 rounded-2xl border border-border-soft bg-surface-1 p-3">
      <span className="mb-1 block text-sm font-normal text-text-subtle">
        {messages.opcoesRotulo}
      </span>

      <p className="mb-2 text-xs text-text-subtle">{messages.dica}</p>

      <div className="flex flex-col gap-1.5">
        {opcoes.map((opcao, posicao) => (
          <div key={posicao} className="flex items-center gap-2">
            <input
              type="text"
              value={opcao}
              maxLength={120}
              onChange={(event) => atualizar(posicao, event.target.value)}
              placeholder={messages.opcaoPlaceholder(posicao + 1)}
              aria-label={messages.opcaoPlaceholder(posicao + 1)}
              className="min-w-0 flex-1 rounded-lg border border-border-soft bg-transparent px-3 py-2 text-sm text-text-strong"
            />

            {opcoes.length > 2 && (
              <button
                type="button"
                onClick={() =>
                  onOpcoesChange(opcoes.filter((_valor, indice) => indice !== posicao))
                }
                title={messages.removerOpcao}
                aria-label={messages.removerOpcao}
                className="rounded-lg p-1.5 text-text-subtle transition hover:bg-muted hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {opcoes.length < 6 && (
        <button
          type="button"
          onClick={() => onOpcoesChange([...opcoes, ""])}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-sm font-normal text-text-subtle transition hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />

          {messages.adicionarOpcao}
        </button>
      )}

      {onMultiplaEscolhaChange && (
        <label className="mt-3 flex items-center gap-2 text-sm font-normal text-text-strong">
          <input
            type="checkbox"
            checked={multiplaEscolha ?? false}
            onChange={(event) => onMultiplaEscolhaChange(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <ListChecks className="h-3.5 w-3.5 text-text-subtle" aria-hidden="true" />

          <span>{messages.multiplaEscolha}</span>
        </label>
      )}

      {onTerminaEmChange && (
        <div className="mt-2">
          <label
            className="flex items-center gap-2 text-sm font-normal text-text-strong"
            htmlFor="enquete-prazo"
          >
            <CalendarClock className="h-3.5 w-3.5 text-text-subtle" aria-hidden="true" />

            {messages.prazoRotulo}
          </label>

          <input
            id="enquete-prazo"
            type="datetime-local"
            value={paraCampo(terminaEm)}
            min={agoraCampo}
            onChange={(event) => onTerminaEmChange(deCampo(event.target.value))}
            className="mt-1 rounded-lg border border-border-soft bg-transparent px-3 py-2 text-sm text-text-strong"
          />

          <p className="mt-1 text-xs text-text-subtle">{messages.prazoDica}</p>
        </div>
      )}
    </div>
  );
}
