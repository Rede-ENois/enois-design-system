import { useEffect, useState } from "react";

import { BookOpen, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplaySheetCard } from "../../types/domain/roleplay/roleplay-sheet-card.js";
import type { RoleplaySheetPanelProps } from "../../types/domain/roleplay/roleplay-sheet-panel-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Pill } from "../../ui/pill.js";

import { FormField } from "./form-field.js";

/**
 * The viewer's own sheet plus the board of sheets opened to the group. The server decides what a
 * board card shows; the view never invents a field, and publishing is the owner's opt-in.
 */
export function RoleplaySheetPanel({
  templateFields,
  sheet,
  board,
  loading = false,
  saving = false,
  onSave,
  onPublish,
  onUnpublish,
}: RoleplaySheetPanelProps) {
  const messages = useMessages().roleplay;

  if (loading) return <LoadingState label={messages.loading} />;

  if (!sheet && templateFields.length === 0) {
    return <p className="text-sm text-text-subtle">{messages.sheetBoardEmpty}</p>;
  }

  return (
    <div className="space-y-6">
      <SheetEditor templateFields={templateFields} sheet={sheet} saving={saving} onSave={onSave} />

      <section className="min-w-0 space-y-2">
        <h3 className="text-sm font-semibold text-text-strong">{messages.sheetBoard}</h3>

        {board.length === 0 && (
          <p className="text-sm text-text-subtle">{messages.sheetBoardEmpty}</p>
        )}

        <ul className="space-y-2">
          {board.map((card) => (
            <li key={card.id}>
              <SheetBoardCard card={card} onPublish={onPublish} onUnpublish={onUnpublish} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SheetEditor({
  templateFields,
  sheet,
  saving,
  onSave,
}: {
  templateFields: { key: string; label: string }[];
  sheet: {
    name: string;
    values: Record<string, string>;
    derived: { label: string; value: string }[];
  } | null;
  saving: boolean;
  onSave: (name: string, values: Record<string, string>) => void;
}) {
  const messages = useMessages().roleplay;
  const [name, setName] = useState(sheet?.name ?? "");
  const [values, setValues] = useState<Record<string, string>>(sheet?.values ?? {});

  // The sheet arrives with the panel (the app fetches it): fill only what the human hasn't
  // touched, so a server refresh never wipes an edit in progress.
  useEffect(() => {
    if (!sheet) return;
    setName((current) => current || sheet.name);
    setValues((current) => (Object.keys(current).length === 0 ? sheet.values : current));
  }, [sheet]);

  return (
    <section className="surface-card min-w-0 space-y-4 p-4">
      <FormField label={messages.sheetNameLabel}>
        {(control) => (
          <Input
            {...control}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={messages.sheetNamePlaceholder}
            maxLength={120}
            showCounter={false}
          />
        )}
      </FormField>

      {templateFields.map((field) => (
        <FormField key={field.key} label={field.label}>
          {(control) => (
            <Input
              {...control}
              value={values[field.key] ?? ""}
              onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
            />
          )}
        </FormField>
      ))}

      {sheet && sheet.derived.length > 0 && (
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-text-subtle">{messages.sheetDerived}</p>

          <div className="flex flex-wrap gap-2">
            {sheet.derived.map((d) => (
              <Pill key={d.label} size="sm">
                {d.label}: {d.value}
              </Pill>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-auto rounded-full"
        disabled={saving || !name.trim()}
        onClick={() => onSave(name.trim(), values)}
      >
        {saving && <Loader2 className="animate-spin" aria-hidden />}
        {saving ? messages.sheetSaving : messages.sheetSave}
      </Button>
    </section>
  );
}

function SheetBoardCard({
  card,
  onPublish,
  onUnpublish,
}: {
  card: RoleplaySheetCard;
  onPublish: (card: RoleplaySheetCard) => void;
  onUnpublish: (card: RoleplaySheetCard) => void;
}) {
  const messages = useMessages().roleplay;

  return (
    <section className="surface-card min-w-0 space-y-2 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex min-w-0 items-center gap-2 font-medium text-text-strong">
          <BookOpen aria-hidden className="h-4 w-4 shrink-0 text-primary" />

          <span className="min-w-0 break-words">{card.name}</span>
        </h4>

        {card.published ? (
          <Button
            size="sm"
            variant="ghost"
            className="w-auto rounded-full"
            onClick={() => onUnpublish(card)}
          >
            {messages.unpublish}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="w-auto rounded-full"
            onClick={() => onPublish(card)}
          >
            {messages.publish}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {card.fields.map((field) => (
          <Pill key={field.label} size="sm">
            {field.label}: {field.value}
          </Pill>
        ))}
      </div>
    </section>
  );
}
