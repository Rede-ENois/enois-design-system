import { useState } from "react";

import { OctagonAlert, Power } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PanicModeSectionProps } from "../../types/domain/moderation/panic-mode-section-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";

/**
 * Botão de pânico: bloqueia TODA escrita da aplicação com 429 enquanto estiver ativo. O próprio
 * botão (e o login) ficam fora do bloqueio, senão não haveria como desligar. O estado é
 * compartilhado entre os pods pelo backend.
 */
export function PanicModeSection({
  active,
  envLocked,
  loading,
  pending,
  onActivate,
  onDeactivate,
}: PanicModeSectionProps) {
  const messages = useMessages().panicModeSection;
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <section
      className={cn(
        "space-y-2 rounded-2xl border p-4",
        active ? "border-destructive/60 bg-destructive/10" : "border-border-soft bg-surface-card",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-base font-medium">
            <OctagonAlert className={cn("h-5 w-5", active ? "text-destructive" : "text-primary")} />

            <>{messages.title}</>
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {envLocked ? messages.envLocked : active ? messages.active : messages.description}
          </p>
        </div>

        <Button
          variant={active ? "outline" : "destructive"}
          className="w-auto rounded-full gap-2"
          disabled={pending || loading || envLocked}
          onClick={() => (active ? onDeactivate() : setConfirmOpen(true))}
        >
          <Power className="h-4 w-4" />

          <>{active ? messages.deactivate : messages.activate}</>
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={messages.confirmTitle}
        description={messages.confirmBody}
        confirmLabel={messages.activate}
        destructive
        pending={pending}
        onConfirm={() => {
          setConfirmOpen(false);
          onActivate();
        }}
      />
    </section>
  );
}
