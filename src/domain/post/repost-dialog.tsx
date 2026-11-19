import { useEffect, useState } from "react";

import { Building2, MessageSquareText, Repeat2, Undo2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RepostDialogProps } from "../../types/domain/post/repost-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Select } from "../../ui/select.js";
import { Textarea } from "../../ui/textarea.js";

/** Limite combinado com o backend (`RepostPostService`). */
export const REPOST_OPINION_MAX = 600;

/**
 * Republicar em três portas (estilo Twitter/LinkedIn):
 * 1. Republicar direto — ponteiro pro original, sem post novo.
 * 2. Republicar com comentário — abre textarea, cria post novo do repostador.
 * 3. Republicar na comunidade — com comunidades do viewer (o chamador busca), manda
 *    `communityId` + comentário para o mural da comunidade escolhida.
 */
export function RepostDialog({
  postId,
  open,
  onOpenChange,
  pending = false,
  reposted = false,
  onRepost,
  onUndoRepost,
  communities,
  onRepostToCommunity,
}: RepostDialogProps) {
  const messages = useMessages().repostDialog;
  const [step, setStep] = useState<"choose" | "opinion" | "community">("choose");
  const [opinion, setOpinion] = useState("");
  const [communityId, setCommunityId] = useState("");

  const communityOptions = onRepostToCommunity ? (communities ?? []) : [];

  useEffect(() => {
    if (!open) {
      setStep("choose");
      setOpinion("");
      setCommunityId("");
    }
  }, [open]);

  const closeStep = (next: boolean) => {
    if (!next) {
      setStep("choose");
      setOpinion("");
      setCommunityId("");
    }
    onOpenChange(next);
  };

  const cleanOpinion = opinion.trim();

  return (
    <Dialog open={open} onOpenChange={closeStep}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <Repeat2 className="h-5 w-5 text-primary" />

            <>{messages.title}</>
          </DialogTitle>

          {step === "choose" && (
            <DialogDescription className="text-sm leading-relaxed text-text-subtle">
              {messages.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "choose" ? (
          <div className="flex flex-col gap-2 pt-1">
            {reposted && onUndoRepost ? (
              <button
                type="button"
                disabled={pending}
                onClick={onUndoRepost}
                className="flex items-center gap-3 rounded-xl border border-destructive/30 px-4 py-3 text-left transition hover:bg-destructive/5"
              >
                <Undo2 className="h-5 w-5 shrink-0 text-destructive" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-destructive">{messages.undo}</p>

                  <p className="text-xs text-text-subtle">{messages.undoHint}</p>
                </div>
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={() => onRepost(undefined)}
                className="flex items-center gap-3 rounded-xl border border-border-soft px-4 py-3 text-left transition hover:bg-surface-2"
              >
                <Repeat2 className="h-5 w-5 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-strong">{messages.plain}</p>

                  <p className="text-xs text-text-subtle">{messages.plainHint}</p>
                </div>
              </button>
            )}

            <button
              type="button"
              disabled={pending}
              onClick={() => setStep("opinion")}
              className="flex items-center gap-3 rounded-xl border border-border-soft px-4 py-3 text-left transition hover:bg-surface-2"
            >
              <MessageSquareText className="h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-text-strong">{messages.withOpinion}</p>

                <p className="text-xs text-text-subtle">{messages.withOpinionHint}</p>
              </div>
            </button>

            {communityOptions.length > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStep("community")}
                className="flex items-center gap-3 rounded-xl border border-border-soft px-4 py-3 text-left transition hover:bg-surface-2"
              >
                <Building2 className="h-5 w-5 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-strong">{messages.community}</p>

                  <p className="text-xs text-text-subtle">{messages.communityHint}</p>
                </div>
              </button>
            )}
          </div>
        ) : step === "community" ? (
          <div className="space-y-3 pt-1">
            <p className="text-sm text-text-subtle">
              {messages.communityPlaceholder(communityOptions.length)}
            </p>

            <Select
              aria-label={messages.communityPick}
              value={communityId}
              onChange={(event) => setCommunityId(event.target.value)}
            >
              <option value="" disabled>
                {messages.communityPick}
              </option>
              {communityOptions.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </Select>

            <Textarea
              id={`repost-community-opinion-${postId}`}
              value={opinion}
              onChange={(event) => setOpinion(event.target.value)}
              placeholder={messages.opinionPlaceholder}
              rows={4}
              maxLength={REPOST_OPINION_MAX}
            />

            <p className="text-right text-xs text-text-subtle">
              {messages.opinionCount(opinion.length)}
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setStep("choose");
                  setOpinion("");
                }}
              >
                {messages.back}
              </Button>

              <Button
                className="rounded-full"
                disabled={pending || !communityId || cleanOpinion.length === 0}
                onClick={() => onRepostToCommunity?.(communityId, cleanOpinion)}
              >
                {messages.publish}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <Textarea
              id={`repost-opinion-${postId}`}
              value={opinion}
              onChange={(event) => setOpinion(event.target.value)}
              placeholder={messages.opinionPlaceholder}
              rows={4}
              maxLength={REPOST_OPINION_MAX}
              autoFocus
            />

            <p className="text-right text-xs text-text-subtle">
              {messages.opinionCount(opinion.length)}
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => setStep("choose")}>
                {messages.back}
              </Button>

              <Button
                className="rounded-full"
                disabled={pending || cleanOpinion.length === 0}
                onClick={() => onRepost(cleanOpinion)}
              >
                {messages.publish}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
