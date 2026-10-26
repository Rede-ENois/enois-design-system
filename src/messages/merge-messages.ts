import type { MessagesOverride } from "../types/messages/messages-override.js";
import type { Messages } from "../types/messages/messages.js";

import { defaultMessages } from "./default-messages.js";

/** Overrides replace single keys, so the app can change one label without restating the rest. */
export function mergeMessages(overrides: MessagesOverride = {}): Messages {
  return Object.fromEntries(
    Object.entries(defaultMessages).map(([component, messages]) => [
      component,
      { ...messages, ...overrides[component as keyof Messages] },
    ]),
  ) as Messages;
}
