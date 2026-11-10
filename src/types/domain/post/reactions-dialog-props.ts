import type { ReactionCountSummary } from "../../lib/reactions/reaction-count-summary.js";

import type { ReactionRowData } from "./reaction-row-data.js";
import type { ReactionUserData } from "./reaction-user-data.js";

export type ReactionsDialogProps<T extends string = string> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reactions: ReactionRowData<T>[];
  summary: ReactionCountSummary<T>;
  /** Perfis por id (chegam depois da lista). */
  users?: Record<string, ReactionUserData>;
  currentUserId: string | null;
  emojis: Record<T, string>;
  profileHref?: (username: string) => string;
  isLoading: boolean;
  isError: boolean;
};
