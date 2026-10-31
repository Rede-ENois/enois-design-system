import { Bookmark, Gamepad2, Newspaper, Pencil, Share2, Sparkles } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GameDetailProps } from "../../types/domain/games/game-detail-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";

import { GameBanner } from "./game-banner.js";
import { GameIcon } from "./game-icon.js";

/**
 * A página do jogo: cabeçalho, player, pedidos do jogo (gasto e conquista), ficha, avaliações,
 * comentários e novidades. O jogo só PEDE identidade, gasto e compartilhamento; gasto e publicação
 * acontecem com o clique da pessoa.
 */
export function GameDetail({
  notFound,
  game,
  username,
  gamesHref,
  developerHref,
  owned,
  favorited,
  favoriteDisabled,
  onToggleFavorite,
  onShare,
  onEdit,
  onNewUpdate,
  renderBannerFrame,
  accountChanged,
  player,
  spend,
  spendPending,
  onSpendDismiss,
  onSpendConfirm,
  achievement,
  achievementPending,
  onAchievementDismiss,
  onAchievementPublish,
  reviews,
  comments,
  updates,
  dialogs,
}: GameDetailProps) {
  const t = useMessages().gameDetail;

  if (notFound) {
    return (
      <div className="surface-card mx-auto max-w-2xl p-8 text-center">
        <Gamepad2 className="mx-auto h-10 w-10 text-primary" />

        <p className="mt-3 text-sm font-medium text-text-strong">{t.notFound}</p>

        <AppLink
          href={gamesHref}
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          {t.gamesTitle}
        </AppLink>
      </div>
    );
  }

  if (!game) {
    return <p className="py-10 text-center text-sm text-text-subtle">{t.loading}</p>;
  }

  const g = game;
  const playable = g.status === "PUBLISHED";
  const gallery = [g.cover, ...g.mediaIds].filter(Boolean) as string[];

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-5">
        <p className="text-sm text-text-subtle">
          <AppLink href={gamesHref} className="hover:underline">
            {t.gamesTitle}
          </AppLink>
          {" / "}
          <AppLink href={developerHref} className="hover:underline">
            {username}
          </AppLink>
        </p>

        <GameBanner
          banner={g.banner}
          bannerHtml={g.bannerHtml}
          title={g.title}
          renderHtmlFrame={renderBannerFrame}
        />

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <GameIcon icon={g.icon} cover={g.cover} url={g.url} className="h-14 w-14" />

            <div className="min-w-0">
              <h1 className="min-w-0 break-words text-2xl font-semibold tracking-tight text-text-strong">
                {g.title}
              </h1>

              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-subtle">
                <AppLink href={developerHref} className="font-medium text-primary hover:underline">
                  {g.username ?? username}
                </AppLink>

                <span className="rounded-full border border-border-soft px-2 py-0.5 text-xs">
                  {t.stages[g.stage] ?? g.stage}
                </span>

                <span className="rounded-full border border-border-soft px-2 py-0.5 text-xs">
                  {g.distribution === "PAID" ? t.priceSoon(g.priceCoins) : t.free}
                </span>

                {g.version && <span className="text-xs">{t.version(g.version)}</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {owned && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5"
                  onClick={onEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />

                  <>{t.edit}</>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5"
                  onClick={onNewUpdate}
                >
                  <Newspaper className="h-3.5 w-3.5" />

                  <>{t.newUpdate}</>
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              className={cn("rounded-full gap-1.5", favorited && "text-primary")}
              disabled={favoriteDisabled}
              onClick={onToggleFavorite}
            >
              <Bookmark className="h-3.5 w-3.5" />

              <>{favorited ? t.unfavorite : t.favorite}</>
            </Button>

            <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={onShare}>
              <Share2 className="h-3.5 w-3.5" />

              <>{t.share}</>
            </Button>
          </div>
        </header>

        {!playable && (
          <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {g.status === "SUSPENDED" ? t.suspended : t.notPublished}
          </p>
        )}

        {accountChanged && (
          <p
            role="status"
            className="rounded-xl bg-primary-soft px-4 py-2 text-sm text-text-strong"
          >
            {t.accountChanged}
          </p>
        )}

        {player}

        <Dialog
          open={spend !== null}
          onOpenChange={(open) => {
            if (!open && !spendPending) onSpendDismiss();
          }}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t.spend.title}</DialogTitle>

              <DialogDescription>{t.spend.notice}</DialogDescription>
            </DialogHeader>

            {spend && (
              <p className="text-sm text-text-strong">
                <span className="font-semibold">{t.spend.amount(spend.amountLabel)}</span>
                {spend.motivo ? ` · ${spend.motivo}` : ""}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={spendPending}
                onClick={onSpendDismiss}
              >
                {t.spend.refuse}
              </Button>

              <Button className="rounded-full" disabled={spendPending} onClick={onSpendConfirm}>
                {spendPending ? t.spend.confirming : t.spend.confirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={achievement !== null}
          onOpenChange={(open) => {
            if (!open && !achievementPending) onAchievementDismiss();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />

                <>{t.achievement.title}</>
              </DialogTitle>

              <DialogDescription>{t.achievement.notice(g.title)}</DialogDescription>
            </DialogHeader>

            {achievement && (
              <>
                <p className="whitespace-pre-line rounded-xl bg-surface-2 p-3 text-sm text-text-strong">
                  {achievement.texto}
                </p>

                {achievement.imagem && (
                  <img
                    src={achievement.imagem}
                    alt={t.achievement.imageAlt}
                    className="max-h-48 w-full rounded-xl border border-border-soft object-contain"
                  />
                )}
              </>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={achievementPending}
                onClick={onAchievementDismiss}
              >
                {t.achievement.cancel}
              </Button>

              <Button
                className="rounded-full"
                disabled={achievementPending}
                onClick={onAchievementPublish}
              >
                {achievementPending ? t.achievement.publishing : t.achievement.publish}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.slice(1, 6).map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="h-24 w-40 shrink-0 rounded-xl border border-border-soft object-cover"
              />
            ))}
          </div>
        )}

        <section className="surface-card space-y-3 p-4 sm:p-5">
          <h2 className="text-base font-medium">{t.about}</h2>

          <p className="whitespace-pre-line text-sm font-normal text-muted-foreground">
            {g.description}
          </p>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {g.genres.length > 0 && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  {t.genres}
                </dt>

                <dd className="text-text-strong">{g.genres.join(", ")}</dd>
              </div>
            )}

            {g.languages.length > 0 && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  {t.languages}
                </dt>

                <dd className="text-text-strong">{g.languages.join(", ")}</dd>
              </div>
            )}

            {g.controls && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  {t.controls}
                </dt>

                <dd className="text-text-strong">{g.controls}</dd>
              </div>
            )}

            {g.requirements && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  {t.requirements}
                </dt>

                <dd className="text-text-strong">{g.requirements}</dd>
              </div>
            )}

            {g.contentWarnings && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                  {t.warnings}
                </dt>

                <dd className="text-text-strong">{g.contentWarnings}</dd>
              </div>
            )}
          </dl>
        </section>

        {reviews}
        {comments}

        <section className="surface-card space-y-3 p-4 sm:p-5">
          <h2 className="text-base font-medium">{t.updates}</h2>

          {updates.length === 0 ? (
            <p className="text-sm font-normal text-text-subtle">{t.noUpdates}</p>
          ) : (
            <ul className="space-y-3">
              {updates.map((update) => (
                <li key={update.id} className="border-l-2 border-border-soft pl-3">
                  <p className="text-sm font-medium text-text-strong">
                    {update.title}
                    {update.version && (
                      <span className="ml-2 text-xs font-normal text-text-subtle">
                        {t.version(update.version)}
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-text-subtle">{update.dateLabel}</p>

                  {update.body && (
                    <p className="mt-1 whitespace-pre-line text-sm font-normal text-muted-foreground">
                      {update.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {dialogs}
    </>
  );
}
