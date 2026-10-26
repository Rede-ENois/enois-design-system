import type { Messages } from "./messages.js";

/** Any subset of the messages, per component, to replace the pt-BR defaults. */
export type MessagesOverride = { [Component in keyof Messages]?: Partial<Messages[Component]> };
