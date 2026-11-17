import { useState } from "react";

import { Loader2, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ColagemPhotoDialogProps } from "../../types/domain/colagem/colagem-photo-dialog-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";
import { ReactionPicker } from "../post/reactions/reaction-picker.js";
import { ReactionsSummary } from "../post/reactions/reactions-summary.js";

import { ColagemComments } from "./colagem-comments.js";

/**
 * O detalhe da foto: a imagem (sensível nasce velada), o autor, as reações de uma por pessoa e
 * as contribuições. Remover a própria foto pede confirmação; falhar deixa o diálogo aberto com
 * o aviso na tela para a pessoa tentar de novo.
 */
export function ColagemPhotoDialog({
  open,
  onOpenChange,
  photo,
  photoState,
  comments,
  commentsState,
  emojis,
  reactionPending,
  onToggleReaction,
  onComment,
  onRemoveComment,
  onRemovePhoto,
  commentAttachment,
  onCommentFiles,
  onRemoveCommentAttachment,
}: ColagemPhotoDialogProps) {
  const messages = useMessages().colagemDialog;
  const [confirmando, setConfirmando] = useState(false);
  const [erroRemocao, setErroRemocao] = useState(false);

  const remover = async () => {
    setConfirmando(false);
    setErroRemocao(false);
    try {
      await onRemovePhoto();
    } catch {
      setErroRemocao(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>

          <DialogDescription className="sr-only">{messages.title}</DialogDescription>
        </DialogHeader>

        {photoState.kind === "loading" && (
          <p className="flex items-center justify-center gap-2 py-10 text-sm text-text-subtle">
            <Loader2 className="h-4 w-4 animate-spin" /> {messages.loading}
          </p>
        )}

        {photoState.kind === "error" && (
          <p className="py-10 text-center text-sm text-text-subtle">{messages.missingPhoto}</p>
        )}

        {photo && (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2" aria-label={messages.author}>
              <UserAvatar
                src={photo.authorAvatar}
                frame={photo.authorAvatarFrame}
                alt={photo.authorName}
                className="h-8 w-8 shrink-0"
              />
              <StyledName
                name={photo.authorName ?? ""}
                style={photo.authorStyle}
                className="text-sm"
              />
            </div>

            <ColagemPhotoFigure
              mediaUrl={photo.mediaUrl}
              description={photo.description}
              spoiler={photo.mediaSpoiler}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ReactionsSummary
                  summary={photo.reactionSummary}
                  emojis={emojis}
                  activeType={photo.myReaction}
                  clickable
                  disabled={reactionPending}
                  onToggle={onToggleReaction}
                />

                <ReactionPicker
                  emojis={emojis}
                  activeType={photo.myReaction}
                  onReact={onToggleReaction}
                  buttonClassName="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-text-subtle transition hover:text-text-strong"
                  buttonTitle={messages.react}
                >
                  <span>❤ {photo.reactions > 0 ? photo.reactions : ""}</span>
                </ReactionPicker>
              </div>
              {photo.isOwner && (
                <Button variant="ghost" size="sm" onClick={() => setConfirmando(true)}>
                  <Trash2 className="h-4 w-4" /> {messages.removePhoto}
                </Button>
              )}
            </div>

            {erroRemocao && (
              <p role="alert" className="text-xs text-text-subtle">
                {messages.removeError}
              </p>
            )}

            <ColagemComments
              photo={photo}
              comments={comments}
              state={commentsState}
              attachment={commentAttachment}
              onFiles={onCommentFiles}
              onRemoveAttachment={onRemoveCommentAttachment}
              onComment={onComment}
              onRemoveComment={onRemoveComment}
            />
          </div>
        )}

        <ConfirmDialog
          open={confirmando}
          onOpenChange={setConfirmando}
          title={messages.removeConfirmTitle}
          description={messages.removeConfirmBody}
          confirmLabel={messages.removePhoto}
          destructive
          onConfirm={() => void remover()}
        />
      </DialogContent>
    </Dialog>
  );
}

/** A foto do detalhe: sensível nasce velada e a pessoa decide revelar; a legenda acompanha. */
function ColagemPhotoFigure({
  mediaUrl,
  description,
  spoiler,
}: {
  mediaUrl: string;
  description: string | null;
  spoiler: boolean;
}) {
  const grid = useMessages().colagemGrid;
  const [revelada, setRevelada] = useState(!spoiler);

  return (
    <figure className="space-y-2">
      {revelada ? (
        <img
          src={mediaUrl}
          alt={description ?? grid.openPhoto}
          className="max-h-[55vh] w-full rounded-xl object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => setRevelada(true)}
          className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-black/5"
        >
          <img src={mediaUrl} alt="" className="h-full w-full object-cover blur-xl" />

          <span className="absolute text-sm font-medium">{grid.revealPhoto}</span>
        </button>
      )}
      {description && <figcaption className="text-sm text-text-strong">{description}</figcaption>}
    </figure>
  );
}
