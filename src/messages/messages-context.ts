import { createContext, useContext } from "react";

import type { Messages } from "../types/messages/messages.js";

import { defaultMessages } from "./default-messages.js";

// Defaults as the context value: components work without an EnoisProvider (tests, stories).
export const MessagesContext = createContext<Messages>(defaultMessages);

export function useMessages(): Messages {
  return useContext(MessagesContext);
}
