import { useEffect, useRef, useState } from "react";

import { Bookmark, Flag, Heart, MessageSquare, Repeat2, Send, ThumbsUp } from "lucide-react";

import { topReactionTabs } from "../../../lib/reactions/summary.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { PostActionsProps } from "../../../types/domain/post/post-actions-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover.js";

import { ReactionPicker } from "./reaction-picker.js";

/** Fundo de cada bolinha do contador, ciclado por posição quando há mais de uma reação. */
const PILL_BACKGROUNDS = ["bg-rose-500", "bg-amber-500", "bg-blue-500"];

/**
 * Botões da fileira medem ~28×32px: o pseudo-elemento infla o alvo de toque até 44px sem mudar
 * o desenho (mesmo recurso das pílulas de reação).
 */
const HIT_AREA = "relative before:absolute before:-inset-y-2 before:-inset-x-1 before:content-['']";

/**
 * A fileira de ações de um post: reagir, ver quem reagiu, comentar, compartilhar, salvar e
 * denunciar.
 *
 * Estrutura refinada:
 * - À esquerda: ícones limpos (sem fundo) para Curtir, Comentar, Repostar e Enviar,
 *   acompanhados apenas dos contadores numéricos.
 * - À direita: agrupamento de ícones de reações (bolinhas sobrepostas) e salvar.
 */
export function PostActions<T extends string>({
  emojis,
  reactionStatus,
  reactionSummary,
  onReact,
  reactionPending,
  motionAllowed,
  reactionCount,
  commentsCount,
  savesCount,
  saved,
  canRepost,
  reposted,
  repostsCount,
  repostUnavailableReason,
  onShowReactions,
  onComments,
  onRepost,
  onShare,
  shareMenu,
  onReport,
  onSave,
  children,
  dialogs,
}: PostActionsProps<T>) {
  const messages = useMessages().postActions;
  const wasReactionPending = useRef(reactionPending);
  const [reactionPulse, setReactionPulse] = useState<T | null>(null);

  useEffect(() => {
    // Só a nova ação dispara o pulso: carregar o feed ou desfazer uma falha não celebra a reação.
    if (reactionPending && !wasReactionPending.current) {
      setReactionPulse(motionAllowed() ? reactionStatus : null);
    }
    wasReactionPending.current = reactionPending;
    // motionAllowed is read at the transition only
  }, [reactionPending, reactionStatus]);

  return (
    <>
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-1 border-t border-border pt-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Curtir / Reagir com ícone limpo */}
          <ReactionPicker
            emojis={emojis}
            activeType={reactionStatus}
            onReact={onReact}
            buttonClassName={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition hover:text-foreground ${HIT_AREA} ${
              reactionStatus ? "text-primary font-semibold" : "text-muted-foreground"
            }`}
            buttonTitle={
              reactionStatus ? messages.reactedWith(emojis[reactionStatus]) : messages.react
            }
          >
            <span
              key={reactionStatus ?? "none"}
              className={`grid h-4 w-4 place-items-center ${
                reactionPulse && reactionPulse === reactionStatus
                  ? "post-action-reaction-pulse"
                  : ""
              }`}
              onAnimationEnd={() => setReactionPulse(null)}
            >
              {reactionStatus ? (
                <span className="text-base leading-none">{emojis[reactionStatus]}</span>
              ) : (
                <ThumbsUp className="h-4 w-4" />
              )}
            </span>

            {reactionCount > 0 && (
              <span className="text-xs tabular-nums font-medium">{reactionCount}</span>
            )}
          </ReactionPicker>

          {/* Comentários */}
          <button
            type="button"
            onClick={onComments}
            title={messages.comments}
            aria-label={messages.comments}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground transition hover:text-foreground ${HIT_AREA}`}
          >
            <MessageSquare className="h-4 w-4" />

            {commentsCount > 0 && (
              <span className="text-xs tabular-nums font-medium">{commentsCount}</span>
            )}
          </button>

          {/* Repostar */}
          {canRepost && (
            <button
              type="button"
              onClick={onRepost}
              title={reposted ? messages.reposted : messages.repost}
              aria-label={reposted ? messages.reposted : messages.repost}
              aria-pressed={reposted}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition ${HIT_AREA} ${
                reposted
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Repeat2 className="h-4 w-4" />

              {repostsCount > 0 && (
                <span className="text-xs tabular-nums font-medium">{repostsCount}</span>
              )}
            </button>
          )}

          {/* Repost indisponível */}
          {!canRepost && repostUnavailableReason && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-disabled="true"
                  aria-label={messages.repostUnavailable}
                  title={repostUnavailableReason}
                  className={`flex cursor-not-allowed items-center rounded-lg px-2 py-1.5 opacity-40 transition text-muted-foreground ${HIT_AREA}`}
                >
                  <Repeat2 className="h-4 w-4" />
                </button>
              </PopoverTrigger>

              <PopoverContent side="top" className="w-64 p-3 text-xs leading-relaxed">
                <p className="font-medium text-foreground">{messages.repostUnavailable}</p>

                <p className="mt-1 text-muted-foreground">{repostUnavailableReason}</p>
              </PopoverContent>
            </Popover>
          )}

          {/* Enviar / Compartilhar */}
          {shareMenu ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  title={messages.share}
                  aria-label={messages.share}
                  className={`flex items-center rounded-lg px-2 py-1.5 text-muted-foreground transition hover:text-foreground ${HIT_AREA}`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </PopoverTrigger>

              <PopoverContent align="start" side="top" className="flex w-48 flex-col gap-0.5 p-1.5">
                {shareMenu}
              </PopoverContent>
            </Popover>
          ) : (
            <button
              type="button"
              onClick={onShare}
              title={messages.share}
              aria-label={messages.share}
              className={`flex items-center rounded-lg px-2 py-1.5 text-muted-foreground transition hover:text-foreground ${HIT_AREA}`}
            >
              <Send className="h-4 w-4" />
            </button>
          )}

          {children}

          <button
            type="button"
            onClick={onReport}
            title={messages.report}
            aria-label={messages.report}
            className={`flex items-center rounded-lg px-2 py-1.5 text-muted-foreground transition hover:text-foreground ${HIT_AREA}`}
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>

        {/* Alinhados à direita: Bolinhas sobrepostas de reações e botão salvar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {reactionCount > 0 && (
            <button
              type="button"
              onClick={onShowReactions}
              title={messages.seeWho(reactionCount)}
              aria-label={messages.seeWho(reactionCount)}
              aria-haspopup="dialog"
              className={`flex items-center gap-1 rounded-lg py-1 px-1 transition hover:opacity-80 ${HIT_AREA}`}
            >
              <div className="flex -space-x-1 items-center">
                {/* O top REAL do post (até 3, do mais usado). Sem summary, o tripé padrão. */}
                {(reactionSummary
                  ? topReactionTabs(reactionSummary)
                  : [
                      { type: "LIKE" as T, count: 0 },
                      { type: "LOVE" as T, count: 0 },
                      { type: "INSIGHTFUL" as T, count: 0 },
                    ]
                ).map(({ type }, index) => (
                  <span
                    key={type}
                    className={`grid h-4 w-4 place-items-center rounded-full text-[9px] text-white ring-1.5 ring-surface-card shadow-sm select-none ${
                      PILL_BACKGROUNDS[index % PILL_BACKGROUNDS.length]
                    }`}
                  >
                    {emojis[type] ?? type}
                  </span>
                ))}
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            title={saved ? messages.unsave : messages.save}
            aria-label={saved ? messages.unsave : messages.save}
            aria-pressed={saved}
            className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${HIT_AREA} ${
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="post-action-bookmark h-4 w-4" data-saved={saved} />

            {savesCount > 0 && <span className="text-xs tabular-nums">{savesCount}</span>}
          </button>
        </div>
      </footer>

      {dialogs}
    </>
  );
}
