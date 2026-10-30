import { useId, useState } from "react";

import { Loader2, Send } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { MicroProjectProposalDialogProps } from "../../types/domain/companies/micro-project-proposal-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";
import { ProfessionalSignature } from "../jobs/professional-signature.js";

const MIN = 20;
const MAX = 2000;

/**
 * A proposal to a microproject: one message, signed by the professional identity. It opens the
 * professional conversation with the company, where the details get settled.
 */
export function MicroProjectProposalDialog({
  open,
  onOpenChange,
  projectTitle,
  applicant,
  pending,
  error,
  onSubmit,
}: MicroProjectProposalDialogProps) {
  const copy = useMessages().microProjectProposalDialog;
  const [message, setMessage] = useState("");
  const [tried, setTried] = useState(false);
  const fieldId = useId();
  const missing = Math.max(0, MIN - message.trim().length);
  const invalid = tried && missing > 0;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setMessage("");
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>

          <DialogDescription>{copy.hint}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="min-w-0 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (missing === 0) onSubmit(message.trim());
          }}
        >
          <p className="break-words rounded-xl bg-surface-1 px-4 py-3 text-sm font-medium text-text-strong">
            {projectTitle}
          </p>

          <ProfessionalSignature identity={applicant} setupHref={null} />

          <div className="space-y-2">
            <Label htmlFor={fieldId}>{copy.label}</Label>

            <Textarea
              id={fieldId}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={copy.placeholder}
              rows={6}
              maxLength={MAX}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? `${fieldId}-error` : undefined}
            />

            {invalid && (
              <p id={`${fieldId}-error`} className="text-xs text-destructive">
                {copy.tooShort(missing)}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={pending}
              onClick={() => handleOpenChange(false)}
            >
              {copy.cancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
              {pending ? copy.sending : copy.send}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
