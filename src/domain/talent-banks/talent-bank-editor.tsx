import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankEditorProps } from "../../types/domain/talent-banks/talent-bank-editor-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { Textarea } from "../../ui/textarea.js";

import { useTalentBankSharedFields } from "./talent-bank-shared-fields.js";

const DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

/**
 * The recruiter's own bank: what it is, what it asks for and whether it shows up in the showcase.
 *
 * <p>Visibility and consent are two different permissions, and the form says so: a visible bank
 * still gets no data without the person's authorization on each field.</p>
 */
export function TalentBankEditor({
  values,
  onChange,
  discoverable,
  onDiscoverableChange,
  onSave,
  createdAt,
  pending = false,
  error = null,
}: TalentBankEditorProps) {
  const messages = useMessages().talentBank.editor;
  const fields = useTalentBankSharedFields();
  const change = (patch: Partial<typeof values>) => onChange({ ...values, ...patch });

  const toggleField = (key: string) => {
    const requested = values.requestedFields.includes(key)
      ? values.requestedFields.filter((item) => item !== key)
      : [...values.requestedFields, key];

    change({ requestedFields: requested });
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        {createdAt && (
          <p className="mt-1 text-[13px] text-text-date">
            {messages.createdAt(DIA.format(new Date(createdAt)))}
          </p>
        )}
      </header>

      <section className="surface-card flex min-w-0 flex-col gap-4 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-title">{messages.nameLabel}</Label>

          <Input
            id="talent-bank-title"
            value={values.title}
            onChange={(event) => change({ title: event.target.value })}
            placeholder={messages.namePlaceholder}
            maxLength={120}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-purpose">{messages.purposeLabel}</Label>

          <Textarea
            id="talent-bank-purpose"
            value={values.purpose}
            onChange={(event) => change({ purpose: event.target.value })}
            placeholder={messages.purposePlaceholder}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-description">{messages.descriptionLabel}</Label>

          <Textarea
            id="talent-bank-description"
            value={values.description}
            onChange={(event) => change({ description: event.target.value })}
            placeholder={messages.descriptionPlaceholder}
            rows={3}
            maxLength={1000}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-conditions">{messages.conditionsLabel}</Label>

          <Textarea
            id="talent-bank-conditions"
            value={values.handlingConditions}
            onChange={(event) => change({ handlingConditions: event.target.value })}
            placeholder={messages.conditionsPlaceholder}
            rows={3}
            maxLength={1000}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-area">{messages.focusAreaLabel}</Label>

          <Input
            id="talent-bank-area"
            value={values.focusArea}
            onChange={(event) => change({ focusArea: event.target.value })}
            placeholder={messages.focusAreaPlaceholder}
            maxLength={80}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <Label htmlFor="talent-bank-skills">{messages.skillsLabel}</Label>

          <Input
            id="talent-bank-skills"
            value={values.desiredSkills}
            onChange={(event) => change({ desiredSkills: event.target.value })}
            placeholder={messages.skillsPlaceholder}
            maxLength={200}
          />
        </div>
      </section>

      <section className="surface-card flex min-w-0 flex-col gap-3 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-strong">{messages.fieldsLabel}</p>

          <p className="mt-0.5 text-[13px] text-text-subtle">{messages.fieldsHint}</p>
        </div>

        <ul className="flex flex-col gap-2">
          {fields.map((field) => (
            <li key={field.key}>
              <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-border-soft p-3">
                <input
                  type="checkbox"
                  checked={values.requestedFields.includes(field.key)}
                  onChange={() => toggleField(field.key)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                />

                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-text-strong">
                    {field.label}
                  </span>

                  <span className="block text-[13px] text-text-subtle">{field.description}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="talent-bank-visible">{messages.visibilityLabel}</Label>

          <Switch
            id="talent-bank-visible"
            checked={discoverable}
            onCheckedChange={onDiscoverableChange}
          />
        </div>

        <p className="text-[13px] text-text-subtle">{messages.visibilityHint}</p>
      </section>

      {error && (
        <p
          className="rounded-xl bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <Button disabled={pending || values.requestedFields.length === 0} onClick={onSave}>
        {pending ? messages.saving : messages.save}
      </Button>
    </section>
  );
}
