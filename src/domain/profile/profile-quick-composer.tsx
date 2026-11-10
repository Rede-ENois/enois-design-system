import { type ChangeEvent, useRef } from "react";

import { FilePenLine, Image, Video } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileQuickComposerProps } from "../../types/domain/profile/profile-quick-composer-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

// The divider lives on a square cell around each button: on the rounded button itself the border
// followed its corners and drew curved lines between the shortcuts.
const cellClass = "min-w-0 px-1";
const shortcutClass =
  "flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/**
 * Launcher for the app's full composer. It never publishes by itself: a post made here used to skip
 * the type and topic pickers, so it landed in the wrong feed filters.
 */
export function ProfileQuickComposer({
  profile,
  onCompose,
  onComposeWithMedia,
  onWriteArticle,
}: ProfileQuickComposerProps) {
  const messages = useMessages().profileQuickComposer;
  const { resolveMediaUrl } = useAdapters();
  const fileRef = useRef<HTMLInputElement>(null);

  // The picker opens here, inside the click, because browsers only allow it during a user gesture.
  const pickMedia = (kind: "image" | "video") => {
    const input = fileRef.current;
    if (!input) return;
    input.accept = kind === "video" ? "video/*" : "image/*";
    input.multiple = kind === "image";
    input.click();
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) onComposeWithMedia(files);
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-surface-card p-4 shadow-[0_20px_60px_-44px_color-mix(in_oklab,var(--primary)_95%,transparent)] sm:p-5">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleMediaSelect}
      />

      <div className="flex items-center gap-3">
        <UserAvatar
          frame={profile.avatarFrame}
          src={resolveMediaUrl(profile.avatar)}
          alt={profile.name}
          className="h-10 w-10 shrink-0"
        />

        <button
          type="button"
          onClick={onCompose}
          className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-border-soft bg-surface-1 px-5 text-left text-sm font-medium text-text-subtle transition hover:border-primary/40 hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="truncate">{messages.start}</span>
        </button>
      </div>

      <div
        className={`mt-3 grid ${onWriteArticle ? "grid-cols-3" : "grid-cols-2"} divide-x divide-border-soft border-t border-border-soft pt-3`}
      >
        <div className={cellClass}>
          <button type="button" onClick={() => pickMedia("video")} className={shortcutClass}>
            <Video className="h-4 w-4 text-primary" aria-hidden="true" />
            {messages.video}
          </button>
        </div>

        <div className={cellClass}>
          <button type="button" onClick={() => pickMedia("image")} className={shortcutClass}>
            <Image className="h-4 w-4 text-primary" aria-hidden="true" />
            {messages.photo}
          </button>
        </div>

        {onWriteArticle && (
          <div className={cellClass}>
            <button type="button" onClick={onWriteArticle} className={shortcutClass}>
              <FilePenLine className="h-4 w-4 text-primary" aria-hidden="true" />
              {messages.article}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
