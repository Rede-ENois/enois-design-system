import { useMemo } from "react";

import type { EnoisProviderProps } from "../types/messages/enois-provider-props.js";

import { mergeMessages } from "./merge-messages.js";
import { MessagesContext } from "./messages-context.js";

export function EnoisProvider({ messages, children }: EnoisProviderProps) {
  const value = useMemo(() => mergeMessages(messages), [messages]);

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
