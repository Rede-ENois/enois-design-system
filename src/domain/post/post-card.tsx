import { BookOpen, CircleCheck, Clock, FileText, Pin, PinOff, Repeat2 } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { inlineMediaIds } from "../../lib/rich-text/inline-media.js";
import { hideExternalPageUrls } from "../../lib/shared-links.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PostCardProps } from "../../types/domain/post/post-card-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Badge } from "../../ui/badge.js";

import { AuthorInfo } from "./author-info.js";
import { LinkPreviews } from "./media/link-previews.js";
import { SpoilerMedia } from "./media/spoiler-media.js";
import { PostOwnerMenu } from "./post-owner-menu.js";
import { postSeal } from "./post-seals.js";
import { POST_TYPE_META } from "./post-type-meta.js";

/**
 * Posts acima disso entram compactados na LISTA: o corte é por linhas (8) e o "Ler mais" abre o
 * post inteiro. Na página do post o card é o post (`fullPost`), então não corta nem mostra o link —
 * era o furo: o "Ler mais" levava para a página em que a pessoa já estava e o texto seguia cortado.
 */
const POST_COMPACT_THRESHOLD = 400;

/**
 * The post card: author, badges, seals, text, media, page, reactions, tags and the actions row.
 * Data-coupled pieces (rich text with inline media, media grid, actions, comments, owner dialogs)
 * come from the app as render props and slots.
 */
export function PostCard({
  post,
  hrefs,
  timeLabel,
  editedTimeLabel,
  topicLabel,
  anchored = false,
  fullPost = false,
  pinned = false,
  onTogglePin,
  pinPending = false,
  isOwner,
  onEdit,
  onDelete,
  seals,
  mySeals,
  onShowSeals,
  onFollowCommunity,
  followPending,
  onOpenPost,
  autoplayLinks = false,
  pageHtml,
  pageLoading = false,
  mediaSpoiler = false,
  page,
  reactionsSummary,
  notes,
  actions,
  ownerDialogs,
  comments,
  renderRichText,
  renderMediaGrid,
  renderAuthorTrigger,
}: PostCardProps) {
  const messages = useMessages().postCard;
  const sealLabels = useMessages().postSeals;
  const { isOwnMediaUrl } = useAdapters();
  const metaType = POST_TYPE_META[post.type] ? post.type : "INSIGHT";
  const meta = POST_TYPE_META[metaType];
  // Só corta em lista: na página do post o texto inteiro é o conteúdo da página.
  const isCompact = !fullPost && post.content.length > POST_COMPACT_THRESHOLD;
  const visibleContent = hideExternalPageUrls(post.content, isOwnMediaUrl);

  return (
    <article
      id={anchored ? `feed-post-${post.id}` : undefined}
      tabIndex={anchored ? -1 : undefined}
      className={`min-w-0 border border-border-soft bg-surface-card p-4 transition sm:p-5 ${
        // Post de página: sem canto no card, porque o conteúdo tem de alcançar as bordas — o
        // arredondamento do card recortava os cantos da página e era o que sobrava de "rounding".
        post.pageHtml ? "rounded-none" : "overflow-hidden rounded-2xl"
      } ${
        // Na lista, o navegador pula layout e pintura dos cards fora da tela; `auto` no tamanho
        // guarda a altura real depois da primeira vez, para a barra de rolagem não pular. Fica de
        // fora o post de página (o iframe dele mede a própria altura) e a página do post.
        !fullPost && post.type !== "PAGE"
          ? "[contain-intrinsic-size:auto_360px] [content-visibility:auto]"
          : ""
      }`}
    >
      {post.repostOf && hrefs.repostOf && (
        <AppLink
          href={hrefs.repostOf}
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-text-subtle transition hover:text-primary"
        >
          <Repeat2 className="h-3.5 w-3.5" />

          <>
            {post.repostWithOpinion
              ? messages.repostedWithOpinion
              : messages.repostedFrom(post.repostOfAuthor)}
          </>
        </AppLink>
      )}

      <header className="flex flex-wrap items-start justify-between gap-3">
        <AuthorInfo
          authorName={post.authorName}
          authorStyle={post.authorStyle}
          authorContributor={post.authorContributor}
          authorBadge={post.authorBadge}
          authorBadges={post.authorBadges}
          authorAvatar={post.authorAvatar}
          authorAvatarFrame={post.authorAvatarFrame}
          authorHref={hrefs.author}
          renderAuthorTrigger={renderAuthorTrigger}
          timeLabel={timeLabel}
          community={
            post.community && hrefs.community
              ? { name: post.community.name, joined: post.community.joined, href: hrefs.community }
              : null
          }
          fallbackClassName={meta.classAvatar}
          onFollowCommunity={onFollowCommunity}
          followPending={followPending}
        />

        <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">
          {pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              <Pin className="h-3 w-3" aria-hidden />

              <>{messages.pinned}</>
            </span>
          )}

          {onTogglePin && (
            <button
              type="button"
              onClick={onTogglePin}
              disabled={pinPending}
              title={pinned ? messages.unpin : messages.pin}
              aria-label={pinned ? messages.unpin : messages.pin}
              className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-primary disabled:opacity-50"
            >
              {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
          >
            {messages.types[metaType]}
          </span>

          {post.type === "QUESTION" &&
            (post.resolved ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-growth/10 px-2.5 py-1 text-xs font-medium text-growth">
                <CircleCheck className="h-3 w-3" aria-hidden />
                {messages.questionResolved}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-border-soft px-2.5 py-1 text-xs font-medium text-text-subtle">
                {messages.questionOpen}
              </span>
            ))}

          {/* O assunto (categoria) do post fica ao lado do tipo, quando o autor classificou. */}
          {topicLabel && (
            <span
              className="inline-flex items-center rounded-full border border-border-soft px-2.5 py-1 text-xs font-medium text-text-subtle"
              title={messages.topic}
            >
              {topicLabel}
            </span>
          )}

          {post.type === "MOMENT" && post.expiresAt && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-2 py-1 text-xs font-normal text-amber-600 dark:text-amber-400"
              title={messages.momentExpiryTitle}
            >
              <Clock className="h-3 w-3" />
              {messages.momentExpiry(remainingHours(post.expiresAt))}
            </span>
          )}

          {isOwner && onEdit && onDelete && <PostOwnerMenu onEdit={onEdit} onDelete={onDelete} />}
        </div>
      </header>

      {/* Selos da comunidade: ficam no topo, acima do conteudo — e os que a pessoa marcou ficam em
          destaque (anel). Cada selo é um botão: abre a lista de quem marcou, como a contagem de
          reações abre a de quem reagiu. A contagem aparece sempre (é a resposta de "quantos"). */}
      {seals && seals.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {seals.map((item) => {
            const seal = postSeal(item.seal);
            if (!seal) return null;
            const label = sealLabels[seal.labelKey];
            return (
              <button
                key={item.seal}
                type="button"
                onClick={onShowSeals}
                title={`${label} · ${messages.sealSeeWho}`}
                aria-label={`${label} · ${messages.sealSeeWho}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition hover:border-primary/50",
                  seal.className,
                  mySeals.includes(item.seal) && "ring-1 ring-primary/60",
                )}
              >
                <seal.icon className="h-3 w-3" aria-hidden />

                <>{label}</>

                <span className="tabular-nums opacity-70">{item.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Post de pagina pode nao ter texto nenhum: sem paragrafo, so a pagina logo abaixo.
          Na lista, texto acima de 400 caracteres entra cortado em 8 linhas com o "Ler mais" que
          abre o post; na propria pagina do post (`fullPost`) nada e cortado — o texto completo mora
          la. Artigo fica so cortado na lista: o bloco abaixo dele ja e o convite para abrir. */}
      {visibleContent !== "" && (
        <>
          {renderRichText({
            content: visibleContent,
            mediaIds: post.mediaIds,
            mediaSpoiler,
            className: cn(
              "mt-4 whitespace-pre-line break-words text-base font-normal leading-relaxed text-text-strong",
              isCompact && "line-clamp-8",
            ),
          })}

          {isCompact && post.type !== "ARTICLE" && (
            <AppLink
              href={hrefs.post}
              onClick={onOpenPost}
              className="mt-1 inline-flex text-sm font-normal text-primary hover:underline"
            >
              <>{messages.readMore}</>
            </AppLink>
          )}
        </>
      )}

      {/* Repost COM opinião: o texto acima é o comentário; aqui vai o post original citado. */}
      {post.repostWithOpinion && post.repostOf && hrefs.repostOf && (
        <div className="mt-3 rounded-xl border border-border-soft bg-surface-1 p-3">
          <AppLink
            href={hrefs.repostOf}
            className="inline-flex items-center gap-1.5 text-xs text-text-subtle transition hover:text-primary"
          >
            <Repeat2 className="h-3.5 w-3.5" />

            <>{messages.quotedFrom(post.repostOfAuthor)}</>
          </AppLink>

          {post.repostOfContent && (
            <p className="mt-2 line-clamp-6 whitespace-pre-line break-words text-sm text-text-strong">
              {post.repostOfContent}
            </p>
          )}

          {post.repostOfMediaIds && post.repostOfMediaIds.length > 0 && (
            <div className="mt-2">
              {renderMediaGrid({ mediaIds: post.repostOfMediaIds, compact: true, mediaSpoiler })}
            </div>
          )}

          <AppLink
            href={hrefs.repostOf}
            className="mt-2 inline-flex text-xs text-primary hover:underline"
          >
            {messages.viewOriginal}
          </AppLink>
        </div>
      )}

      {/* Blog: o post-ponteiro so aponta para o cantinho — o conteudo mora la, nao no feed. */}
      {post.type === "BLOG" && hrefs.blog && (
        <AppLink
          href={hrefs.blog}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-normal text-primary hover:underline"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />

          <>{messages.readBlog}</>
        </AppLink>
      )}

      {/* Artigo tem corpo (completo) na pagina do post; o card mostra o resumo e o convite. */}
      {post.type === "ARTICLE" && (
        <AppLink
          href={hrefs.post}
          onClick={onOpenPost}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-normal text-primary hover:underline"
        >
          <FileText className="h-3.5 w-3.5" />

          <>{messages.readArticle}</>
        </AppLink>
      )}

      {post.editedAt && (
        <p className="mt-1 text-xs font-normal text-text-subtle">
          {messages.edited} {messages.editedTime(editedTimeLabel ?? "")}
        </p>
      )}

      {post.mediaIds.length > 0 && (
        <div className="mt-4">
          {/* Mídia inserida no texto aparece NO TEXTO (item 9); a grade do fim é só o que
              sobrou sem marcador — repetir a mesma mídia duas vezes seria estranho. */}
          {renderMediaGrid({
            mediaIds: post.mediaIds.filter((id) => !inlineMediaIds(post.content).includes(id)),
            mediaSpoiler,
          })}
        </div>
      )}

      {pageHtml ? (
        <SpoilerMedia active={mediaSpoiler} label={messages.mediaSpoilerReveal}>
          {() => page}
        </SpoilerMedia>
      ) : pageLoading ? (
        <p className="mt-4 rounded-xl border border-dashed border-border-soft px-3 py-6 text-center text-xs font-normal text-text-subtle">
          {messages.pageLoading}
        </p>
      ) : null}

      {reactionsSummary}
      <LinkPreviews content={post.content} autoplay={autoplayLinks} />

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="rounded-full border border-border-soft bg-transparent font-normal text-text-subtle"
            >
              {messages.tag(t)}
            </Badge>
          ))}
        </div>
      )}

      {notes}

      {actions}

      {isOwner && ownerDialogs}

      {comments}
    </article>
  );
}

/** Quantas horas faltam para o Momento se apagar (arredonda para cima; mínimo 1). */
function remainingHours(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(1, Math.ceil(diff / 3_600_000));
}
