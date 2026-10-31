import { useMessages } from "../../messages/messages-context.js";
import type { WhatsNewDialogProps } from "../../types/domain/whats-new/whats-new-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";

/**
 * "O que há de novo" shown once per release. Fully controlled: the app decides when a release is
 * unseen and what it contains; this only draws. Calm on purpose: a numbered list, no motion beyond
 * the dialog's own fade, one button.
 */
export function WhatsNewDialog({ open, onOpenChange, items }: WhatsNewDialogProps) {
  const messages = useMessages().whatsNewDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <p className="text-xs font-medium text-primary">{messages.eyebrow}</p>

          <DialogTitle className="text-xl text-text-strong text-balance">
            {messages.title}
          </DialogTitle>

          <DialogDescription className="text-text-subtle">{messages.description}</DialogDescription>
        </DialogHeader>

        <ol className="space-y-4">
          {items.map((item, index) => (
            <li key={item.id} className="flex gap-3">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-medium tabular-nums text-text-subtle"
              >
                {index + 1}
              </span>

              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold text-text-strong">{item.title}</p>

                <p className="text-sm text-text-subtle">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <DialogFooter>
          <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            {messages.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
