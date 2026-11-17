import { useState } from "react";

import { Globe, Loader2, PenLine, Plus, Trash2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayWorldPanelProps } from "../../types/domain/roleplay/roleplay-world-panel-props.js";
import type { RoleplayWorldEntryView } from "../../types/domain/roleplay/roleplay-world-view.js";
import type { WorldKind } from "../../types/domain/roleplay/world-kind.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";

import { FormField } from "./form-field.js";

const WORLD_KINDS: readonly WorldKind[] = ["LOCALE", "CHARACTER", "ITEM", "PLOT", "LORE"];

/** The campaign atlas: the group registers what it discovered; editing is per-author or master. */
export function RoleplayWorldPanel({
  entries,
  loading = false,
  kind = null,
  onKindChange,
  onSaveEntry,
  onDeleteEntry,
  savingEntry = false,
}: RoleplayWorldPanelProps) {
  const messages = useMessages().roleplay;
  const [editorEntry, setEditorEntry] = useState<RoleplayWorldEntryView | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const openEditor = (entry: RoleplayWorldEntryView | null) => {
    setEditorEntry(entry);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {onKindChange && (
            <Button
              size="sm"
              variant={kind === null ? "default" : "outline"}
              className="w-auto rounded-full"
              aria-pressed={kind === null}
              onClick={() => onKindChange(null)}
            >
              <Globe aria-hidden />
              {messages.worldAll}
            </Button>
          )}

          {onKindChange &&
            WORLD_KINDS.map((k) => (
              <Button
                key={k}
                size="sm"
                variant={kind === k ? "default" : "outline"}
                className="w-auto rounded-full"
                aria-pressed={kind === k}
                onClick={() => onKindChange(k)}
              >
                {messages.worldKinds[k] ?? k}
              </Button>
            ))}
        </div>

        <Button size="sm" className="w-auto rounded-full" onClick={() => openEditor(null)}>
          <Plus aria-hidden />
          {messages.worldAdd}
        </Button>
      </div>

      {loading && <LoadingState label={messages.loading} />}

      {!loading && entries.length === 0 && (
        <p className="text-sm text-text-subtle">{messages.worldEmpty}</p>
      )}

      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <WorldCard
              entry={entry}
              onEdit={() => openEditor(entry)}
              onDelete={() => onDeleteEntry(entry)}
            />
          </li>
        ))}
      </ul>

      <RoleplayWorldEntryDialog
        open={editorOpen}
        entry={editorEntry}
        saving={savingEntry}
        onOpenChange={setEditorOpen}
        onSave={(values) => {
          onSaveEntry(values, editorEntry);
          setEditorOpen(false);
        }}
      />
    </div>
  );
}

function WorldCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: RoleplayWorldEntryView;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const messages = useMessages().roleplay;

  return (
    <section className="surface-card min-w-0 space-y-2 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <h4 className="min-w-0 break-words font-semibold text-text-strong">{entry.title}</h4>

          <Pill size="sm">{messages.worldKinds[entry.kind] ?? entry.kind}</Pill>
        </div>

        {entry.canEdit && (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="w-auto rounded-full" onClick={onEdit}>
              <PenLine aria-hidden />
              {messages.worldEdit}
            </Button>

            <Button size="sm" variant="ghost" className="w-auto rounded-full" onClick={onDelete}>
              <Trash2 aria-hidden />
              {messages.worldDelete}
            </Button>
          </div>
        )}
      </div>

      {entry.body && <p className="whitespace-pre-line text-sm text-text-subtle">{entry.body}</p>}

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <Pill key={tag} size="sm">
              {tag}
            </Pill>
          ))}
        </div>
      )}

      {entry.linkedSheetName && (
        <p className="text-xs text-text-date">
          {messages.worldLinked}: {entry.linkedSheetName}
        </p>
      )}
    </section>
  );
}

function RoleplayWorldEntryDialog({
  open,
  entry,
  saving,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  entry: RoleplayWorldEntryView | null;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: { kind: string; title: string; body: string | null; tags: string[] }) => void;
}) {
  const messages = useMessages().roleplay;
  const [kind, setKind] = useState<WorldKind>(entry?.kind ?? WORLD_KINDS[0]);
  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");
  const [tags, setTags] = useState(entry?.tags.join(", ") ?? "");
  const [tried, setTried] = useState(false);
  const titleError = title.trim() ? null : messages.worldTitleRequired;

  const submit = () => {
    setTried(true);
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({
      kind,
      title: trimmed,
      body: body.trim() || null,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLocaleLowerCase("pt-BR"))
        .filter(Boolean),
    });
    setTried(false);
  };

  const close = (next: boolean) => {
    if (!next) {
      setTitle("");
      setBody("");
      setTags("");
      setKind(WORLD_KINDS[0]);
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{entry ? messages.worldEdit : messages.worldAdd}</DialogTitle>

          <DialogDescription>{messages.worldKindLabel}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className={cn("max-h-[70vh] min-w-0 space-y-4 overflow-y-auto")}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <FormField label={messages.worldKindLabel}>
            {(control) => (
              <select
                {...control}
                value={kind}
                onChange={(event) => setKind(event.target.value as WorldKind)}
                className="flex h-9 w-full rounded-md border border-input bg-surface-card px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm [&>option]:bg-surface-card"
              >
                {WORLD_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {messages.worldKinds[k] ?? k}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label={messages.worldTitleLabel} error={tried ? titleError : null}>
            {(control) => (
              <Input
                {...control}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={messages.worldTitlePlaceholder}
                maxLength={120}
                showCounter={false}
              />
            )}
          </FormField>

          <FormField label={messages.worldBodyLabel}>
            {(control) => (
              <Textarea
                {...control}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={20000}
                rows={5}
              />
            )}
          </FormField>

          <FormField label={messages.worldTagsLabel}>
            {(control) => (
              <Input
                {...control}
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder={messages.worldTagsPlaceholder}
                showCounter={false}
              />
            )}
          </FormField>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={saving}
              onClick={() => close(false)}
            >
              {messages.worldCancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={saving}>
              {saving && <Loader2 className="animate-spin" aria-hidden />}
              {saving ? messages.worldSaving : messages.worldSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
