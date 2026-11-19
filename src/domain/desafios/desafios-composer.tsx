import { useState } from "react";

import { CalendarClock, Loader2, Megaphone } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DesafiosComposerProps } from "../../types/domain/desafios/desafios-composer-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";

/** O teto do título no backend (DesafiosService.MAX_TITLE); contar aqui evita o 400. */
const MAX_TITLE = 120;
/** O teto da descrição no backend (DesafiosService.MAX_DESCRIPTION). */
const MAX_DESCRIPTION = 3000;
/** O teto de janela no backend (DesafiosService.MAX_DAYS). */
const MAX_DAYS = 31;

/** Agora -> valor de <input type="datetime-local"> (horário local, "YYYY-MM-DDTHH:mm"). */
const agoraCampo = () => {
  const data = new Date();
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

/** Valor do campo -> ISO UTC (vazio = sem prazo). */
const deCampo = (valor: string) => (valor ? new Date(valor).toISOString() : undefined);

/** O teto do prazo como valor de campo, para o navegador travar data além da janela. */
const limiteCampo = () => {
  const data = new Date();
  data.setDate(data.getDate() + MAX_DAYS);
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

/**
 * O compositor do desafio: título curto, o que fazer e a janela opcional de até 31 dias. O
 * desafio é um convite com responsável — publicar aqui é convocar, e quem convoca depois
 * encerra reconhecendo uma participação. `onPublish` devolve a promessa do resultado para
 * limpar os campos só quando publicou.
 */
export function DesafiosComposer({ onPublish }: DesafiosComposerProps) {
  const messages = useMessages().desafiosComposer;
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const semTitulo = !titulo.trim();
  const semDescricao = !descricao.trim();
  const publicar = async () => {
    if (semTitulo || semDescricao || enviando) return;
    setEnviando(true);
    try {
      await onPublish({
        title: titulo.trim(),
        description: descricao.trim(),
        endsAt: deCampo(prazo),
      });
      setTitulo("");
      setDescricao("");
      setPrazo("");
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border p-4">
      <div className="space-y-1">
        <input
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder={messages.titlePlaceholder}
          aria-label={messages.titleAria}
          maxLength={MAX_TITLE}
          className="w-full rounded-lg border border-border-soft bg-transparent px-3 py-2 text-sm text-text-strong placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Textarea
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder={messages.descriptionPlaceholder}
          aria-label={messages.descriptionAria}
          rows={3}
          maxLength={MAX_DESCRIPTION}
        />
      </div>

      <div>
        <label
          className="flex items-center gap-2 text-sm font-normal text-text-strong"
          htmlFor="desafios-prazo"
        >
          <CalendarClock className="h-3.5 w-3.5 text-text-subtle" aria-hidden="true" />

          {messages.deadlineLabel}
        </label>

        <input
          id="desafios-prazo"
          type="datetime-local"
          value={prazo}
          min={agoraCampo()}
          max={limiteCampo()}
          onChange={(event) => setPrazo(event.target.value)}
          className="mt-1 rounded-lg border border-border-soft bg-transparent px-3 py-2 text-sm text-text-strong"
        />

        <p className="mt-1 text-xs text-text-subtle">{messages.deadlineHint}</p>
      </div>

      <Button
        onClick={() => void publicar()}
        disabled={enviando || semTitulo || semDescricao}
        title={semTitulo ? messages.needTitle : semDescricao ? messages.needDescription : undefined}
        className="gap-2 rounded-full"
      >
        {enviando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Megaphone className="h-4 w-4" />
        )}
        {enviando ? messages.publishing : messages.publish}
      </Button>
    </section>
  );
}
