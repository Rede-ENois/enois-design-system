import { type ChangeEvent, useRef } from "react";

import { ImagePlus, X } from "lucide-react";

import { postMessages } from "../../messages/defaults/post.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ComposerMediaPickerProps } from "../../types/domain/post/composer-media-picker-props.js";
import type { ComposerMediaTransport } from "../../types/domain/post/composer-media-transport.js";

function TransportFeedback({
  transport,
  position,
}: {
  transport: ComposerMediaTransport;
  position: number;
}) {
  const messages =
    useMessages().composerMediaPicker.transport ?? postMessages.composerMediaPicker.transport;
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
      <p role="status">
        <span className="sr-only">{`${attachment}: `}</span>
        {messages[transport.phase]}
      </p>
      {measured && <p>{messages.bytesRemaining(bytesRemaining)}</p>}
      {onAction && (
        <button
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
  const fileRef = useRef<HTMLInputElement>(null);

  // Opened inside the click: browsers only allow the dialog during a user gesture.
  const pick = () => fileRef.current?.click();

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div className="space-y-2">
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
              key={item.id === undefined ? `index:${index}` : `id:${item.id}`}
              className="min-w-0 overflow-hidden rounded-xl border border-border-soft"
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
                <TransportFeedback transport={item.transport} position={index + 1} />
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
