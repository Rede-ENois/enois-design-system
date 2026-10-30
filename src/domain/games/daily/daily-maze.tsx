import { type KeyboardEvent, useEffect, useState } from "react";

import { Clock, Map } from "lucide-react";

import { useMessages } from "../../../messages/messages-context.js";
import type { DailyMazeProps } from "../../../types/domain/games/daily-maze-props.js";
import type { MazeDirection } from "../../../types/domain/games/maze-direction.js";
import { Button } from "../../../ui/button.js";

import { DailyRanking } from "./daily-ranking.js";
import { DailyShareAction } from "./daily-share-action.js";

const keys: Record<string, MazeDirection> = {
  ArrowUp: "UP",
  ArrowRight: "RIGHT",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** Labirinto 9 × 9: o rastro, o cronômetro, os controles de toque e o ranking do dia. */
export function DailyMaze({
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
  movePending,
  moveFailed,
  moveErrorMessage,
  onMove,
  ranking,
  onShare,
  shareStatus,
}: DailyMazeProps) {
  const messages = useMessages().dailyMaze;
  const challenge = useMessages().dailyChallenge;
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Atualiza rastro de passos do labirinto
  useEffect(() => {
    if (state?.position !== undefined) {
      setVisited((prev) => new Set([...prev, state.position]));
    }
  }, [state?.position]);

  // Reseta rastro quando o desafio for reiniciado
  useEffect(() => {
    if (state?.status === "NOT_STARTED") {
      setVisited(new Set([0]));
    }
  }, [state?.status, state?.date]);

  // Cronômetro ao vivo durante a partida. Depende só do status e do início, de propósito: o
  // `state` inteiro muda a cada passo no labirinto e reiniciaria o intervalo a cada passo.
  const status = state?.status;
  const startedAt = state?.startedAt;
  useEffect(() => {
    if (status !== "IN_PROGRESS" || !startedAt) return;
    const startMs = new Date(startedAt).getTime();
    const updateTimer = () => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startMs) / 1000)));
    };
    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, [status, startedAt]);

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const direction = keys[event.key];
    if (!direction) return;
    event.preventDefault();
    onMove(direction);
  }

  return (
    <section className="surface-card p-5 sm:p-6" aria-labelledby="maze-title">
      <h2 id="maze-title" className="flex items-center gap-2 text-xl font-semibold">
        <Map className="h-5 w-5 text-blue-500" /> {messages.title}
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">{messages.subtitle}</p>

      {loading && (
        <p className="mt-4" role="status">
          {challenge.loading}
        </p>
      )}
      {loadError && (
        <p className="mt-4" role="alert">
          {messages.loadError}{" "}
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

      {state && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{challenge.challengeOf(state.date)}</span>

            <span>·</span>

            <span>{messages.moves(state.moves)}</span>
            {state.status === "IN_PROGRESS" && (
              <>
                <span>·</span>

                <span className="flex items-center gap-1 font-mono font-medium text-foreground">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  {formatTime(elapsedSeconds)}
                </span>
              </>
            )}
          </div>

          {state.status === "NOT_STARTED" && (
            <div>
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

          {state.passages && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div
                tabIndex={0}
                onKeyDown={onKey}
                role="application"
                aria-label={messages.boardLabel(
                  (state.position % 9) + 1,
                  Math.floor(state.position / 9) + 1,
                )}
                className="grid aspect-square w-full max-w-[300px] xs:max-w-[340px] sm:max-w-sm grid-cols-9 outline-primary focus-visible:outline focus-visible:outline-2 select-none border border-border/40 rounded bg-card/40"
              >
                {state.passages.map((cell, i) => {
                  const isCurrent = i === state.position;
                  const isVisited = visited.has(i) && !isCurrent;
                  return (
                    <div
                      key={i}
                      aria-hidden="true"
                      className={`relative grid place-items-center transition-colors duration-200 ${
                        isVisited ? "bg-primary/10" : ""
                      }`}
                      style={{
                        borderTop: cell & 1 ? "1px solid transparent" : "2px solid currentColor",
                        borderRight: cell & 2 ? "1px solid transparent" : "2px solid currentColor",
                        borderBottom: cell & 4 ? "1px solid transparent" : "2px solid currentColor",
                        borderLeft: cell & 8 ? "1px solid transparent" : "2px solid currentColor",
                      }}
                    >
                      {i === 80 && (
                        <span
                          className="text-xs font-bold text-primary animate-pulse"
                          title={messages.exit}
                        >
                          🏁
                        </span>
                      )}
                      {isVisited && i !== 80 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                      )}
                      {isCurrent && (
                        <span className="absolute h-3.5 w-3.5 rounded-full bg-primary shadow-sm transition-all duration-150" />
                      )}
                    </div>
                  );
                })}
              </div>

              {state.status === "IN_PROGRESS" && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium sm:hidden">
                    {messages.tapToMove}
                  </span>

                  <div
                    className="grid grid-cols-3 gap-1.5 w-36 touch-manipulation select-none"
                    aria-label={messages.controlsLabel}
                  >
                    <div />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-lg text-base touch-manipulation active:scale-95"
                      aria-label={messages.moveUp}
                      disabled={movePending}
                      onClick={() => onMove("UP")}
                    >
                      ↑
                    </Button>

                    <div />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-lg text-base touch-manipulation active:scale-95"
                      aria-label={messages.moveLeft}
                      disabled={movePending}
                      onClick={() => onMove("LEFT")}
                    >
                      ←
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-lg text-base touch-manipulation active:scale-95"
                      aria-label={messages.moveDown}
                      disabled={movePending}
                      onClick={() => onMove("DOWN")}
                    >
                      ↓
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-lg text-base touch-manipulation active:scale-95"
                      aria-label={messages.moveRight}
                      disabled={movePending}
                      onClick={() => onMove("RIGHT")}
                    >
                      →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {moveFailed && (
            <p role="alert" className="text-sm text-destructive">
              {moveErrorMessage ?? messages.moveError}
            </p>
          )}

          {state.status === "WON" && (
            <div
              role="status"
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-sm text-emerald-600 dark:text-emerald-400"
            >
              <p className="font-semibold text-base">{messages.won}</p>

              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {messages.completedIn} <strong>{messages.moves(state.moves)}</strong>
                {state.startedAt && state.completedAt && (
                  <>
                    {" "}
                    {messages.and}{" "}
                    <strong>
                      {messages.seconds(
                        Math.max(
                          0,
                          (new Date(state.completedAt).getTime() -
                            new Date(state.startedAt).getTime()) /
                            1000,
                        ).toFixed(1),
                      )}
                    </strong>
                  </>
                )}
                .
              </p>
            </div>
          )}

          {state.status === "WON" && onShare && (
            <div className="flex flex-wrap items-center gap-2">
              <DailyShareAction onShare={onShare} status={shareStatus} />
            </div>
          )}
        </div>
      )}

      <DailyRanking
        titleClassName="mt-6 font-semibold"
        loading={ranking.loading}
        error={ranking.error}
        onRetry={ranking.onRetry}
        entries={ranking.items?.map((item) => ({
          username: item.username,
          name: item.name,
          href: item.href,
          detail: messages.rankingDetail(item.elapsedMillis, item.moves),
        }))}
      />
    </section>
  );
}
