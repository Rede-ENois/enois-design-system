import {
  type ChangeEvent,
  type RefCallback,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { ImagePlus, X } from "lucide-react";

import { postMessages } from "../../messages/defaults/post.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ComposerMediaDraft } from "../../types/domain/post/composer-media-draft.js";
import type { ComposerMediaPickerProps } from "../../types/domain/post/composer-media-picker-props.js";
import type { ComposerMediaTransport } from "../../types/domain/post/composer-media-transport.js";

function useTransportMessages() {
  return useMessages().composerMediaPicker.transport ?? postMessages.composerMediaPicker.transport;
}

function attachmentKey(item: ComposerMediaDraft, index: number) {
  return item.id === undefined ? `index:${index}` : `id:${item.id}`;
}

function TransferAnnouncements({ items }: Pick<ComposerMediaPickerProps, "items">) {
  const messages = useTransportMessages();
  const region = useRef<HTMLDivElement>(null);
  const previous = useRef(new Map<string, ComposerMediaTransport["phase"]>());
  const announced = useRef<string[]>([]);

  useEffect(() => {
    const next = new Map<string, ComposerMediaTransport["phase"]>();
    const positions = new Map<string, number>();
    const changed: string[] = [];
    items.forEach((item, index) => {
      if (!item.transport || item.status === "prohibited") return;
      const key = attachmentKey(item, index);
      const phase = item.transport.phase;
      next.set(key, phase);
      positions.set(key, index + 1);
      if (previous.current.get(key) !== phase) changed.push(key);
    });

    // Retain the last announcements for still-active items, using their current positions.
    announced.current =
      changed.length > 0 ? changed : announced.current.filter((key) => next.has(key));
    const text = announced.current
      .flatMap((key) => {
        const position = positions.get(key);
        const phase = next.get(key);
        return position === undefined || phase === undefined
          ? []
          : [`${messages.attachment(position)}: ${messages[phase]}`];
      })
      .join(". ");
    if (region.current && region.current.textContent !== text) region.current.textContent = text;
    previous.current = next;
  }, [items, messages]);

  return <div ref={region} role="status" className="sr-only" />;
}

function TransportFeedback({
  transport,
  position,
  actionRef,
}: {
  transport: ComposerMediaTransport;
  position: number;
  actionRef: RefCallback<HTMLButtonElement>;
}) {
  const messages = useTransportMessages();
  const sending = transport.phase === "sending";
  const bytesRemaining = sending ? transport.bytesRemaining : undefined;
  const measured =
    bytesRemaining !== undefined && Number.isSafeInteger(bytesRemaining) && bytesRemaining >= 0;
  const onAction = sending
    ? transport.onCancel
    : transport.phase === "failed"
      ? transport.onRetry
      : undefined;
  const action = sending ? messages.cancel : messages.retry;
  const attachment = messages.attachment(position);

  return (
    <div className="bg-surface-card px-2 py-1.5 text-xs wrap-anywhere text-text-strong">
      <p>{messages[transport.phase]}</p>
      {measured && <p>{messages.bytesRemaining(bytesRemaining)}</p>}
      {onAction && (
        <button
          key={transport.phase}
          ref={actionRef}
          type="button"
          onClick={onAction}
          aria-label={`${action}: ${attachment}`}
          className="min-h-8 max-w-full text-left font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/**
 * The attachments already chosen in a composer: the previews, where each upload stands, and the
 * button that opens the picker again.
 *
 * The file input lives here, so every composer gets the same dialog and the app never has to build
 * one. The files are handed to the app, which checks and uploads them and answers by updating
 * `items`; the input is cleared right after the change so picking the same file twice still fires.
 */
export function ComposerMediaPicker({
  items,
  onFiles,
  onRemove,
  canAddMore = true,
  accept = "image/*",
  multiple = true,
}: ComposerMediaPickerProps) {
  const messages = useMessages().composerMediaPicker;
  const transportMessages = useTransportMessages();
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFocus = useRef<HTMLElement | null>(null);
  const actionRef = useCallback<RefCallback<HTMLButtonElement>>((button) => {
    if (!button) return;
    return () => {
      if (button.ownerDocument.activeElement === button) {
        pendingFocus.current = button.closest<HTMLElement>('[role="group"]');
      }
    };
  }, []);

  // A keyed attachment can move again after its old action is detached.
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (!target?.isConnected) return;
    const document = target.ownerDocument;
    if (document.activeElement === document.body) target.focus({ preventScroll: true });
  });

  // Opened inside the click: browsers only allow the dialog during a user gesture.
  const pick = () => fileRef.current?.click();

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div className="space-y-2">
      <TransferAnnouncements items={items} />
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleSelect}
      />

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={attachmentKey(item, index)}
              role="group"
              aria-label={transportMessages.attachment(index + 1)}
              tabIndex={-1}
              className="min-w-0 overflow-hidden rounded-xl border border-border-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <div className="relative">
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt=""
                    className={`h-28 w-full bg-surface-1 object-cover ${
                      item.status === "prohibited" ? "scale-105 blur-lg" : ""
                    }`}
                  />
                ) : (
                  <div className="h-28 w-full bg-surface-1" />
                )}

                {item.status === "prohibited" ? (
                  <div className="absolute inset-0 grid place-items-center bg-surface-card/85 p-2 text-center text-[11px] font-semibold text-text-strong">
                    {messages.prohibited}
                  </div>
                ) : item.status === "checking" ? (
                  <div className="absolute inset-0 grid place-items-center bg-surface-card/70">
                    <span className="rounded-full bg-surface-card px-2 py-0.5 text-[11px] text-text-strong">
                      {messages.checking}
                    </span>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={messages.remove}
                  title={messages.remove}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-surface-card/80 text-text-strong shadow hover:bg-surface-card"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {item.transport && item.status !== "prohibited" && (
                <TransportFeedback
                  transport={item.transport}
                  position={index + 1}
                  actionRef={actionRef}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <button
          type="button"
          onClick={pick}
          aria-label={messages.add}
          title={messages.add}
          className="grid h-8 w-8 place-items-center rounded-full text-text-subtle transition hover:bg-surface-1 hover:text-text-strong"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
