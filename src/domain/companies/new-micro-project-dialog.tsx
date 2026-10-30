import { useState } from "react";

import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NewMicroProjectDialogProps } from "../../types/domain/companies/new-micro-project-dialog-props.js";
import { Button } from "../../ui/button.js";
import { DateTextInput } from "../../ui/date-text-input.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Textarea } from "../../ui/textarea.js";

import { FormField } from "./form-field.js";

/** The same ceilings the API and the columns accept. */
const LIMITS = { title: 200, text: 4000, budget: 160 } as const;

const EMPTY = { title: "", problem: "", scope: "", deliverables: "", acceptance: "", budget: "" };

const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/** Today as yyyy-mm-dd in the viewer's time zone (the deadline is a calendar day). */
function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Publishing a microproject: a real problem, a short paid pilot. Labelled fields with their rule
 * as a hint; errors show inline after the first try and clear as the person fixes them.
 */
export function NewMicroProjectDialog({
  open,
  onOpenChange,
  pending,
  error,
  onSubmit,
}: NewMicroProjectDialogProps) {
  const copy = useMessages().newMicroProjectDialog;
  const [form, setForm] = useState(EMPTY);
  const [deadline, setDeadline] = useState("");
  const [tried, setTried] = useState(false);
  const today = todayIso();

  const errors = {
    title: form.title.trim().length < 8 ? copy.titleTooShort : null,
    problem: form.problem.trim().length < 30 ? copy.problemTooShort : null,
    deliverables: lines(form.deliverables).length === 0 ? copy.required : null,
    acceptance: lines(form.acceptance).length === 0 ? copy.required : null,
    deadline: !deadline
      ? null
      : !/^\d{4}-\d{2}-\d{2}$/.test(deadline)
        ? copy.deadlineInvalid
        : deadline < today
          ? copy.deadlinePast
          : null,
  };
  const shown = (key: keyof typeof errors) => (tried ? errors[key] : null);
  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setForm(EMPTY);
      setDeadline("");
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>

          <DialogDescription>{copy.hint}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="min-w-0 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (Object.values(errors).some(Boolean)) return;
            onSubmit({
              title: form.title.trim(),
              problem: form.problem.trim(),
              scope: form.scope.trim() || null,
              deliverables: lines(form.deliverables),
              acceptance: lines(form.acceptance),
              budget: form.budget.trim() || null,
              deadline: deadline || null,
            });
          }}
        >
          <FormField label={copy.titleLabel} hint={copy.titleHint} error={shown("title")}>
            {(control) => (
              <Input
                {...control}
                value={form.title}
                onChange={(event) => set("title")(event.target.value)}
                maxLength={LIMITS.title}
                showCounter={false}
              />
            )}
          </FormField>

          <FormField label={copy.problemLabel} hint={copy.problemHint} error={shown("problem")}>
            {(control) => (
              <Textarea
                {...control}
                value={form.problem}
                onChange={(event) => set("problem")(event.target.value)}
                rows={4}
                maxLength={LIMITS.text}
              />
            )}
          </FormField>

          <FormField label={copy.scopeLabel} optional={copy.optional} hint={copy.scopeHint}>
            {(control) => (
              <Textarea
                {...control}
                value={form.scope}
                onChange={(event) => set("scope")(event.target.value)}
                rows={3}
                maxLength={LIMITS.text}
              />
            )}
          </FormField>

          <FormField
            label={copy.deliverablesLabel}
            hint={copy.deliverablesHint}
            error={shown("deliverables")}
          >
            {(control) => (
              <Textarea
                {...control}
                value={form.deliverables}
                onChange={(event) => set("deliverables")(event.target.value)}
                rows={3}
                maxLength={LIMITS.text}
              />
            )}
          </FormField>

          <FormField
            label={copy.acceptanceLabel}
            hint={copy.acceptanceHint}
            error={shown("acceptance")}
          >
            {(control) => (
              <Textarea
                {...control}
                value={form.acceptance}
                onChange={(event) => set("acceptance")(event.target.value)}
                rows={3}
                maxLength={LIMITS.text}
              />
            )}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={copy.budgetLabel} optional={copy.optional}>
              {(control) => (
                <Input
                  {...control}
                  value={form.budget}
                  onChange={(event) => set("budget")(event.target.value)}
                  placeholder={copy.budgetPlaceholder}
                  maxLength={LIMITS.budget}
                  showCounter={false}
                />
              )}
            </FormField>

            <FormField
              label={copy.deadlineLabel}
              optional={copy.optional}
              error={shown("deadline")}
            >
              {(control) => (
                <DateTextInput {...control} value={deadline} onValueChange={setDeadline} />
              )}
            </FormField>
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
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {pending ? copy.publishing : copy.publish}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
