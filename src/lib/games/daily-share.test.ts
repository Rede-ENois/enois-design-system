import { describe, expect, it } from "vitest";

import { buildDailyShareText } from "./daily-share.js";

const URL = "https://enois.ia.br/games?categoria=diarios";

describe("buildDailyShareText", () => {
  it("word win: n/6 and one emoji row per guess, ending with the url", () => {
    const text = buildDailyShareText(
      {
        game: "word",
        dateLabel: "30/10",
        won: true,
        marks: [
          ["CORRECT", "ABSENT", "PRESENT", "ABSENT", "ABSENT"],
          ["CORRECT", "CORRECT", "CORRECT", "CORRECT", "CORRECT"],
        ],
      },
      URL,
    );
    expect(text).toBe(`Palavras Énóis 30/10 · 2/6\n\n🟩⬛🟨⬛⬛\n🟩🟩🟩🟩🟩\n\n${URL}`);
  });

  it("word loss: X/6", () => {
    const marks = Array.from({ length: 6 }, () => Array(5).fill("ABSENT"));
    const text = buildDailyShareText({ game: "word", dateLabel: "30/10", won: false, marks }, URL);
    expect(text.split("\n")[0]).toBe("Palavras Énóis 30/10 · X/6");
    expect(text.endsWith(URL)).toBe(true);
  });

  it("maze: moves and time", () => {
    expect(
      buildDailyShareText(
        { game: "maze", dateLabel: "30/10", moves: 42, elapsedMillis: 37400 },
        URL,
      ),
    ).toBe(`Labirinto Énóis 30/10 · 42 movimentos em 37,4 s\n${URL}`);
  });

  it("blocks: score and lines, singular aware", () => {
    expect(
      buildDailyShareText({ game: "blocks", dateLabel: "30/10", score: 1240, lines: 1 }, URL),
    ).toBe(`Blocos Énóis 30/10 · 1240 pontos · 1 linha\n${URL}`);
  });

  it("uses the messages passed in", () => {
    const text = buildDailyShareText(
      { game: "blocks", dateLabel: "30/10", score: 1, lines: 2 },
      URL,
      {
        button: "",
        copied: "",
        shared: "",
        error: "",
        word: () => "",
        maze: () => "",
        blocks: (date, score, lines) => `Blocks ${date} ${score}/${lines}`,
      },
    );
    expect(text).toBe(`Blocks 30/10 1/2\n${URL}`);
  });
});
