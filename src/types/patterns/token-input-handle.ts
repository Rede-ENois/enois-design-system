export type TokenInputHandle = {
  /** Commits pending text and returns the full list, or null when invalid. */
  commit: () => string[] | null;
};
