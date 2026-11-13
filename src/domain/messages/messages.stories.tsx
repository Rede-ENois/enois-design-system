import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChatDockWindow } from "./chat-dock-window.js";
import { ChatDock } from "./chat-dock.js";
import { ConversationItem } from "./conversation-item.js";
import { ConversationListSkeletons } from "./conversation-list-skeletons.js";
import { ConversationThread } from "./conversation-thread.js";
import { E2eSetupBanner } from "./e2e-setup-banner.js";
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
  render: () => (
    <div className="flex h-[600px] max-w-lg flex-col">
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
          message={{ reactions: { LOVE: 1 } }}
          isMe={false}
          peer={peer}
          profileHref="#"
          content={<p>Oi! Vi teu portfólio, curti muito.</p>}
          timeLabel="10 min"
          emojis={emojis}
        />
        <MessageBubble
          message={{ myReaction: "LIKE", reactions: { LIKE: 1 } }}
          isMe
          readByOther
          profileHref="#"
          content={<p>Valeu demais!</p>}
          timeLabel="agora"
          emojis={emojis}
        />
      </ConversationThread>
    </div>
  ),
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
