import { useId, useState } from "react";

import { Megaphone, Plus, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ReleaseNotesEditorProps } from "../../types/domain/whats-new/release-notes-editor-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

import { WhatsNewDialog } from "./whats-new-dialog.js";

/**
 * Admin editor for the "O que há de novo" release: a short list of title + description pairs.
 * Fully controlled (the app owns the draft and calls the API); the preview opens the same
 * `WhatsNewDialog` people will see. Separate from the platform notice on purpose: that one is free
 * HTML, this one is structured copy that always renders the same way.
 */
export function ReleaseNotesEditor({
  items,
  onItemsChange,
  liveSince,
  publishing = false,
  retiring = false,
  onPublish,
  onRetire,
  maxItems = 8,
  maxTitleLength = 80,
  maxDescriptionLength = 240,
}: ReleaseNotesEditorProps) {
  const messages = useMessages().releaseNotesEditor;
  const baseId = useId();
  const [previewOpen, setPreviewOpen] = useState(false);

  const complete = items.filter((item) => item.title.trim() && item.description.trim());
  const canPublish = items.length > 0 && complete.length === items.length && !publishing;

  const update = (index: number, field: "title" | "description", value: string) =>
    onItemsChange(items.map((item, at) => (at === index ? { ...item, [field]: value } : item)));

  const add = () =>
    onItemsChange([...items, { id: crypto.randomUUID(), title: "", description: "" }]);

  const remove = (index: number) => onItemsChange(items.filter((_, at) => at !== index));

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
          {messages.title}
        </h2>

        <p className="text-sm text-muted-foreground">{messages.description}</p>
      </div>

      <div className="rounded-2xl border border-border-soft bg-surface-card p-4 text-sm">
        {liveSince ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-text-strong">{messages.live(liveSince)}</p>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-destructive"
              disabled={retiring}
              onClick={onRetire}
            >
              {retiring ? messages.retiring : messages.retire}
            </Button>
          </div>
        ) : (
          <p className="inline-flex items-center gap-2 text-text-subtle">
            <Megaphone aria-hidden className="h-4 w-4" />

            <>{messages.none}</>
          </p>
        )}
      </div>

      <ol className="space-y-3">
        {items.map((item, index) => {
          const position = index + 1;
          const titleId = `${baseId}-title-${item.id}`;
          const descriptionId = `${baseId}-description-${item.id}`;

          return (
            <li key={item.id} className="space-y-3 rounded-2xl border border-border-soft p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-strong">
                  {messages.itemLabel(position)}
                </p>

                <button
                  type="button"
                  aria-label={messages.remove(position)}
                  onClick={() => remove(index)}
                  className="grid h-8 w-8 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={titleId} className="text-xs font-normal text-text-subtle">
                  {messages.itemTitle}
                </Label>

                <Input
                  id={titleId}
                  value={item.title}
                  maxLength={maxTitleLength}
                  placeholder={messages.itemTitlePlaceholder}
                  onChange={(event) => update(index, "title", event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={descriptionId} className="text-xs font-normal text-text-subtle">
                  {messages.itemDescription}
                </Label>

                <Textarea
                  id={descriptionId}
                  value={item.description}
                  rows={2}
                  maxLength={maxDescriptionLength}
                  placeholder={messages.itemDescriptionPlaceholder}
                  onChange={(event) => update(index, "description", event.target.value)}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <Button
        variant="ghost"
        className="gap-1.5 rounded-full sm:w-auto"
        disabled={items.length >= maxItems}
        onClick={add}
      >
        <Plus aria-hidden className="h-4 w-4" />

        <>{messages.add}</>

        <span className="text-xs tabular-nums text-text-subtle">
          {messages.count(items.length, maxItems)}
        </span>
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="rounded-full sm:w-auto" disabled={!canPublish} onClick={onPublish}>
          {publishing ? messages.publishing : liveSince ? messages.republish : messages.publish}
        </Button>

        <Button
          variant="outline"
          className="rounded-full sm:w-auto"
          disabled={complete.length === 0}
          onClick={() => setPreviewOpen(true)}
        >
          {messages.preview}
        </Button>
      </div>

      <WhatsNewDialog open={previewOpen} onOpenChange={setPreviewOpen} items={complete} />
    </section>
  );
}
