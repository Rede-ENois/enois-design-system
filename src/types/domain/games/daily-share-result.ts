import type { WordMark } from "./word-mark.js";

/** Plain result data for the share text. Never carries the answer or the board. */
export type DailyShareResult =
  | {
      game: "word";
      /** Date as shown to people, e.g. "30/10". */
      dateLabel: string;
      won: boolean;
      /** Marks of each confirmed guess, in order. */
      marks: WordMark[][];
    }
  | { game: "maze"; dateLabel: string; moves: number; elapsedMillis: number }
  | { game: "blocks"; dateLabel: string; score: number; lines: number };
