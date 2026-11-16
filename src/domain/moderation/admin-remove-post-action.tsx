import { useState } from "react";

import { Trash2 } from "lucide-react";

import type { AdminRemovePostActionProps } from "../../types/domain/moderation/admin-remove-post-action-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";

/**
 * Administrative removal of ONE post, by id, without a report or a vote.
 *
 * Same pattern as the moderation panel: the reason (10+ characters) is required inside the dialog,
 * the confirmation is an explicit button and the container reports what really happened (removed,
 * already offline or not found) — the view never claims success by itself.
 */
export function AdminRemovePostAction({
  onRemove,
  pending = false,
  label,
  title,
  description,
  confirmLabel,
  cancelLabel,
  reasonPlaceholder,
  reasonTooShort,
  error = null,
}: AdminRemovePostActionProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const clean = reason.trim();
  const tooShort = clean.length > 0 && clean.length < 10;

  const remove = async () => {
    const ok = await onRemove(clean);
    setOpen(false);
    if (ok) setReason("");
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-auto rounded-full gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />

        <>{label}</>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setReason("");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={reasonPlaceholder}
              maxLength={2000}
              aria-label={reasonPlaceholder}
            />

            {tooShort && <p className="text-xs text-text-subtle">{reasonTooShort}</p>}

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setReason("");
              }}
            >
              <>{cancelLabel}</>
            </Button>

            <Button
              variant="destructive"
              className="rounded-full"
              disabled={pending || clean.length < 10}
              onClick={() => void remove()}
            >
              <>{confirmLabel}</>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
