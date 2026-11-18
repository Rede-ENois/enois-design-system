import { useState } from "react";

import { HandHeart, Loader2, Trash2, Trophy } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { DesafiosParticipacoesProps } from "../../types/domain/desafios/desafios-participacoes-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";

import { DesafiosAuthor } from "./desafios-author.js";

const HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** O teto da participação no backend (DesafiosService.MAX_PARTICIPACAO); contar aqui evita o 400. */
const MAX_PARTICIPACAO = 5000;

/**
 * O mural do desafio escolhido: as participações com quem as fez, a torcida contada (uma por
 * pessoa, sem lista de quem torceu) e o campo de resposta — que só existe quando o desafio
 * aceita: no ar e quem vê não é quem convocou. Para quem convocou e o desafio está no ar, o
 * encerramento com reconhecimento é escolher uma participação no ar e nominá-la.
 */
export function DesafiosParticipacoes({
  desafio,
  state,
  participacoes,
  onParticipate,
  onCheer,
  onUncheer,
  onRemoveParticipacao,
  onClose,
}: DesafiosParticipacoesProps) {
  const messages = useMessages().desafiosParticipacoes;
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [encerrando, setEncerrando] = useState(false);
  const [escolhida, setEscolhida] = useState<string | null>(null);

  const aceitaResposta = desafio.status === "ACTIVE" && !desafio.isMine;
  const aceitaEncerramento = desafio.status === "ACTIVE" && desafio.isMine;
  const vazio = !texto.trim();

  const participar = async () => {
    if (vazio || enviando) return;
    setEnviando(true);
    try {
      await onParticipate({ content: texto.trim() });
      setTexto("");
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setEnviando(false);
    }
  };

  const encerrar = () => {
    if (!escolhida || encerrando) return;
    setEncerrando(true);
    onClose(escolhida);
  };

  return (
    <section className="space-y-3" aria-label={messages.title}>
      <h3 className="text-sm font-semibold text-text-strong">{messages.title}</h3>

      {aceitaEncerramento && desafio.status === "ACTIVE" && (
        <div className="space-y-2 rounded-xl border border-border-soft bg-surface-1 p-3">
          <p className="text-xs text-text-subtle">{messages.encerrarHint}</p>

          {encerrando && <p className="text-xs font-medium">{messages.encerrando}</p>}
        </div>
      )}

      {state.kind === "loading" && (
        <p className="flex items-center justify-center gap-2 py-6 text-sm text-text-subtle">
          <Loader2 className="h-4 w-4 animate-spin" /> {messages.loading}
        </p>
      )}
      {state.kind === "error" && (
        <p className="py-6 text-center text-sm text-text-subtle">{messages.error}</p>
      )}
      {state.kind === "empty" && (
        <p className="py-6 text-center text-sm text-text-subtle">{messages.empty}</p>
      )}

      {state.kind === "ready" && (
        <ul className="space-y-3">
          {participacoes.map((participacao) => {
            const minhaTorcida = participacao.cheered;
            const eADestaque = escolhida === participacao.id;
            return (
              <li key={participacao.id} className="space-y-2 rounded-xl border border-border p-3">
                <div className="flex items-start gap-2">
                  <DesafiosAuthor author={participacao.author} />

                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    {participacao.isMine && (
                      <button
                        type="button"
                        onClick={() => onRemoveParticipacao(participacao.id)}
                        className="text-text-subtle transition hover:text-text-strong"
                        title={messages.remove}
                        aria-label={messages.remove}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    {aceitaEncerramento && (
                      <button
                        type="button"
                        onClick={() => setEscolhida(eADestaque ? null : participacao.id)}
                        aria-pressed={eADestaque}
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                          eADestaque
                            ? "border-primary bg-surface-2 text-text-strong"
                            : "border-border text-text-subtle hover:bg-surface-2",
                        )}
                        title={messages.escolherDestaque}
                      >
                        <Trophy aria-hidden className="h-3.5 w-3.5" />
                        {eADestaque ? messages.destaqueEscolhido : messages.escolherDestaque}
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm text-text-strong">
                  {participacao.content}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      minhaTorcida ? onUncheer(participacao.id) : onCheer(participacao.id)
                    }
                    aria-label={minhaTorcida ? messages.uncheer : messages.cheer}
                    aria-pressed={minhaTorcida}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                      minhaTorcida
                        ? "border-primary bg-surface-2 text-text-strong"
                        : "border-border text-text-subtle hover:bg-surface-2",
                    )}
                  >
                    <HandHeart aria-hidden className="h-3.5 w-3.5" />

                    <span>{messages.cheers(participacao.cheers)}</span>
                  </button>

                  <span className="ml-auto text-xs text-text-subtle">
                    {HORA.format(new Date(participacao.createdAt))}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {aceitaEncerramento && escolhida && !encerrando && (
        <Button onClick={encerrar} className="gap-2 rounded-full">
          <Trophy className="h-4 w-4" />
          {messages.encerrar}
        </Button>
      )}

      {aceitaResposta ? (
        <div className="space-y-2">
          <Textarea
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder={messages.placeholder}
            aria-label={messages.placeholder}
            rows={3}
            maxLength={MAX_PARTICIPACAO}
          />

          <Button
            onClick={() => void participar()}
            disabled={enviando || vazio}
            title={vazio ? messages.needText : undefined}
            className="gap-2 rounded-full"
          >
            {enviando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <HandHeart className="h-4 w-4" />
            )}
            {enviando ? messages.sending : messages.send}
          </Button>
        </div>
      ) : (
        desafio.status === "CLOSED" && (
          <p className="text-xs text-text-subtle">{messages.closedMural}</p>
        )
      )}
    </section>
  );
}
