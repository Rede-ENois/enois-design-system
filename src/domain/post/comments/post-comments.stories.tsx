import { useEffect, useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CommentMediaDraft } from "../../../types/domain/post/comment-media-draft.js";
import type { CommentsError } from "../../../types/domain/post/comments-error.js";
import type { PostCommentsProps } from "../../../types/domain/post/post-comments-props.js";
import { MentionTextarea } from "../editor/mention-textarea.js";

import { PostComments } from "./post-comments.js";

const meta: Meta<Pick<PostCommentsProps, "error">> = {
  title: "Domain/Post comments",
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Composer: StoryObj<typeof meta> = {
  args: { error: null },
  render: function ComposerStory({ error: initialError }) {
    const [draft, setDraft] = useState("");
    const [media, setMedia] = useState<CommentMediaDraft[]>([]);
    const [mediaSpoiler, setMediaSpoiler] = useState(false);
    const mediaRef = useRef(media);
    const [sending, setSending] = useState(false);
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [error, setError] = useState<CommentsError | null>(initialError);
    const [gifRequests, setGifRequests] = useState(0);
    const [submissions, setSubmissions] = useState(0);
    const [lastMediaCount, setLastMediaCount] = useState(0);
    useEffect(() => {
      mediaRef.current = media;
    }, [media]);
    useEffect(
      () => () => mediaRef.current.forEach((item) => URL.revokeObjectURL(item.preview)),
      [],
    );

    return (
      <div className="mx-auto w-full max-w-xl min-w-0">
        <PostComments
          formId="comment-composer-example"
          comments={[{ id: "example", parentCommentId: null, authorName: "Pessoa de exemplo" }]}
          loading={false}
          loadingMore={false}
          hasMore={false}
          error={error}
          onRetry={() => setError(null)}
          onLoadMore={() => undefined}
          renderComment={(comment) => (
            <div className="flex items-center justify-between gap-2">
              <span>{comment.authorName}</span>

              <button type="button" onClick={() => setReplyToId(comment.id)}>
                Responder
              </button>
            </div>
          )}
          replyToId={replyToId}
          onCancelReply={() => setReplyToId(null)}
          media={media}
          mediaSpoiler={mediaSpoiler}
          onToggleMediaSpoiler={() => setMediaSpoiler((value) => !value)}
          onRemoveMedia={(index) => {
            URL.revokeObjectURL(media[index].preview);
            setMedia((current) => current.filter((_, i) => i !== index));
          }}
          onInsertMedia={(index) => setDraft((value) => `${value}{{media:pendente-${index}}}`)}
          onAddImages={(files) =>
            setMedia((current) => [
              ...current,
              ...files
                .slice(0, 4 - current.length)
                .map((file) => ({ type: "image" as const, preview: URL.createObjectURL(file) })),
            ])
          }
          onAddAudio={(file) =>
            setMedia((current) => [
              ...current,
              { type: "audio", preview: URL.createObjectURL(file) },
            ])
          }
          onErrorChange={setError}
          composerField={({ toolsOpen }) => (
            <MentionTextarea
              value={draft}
              onChange={setDraft}
              placeholder="Escreva um comentário"
              className="w-full resize-none border-0 bg-transparent px-2 py-1.5 text-base md:text-sm outline-none"
              rows={1}
              toolbar
              toolbarVisible={toolsOpen}
              mentionResults={[]}
              onMentionQueryChange={() => undefined}
            />
          )}
          canSend={Boolean(draft.trim()) || media.length > 0}
          sending={sending}
          onSubmit={async () => {
            setSending(true);
            setLastMediaCount(media.length);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmissions((value) => value + 1);
            setDraft("");
            media.forEach((item) => URL.revokeObjectURL(item.preview));
            setMedia([]);
            setReplyToId(null);
            setSending(false);
            return true;
          }}
          onOpenGifPicker={() => setGifRequests((value) => value + 1)}
        />

        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          <p>Exemplo local, sem envio para API.</p>

          <p>
            Envios concluídos: <output aria-label="Envios concluídos">{submissions}</output>
          </p>

          <p>
            Anexos no último envio:{" "}
            <output aria-label="Anexos no último envio">{lastMediaCount}</output>
          </p>

          <p>
            Chamadas do seletor de GIF:{" "}
            <output aria-label="Chamadas do seletor de GIF">{gifRequests}</output>
          </p>
        </div>
      </div>
    );
  },
};

export const SendError: StoryObj<typeof meta> = {
  ...Composer,
  args: { error: "send" },
};
