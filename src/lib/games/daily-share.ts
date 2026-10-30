import { gamesMessages } from "../../messages/defaults/games.js";
import type { DailyShareResult } from "../../types/domain/games/daily-share-result.js";
import type { WordMark } from "../../types/domain/games/word-mark.js";
import type { GamesMessages } from "../../types/messages/games-messages.js";

import { MAX_GUESSES } from "./daily-word.js";

const SQUARES: Record<WordMark, string> = { CORRECT: "🟩", PRESENT: "🟨", ABSENT: "⬛" };

/** Spoiler-free share text of a daily result, ending with `url`. */
export function buildDailyShareText(
  result: DailyShareResult,
  url: string,
  messages: GamesMessages["dailyShare"] = gamesMessages.dailyShare,
): string {
  switch (result.game) {
    case "word": {
      const score = `${result.won ? result.marks.length : "X"}/${MAX_GUESSES}`;
      const grid = result.marks.map((row) => row.map((mark) => SQUARES[mark]).join(""));
      return [messages.word(result.dateLabel, score), "", ...grid, "", url].join("\n");
    }
    case "maze":
      return [messages.maze(result.dateLabel, result.moves, result.elapsedMillis), url].join("\n");
    case "blocks":
      return [messages.blocks(result.dateLabel, result.score, result.lines), url].join("\n");
  }
}
