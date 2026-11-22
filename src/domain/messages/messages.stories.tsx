import { useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatDockWindow } from "./chat-dock-window.js";
import { ChatDock } from "./chat-dock.js";
import { ConversationItem } from "./conversation-item.js";
import { ConversationListSkeletons } from "./conversation-list-skeletons.js";
import { ConversationThread } from "./conversation-thread.js";
import { E2eSetupBanner } from "./e2e-setup-banner.js";
import { GroupAdminSection } from "./group-admin-section.js";
import { GroupComposer } from "./group-composer.js";
import { GroupTopicsView } from "./group-topics-view.js";
import { MessageBubble } from "./message-bubble.js";
import { MessageSkeletons } from "./message-skeletons.js";

const meta: Meta = {
  title: "Domain/Messages",
};

export default meta;

const peer = { name: "Ana Souza", headline: "Designer em São Paulo" };
const emojis = { LIKE: "👍", LOVE: "❤️", HAHA: "😂" };

export const List: StoryObj = {
  render: () => (
    <ul className="max-w-sm">
      <ConversationItem
        conversation={{ lastMessage: "Bora marcar aquele café?", unread: 2 }}
        peer={peer}
        profileHref="#"
        timeLabel="5 min"
        isActive={false}
        onSelect={() => {}}
      />
      <ConversationItem
        conversation={{ title: "Projeto Énóis", lastMessage: "Fechado!", unread: 0 }}
        profileHref="#"
        timeLabel="2 h"
        isActive
        onSelect={() => {}}
      />
      <ConversationItem
        conversation={{ lastMessage: "", unread: 1 }}
        peer={peer}
        profileHref="#"
        timeLabel="agora"
        isActive={false}
        onSelect={() => {}}
        previewLoading
      />
    </ul>
  ),
};

export const Thread: StoryObj = {
  render: function ThreadStory() {
    const scope = useRef<HTMLDivElement>(null);
    return (
      <div ref={scope} className="flex h-[600px] max-w-lg flex-col">
        <ConversationThread
          peer={peer}
          profileHref="#"
          loading={false}
          empty={false}
          newestMessageId="2"
          hasOlderMessages
          loadingOlder={false}
          onLoadOlder={() => {}}
          selecting={false}
          selectedCount={0}
          onStartSelecting={() => {}}
          onCancelSelection={() => {}}
          deletePending={false}
          onDeleteSelected={() => {}}
          sendPending={false}
          onSend={() => Promise.resolve()}
          servicesOpen={false}
          onServicesOpenChange={() => {}}
          servicesLoading={false}
          services={[]}
          serviceHref={(id) => `/servicos#oferta-${id}`}
        >
          <MessageBubble
            message={{ id: "story-original", reactions: { LOVE: 1 } }}
            isMe={false}
            peer={peer}
            profileHref="#"
            content={<p>Oi! Vi teu portfólio, curti muito.</p>}
            timeLabel="10 min"
            emojis={emojis}
          />
          <MessageBubble
            message={{ id: "story-reply", myReaction: "LIKE", reactions: { LIKE: 1 } }}
            isMe
            readByOther
            profileHref="#"
            content={<p>Valeu demais!</p>}
            replyQuote={{
              from: peer.name,
              text: "Oi! Vi teu portfólio, curti muito.",
              isMe: false,
            }}
            onReplyQuoteClick={() => {
              scope.current?.querySelector<HTMLElement>('[id="message-story-original"]')?.focus();
            }}
            timeLabel="agora"
            emojis={emojis}
          />
        </ConversationThread>
      </div>
    );
  },
};

/** Synthetic messages: native activation, optional callback and selection mode. */
export const ReplyNavigation: StoryObj = {
  render: function ReplyNavigationStory() {
    const scope = useRef<HTMLDivElement>(null);
    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState(false);
    const navigate = () => {
      scope.current?.querySelector<HTMLElement>('[id="message-demo-original"]')?.focus();
    };
    const quote = {
      from: "Pessoa fictícia",
      text: "Mensagem original de demonstração.",
      isMe: false,
    };
    return (
      <div ref={scope} className="max-w-lg space-y-4">
        <button type="button" onClick={() => setSelecting(!selecting)} aria-pressed={selecting}>
          {selecting ? "Sair da seleção" : "Selecionar mensagens"}
        </button>

        <MessageBubble
          message={{ id: "demo-original" }}
          isMe={false}
          profileHref="#"
          content={<p>{quote.text}</p>}
          timeLabel="10:00"
          emojis={{}}
        />
        {[false, true].map((isMe) => (
          <MessageBubble
            key={String(isMe)}
            message={{ id: `demo-reply-${isMe}` }}
            isMe={isMe}
            profileHref="#"
            replyQuote={{ ...quote, isMe, text: quote.text.repeat(12) }}
            onReplyQuoteClick={navigate}
            selecting={selecting}
            selected={selected}
            onToggleSelect={() => selecting && setSelected(!selected)}
            content={<p>Resposta fictícia para testar mouse, Enter e Espaço.</p>}
            timeLabel="10:01"
            emojis={{}}
          />
        ))}
        <MessageBubble
          message={{}}
          isMe={false}
          profileHref="#"
          replyQuote={quote}
          content={<p>Citação sem ação de navegação disponível.</p>}
          timeLabel="10:02"
          emojis={{}}
        />
      </div>
    );
  },
};

/** Long title and long category in the service chooser: both stay on the row (issue #199). */
export const ThreadAttachService: StoryObj = {
  render: () => (
    <div className="flex h-[600px] max-w-lg flex-col">
      <ConversationThread
        peer={peer}
        profileHref="#"
        loading={false}
        empty
        newestMessageId={null}
        hasOlderMessages={false}
        loadingOlder={false}
        onLoadOlder={() => {}}
        selecting={false}
        selectedCount={0}
        onStartSelecting={() => {}}
        onCancelSelection={() => {}}
        deletePending={false}
        onDeleteSelected={() => {}}
        sendPending={false}
        onSend={() => Promise.resolve()}
        servicesOpen
        onServicesOpenChange={() => {}}
        servicesLoading={false}
        services={[
          {
            id: "s1",
            title: "Consultoria de arquitetura de software para times pequenos",
            category: "Desenvolvimento de software sob medida",
          },
          { id: "s2", title: "Logo", category: "Design" },
        ]}
        serviceHref={(id) => `/servicos#oferta-${id}`}
      />
    </div>
  ),
};

export const ThreadWithE2eBanner: StoryObj = {
  render: () => (
    <div className="flex h-[400px] max-w-lg flex-col">
      <ConversationThread
        peer={peer}
        profileHref="#"
        banner={
          <E2eSetupBanner
            hasPassword
            onSetupWithPassword={async () => false}
            onDefinePassword={async () => false}
          />
        }
        loading={false}
        empty
        newestMessageId={null}
        hasOlderMessages={false}
        loadingOlder={false}
        onLoadOlder={() => {}}
        selecting={false}
        selectedCount={0}
        onStartSelecting={() => {}}
        onCancelSelection={() => {}}
        deletePending={false}
        onDeleteSelected={() => {}}
        sendPending={false}
        onSend={() => Promise.resolve()}
        servicesOpen={false}
        onServicesOpenChange={() => {}}
        servicesLoading={false}
        services={[]}
        serviceHref={(id) => `/servicos#oferta-${id}`}
      />
    </div>
  ),
};

export const E2eBannerDefinePassword: StoryObj = {
  render: () => (
    <div className="max-w-lg">
      <E2eSetupBanner
        hasPassword={false}
        onSetupWithPassword={async () => false}
        onDefinePassword={async () => false}
      />
    </div>
  ),
};

export const Loading: StoryObj = {
  render: () => (
    <div className="max-w-lg space-y-6">
      <ConversationListSkeletons count={3} />
      <MessageSkeletons />
    </div>
  ),
};

/** Fixo no canto inferior direito e só no desktop (`lg`): abra o canvas largo para ver. */
export const Dock: StoryObj = {
  render: () => (
    <ChatDock
      expanded
      onToggleExpanded={() => {}}
      unreadCount={3}
      windows={<ChatDockWindow loading onClose={() => {}} />}
      empty={false}
      hasMore
      loadingMore={false}
      onLoadMore={() => {}}
    >
      <ConversationItem
        conversation={{ lastMessage: "Bora marcar aquele café?", unread: 2 }}
        peer={peer}
        profileHref="#"
        timeLabel="5 min"
        isActive={false}
        onSelect={() => {}}
      />
    </ChatDock>
  ),
};

/** Criar grupo: título e seleção múltipla de pessoas (o "conversar com várias de uma vez"). */
export const GroupComposerStory: StoryObj = {
  name: "GroupComposer",
  render: () => (
    <GroupComposer
      contacts={[
        { id: "u1", name: "Ana Souza", headline: "Jogadora", avatar: null },
        { id: "u2", name: "Beto Lima", headline: "Streamer", avatar: null },
        { id: "u3", name: "Cris Dias", headline: "Designer", avatar: null },
      ]}
      onSearch={() => {}}
      onCreate={() => {}}
    />
  ),
};

const groupPeople = [
  { userId: "own1", name: "Ana Souza", role: "OWNER" as const, avatar: null },
  { userId: "adm1", name: "Beto Lima", role: "ADMIN" as const, avatar: null },
  { userId: "mem1", name: "Cris Dias", role: "MEMBER" as const, avatar: null },
  { userId: "mem2", name: "Duda Reis", role: "MEMBER" as const, avatar: null },
];

const groupTopics = [
  { id: "t1", name: "Jogatinas", status: "OPEN" as const },
  { id: "t2", name: "Rolê de sábado", status: "OPEN" as const },
  { id: "t3", name: "Trabalho", status: "ARCHIVED" as const },
];

const noopAsync = async () => {};

/** Painel do grupo visto pelo dono: papéis, promover, remover e adicionar pessoas. */
export const GroupPanelOwner: StoryObj = {
  name: "GroupAdminSection (dono)",
  render: () => (
    <div className="mx-auto max-w-md border border-border-soft p-4">
      <GroupAdminSection
        groupTitle="Jogatina de sexta"
        participants={groupPeople}
        isOwner
        canManage
        candidates={[
          { id: "c1", name: "Edu Prado", avatar: null },
          { id: "c2", name: "Fabi Melo", avatar: null, alreadyMember: true },
        ]}
        onSearchCandidates={() => {}}
        onAddMembers={noopAsync}
        onPromote={noopAsync}
        onDemote={noopAsync}
        onRemove={noopAsync}
      />
    </div>
  ),
};

/** O mesmo painel visto por um membro comum: sem gestão, só quem está no grupo. */
export const GroupPanelMember: StoryObj = {
  name: "GroupAdminSection (membro)",
  render: () => (
    <div className="mx-auto max-w-md border border-border-soft p-4">
      <GroupAdminSection
        groupTitle="Jogatina de sexta"
        participants={groupPeople}
        isOwner={false}
        canManage={false}
        candidates={[]}
        onSearchCandidates={() => {}}
        onAddMembers={noopAsync}
        onPromote={noopAsync}
        onDemote={noopAsync}
        onRemove={noopAsync}
      />
    </div>
  ),
};

/** Tópicos na tela do filão; o botão abre a gestão (criar, renomear, arquivar, ordenar). */
export const GroupTopics: StoryObj = {
  render: function GroupTopicsStory() {
    const [active, setActive] = useState<string | null>(null);
    return (
      <div className="mx-auto max-w-md">
        <GroupTopicsView
          topics={groupTopics}
          activeTopicId={active}
          onSelectTopic={setActive}
          manager
          onCreateTopic={async () => null}
          onRenameTopic={async () => null}
          onArchiveTopic={async () => null}
          onReorderTopics={async () => null}
        />

        <p className="px-4 py-6 text-sm text-text-subtle">
          Tópico selecionado: {active ?? "todos os assuntos"}
        </p>
      </div>
    );
  },
};

/** Membro comum: só a fila, sem a gestão. */
export const GroupTopicsMember: StoryObj = {
  name: "GroupTopics (membro)",
  render: () => (
    <div className="mx-auto max-w-md">
      <GroupTopicsView
        topics={groupTopics}
        activeTopicId="t1"
        onSelectTopic={() => {}}
        manager={false}
        onCreateTopic={async () => null}
        onRenameTopic={async () => null}
        onArchiveTopic={async () => null}
        onReorderTopics={async () => null}
      />
    </div>
  ),
};
