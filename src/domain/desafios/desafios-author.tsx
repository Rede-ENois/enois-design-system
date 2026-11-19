import { useMessages } from "../../messages/messages-context.js";
import type { DesafioAuthorView } from "../../types/domain/desafios/desafio-author-view.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";

/** O autor nominal de um desafio ou participação: rosto, nome estilizado e @ — nunca anônimo. */
export function DesafiosAuthor({ author }: { author: DesafioAuthorView }) {
  const messages = useMessages().userAvatar;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <UserAvatar
        src={author.avatar}
        alt={author.name}
        frame={author.avatarFrame}
        className="h-9 w-9 shrink-0"
      />

      <div className="min-w-0">
        <StyledName
          name={author.name ?? ""}
          style={author.nameStyle}
          className="text-sm font-medium"
        />
        {author.username && <p className="truncate text-xs text-text-subtle">@{author.username}</p>}
      </div>
    </div>
  );
}
