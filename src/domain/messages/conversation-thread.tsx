import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Briefcase, EyeOff, ImageIcon, Send, X } from "lucide-react";

import { insertSnippet } from "../../lib/rich-text/insert-snippet.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ConversationServiceOption } from "../../types/domain/messages/conversation-service-option.js";
import type { ConversationThreadProps } from "../../types/domain/messages/conversation-thread-props.js";
import { Button } from "../../ui/button.js";
import { EmojiPicker } from "../../ui/emoji-picker.js";
import { SpoilerPreview } from "../post/media/spoiler-preview.js";

import { ConversationHeader } from "./conversation-header.js";
import { MessageSkeletons } from "./message-skeletons.js";

/** Preview de arquivo local: gera a blob URL no render e revoga no unmount. Quebra a cadeia de
 *  taint que o CodeQL via quando a URL passava por state. */
function BlobPreview({ file, alt, className }: { file: File; alt: string; className: string }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <img src={url} alt={alt} className={className} />;
}

/**
 * O filão de uma conversa: cabeçalho, histórico e compositor.
 *
 * Mora fora da rota porque o dock quer abrir várias conversas ao mesmo tempo: cada aba é uma
 * instância desta tela, com o próprio estado de rascunho e rolagem.
 */
export function ConversationThread({
  conversationTitle,
  peer,
  profileHref,
  onBack,
  banner,
  e2eRequired,
  children,
  loading,
  empty,
  newestMessageId,
  hasOlderMessages,
  loadingOlder,
  onLoadOlder,
  selecting,
  selectedCount,
  onStartSelecting,
  onCancelSelection,
  deletePending,
  onDeleteSelected,
  sendPending,
  onSend,
  servicesOpen,
  onServicesOpenChange,
  servicesLoading,
  services,
  serviceHref,
  replyingTo,
  onCancelReply,
}: ConversationThreadProps) {
  const messages = useMessages().conversationThread;
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{ file: File; preview: string }[]>([]);
  const [mediaSpoiler, setMediaSpoiler] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const attachService = (listing: ConversationServiceOption) => {
    const snippet = `${messages.serviceAttachment} ${listing.title} — ${serviceHref(listing.id)}`;
    setText((previous) => (previous.trim() ? `${previous.trimEnd()}\n${snippet}` : snippet));
    onServicesOpenChange(false);
    messageInputRef.current?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sendPending) return;
    const content = text.trim();
    if (!content && media.length === 0) return;
    // Limpa na hora para evitar reenvio se Enter disparar duas vezes antes do onSuccess.
    setText("");
    setMedia([]);
    const shouldSpoiler = mediaSpoiler;
    setMediaSpoiler(false);
    setUploadError(null);
    const replyId = replyingTo?.id;
    onCancelReply?.();
    try {
      await onSend({
        text: content,
        files: media.map((item) => item.file),
        mediaSpoiler: shouldSpoiler,
        replyToId: replyId,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : messages.mediaError);
    }
  };

  const addMediaFiles = (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setMedia((current) => {
      const room = 4 - current.length;
      if (room <= 0) {
        setUploadError(messages.mediaLimit);
        return current;
      }
      setUploadError(null);
      return [
        ...current,
        ...images.slice(0, room).map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ];
    });
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    addMediaFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const removeMediaItem = (index: number) => {
    setMedia((current) => {
      URL.revokeObjectURL(current[index].preview);
      const next = current.filter((_, i) => i !== index);
      if (next.length === 0) setMediaSpoiler(false);
      return next;
    });
  };

  // Campo de mensagem cresce com o texto (teto 128px) e volta a 1 linha ao enviar.
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = messageInputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [text]);

  /** Emoji do seletor: entra na posição do cursor (o campo é o mesmo, então vale para o chat). */
  const insertEmoji = (emoji: string) => {
    const el = messageInputRef.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? start;
    const result = insertSnippet(text, start, end, emoji);
    setText(result.value);

    requestAnimationFrame(() => {
      const node = messageInputRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  // Rola para o fim quando chega mensagem nova — mas NAO quando o usuario carrega mensagens
  // antigas (senao a lista salta para o fim e ele perde o ponto em que estava lendo).
  const lastScrolledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!newestMessageId || lastScrolledRef.current === newestMessageId) return;
    lastScrolledRef.current = newestMessageId;
    // Rola DENTRO do quadro de mensagens: `scrollIntoView` fazia o navegador rolar a página
    // inteira quando o teclado abria no mobile.
    const el = messagesScrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [newestMessageId]);

  return (
    <>
      <ConversationHeader
        action={
          selecting ? undefined : (
            <button
              type="button"
              onClick={onStartSelecting}
              className="rounded-full px-3 py-1 text-xs font-normal text-text-subtle transition hover:bg-surface-2 hover:text-primary"
            >
              {messages.selectMessages}
            </button>
          )
        }
        conversationTitle={conversationTitle}
        peer={peer}
        profileHref={profileHref}
        onBack={onBack}
      />

      {e2eRequired
        ? banner && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/30 p-5">
              {banner}

              <p className="text-center text-xs text-text-subtle">{messages.e2eRequired}</p>
            </div>
          )
        : banner && <div className="px-4 pt-3">{banner}</div>}

      {!e2eRequired && (
        <>
          <div
            ref={messagesScrollRef}
            className="flex-1 overflow-y-auto overscroll-contain bg-muted/30 p-5"
          >
            {hasOlderMessages && (
              <div className="mb-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  disabled={loadingOlder}
                  onClick={onLoadOlder}
                >
                  {loadingOlder ? messages.loadingOlder : messages.loadOlderMessages}
                </Button>
              </div>
            )}
            <div className="space-y-3">
              {loading ? (
                <MessageSkeletons />
              ) : empty ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  {messages.noMessages}
                </p>
              ) : (
                children
              )}
              <div />
            </div>
          </div>

          {selecting ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2 p-3">
              <span className="text-xs font-normal text-text-subtle">
                {messages.selectedMessages(selectedCount)}
              </span>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={onCancelSelection}
                >
                  {messages.cancelSelection}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-full"
                  disabled={selectedCount === 0 || deletePending}
                  onClick={onDeleteSelected}
                >
                  {messages.deleteSelectedMessages(selectedCount)}
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border-t border-border px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            >
              {replyingTo && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border-l-2 border-primary bg-muted px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-primary">
                      {messages.replyingTo(replyingTo.from)}
                    </p>

                    <p className="truncate text-xs text-text-subtle">{replyingTo.text}</p>
                  </div>

                  <button
                    type="button"
                    onClick={onCancelReply}
                    className="shrink-0 rounded-full p-0.5 text-text-subtle transition hover:bg-surface-2 hover:text-foreground"
                    aria-label={messages.cancelReply}
                    title={messages.cancelReply}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {media.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {media.map((item, index) => (
                    <div key={item.preview} className="relative">
                      <SpoilerPreview
                        active={mediaSpoiler}
                        label={messages.mediaSpoilerBadge}
                        className="h-16 w-16 rounded-lg"
                      >
                        <BlobPreview
                          file={item.file}
                          alt=""
                          className="h-16 w-16 rounded-lg border border-border-soft object-cover"
                        />
                      </SpoilerPreview>

                      <button
                        type="button"
                        onClick={() => removeMediaItem(index)}
                        className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background shadow"
                        aria-label={messages.removeMedia}
                        title={messages.removeMedia}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMediaSpoiler((active) => !active)}
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

              {uploadError && <p className="mb-2 text-xs text-destructive">{uploadError}</p>}

              {servicesOpen && (
                <div className="mb-2 rounded-xl border border-border-soft bg-surface-2 p-2">
                  <p className="px-1 text-xs font-medium">{messages.attachServiceTitle}</p>

                  <p className="px-1 pb-2 text-[11px] text-text-subtle">
                    {messages.attachServiceHint}
                  </p>

                  {servicesLoading ? (
                    <p className="px-1 py-2 text-xs text-text-subtle">{messages.loadingOlder}</p>
                  ) : services.length === 0 ? (
                    <p className="px-1 py-2 text-xs text-text-subtle">{messages.noServices}</p>
                  ) : (
                    <ul className="max-h-40 space-y-1 overflow-y-auto overscroll-contain">
                      {services.map((listing) => (
                        <li key={listing.id}>
                          <button
                            type="button"
                            onClick={() => attachService(listing)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-surface-card"
                          >
                            <span className="min-w-0 flex-1 truncate">{listing.title}</span>

                            <span className="shrink-0 text-text-subtle">{listing.category}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaSelect}
                />
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter envia; Shift+Enter quebra linha (padrao de chat).
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }
                  }}
                  onPaste={(event) => {
                    const files = Array.from(event.clipboardData?.files ?? []);
                    if (files.some((file) => file.type.startsWith("image/"))) {
                      event.preventDefault();
                      addMediaFiles(files);
                    }
                  }}
                  ref={messageInputRef}
                  rows={1}
                  placeholder={messages.inputPlaceholder}
                  className="max-h-20 min-h-[40px] w-full resize-none rounded-2xl bg-muted px-4 py-2.5 text-sm outline-none"
                />

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-muted hover:text-foreground"
                    aria-label={messages.attachMedia}
                    title={messages.attachMedia}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onServicesOpenChange(!servicesOpen)}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-muted hover:text-foreground ${
                      servicesOpen ? "bg-muted text-primary" : "text-text-subtle"
                    }`}
                    aria-label={messages.attachService}
                    aria-expanded={servicesOpen}
                    title={messages.attachService}
                  >
                    <Briefcase className="h-4 w-4" />
                  </button>

                  <EmojiPicker
                    onPick={insertEmoji}
                    buttonTitle={messages.emoji}
                    buttonClassName="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-muted hover:text-foreground"
                  />

                  <button
                    type="submit"
                    aria-label={messages.send}
                    title={messages.send}
                    disabled={(!text.trim() && media.length === 0) || sendPending}
                    className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </>
  );
}
