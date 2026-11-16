import { BadgeCheck, ShieldAlert } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RecruitmentDetailDialogProps } from "../../types/domain/jobs/recruitment-detail-dialog-props.js";
import { Badge } from "../../ui/badge.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";

/**
 * The candidate file, in a dialog: the profile snapshot the application was made with, the
 * application message, the form answers and the explainable score. Interview and rejection
 * actions come from the app as `children` — this component does not fetch or route.
 */
export function RecruitmentDetailDialog({
  open,
  onOpenChange,
  detail,
  children,
}: RecruitmentDetailDialogProps) {
  const messages = useMessages().recruitment;

  if (!detail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{detail.name}</DialogTitle>

          <DialogDescription>{messages.fileTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{detail.statusLabel}</Badge>
            {detail.identityVerified ? (
              <Badge variant="secondary" className="gap-1">
                <BadgeCheck aria-hidden className="h-3 w-3" />
                {messages.identityVerified}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <ShieldAlert aria-hidden className="h-3 w-3" />
                {messages.identityUnverified}
              </Badge>
            )}
            <Badge variant="secondary">{messages.reputation(detail.reputation)}</Badge>
          </div>

          {detail.headline && <p className="text-sm text-muted-foreground">{detail.headline}</p>}

          <p className="text-xs text-muted-foreground">
            {messages.experience(detail.experienceYears, detail.experiencesCount)}
            {detail.location ? ` · ${detail.location}` : ""}
          </p>

          {detail.skills.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{messages.skillsLabel}</p>

              <p className="text-sm text-text-strong">{detail.skills.join(", ")}</p>
            </div>
          )}

          {detail.score && detail.score.available && (
            <div className="space-y-1 rounded-xl border border-border-soft p-3">
              <p className="text-xs font-semibold text-text-strong">
                {messages.scoreBreakdownTitle}
              </p>

              <ul className="space-y-1">
                {detail.score.components.map((component) => (
                  <li key={component.code} className="text-xs text-muted-foreground">
                    {messages.scorePart(component.label, component.points, component.maxPoints)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.message && (
            <div className="space-y-1 rounded-xl bg-muted/50 px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">{messages.messageLabel}</p>

              <p className="whitespace-pre-wrap break-words text-sm text-text-strong">
                {detail.message}
              </p>
            </div>
          )}

          {detail.answers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{messages.answersLabel}</p>

              <dl className="space-y-1">
                {detail.answers.map((answer) => (
                  <div key={answer.label} className="text-sm">
                    <dt className="font-medium text-text-strong">{answer.label}</dt>

                    <dd className="break-words text-muted-foreground">{answer.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
