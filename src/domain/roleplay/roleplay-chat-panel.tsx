import { useState } from "react";

import { Loader2, Pin, PinOff, Send } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayChatMessageView } from "../../types/domain/roleplay/roleplay-chat-message-view.js";
import type { RoleplayChatPanelProps } from "../../types/domain/roleplay/roleplay-chat-panel-props.js";
import { Button } from "../../ui/button.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";

/** The table chat: IC in the character's voice, OOC for coordination; pinning is the master's. */
export function RoleplayChatPanel({
  messages: chat,
  presence,
  loading = false,
  sending = false,
  onSend,
  onTogglePin,
}: RoleplayChatPanelProps) {
  const messages = useMessages().roleplay;
  const [channel, setChannel] = useState<"IC" | "OOC">("IC");
  const [draft, setDraft] = useState("");

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(channel, trimmed);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={channel === "IC" ? "default" : "outline"}
          className="w-auto rounded-full"
          aria-pressed={channel === "IC"}
          onClick={() => setChannel("IC")}
        >
          {messages.chatChannelIc}
        </Button>

        <Button
          size="sm"
          variant={channel === "OOC" ? "default" : "outline"}
          className="w-auto rounded-full"
          aria-pressed={channel === "OOC"}
          onClick={() => setChannel("OOC")}
        >
          {messages.chatChannelOoc}
        </Button>

        {presence.length > 0 && (
          <div className="ml-auto flex min-w-0 flex-wrap items-center gap-1">
            <span className="text-xs font-medium text-text-subtle">{messages.presence}</span>

            {presence.map((p) => (
              <Pill key={p.name} size="sm">
                {p.name}
              </Pill>
            ))}
          </div>
        )}
      </div>

      <div className="max-h-[55vh] space-y-2 overflow-y-auto rounded-2xl border border-border-soft bg-surface-card p-3">
        {loading && <LoadingState label={messages.loading} />}

        {!loading && chat.length === 0 && (
          <p className="py-6 text-center text-sm text-text-subtle">{messages.chatEmpty}</p>
        )}

        <ul className="space-y-1">
          {chat.map((message) => (
            <li key={message.id} className="min-w-0">
              <ChatMessage message={message} onTogglePin={onTogglePin} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          aria-label={channel === "IC" ? messages.chatPlaceholderIc : messages.chatPlaceholderOoc}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={channel === "IC" ? messages.chatPlaceholderIc : messages.chatPlaceholderOoc}
          maxLength={2000}
          rows={2}
          className="min-h-12"
        />

        <Button className="w-auto rounded-full" disabled={!draft.trim() || sending} onClick={send}>
          {sending && <Loader2 className="animate-spin" aria-hidden />}
          <Send aria-hidden />
          {messages.chatSend}
        </Button>
      </div>
    </div>
  );
}

function ChatMessage({
  message,
  onTogglePin,
}: {
  message: RoleplayChatMessageView;
  onTogglePin?: (message: RoleplayChatMessageView) => void;
}) {
  const messages = useMessages().roleplay;
  const channelLabel = message.channel === "IC" ? messages.chatChannelIc : messages.chatChannelOoc;

  return (
    <div className="min-w-0 rounded-xl px-2 py-1.5 text-sm">
      <p className="whitespace-pre-line text-text-strong">{message.content}</p>

      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-text-date">
        <span>{channelLabel}</span>

        {message.pinned && (
          <span className="inline-flex items-center gap-1">
            <Pin aria-hidden className="h-3 w-3" />
            {messages.chatPinned}
          </span>
        )}

        {onTogglePin && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded px-1 text-text-subtle underline-offset-2 hover:text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={() => onTogglePin(message)}
          >
            {message.pinned ? (
              <PinOff aria-hidden className="h-3 w-3" />
            ) : (
              <Pin aria-hidden className="h-3 w-3" />
            )}
            {message.pinned ? messages.unpin : messages.pin}
          </button>
        )}
      </p>
    </div>
  );
}
