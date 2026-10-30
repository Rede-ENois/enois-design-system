import type { StreakData } from "./streak-data.js";

export type StreakCardProps = {
  streak?: StreakData | null;
  /** Today's date (`YYYY-MM-DD`) in the same timezone the backend counts days in. */
  today: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  /** `compact` is a single line for the account menu or header. */
  variant?: "full" | "compact";
  className?: string;
};
