import { ImagePlus } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ComposerLauncherProps } from "../../types/domain/post/composer-launcher-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/**
 * The composer at rest: a soft rounded table with your photo and one line to start. Formatting,
 * topic, type and scheduling only appear once the person opens it, so the feed starts with posts,
 * not with a toolbar.
 */
export function ComposerLauncher({
  avatar,
  avatarFrame,
  name,
  onOpen,
  onAddMedia,
}: ComposerLauncherProps) {
  const messages = useMessages().composerLauncher;

  return (
    <div className="flex h-[3.625rem] items-center gap-3 rounded-full bg-surface-card pl-2 pr-1.5 shadow-[var(--shadow-table)]">
      <UserAvatar
        frame={avatarFrame}
        frameOverflow="hidden"
        src={avatar}
        alt={name}
        className="h-10 w-10"
      />

      <button
        type="button"
        onClick={onOpen}
        className="h-full min-w-0 flex-1 truncate text-left text-[15px] font-medium text-text-date transition hover:text-text-subtle"
      >
        {messages.placeholder}
      </button>

      {onAddMedia && (
        <button
          type="button"
          onClick={onAddMedia}
          aria-label={messages.addMedia}
          title={messages.addMedia}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong"
        >
          <ImagePlus aria-hidden className="h-[22px] w-[22px]" />
        </button>
      )}
    </div>
  );
}
