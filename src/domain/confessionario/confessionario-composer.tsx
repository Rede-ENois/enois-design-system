import { useState } from "react";

import { Loader2, ScrollText } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ConfessionarioComposerProps } from "../../types/domain/confessionario/confessionario-composer-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";

/** O teto da confissão no backend (ConfessionarioService.MAX_CONTENT); contar aqui evita o 400. */
const MAX_CONTENT = 5000;

/**
 * O compositor do Confessionário: só texto, sem mídia — o que se pede aqui é uma história. O
 * aviso lembra que ninguém sabe quem contou e que o texto fica só neste espaço, fora do feed
 * principal. `onPublish` devolve a promessa do resultado para limpar o campo só quando publicou.
 */
export function ConfessionarioComposer({ onPublish }: ConfessionarioComposerProps) {
  const messages = useMessages().confessionarioComposer;
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const vazio = !texto.trim();
  const publicar = async () => {
    if (vazio || enviando) return;
    setEnviando(true);
    try {
      await onPublish({ content: texto.trim() });
      setTexto("");
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border p-4">
      <p className="text-xs text-text-subtle">{messages.hint}</p>

      <div className="space-y-1">
        <Textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={messages.placeholder}
          aria-label={messages.placeholder}
          rows={4}
          maxLength={MAX_CONTENT}
        />
      </div>

      <Button
        onClick={() => void publicar()}
        disabled={enviando || vazio}
        title={vazio ? messages.needText : undefined}
        className="gap-2 rounded-full"
      >
        {enviando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ScrollText className="h-4 w-4" />
        )}
        {enviando ? messages.publishing : messages.publish}
      </Button>
    </section>
  );
}
