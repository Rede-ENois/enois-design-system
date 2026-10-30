// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../../messages/default-messages.js";
import type { DailyBlocksProps } from "../../../types/domain/games/daily-blocks-props.js";
import type { DailyMazeProps } from "../../../types/domain/games/daily-maze-props.js";
import type { DailyWordProps } from "../../../types/domain/games/daily-word-props.js";

import { DailyBlocks } from "./daily-blocks.js";
import { DailyMaze } from "./daily-maze.js";
import { DailyWord } from "./daily-word.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.dailyShare;
const noop = () => {};
const challenge = {
  loading: false,
  loadError: false,
  onRetryLoad: noop,
  canTogglePrevious: false,
  showPrevious: false,
  onTogglePrevious: noop,
  onStart: noop,
  startPending: false,
  startError: false,
  ranking: { loading: false, error: false, onRetry: noop, items: [] },
};

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const shareButton = () =>
  [...host.querySelectorAll("button")].find((b) => b.textContent === messages.button);
const liveLines = () => [...host.querySelectorAll('[aria-live="polite"]')];

function renderMaze(props: Partial<DailyMazeProps> = {}) {
  act(() =>
    root.render(
      <DailyMaze
        {...challenge}
        state={{
          date: "2026-10-30",
          status: "WON",
          passages: null,
          position: 80,
          moves: 42,
          startedAt: null,
          completedAt: null,
        }}
        movePending={false}
        moveFailed={false}
        moveErrorMessage={null}
        onMove={noop}
        {...props}
      />,
    ),
  );
}

function renderBlocks(props: Partial<DailyBlocksProps> = {}) {
  act(() =>
    root.render(
      <DailyBlocks
        {...challenge}
        state={{ date: "2026-10-30", status: "WON" }}
        game={null}
        official={{
          date: "2026-10-30",
          status: "WON",
          score: 1240,
          lines: 10,
          actions: 312,
          board: Array.from({ length: 20 }, () => ".........."),
          activeCells: [],
          nextCells: [],
          pieces: [],
          rulesVersion: 1,
        }}
        pendingCount={0}
        syncError={null}
        onAction={noop}
        onRetrySync={noop}
        boardRef={{ current: null }}
        {...props}
      />,
    ),
  );
}

function renderWord(props: Partial<DailyWordProps> = {}) {
  act(() =>
    root.render(
      <DailyWord
        {...challenge}
        state={{
          date: "2026-10-30",
          status: "LOST",
          streak: 0,
          guesses: [{ word: "TURMA", marks: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT"] }],
        }}
        draft=""
        shakeRow={null}
        lastConfirmedRow={null}
        localError={null}
        guessPending={false}
        onKey={noop}
        stats={{ played: 1, won: 0, currentStreak: 0, maxStreak: 0, distribution: {} }}
        statsOpen={false}
        onStatsOpenChange={noop}
        onShare={noop}
        {...props}
      />,
    ),
  );
}

describe("daily share action", () => {
  it("maze and blocks hide the button when onShare is absent", () => {
    renderMaze();
    expect(shareButton()).toBeUndefined();
    renderBlocks();
    expect(shareButton()).toBeUndefined();
  });

  it("maze shows the button on the result and calls onShare", () => {
    const onShare = vi.fn();
    renderMaze({ onShare });
    act(() => shareButton()!.click());
    expect(onShare).toHaveBeenCalledOnce();
  });

  it("maze hides the button while the run is not finished", () => {
    renderMaze({
      onShare: noop,
      state: {
        date: "2026-10-30",
        status: "IN_PROGRESS",
        passages: null,
        position: 0,
        moves: 0,
        startedAt: null,
        completedAt: null,
      },
    });
    expect(shareButton()).toBeUndefined();
  });

  it("blocks shows the button once the official result is in", () => {
    const onShare = vi.fn();
    renderBlocks({ onShare });
    act(() => shareButton()!.click());
    expect(onShare).toHaveBeenCalledOnce();
  });

  it("keeps an empty polite live line while idle and fills it per status", () => {
    renderBlocks({ onShare: noop });
    expect(liveLines()).toHaveLength(1);
    expect(liveLines()[0].textContent).toBe("");

    renderBlocks({ onShare: noop, shareStatus: "copied" });
    expect(liveLines()[0].textContent).toBe(messages.copied);
    renderBlocks({ onShare: noop, shareStatus: "shared" });
    expect(liveLines()[0].textContent).toBe(messages.shared);
    renderBlocks({ onShare: noop, shareStatus: "error" });
    expect(liveLines()[0].textContent).toBe(messages.error);
    expect(liveLines()[0].getAttribute("role")).toBeNull();
  });

  it("word announces the share status next to its button", () => {
    renderWord({ shareStatus: "copied" });
    expect(shareButton()).toBeDefined();
    expect(liveLines().map((line) => line.textContent)).toEqual([messages.copied]);
  });
});
