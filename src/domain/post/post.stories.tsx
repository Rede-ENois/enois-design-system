import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { PostCardData } from "../../types/domain/post/post-card-data.js";
import type { PostMediaGridProps } from "../../types/domain/post/post-media-grid-props.js";
import type { PostRichTextProps } from "../../types/domain/post/post-rich-text-props.js";

import { CaughtUpDivider } from "./caught-up-divider.js";
import { CommentItem } from "./comments/comment-item.js";
import { orderCommentsWithAccepted } from "./comments/order-comments-with-accepted.js";
import { PostComments } from "./comments/post-comments.js";
import { MentionTextarea } from "./editor/mention-textarea.js";
import { MediaGrid } from "./media/media-grid.js";
import { PostCardSkeletons } from "./post-card-skeletons.js";
import { PostCard } from "./post-card.js";
import { PostNotes } from "./post-notes.js";
import { PostSealPicker } from "./post-seal-picker.js";
import { QuestionComposerHint } from "./question-composer-hint.js";
import { QuestionStatusFilter } from "./question-status-filter.js";
import { PostActions } from "./reactions/post-actions.js";
import { ReactionsDialog } from "./reactions/reactions-dialog.js";
import { ReactionsSummary } from "./reactions/reactions-summary.js";
import { ReportDialog } from "./report-dialog.js";
import { RichText } from "./rich-text.js";

const meta: Meta = {
  title: "Domain/Post",
};

export default meta;

const emojis = { LIKE: "👍", LOVE: "❤️", LAUGH: "😂" };

const post: PostCardData = {
  id: "p1",
  type: "INSIGHT",
  content:
    "Primeiro dia no estágio e já aprendi **muito**. Dica para quem está começando: pergunte sempre, @ana. ||Spoiler: o café é ótimo.||",
  authorName: "Bruno Lima",
  authorAvatar: null,
  community: { name: "Carreira em tech", joined: false },
  tags: ["carreira", "estagio"],
  mediaIds: [],
};

const renderRichText = (props: PostRichTextProps) => (
  <RichText {...props} mentionHref={(username) => `/perfil/${username}`} />
);

const renderMediaGrid = ({ mediaIds, ...props }: PostMediaGridProps) => (
  <MediaGrid
    {...props}
    items={mediaIds.map((id) => ({
      id,
      mimeType: "image/png",
      cdnUrl: "https://placehold.co/600x400/png",
    }))}
  />
);

export const Card: StoryObj = {
  render: function CardStory() {
    const [reaction, setReaction] = useState<keyof typeof emojis | null>("LOVE");

    return (
      <div className="max-w-xl">
        <PostCard
          post={{ ...post, mediaIds: ["m1"] }}
          hrefs={{ author: "#", post: "#", community: "#" }}
          timeLabel="há 5 min"
          topicLabel="Carreira"
          isOwner
          onEdit={() => {}}
          onDelete={() => {}}
          seals={[{ seal: "DICA", count: 3 }]}
          mySeals={["DICA"]}
          onShowSeals={() => {}}
          onFollowCommunity={() => {}}
          reactionsSummary={
            <ReactionsSummary
              summary={{ LOVE: 4, LIKE: 2 }}
              emojis={emojis}
              activeType={reaction}
              clickable
              onToggle={(type) => setReaction((current) => (current === type ? null : type))}
            />
          }
          actions={
            <PostActions
              emojis={emojis}
              reactionStatus={reaction}
              onReact={setReaction}
              reactionPending={false}
              motionAllowed={() => true}
              reactionCount={6}
              commentsCount={2}
              savesCount={1}
              saved={false}
              canRepost
              onShowReactions={() => {}}
              onComments={() => {}}
              onRepost={() => {}}
              onShare={() => {}}
              onReport={() => {}}
              onSave={() => {}}
            >
              <PostSealPicker mySeals={["DICA"]} onToggle={() => {}} onRemove={() => {}} />
            </PostActions>
          }
          renderRichText={renderRichText}
          renderMediaGrid={renderMediaGrid}
        />
      </div>
    );
  },
};

/** Página, artigo e blog não viajam no repost: o botão fica, desabilitado, e diz por quê. */
export const RepostUnavailable: StoryObj = {
  render: () => (
    <div className="max-w-xl pt-28">
      <PostActions
        emojis={emojis}
        reactionStatus={null}
        onReact={() => {}}
        reactionPending={false}
        motionAllowed={() => true}
        reactionCount={3}
        commentsCount={1}
        savesCount={0}
        saved={false}
        canRepost={false}
        repostUnavailableReason="Páginas ainda não podem ser republicadas: a cópia perderia o conteúdo da página. Use Compartilhar para mandar o link."
        onShowReactions={() => {}}
        onComments={() => {}}
        onRepost={() => {}}
        onShare={() => {}}
        onReport={() => {}}
        onSave={() => {}}
      />
    </div>
  ),
};

export const Skeletons: StoryObj = {
  render: () => <PostCardSkeletons count={2} />,
};

// A largura pertence ao contêiner: uma coluna de desktop também pode ter pouco espaço.
function headerStory(width: number, initiallyPinned: boolean, simple = false): StoryObj {
  return {
    render: function HeaderStory() {
      const [pinned, setPinned] = useState(initiallyPinned);

      return (
        <div style={{ width, maxWidth: "100%" }}>
          <PostCard
            post={{
              ...post,
              authorName: simple ? "Ana" : "Perfil de demonstração com nome comprido",
              community: simple
                ? null
                : { name: "Comunidade de demonstração com nome comprido", joined: true },
              content: "Publicação de demonstração para conferir o cabeçalho do card.",
            }}
            hrefs={{ author: "#autor", post: "#post", community: "#comunidade" }}
            timeLabel="agora"
            topicLabel={simple ? undefined : "Música"}
            pinned={pinned}
            onTogglePin={simple ? undefined : () => setPinned((current) => !current)}
            isOwner
            onEdit={() => {}}
            onDelete={() => {}}
            mySeals={[]}
            onShowSeals={() => {}}
            renderRichText={renderRichText}
            renderMediaGrid={renderMediaGrid}
          />
        </div>
      );
    },
  };
}

export const HeaderNarrowUnpinned = headerStory(320, false);
export const HeaderNarrowPinned = headerStory(320, true);
export const HeaderWideUnpinned = headerStory(800, false);
export const HeaderWidePinned = headerStory(800, true);
export const HeaderSimple = headerStory(420, false, true);

const comments = [
  {
    id: "c1",
    parentCommentId: null,
    authorName: "Ana Souza",
    authorAvatar: null,
    content: "Que bom! Pode contar com a gente.",
  },
  {
    id: "c2",
    parentCommentId: "c1",
    authorName: "Bruno Lima",
    authorAvatar: null,
    content: "Valeu, Ana!",
  },
];

export const Comments: StoryObj = {
  render: function CommentsStory() {
    const [draft, setDraft] = useState("");

    return (
      <div className="max-w-xl">
        <PostComments
          formId="comment-form-story"
          comments={comments}
          loading={false}
          loadingMore={false}
          hasMore
          error={null}
          onRetry={() => {}}
          onLoadMore={() => {}}
          renderComment={(comment, replyingTo) => (
            <CommentItem<keyof typeof emojis>
              comment={comment}
              content={comment.content}
              edited={false}
              profileHref="#"
              timeLabel="há 2 min"
              replyingTo={replyingTo}
              isOwner={comment.id === "c2"}
              canPin={false}
              emojis={emojis}
              reaction={comment.id === "c1" ? "LOVE" : null}
              onReact={() => {}}
              reactionSummary={comment.id === "c1" ? { LOVE: 3, LIKE: 1 } : undefined}
              onShowReactions={() => {}}
              onReply={() => {}}
              onTogglePin={() => {}}
              onDelete={() => {}}
              onReport={() => {}}
              onSaveEdit={async () => true}
              onCancelEdit={() => {}}
              renderRichText={renderRichText}
              renderMediaGrid={renderMediaGrid}
              renderEditField={(value, onChange) => (
                <textarea value={value} onChange={(event) => onChange(event.target.value)} />
              )}
            />
          )}
          replyToId={null}
          onCancelReply={() => {}}
          media={[]}
          mediaSpoiler={false}
          onToggleMediaSpoiler={() => {}}
          onRemoveMedia={() => {}}
          onInsertMedia={() => {}}
          onAddImages={() => {}}
          onAddAudio={() => {}}
          onErrorChange={() => {}}
          composerField={
            <MentionTextarea
              value={draft}
              onChange={(value) => setDraft(value)}
              placeholder="Comente com contexto, dúvida ou referência..."
              className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm font-normal outline-none"
              maxLength={800}
              toolbar
              mentionResults={[]}
              onMentionQueryChange={() => {}}
            />
          }
          canSend={draft.trim() !== ""}
          sending={false}
          onSubmit={async () => true}
          onOpenGifPicker={() => {}}
        />
      </div>
    );
  },
};

const question: PostCardData = {
  id: "q1",
  type: "QUESTION",
  content: "Alguém sabe por que meu `useEffect` roda duas vezes em desenvolvimento?",
  authorName: "Carla Souza",
  authorAvatar: null,
  tags: ["react"],
  mediaIds: [],
};

const answers = [
  {
    id: "a1",
    parentCommentId: null,
    authorName: "Bruno Lima",
    authorAvatar: null,
    content: "Também queria saber!",
  },
  {
    id: "a2",
    parentCommentId: null,
    authorName: "Ana Reis",
    authorAvatar: null,
    content:
      "É o StrictMode: em dev o React monta, desmonta e monta de novo para achar efeitos sem limpeza.",
  },
  {
    id: "a3",
    parentCommentId: null,
    authorName: "Carla Souza",
    authorAvatar: null,
    content: "Faz sentido, obrigada!",
  },
];

/** QUESTION posts: status pill, filter, composer hint and the accepted answer (viewer = author). */
export const Questions: StoryObj = {
  render: function QuestionsStory() {
    const [status, setStatus] = useState<"all" | "open" | "resolved">("all");
    const [acceptedId, setAcceptedId] = useState<string | null>("a2");

    return (
      <div className="max-w-xl space-y-4">
        <QuestionStatusFilter value={status} onChange={setStatus} />
        <QuestionComposerHint />
        {[false, true].map((resolved) => (
          <PostCard
            key={String(resolved)}
            post={{ ...question, id: `q-${resolved}`, resolved }}
            hrefs={{ author: "#", post: "#" }}
            isOwner={false}
            timeLabel="há 1 h"
            mySeals={[]}
            onShowSeals={() => {}}
            renderRichText={renderRichText}
            renderMediaGrid={renderMediaGrid}
          />
        ))}
        <div className="space-y-3">
          {orderCommentsWithAccepted(answers, acceptedId).map((answer) => (
            <CommentItem<keyof typeof emojis>
              key={answer.id}
              comment={{ ...answer, accepted: answer.id === acceptedId }}
              content={answer.content}
              edited={false}
              timeLabel="há 20 min"
              isOwner={answer.authorName === question.authorName}
              canPin={false}
              canAccept={answer.authorName !== question.authorName}
              onAccept={() => setAcceptedId(answer.id)}
              onUnaccept={() => setAcceptedId(null)}
              emojis={emojis}
              reaction={null}
              onReact={() => {}}
              onReply={() => {}}
              onTogglePin={() => {}}
              onDelete={() => {}}
              onReport={() => {}}
              onSaveEdit={async () => true}
              onCancelEdit={() => {}}
              renderRichText={renderRichText}
              renderMediaGrid={renderMediaGrid}
              renderEditField={() => null}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Reactions: StoryObj = {
  render: function ReactionsStory() {
    const [open, setOpen] = useState(true);

    return (
      <ReactionsDialog
        open={open}
        onOpenChange={setOpen}
        reactions={[
          { userId: "u1", type: "LOVE" },
          { userId: "u2", type: "LIKE" },
        ]}
        summary={{ LOVE: 1, LIKE: 1 }}
        users={{ u1: { name: "Ana Souza" }, u2: { name: "Bruno Lima" } }}
        currentUserId="u2"
        emojis={emojis}
        isLoading={false}
        isError={false}
      />
    );
  },
};

export const Report: StoryObj = {
  render: function ReportStory() {
    const [open, setOpen] = useState(true);

    return (
      <ReportDialog
        targetType="POST"
        reasons={["SPAM", "HARASSMENT", "OTHER"]}
        defaultReason="SPAM"
        guidelinesHref="#"
        open={open}
        onOpenChange={setOpen}
        onSubmit={async () => true}
      />
    );
  },
};

const note = {
  id: "n1",
  body: "O estágio citado é de 2023; o programa de 2024 mudou as regras de inscrição.",
  authorName: "Ana Souza",
  authorContributor: {},
  createdAtLabel: "12/03/2024 14:30",
  authorHref: "#",
};

export const Notes: StoryObj = {
  render: () => (
    <div className="max-w-xl space-y-6">
      <PostNotes notes={[note]} canAdd onSend={async () => true} />
      <PostNotes notes={[]} pending onSend={async () => true} />
      <PostNotes notes={[]} deniedReason="Sem fonte." onSend={async () => true} />
    </div>
  ),
};

export const CaughtUp: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <CaughtUpDivider />
    </div>
  ),
};
