/** Os campos da mensagem que o balão lê. */
export type MessageBubbleData = {
  /** Stable identifier for the message-{id} DOM navigation target, when provided. */
  id?: string;
  reactions?: Record<string, number> | null;
  myReaction?: string | null;
};
