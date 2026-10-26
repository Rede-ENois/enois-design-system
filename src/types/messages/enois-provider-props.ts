import type { ReactNode } from "react";

import type { MessagesOverride } from "./messages-override.js";

export type EnoisProviderProps = {
  messages?: MessagesOverride;
  children: ReactNode;
};
