import type { RoleplayChatMessageView } from "./roleplay-chat-message-view.js";
import type { RoleplayChatPresenceView } from "./roleplay-chat-presence-view.js";

/** The table chat: IC is in character, OOC is coordination; pinning is master-only. */
export type RoleplayChatPanelProps = {
  messages: RoleplayChatMessageView[];
  presence: RoleplayChatPresenceView[];
  loading?: boolean;
  sending?: boolean;
  onSend: (channel: "IC" | "OOC", content: string) => void;
  /** Master-only toggle; absent for players. */
  onTogglePin?: (message: RoleplayChatMessageView) => void;
};
