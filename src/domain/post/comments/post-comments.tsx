import {
  type ChangeEvent,
  type FormEvent,
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { EyeOff, Image, Loader2, Mic, Plus, Send, Square, X } from "lucide-react";

import { cn } from "../../../lib/utils.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { PostCommentNode } from "../../../types/domain/post/post-comment-node.js";
import type { PostCommentsProps } from "../../../types/domain/post/post-comments-props.js";
import { Button } from "../../../ui/button.js";
import { SpoilerPreview } from "../media/spoiler-preview.js";

import { CommentSkeletons } from "./comment-skeletons.js";

/**
 * Comentarios de um post.
 *
 * A lista tem altura maxima com scroll proprio (comentario longo nao empurra o resto do card
 * para fora da tela) e o campo de escrita fica ACIMA dela: comentar nao pode exigir rolar todos
 * os comentarios. Respostas cujo comentario pai ainda nao foi carregado aparecem como raiz para
 * nao sumirem. Carregar, enviar e subir mídia é do app; aqui ficam a lista, o rascunho visual dos
 * anexos e a gravação de áudio.
 */
export function PostComments<C extends PostCommentNode>({
  formId,
  comments,
  loading,
  loadingMore,
  hasMore,
  error,
  onRetry,
  onLoadMore,
  renderComment,
  replyToId,
  onCancelReply,
  media,
  mediaSpoiler,
  onToggleMediaSpoiler,
  onRemoveMedia,
  onInsertMedia,
  onAddImages,
  onAddAudio,
  onErrorChange,
  composerField,
  canSend,
  sending,
  onSubmit,
  onOpenGifPicker,
  gifPicker,
}: PostCommentsProps<C>) {
  const messages = useMessages().postComments;
  const [recording, setRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trayId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  // A recording in progress keeps its controls in sight.
  const toolsShown = toolsOpen || recording;

  // Gravar áudio: o mesmo caminho do anexo (vira arquivo e sobe como mídia) — o que muda é que o
  // arquivo nasce do microfone. Sem suporte no navegador, o botão nem aparece.
  const canRecord = typeof window !== "undefined" && typeof window.MediaRecorder !== "undefined";

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  const startRecording = async () => {
    if (media.length >= 4) {
      onErrorChange("mediaLimit");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        audioChunksRef.current = [];
        setRecordedSeconds(0);
        if (blob.size === 0) return;
        onAddAudio(new File([blob], `audio-${Date.now()}.webm`, { type: blob.type }));
      };
      recorder.start();
      recorderRef.current = recorder;
      onErrorChange(null);
      setRecordedSeconds(0);
      setRecording(true);
    } catch {
      onErrorChange("micDenied");
    }
  };

  // Cronômetro da gravação e teto de 3 minutos: arquivo de áudio longo é caro de subir e ninguém
  // ouve — melhor cortar sozinho do que descobrir depois.
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setRecordedSeconds((current) => current + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (recording && recordedSeconds >= 180) stopRecording();
  }, [recording, recordedSeconds]);

  const addMedia = (event: ChangeEvent<HTMLInputElement>) => {
    onAddImages(Array.from(event.target.files ?? []));
    event.target.value = "";
    setToolsOpen(false);
  };

  // Answering puts the caret in the field right where the reply opened.
  useEffect(() => {
    if (!replyToId) return;
    const form = formRef.current;
    form?.querySelector("textarea")?.focus({ preventScroll: true });
    form?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [replyToId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // O comentario novo entra no topo; rola a lista para o usuario ver.
    if (await onSubmit(String(formData.get("website") ?? ""))) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const byId = new Map<string, C>(comments.map((comment) => [comment.id, comment]));
  // Resolve a raiz de cada comentario subindo pelos pais ja carregados. Assim uma resposta a uma
  // resposta continua aparecendo sob o mesmo comentario-raiz — antes ela nao era renderizada
  // (nao era raiz nem resposta direta da raiz) e parecia que "nao renderizava".
  const rootIdByComment = new Map<string, string>();
  for (const comment of comments) {
    let currentId = comment.id;
    let parentId = comment.parentCommentId;
    const guard = new Set<string>();
    while (parentId && byId.has(parentId) && !guard.has(currentId)) {
      guard.add(currentId);
      currentId = parentId;
      parentId = byId.get(parentId)?.parentCommentId ?? null;
    }
    rootIdByComment.set(comment.id, currentId);
  }
  const roots = comments.filter((comment) => rootIdByComment.get(comment.id) === comment.id);
  const replyToName = replyToId ? byId.get(replyToId)?.authorName : undefined;
  // The reply opens in the thread when its comment is loaded; otherwise it stays on top.
  const inlineReply = replyToId !== null && byId.has(replyToId);

  // One form, two places: on top for a new comment, under the comment being answered for a reply,
  // so answering never sends the reader away from what they answer. Draft and attachments stay.
  const composer = (inline: boolean) => (
    <form
      ref={formRef}
      onSubmit={submit}
      onKeyDown={(event) => {
        // Esc leaves an inline reply; the mention list claims Esc first when it is open.
        if (inline && event.key === "Escape" && !event.defaultPrevented) onCancelReply();
      }}
      className={inline ? "mt-2" : "mb-4"}
      id={formId}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="min-w-0">
        {replyToId && (
          <div className="mb-1.5 flex items-center gap-2 pl-[2.625rem] text-xs font-normal text-primary">
            <span className="truncate">
              {replyToName ? messages.replyingTo(replyToName) : messages.reply}
            </span>

            <button
              type="button"
              onClick={onCancelReply}
              className="shrink-0 text-text-subtle hover:text-foreground"
              aria-label={messages.cancelReply}
              title={messages.cancelReply}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {media.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {media.map((item, i) => (
              <div key={item.preview} className="relative">
                {item.type === "audio" ? (
                  <audio
                    src={item.preview}
                    controls
                    className="h-16 w-56 rounded-lg border border-border-soft"
                  />
                ) : (
                  <SpoilerPreview
                    active={mediaSpoiler}
                    label={messages.spoilerBadge}
                    className="h-16 w-16 rounded-lg"
                  >
                    <img
                      src={item.preview}
                      alt=""
                      className="h-16 w-16 rounded-lg border border-border-soft object-cover"
                    />
                  </SpoilerPreview>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveMedia(i)}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-on-foreground shadow"
                  aria-label={messages.removeMedia}
                  title={messages.removeMedia}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Item 9: insere o marcador no ponto do texto (o pendente vira id real no upload). */}
                <button
                  type="button"
                  title={messages.insertInText}
                  onClick={() => onInsertMedia(i)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-primary/40 px-1 py-0.5 text-[10px] font-normal text-primary transition hover:bg-primary/10"
                >
                  {messages.insertInText}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={onToggleMediaSpoiler}
              className={`inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs transition ${
                mediaSpoiler
                  ? "bg-primary text-primary-foreground"
                  : "border border-border-soft text-text-subtle hover:border-primary hover:text-primary"
              }`}
              aria-label={mediaSpoiler ? messages.mediaSpoilerActive : messages.mediaSpoiler}
              title={mediaSpoiler ? messages.mediaSpoilerActive : messages.mediaSpoiler}
            >
              <EyeOff className="h-3.5 w-3.5" />
              {mediaSpoiler ? messages.mediaSpoilerActive : messages.mediaSpoiler}
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={addMedia}
        />

        {/* The field spans the mobile row; one footer owns tools and the only submit button. */}
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-end gap-x-1.5 gap-y-1.5 sm:gap-y-0">
          <button
            type="button"
            onClick={() => setToolsOpen((open) => !open)}
            disabled={recording}
            aria-expanded={toolsShown}
            aria-controls={trayId}
            aria-label={toolsShown ? messages.closeTools : messages.moreTools}
            title={toolsShown ? messages.closeTools : messages.moreTools}
            className={cn(
              "col-start-1 row-start-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-text-subtle transition-colors hover:bg-surface-2 hover:text-primary disabled:opacity-60 sm:row-start-1",
              toolsShown && "bg-surface-2 text-primary",
            )}
          >
            <Plus
              className={cn(
                "h-5 w-5 transition-transform duration-200 ease-out motion-reduce:transition-none",
                toolsShown && "rotate-45",
              )}
            />
          </button>

          <div className="col-span-3 col-start-1 row-start-1 min-w-0 rounded-[1.25rem] border border-border-soft bg-surface-1 px-2 py-1 transition-colors focus-within:border-primary/50 sm:col-span-1 sm:col-start-2">
            {typeof composerField === "function"
              ? composerField({
                  toolsOpen: toolsShown,
                  replyingTo: inline ? (replyToName ?? null) : null,
                })
              : composerField}
          </div>

          <Button
            type="submit"
            size="sm"
            className={cn(
              "col-start-3 row-start-2 h-9 min-w-9 shrink-0 rounded-full sm:row-start-1 sm:w-9 sm:p-0",
              toolsShown && "w-9 p-0",
            )}
            disabled={!canSend || sending}
            aria-busy={sending}
            aria-label={sending ? messages.sending : messages.submit}
          >
            {sending ? (
              <Loader2
                className={cn("h-3.5 w-3.5 animate-spin", !toolsShown && "hidden sm:block")}
                aria-hidden="true"
              />
            ) : (
              <Send
                className={cn("h-3.5 w-3.5", !toolsShown && "hidden sm:block")}
                aria-hidden="true"
              />
            )}
            <span className={toolsShown ? "sr-only" : "sm:sr-only"}>
              {sending ? messages.sending : messages.submit}
            </span>
          </Button>

          {/* Height animates through grid rows, so the tray slides open without measuring it. */}
          <div
            id={trayId}
            inert={!toolsShown}
            className="col-start-2 row-start-2 grid min-w-0 self-center transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none sm:col-span-3 sm:col-start-1"
            style={{ gridTemplateRows: toolsShown ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-wrap items-center gap-1.5 sm:pl-[2.625rem] sm:pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-soft px-2 text-xs text-text-subtle transition-colors hover:border-primary hover:text-primary sm:px-3"
                  aria-label={messages.attachMedia}
                >
                  <Image className="h-3.5 w-3.5" />
                  {messages.photo}
                </button>

                {canRecord && (
                  <button
                    type="button"
                    onClick={() => (recording ? stopRecording() : void startRecording())}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-full border px-2 text-xs transition-colors sm:px-3",
                      recording
                        ? "border-destructive/50 text-destructive"
                        : "border-border-soft text-text-subtle hover:border-primary hover:text-primary",
                    )}
                    aria-label={recording ? messages.stopRecording : messages.recordAudio}
                  >
                    {recording ? (
                      <Square className="h-3.5 w-3.5" />
                    ) : (
                      <Mic className="h-3.5 w-3.5" />
                    )}
                    {recording
                      ? messages.recording(Math.floor(recordedSeconds / 60), recordedSeconds % 60)
                      : messages.audio}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenGifPicker();
                  }}
                  className="inline-flex h-8 items-center rounded-full border border-border-soft px-2 text-xs font-semibold text-text-subtle transition-colors hover:border-primary hover:text-primary sm:px-3"
                >
                  {messages.gif}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <section className="mt-4 border-t border-border-soft pt-4">
      {!inlineReply && composer(false)}

      <div
        ref={listRef}
        // Sem `overscroll-contain`: quando a lista ainda não transborda, ele impede a propagação
        // do toque para a página e o usuário não consegue rolar (relato em tablet/Fennec — o
        // último post da viewport travava o scroll até fechar os comentários).
        // A rolagem também recorta o eixo horizontal: o respiro acolhe os 30% da moldura
        // fora do avatar, inclusive no primeiro e no último comentário, mantendo o alinhamento lateral.
        className="-mx-3 max-h-[55vh] min-h-0 space-y-3 overflow-y-auto p-3"
      >
        {loading && <CommentSkeletons />}

        {!loading && error && (
          <div className="py-4 text-center">
            <p className="text-sm font-normal text-destructive">{messages.errors[error]}</p>

            <Button variant="outline" size="sm" className="mt-2 rounded-full" onClick={onRetry}>
              {messages.retry}
            </Button>
          </div>
        )}

        {!loading && !error && roots.length === 0 && (
          <p className="py-4 text-center text-sm font-normal text-text-subtle">{messages.empty}</p>
        )}

        {!loading &&
          !error &&
          roots.map((comment) => {
            const replies = comments.filter(
              (c) => c.id !== comment.id && rootIdByComment.get(c.id) === comment.id,
            );
            return (
              <div key={comment.id}>
                {renderComment(comment)}

                {(replies.length > 0 || replyToId === comment.id) && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-border-soft pl-3 sm:ml-10 sm:pl-4">
                    {replyToId === comment.id && composer(true)}
                    {replies.map((reply) => (
                      <Fragment key={reply.id}>
                        {renderComment(reply, byId.get(reply.parentCommentId ?? "")?.authorName)}
                        {replyToId === reply.id && composer(true)}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {loadingMore && <CommentSkeletons count={1} />}

        {!loading && !error && hasMore && (
          <div className="pt-1 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-sm font-normal text-primary"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {loadingMore ? messages.loadingMore : messages.loadMore}
            </Button>
          </div>
        )}
      </div>

      {gifPicker}
    </section>
  );
}
