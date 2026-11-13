import { useEffect, useId, useRef, useState } from "react";

import { CalendarPlus, FileUp, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { CalendarImportDialogProps } from "../../types/domain/calendar/calendar-import-dialog-props.js";
import type { CalendarImportResultData } from "../../types/domain/calendar/calendar-import-result-data.js";
import type { CalendarScope } from "../../types/domain/calendar/calendar-scope.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";

const SCOPES: (CalendarScope | null)[] = [null, "SOCIAL", "PROFESSIONAL"];
const DEFAULT_MAX_BYTES = 512 * 1024;

/**
 * Import of an `.ics` file (fase 8, D23). The reader picks the file, chooses the target agenda and
 * only then sees what entered — the counts are the point, because a file that created nothing is
 * not the same as one that created a hundred.
 *
 * The app owns the upload and the mutation; the dialog reports the chosen file and the scope, and
 * draws the result. The size ceiling is the server's, so a file that would be refused is refused
 * before the upload.
 */
export function CalendarImportDialog({
  open,
  onOpenChange,
  scope,
  onScopeChange,
  file,
  onFileChange,
  onImport,
  error = null,
  maxBytes = DEFAULT_MAX_BYTES,
}: CalendarImportDialogProps) {
  const calendar = useMessages().calendar;
  const messages = calendar.importDialog;
  const inputId = useId();
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [result, setResult] = useState<CalendarImportResultData | null>(null);

  const maxMb = Math.max(1, Math.round(maxBytes / (1024 * 1024)));
  const shownError = localError ?? error;

  const scopeLabel = (value: CalendarScope | null) =>
    value === null ? messages.scopeAll : calendar.scopes[value];

  // A new file or a reopened dialog starts a new import, not the previous result.
  const reset = () => {
    setResult(null);
    setLocalError(null);
  };

  const choose = (chosen: File | null) => {
    reset();
    if (!chosen) {
      onFileChange(null);
      return;
    }
    if (!/\.ics$/i.test(chosen.name)) {
      setLocalError(messages.wrongFormat);
      return;
    }
    if (chosen.size > maxBytes) {
      setLocalError(messages.tooLarge(maxMb));
      return;
    }
    onFileChange(chosen);
  };

  const run = async () => {
    setPending(true);
    setLocalError(null);
    try {
      const imported = await onImport();
      if (imported) setResult(imported);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus aria-hidden className="size-4" />
            {messages.title}
          </DialogTitle>

          <DialogDescription>{messages.description}</DialogDescription>
        </DialogHeader>

        {result ? (
          <ImportResult result={result} />
        ) : (
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor={inputId} className="text-sm font-medium text-text-strong">
                {messages.fileLabel}
              </label>

              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-soft bg-surface-2 px-3 py-3 text-sm text-text-subtle transition hover:text-text-strong"
              >
                <FileUp aria-hidden className="size-4 shrink-0" />

                <span className="min-w-0 truncate">
                  {file ? messages.chosenFile(file.name) : messages.chooseFile}
                </span>

                <input
                  id={inputId}
                  type="file"
                  accept=".ics,text/calendar"
                  className="sr-only"
                  onChange={(event) => {
                    const chosen = event.target.files?.[0] ?? null;
                    event.target.value = "";
                    choose(chosen);
                  }}
                />
              </label>

              {file ? (
                <button
                  type="button"
                  className="w-fit text-xs font-medium text-primary hover:underline"
                  onClick={() => choose(null)}
                >
                  {messages.clearFile}
                </button>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-sm font-medium text-text-strong">{messages.scopeLabel}</span>

              <PillRow label={messages.scopeLabel}>
                {SCOPES.map((value) => (
                  <Pill
                    key={value ?? "all"}
                    size="sm"
                    active={scope === value}
                    onClick={() => onScopeChange(value)}
                  >
                    {scopeLabel(value)}
                  </Pill>
                ))}
              </PillRow>
            </div>

            {shownError ? (
              <p role="alert" className="text-sm text-destructive">
                {shownError}
              </p>
            ) : null}
          </div>
        )}

        <DialogFooter className="gap-2">
          {result ? (
            <Button className="rounded-full" onClick={() => onOpenChange(false)}>
              {messages.done}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={pending}
                onClick={() => onOpenChange(false)}
              >
                {messages.cancel}
              </Button>

              <Button
                className="rounded-full"
                disabled={!file || pending}
                onClick={() => void run()}
              >
                {pending ? (
                  <>
                    <Loader2 aria-hidden className="size-3.5 animate-spin" />
                    {messages.importing}
                  </>
                ) : (
                  messages.import
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportResult({ result }: { result: CalendarImportResultData }) {
  const messages = useMessages().calendar.importDialog;
  const entered = result.created + result.moved + result.cancelled;
  const ref = useRef<HTMLDivElement>(null);

  // O botão Importar desmonta quando o resultado aparece: sem mover o foco, ele cai no
  // body e quem usa leitor de tela não fica sabendo o que entrou. O container recebe o
  // foco e é `role="status"`, então o anúncio sai junto com a troca de tela.
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface-2 p-3 focus-visible:outline-none"
    >
      <p className="text-sm font-medium text-text-strong">{messages.resultTitle}</p>

      {entered === 0 ? (
        <p className="text-sm text-text-subtle">{messages.resultEmpty}</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm text-text-subtle">
          <li>{messages.resultReceived(result.received)}</li>

          <li>{messages.resultCreated(result.created)}</li>
          {result.moved > 0 ? <li>{messages.resultMoved(result.moved)}</li> : null}
          {result.cancelled > 0 ? <li>{messages.resultCancelled(result.cancelled)}</li> : null}
          {result.skipped > 0 ? <li>{messages.resultSkipped(result.skipped)}</li> : null}
        </ul>
      )}
    </div>
  );
}
