import { useState } from "react";

import { Settings, ShieldAlert, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { AdminEntityActionsSectionProps } from "../../types/domain/moderation/admin-entity-actions-section-props.js";
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
 * Administrative block of a community or a group: delete it and, for groups, the lighter "close"
 * that keeps the history. Same pattern as AdminRemovePostAction: the mandatory reason lives INSIDE
 * the confirmation dialog, so the destructive button never fires without both the entity name and
 * the justification on screen. The container reports the real outcome; the view claims nothing.
 */
export function AdminEntityActionsSection({
  kind,
  entityName,
  description,
  deleting = false,
  closing = false,
  onDelete,
  onClose,
  error = null,
}: AdminEntityActionsSectionProps) {
  const messages = useMessages().adminEntityActionsSection;
  const [action, setAction] = useState<"DELETE" | "CLOSE" | null>(null);
  const [reason, setReason] = useState("");

  const clean = reason.trim();
  const pending = deleting || closing;
  const tooShort = clean.length > 0 && clean.length < 10;

  const closeDialog = () => {
    setAction(null);
    setReason("");
  };

  const confirm = async () => {
    const current = action;
    if (!current || clean.length < 10) return;
    const ok = current === "DELETE" ? await onDelete(clean) : await onClose?.(clean);
    if (ok) closeDialog();
  };

  return (
    <section className="space-y-3" aria-label={messages.title}>
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-primary" />

        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
          {messages.title}
        </h2>
      </div>

      <div className="surface-card space-y-3 p-4">
        <p className="text-sm text-text-subtle">{description}</p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="w-auto rounded-full gap-1.5"
            disabled={pending}
            onClick={() => setAction("DELETE")}
          >
            <Trash2 className="h-3.5 w-3.5" />

            <>{kind === "group" ? messages.deleteGroup : messages.deleteCommunity}</>
          </Button>

          {onClose && (
            <Button
              variant="outline"
              size="sm"
              className="w-auto rounded-full gap-1.5"
              disabled={pending}
              onClick={() => setAction("CLOSE")}
            >
              <ShieldAlert className="h-3.5 w-3.5" />

              <>{messages.closeGroup}</>
            </Button>
          )}
        </div>

        <p className="text-xs text-text-subtle">
          {kind === "group" ? messages.deleteGroupHint : messages.deleteCommunityHint}
        </p>
      </div>

      <Dialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === "CLOSE" ? messages.closeConfirmTitle : messages.deleteConfirmTitle}
            </DialogTitle>

            <DialogDescription>
              {action === "CLOSE"
                ? messages.closeConfirmBody(entityName)
                : messages.deleteConfirmBody(entityName)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={messages.reasonPlaceholder}
              maxLength={2000}
              aria-label={messages.reasonPlaceholder}
            />

            {tooShort && <p className="text-xs text-text-subtle">{messages.reasonTooShort}</p>}

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={pending}
              onClick={closeDialog}
            >
              <>{messages.cancel}</>
            </Button>

            <Button
              variant={action === "CLOSE" ? "default" : "destructive"}
              className="rounded-full"
              disabled={pending || clean.length < 10}
              onClick={() => void confirm()}
            >
              <>{action === "CLOSE" ? messages.closeConfirm : messages.deleteConfirm}</>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
