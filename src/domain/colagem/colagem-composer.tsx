import { useState } from "react";

import { Camera, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ColagemComposerProps } from "../../types/domain/colagem/colagem-composer-props.js";
import { Button } from "../../ui/button.js";
import { CharCounter } from "../../ui/char-counter.js";
import { Textarea } from "../../ui/textarea.js";
import { ComposerMediaPicker } from "../post/composer-media-picker.js";

/** O teto da legenda no backend (ColagemService.MAX_DESCRIPTION); contar aqui evita o 400. */
const MAX_CAPTION = 500;

/**
 * O compositor da Colagem: uma foto por publicação, legenda curta e o véu de foto sensível.
 * O anexo (conferir e subir) é trabalho de quem compõe — a view desenha o rascunho e recolhe
 * texto e véu; `onPublish` devolve a promessa do resultado para limpar só quando colou.
 */
export function ColagemComposer({
  attachment,
  onFiles,
  onRemoveAttachment,
  onPublish,
}: ColagemComposerProps) {
  const messages = useMessages().colagemComposer;
  const [description, setDescription] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [sending, setSending] = useState(false);

  const semFoto = !attachment?.mediaId;
  const enviando = sending || Boolean(attachment && attachment.status === "checking");

  const publicar = async () => {
    if (semFoto || enviando) return;
    setSending(true);
    try {
      await onPublish({ description: description.trim() || undefined, mediaSpoiler: spoiler });
      setDescription("");
      setSpoiler(false);
    } catch {
      // A recusa já foi avisada por quem compõe; aqui o rascunho fica de pé para corrigir.
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border p-4">
      <h2 className="text-sm font-semibold">{messages.title}</h2>

      <p className="text-xs text-text-subtle">{messages.hint}</p>

      <ComposerMediaPicker
        items={attachment ? [attachment] : []}
        onFiles={onFiles}
        onRemove={onRemoveAttachment}
        canAddMore={false}
        multiple={false}
      />

      <div className="space-y-1">
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={messages.captionPlaceholder}
          aria-label={messages.caption}
          rows={2}
        />
        <CharCounter length={description.length} max={MAX_CAPTION} />
      </div>

      <label className="flex items-center gap-2 text-xs text-text-subtle">
        <input
          type="checkbox"
          checked={spoiler}
          onChange={(event) => setSpoiler(event.target.checked)}
          className="h-3.5 w-3.5"
        />
        {messages.spoiler}
      </label>

      <Button
        onClick={() => void publicar()}
        disabled={enviando || semFoto}
        title={semFoto ? messages.needPhoto : undefined}
        className="gap-2 rounded-full"
      >
        {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {enviando ? messages.publishing : messages.publish}
      </Button>
    </section>
  );
}
