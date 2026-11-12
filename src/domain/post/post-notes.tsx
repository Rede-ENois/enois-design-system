import { useState } from "react";

import { BadgeCheck, Loader2, StickyNote } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { PostNoteData } from "../../types/domain/post/post-note-data.js";
import type { PostNotesProps } from "../../types/domain/post/post-notes-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Textarea } from "../../ui/textarea.js";
import { ContributorTag } from "../name/contributor-tag.js";
import { StyledName } from "../name/styled-name.js";

const POST_NOTE_MAX = 500;
const POST_NOTE_MIN = 10;

/**
 * Rodapé do post: notas aprovadas pela moderação aparecem como verificação da comunidade. Quem
 * ainda não enviou pode pedir uma correção; a nota vai para análise e só aparece depois de aprovada.
 */
export function PostNotes({
  notes,
  pending = false,
  deniedReason = null,
  discarded = false,
  canAdd = false,
  sending = false,
  onSend,
}: PostNotesProps) {
  const messages = useMessages().postNotes;
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");

  const denied = deniedReason !== null;
  const length = body.trim().length;

  if (notes.length === 0 && !pending && !denied && !discarded && !canAdd) return null;

  const send = async () => {
    if (await onSend(body.trim())) {
      setOpen(false);
      setBody("");
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}

      {pending && (
        <p className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-xs text-text-subtle">
          <StickyNote className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />

          <>{messages.pending}</>
        </p>
      )}

      {denied && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {messages.denied(deniedReason)}
        </p>
      )}

      {discarded && (
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-text-subtle">
          {messages.discarded}
        </p>
      )}

      {canAdd && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          // "Adicionar nota" mede ~16px de altura: o `before` infla o alvo de toque até 44px sem
          // mexer no visual (mesmo recurso das pílulas de reação).
          className="relative inline-flex items-center gap-1.5 py-2 text-xs font-medium text-primary before:absolute before:-inset-y-2 before:-inset-x-1 before:content-[''] hover:underline"
        >
          <StickyNote className="h-3.5 w-3.5" aria-hidden />

          <>{messages.add}</>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{messages.dialogTitle}</DialogTitle>

            <DialogDescription>{messages.dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-text-strong">
              {messages.warning}
            </p>

            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              maxLength={POST_NOTE_MAX}
              placeholder={messages.placeholder}
            />

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-text-subtle">
                {messages.count(length, POST_NOTE_MAX)}
              </span>

              <Button
                className="rounded-full"
                disabled={sending || length < POST_NOTE_MIN || length > POST_NOTE_MAX}
                onClick={() => void send()}
              >
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}

                <>{sending ? messages.sending : messages.send}</>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note }: { note: PostNoteData }) {
  const messages = useMessages().postNotes;
  const name = <StyledName name={note.authorName} style={note.authorStyle} />;

  return (
    <aside className="rounded-xl border border-primary/30 bg-primary-soft/40 px-3 py-2">
      <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-primary-text">
        <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />

        <>{messages.title}</>

        <span className="font-normal text-text-subtle">· {messages.verified}</span>
      </p>

      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-text-strong">{note.body}</p>

      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-text-subtle">
        {note.authorHref ? (
          <AppLink href={note.authorHref} className="hover:underline">
            {name}
          </AppLink>
        ) : (
          <span>{name}</span>
        )}

        {note.authorContributor && <ContributorTag color={note.authorContributor.color} />}

        <span>{messages.time(note.createdAtLabel)}</span>
      </p>
    </aside>
  );
}
