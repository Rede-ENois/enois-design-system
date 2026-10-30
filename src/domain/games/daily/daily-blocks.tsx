import type { KeyboardEvent } from "react";

import { Boxes } from "lucide-react";

import {
  MAX_TICKS,
  PIECE_COLORS,
  SHAPE_NAMES,
  TARGET_LINES,
  gameCells,
  ghostCells,
  shapeCells,
} from "../../../lib/games/blocks-engine.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { BlocksAction } from "../../../types/domain/games/blocks-action.js";
import type { DailyBlocksProps } from "../../../types/domain/games/daily-blocks-props.js";
import { Button } from "../../../ui/button.js";

import { DailyRanking } from "./daily-ranking.js";
import { DailyShareAction } from "./daily-share-action.js";

const keys: Record<string, BlocksAction> = {
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  ArrowUp: "ROTATE",
  ArrowDown: "SOFT_DROP",
  " ": "HARD_DROP",
};
const buttons: { action: Exclude<BlocksAction, "WAIT">; symbol: string }[] = [
  { action: "LEFT", symbol: "←" },
  { action: "ROTATE", symbol: "↻" },
  { action: "RIGHT", symbol: "→" },
  { action: "SOFT_DROP", symbol: "↓" },
  { action: "HARD_DROP", symbol: "⤓" },
];

/** Blocos: o tabuleiro 10 × 20, a próxima peça, os controles e o resultado oficial. */
export function DailyBlocks({
  loading,
  loadError,
  onRetryLoad,
  canTogglePrevious,
  showPrevious,
  onTogglePrevious,
  state,
  onStart,
  startPending,
  startError,
  game,
  official,
  pendingCount,
  syncError,
  onAction,
  onRetrySync,
  boardRef,
  ranking,
  onShare,
  shareStatus,
}: DailyBlocksProps) {
  const messages = useMessages().dailyBlocks;
  const challenge = useMessages().dailyChallenge;

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    onAction(action);
  }

  const playing = Boolean(game && game.status === "PLAYING" && !official);
  const validating = Boolean(game && game.status !== "PLAYING" && !official);
  const activeSet =
    playing && game
      ? new Set(gameCells(game).map((cell) => `${cell.x},${cell.y}`))
      : new Set<string>();
  const ghostSet =
    playing && game
      ? new Set(ghostCells(game).map((cell) => `${cell.x},${cell.y}`))
      : new Set<string>();
  const activePieceColor = playing && game ? (PIECE_COLORS[game.piece] ?? PIECE_COLORS[0]) : null;
  const nextPieceColor = playing && game ? (PIECE_COLORS[game.next] ?? PIECE_COLORS[0]) : null;
  const renderedRows = official
    ? official.board.map((row) => row.split(""))
    : game
      ? game.rows
      : null;
  const preview = playing && game ? shapeCells(game.next, 0) : [];
  const previewMinX = preview.length ? Math.min(...preview.map((cell) => cell.x)) : 0;
  const previewMinY = preview.length ? Math.min(...preview.map((cell) => cell.y)) : 0;

  const boardLabel = official
    ? messages.boardFinal(official.score, official.lines, TARGET_LINES)
    : game
      ? messages.boardPlaying(game.score, game.lines, TARGET_LINES, game.x + 1, game.y + 1)
      : messages.boardEmpty;

  return (
    <section className="surface-card p-5 sm:p-6" aria-labelledby="blocks-title" onKeyDown={onKey}>
      <h2 id="blocks-title" className="flex items-center gap-2 text-xl font-semibold">
        <Boxes className="h-5 w-5" />
        {messages.title}
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">{messages.subtitle(TARGET_LINES)}</p>

      {loading && (
        <p className="mt-4" role="status">
          {challenge.loading}
        </p>
      )}
      {loadError && (
        <p className="mt-4" role="alert">
          {challenge.loadError}{" "}
          <button className="text-primary underline" onClick={onRetryLoad}>
            {challenge.retry}
          </button>
        </p>
      )}
      {canTogglePrevious && (
        <Button className="mt-4" variant="outline" onClick={onTogglePrevious}>
          {showPrevious ? challenge.backToToday : challenge.resumeYesterday}
        </Button>
      )}

      {state && state.status === "NOT_STARTED" && !showPrevious && (
        <div className="mt-4">
          <Button onClick={onStart} disabled={startPending}>
            {startPending ? challenge.starting : challenge.start}
          </Button>
          {startError && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {challenge.startError}
            </p>
          )}
        </div>
      )}

      {state && state.status !== "NOT_STARTED" && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {messages.challengeLine(state.date, TARGET_LINES)}
            {official ? messages.officialActions(official.actions) : ""}
          </p>

          {!official && game && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>{messages.score(game.score)}</span>

              <span>{messages.lines(game.lines, TARGET_LINES)}</span>

              <span>
                {messages.timeLeft(Math.max(0, Math.ceil((MAX_TICKS - game.ticks) / 10)))}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-start gap-5">
            <div
              ref={boardRef}
              tabIndex={0}
              role="application"
              aria-label={boardLabel}
              className="grid w-52 grid-cols-10 rounded border border-border bg-card outline-primary focus-visible:outline focus-visible:outline-2"
            >
              {renderedRows?.map((row, y) =>
                row.map((cell, x) => {
                  const active = activeSet.has(`${x},${y}`);
                  const isGhost = !active && ghostSet.has(`${x},${y}`);
                  return (
                    <span
                      key={`${x}-${y}`}
                      aria-hidden="true"
                      className={`grid aspect-square place-items-center border-[0.5px] border-border/30 text-[8px] leading-none transition-colors duration-100 ${
                        cell === "#"
                          ? "bg-muted-foreground/40 text-muted-foreground"
                          : active && activePieceColor
                            ? `${activePieceColor.bg} ${activePieceColor.text} font-bold shadow-sm`
                            : isGhost && activePieceColor
                              ? `${activePieceColor.ghost} border border-dashed`
                              : ""
                      }`}
                    >
                      {cell === "#" ? "■" : active ? "◆" : ""}
                    </span>
                  );
                }),
              )}
            </div>

            {playing && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {messages.next}
                </p>

                <div
                  className="grid grid-cols-4 gap-1 p-2.5 rounded-lg border border-border/50 bg-muted/20"
                  role="img"
                  aria-label={messages.nextLabel(SHAPE_NAMES[game?.next ?? 0])}
                >
                  {Array.from({ length: 2 }, (_, y) =>
                    Array.from({ length: 4 }, (_, x) => {
                      const on = preview.some(
                        (cell) => cell.x - previewMinX === x && cell.y - previewMinY === y,
                      );
                      return (
                        <span
                          key={`${x}-${y}`}
                          aria-hidden="true"
                          className={`grid h-4 w-4 place-items-center rounded-sm text-[10px] ${
                            on && nextPieceColor
                              ? `${nextPieceColor.bg} ${nextPieceColor.text} font-bold shadow-sm`
                              : "bg-transparent"
                          }`}
                        >
                          {on ? "◆" : ""}
                        </span>
                      );
                    }),
                  )}
                </div>
              </div>
            )}
          </div>

          {playing && (
            <div
              className="flex flex-wrap gap-2 sm:gap-2.5 touch-manipulation select-none"
              aria-label={messages.controlsLabel}
            >
              {buttons.map((button) => (
                <Button
                  key={button.action}
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 sm:h-12 sm:w-12 text-lg active:scale-95 touch-manipulation"
                  aria-label={messages.actions[button.action]}
                  disabled={Boolean(syncError)}
                  onClick={() => onAction(button.action)}
                >
                  {button.symbol}
                </Button>
              ))}
            </div>
          )}

          {playing && pendingCount > 1 && (
            <p className="text-sm text-muted-foreground" role="status">
              {messages.syncing(pendingCount)}
            </p>
          )}

          {syncError && (
            <div className="text-sm text-destructive" role="alert">
              <p>{syncError}</p>

              <Button className="mt-2" variant="outline" onClick={onRetrySync}>
                {messages.reconnect}
              </Button>
            </div>
          )}

          {validating && (
            <p className="text-sm text-muted-foreground" role="status">
              {messages.validating}
            </p>
          )}

          {official && (
            <div className="space-y-1" role="status">
              <p className="font-medium">
                {official.status === "WON"
                  ? messages.won(official.lines)
                  : official.status === "LOST"
                    ? messages.lost
                    : messages.timedOut}
              </p>

              <p>{messages.officialResult(official.score, official.lines, TARGET_LINES)}</p>
            </div>
          )}

          {official && onShare && (
            <div className="flex flex-wrap items-center gap-2">
              <DailyShareAction onShare={onShare} status={shareStatus} />
            </div>
          )}

          <p className="text-xs text-muted-foreground">{messages.legend}</p>
        </div>
      )}

      <DailyRanking
        titleClassName="mt-5 font-semibold"
        loading={ranking.loading}
        error={ranking.error}
        onRetry={ranking.onRetry}
        entries={ranking.items?.map((item) => ({
          username: item.username,
          name: item.name,
          href: item.href,
          detail: messages.rankingDetail(item.score, item.lines, item.elapsedMillis),
        }))}
      />
    </section>
  );
}
