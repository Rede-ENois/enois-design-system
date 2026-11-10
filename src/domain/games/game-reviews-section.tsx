import { useEffect, useState } from "react";

import { Star } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { GameReviewsSectionProps } from "../../types/domain/games/game-reviews-section-props.js";
import type { GameStarsProps } from "../../types/domain/games/game-stars-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/** Nota em estrelas; `onPick` ausente = só leitura. */
function Stars({ value, onPick }: GameStarsProps) {
  const messages = useMessages().gameReviewsSection;

  return (
    <div className="flex items-center gap-0.5" aria-label={messages.starsLabel(value)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onPick}
          onClick={() => onPick?.(star)}
          className={onPick ? "cursor-pointer" : "cursor-default"}
          aria-label={messages.starLabel(star)}
          title={messages.starLabel(star)}
        >
          <Star
            className={`h-4 w-4 ${
              star <= value ? "fill-opportunity text-opportunity" : "text-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function GameReviewsSection({
  data,
  loading,
  viewerId,
  ownerId,
  savePending = false,
  removePending = false,
  onSave,
  onRemove,
}: GameReviewsSectionProps) {
  const messages = useMessages().gameReviewsSection;
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");

  const myReview = data?.items.find((review) => review.userId === viewerId);
  const isOwner = viewerId === ownerId;

  useEffect(() => {
    if (!myReview) return;
    setRating(myReview.rating);
    setBody(myReview.body ?? "");
    // Só quando a avaliação do usuário chega/muda; incluir o objeto inteiro resetaria o texto
    // enquanto a pessoa digita.
  }, [myReview?.id]);

  return (
    <section className="surface-card space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-medium">{messages.title}</h2>

        {data && data.count > 0 && (
          <span className="text-sm text-text-subtle">
            {messages.average(data.average, data.count)}
          </span>
        )}
      </div>

      {viewerId && !isOwner && (
        <div className="space-y-2 rounded-2xl border border-border-soft bg-surface-1 p-3">
          <p className="text-sm font-medium text-text-strong">{messages.your}</p>

          <Stars value={rating} onPick={setRating} />
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={2}
            maxLength={2000}
            placeholder={messages.body}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="rounded-full"
              disabled={rating === 0 || savePending}
              onClick={() => onSave(rating, body)}
            >
              {myReview ? messages.update : messages.submit}
            </Button>

            {myReview && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-destructive"
                disabled={removePending}
                onClick={() =>
                  void onRemove().then(
                    () => {
                      setRating(0);
                      setBody("");
                    },
                    () => {},
                  )
                }
              >
                {messages.remove}
              </Button>
            )}
          </div>
        </div>
      )}

      {isOwner && <p className="text-sm text-text-subtle">{messages.owner}</p>}

      {!viewerId && <p className="text-sm text-text-subtle">{messages.login}</p>}

      {loading ? (
        <p className="text-sm text-text-subtle">{messages.loading}</p>
      ) : (data?.items.length ?? 0) === 0 ? (
        <p className="text-sm text-text-subtle">{messages.empty}</p>
      ) : (
        <ul className="space-y-3">
          {data!.items.map((review) => (
            <li key={review.id} className="flex items-start gap-3 border-t border-border-soft pt-3">
              <UserAvatar
                src={review.avatar}
                alt={review.name ?? ""}
                className="h-8 w-8 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-text-strong">
                    {review.name ?? review.username ?? ""}
                  </span>

                  <Stars value={review.rating} />
                </div>

                {review.body && (
                  <p className="mt-1 whitespace-pre-line break-words text-sm text-text-subtle">
                    {review.body}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
