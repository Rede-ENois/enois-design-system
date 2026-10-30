import { useEffect, useState } from "react";

import { BarChart2, HelpCircle, Type } from "lucide-react";

import {
  KEYBOARD_ROWS,
  MAX_GUESSES,
  PHYSICAL_KEYS,
  WORD_LENGTH,
  buildKeyMap,
  keyClasses,
  tileClasses,
} from "../../../lib/games/daily-word.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { DailyWordProps } from "../../../types/domain/games/daily-word-props.js";
import type { RowProps } from "../../../types/domain/games/row-props.js";
import type { TileProps } from "../../../types/domain/games/tile-props.js";
import type { TileState } from "../../../types/domain/games/tile-state.js";
import type { WordMark } from "../../../types/domain/games/word-mark.js";
import { Button } from "../../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog.js";

import { DailyRanking } from "./daily-ranking.js";
import { DailyShareAction } from "./daily-share-action.js";

// ─── Sub-componente: célula da grade ──────────────────────────────────────────

function Tile({ letter, state, revealed, col, animate }: TileProps) {
  const messages = useMessages().dailyWord;
  const [flipped, setFlipped] = useState(false);
  const [displayState, setDisplayState] = useState<TileState>(revealed ? state : state);

  useEffect(() => {
    if (!animate || !revealed) return;
    const delay = col * 300;
    // Vira para branco na metade da animação e aplica a cor real
    const t1 = window.setTimeout(() => setFlipped(true), delay);
    const t2 = window.setTimeout(() => {
      setDisplayState(state);
      setFlipped(false);
    }, delay + 150);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [animate, col, revealed, state]);

  return (
    <div
      aria-label={letter || messages.emptyTile}
      className={tileClasses(displayState, revealed)}
      style={{
        transform: flipped ? "rotateX(90deg)" : undefined,
        transition: flipped ? "transform 150ms ease-in" : "transform 150ms ease-out",
      }}
    >
      {letter}
    </div>
  );
}

// ─── Sub-componente: linha da grade ───────────────────────────────────────────

function Row({ letters, marks, shake, animateReveal }: RowProps) {
  return (
    <div role="row" className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${shake ? "animate-shake" : ""}`}>
      {Array.from({ length: WORD_LENGTH }, (_, i) => {
        const letter = letters[i] ?? "";
        const mark = marks?.[i] ?? null;
        const revealed = marks !== null;
        const state: TileState = revealed ? (mark as WordMark) : letter ? "typing" : "empty";
        return (
          <Tile
            key={i}
            col={i}
            letter={letter}
            state={state}
            revealed={revealed}
            animate={animateReveal}
          />
        );
      })}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

/** Palavras: a grade 6 × 5, o teclado virtual, o ranking e os diálogos de regras e estatísticas. */
export function DailyWord({
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
  draft,
  shakeRow,
  lastConfirmedRow,
  localError,
  guessPending,
  onKey,
  stats,
  statsOpen,
  onStatsOpenChange,
  onShare,
  shareStatus,
  ranking,
}: DailyWordProps) {
  const messages = useMessages().dailyWord;
  const challenge = useMessages().dailyChallenge;
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  // Teclado físico
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const mapped = PHYSICAL_KEYS[e.key] ?? (e.key.length === 1 ? e.key.toUpperCase() : null);
      if (!mapped) return;
      e.preventDefault();
      onKey(mapped);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKey]);

  // Monta a grade de linhas (confirmadas + linha ativa + vazias)
  const confirmedGuesses = state?.guesses ?? [];
  const keyMap = buildKeyMap(confirmedGuesses);
  const isPlaying = state?.status === "IN_PROGRESS";
  const isFinished = state?.status === "WON" || state?.status === "LOST";

  return (
    <section className="surface-card p-5 sm:p-6" aria-labelledby="words-title">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="words-title" className="flex items-center gap-2 text-xl font-semibold">
            <Type className="h-5 w-5 text-emerald-500" />
            {messages.title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">{messages.subtitle(MAX_GUESSES)}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs touch-manipulation"
            onClick={() => setHowToPlayOpen(true)}
            title={messages.howToPlay}
          >
            <HelpCircle className="h-4 w-4 text-primary" />

            <span className="hidden sm:inline">{messages.howToPlay}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs touch-manipulation"
            onClick={() => onStatsOpenChange(true)}
            title={messages.stats}
          >
            <BarChart2 className="h-4 w-4 text-primary" />

            <span className="hidden sm:inline">{messages.stats}</span>
          </Button>
        </div>
      </div>

      {/* Carregando */}
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

      {/* Botão de retomar desafio anterior */}
      {canTogglePrevious && (
        <Button className="mt-4" variant="outline" onClick={onTogglePrevious}>
          {showPrevious ? challenge.backToToday : challenge.resumeYesterday}
        </Button>
      )}

      {/* Começar desafio */}
      {state?.status === "NOT_STARTED" && !showPrevious && (
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

      {/* Jogo */}
      {state && state.status !== "NOT_STARTED" && (
        <div className="mt-5 flex flex-col items-center gap-5">
          <p className="self-start text-sm text-muted-foreground">
            {challenge.challengeOf(state.date)}
            {state.streak > 0 && messages.streak(state.streak)}
          </p>

          {/* Erro local (palavra curta, inválida etc) */}
          {localError && (
            <div role="alert" className="rounded bg-card px-4 py-2 text-sm font-medium shadow">
              {localError}
            </div>
          )}

          {/* Grade 6 × 5 */}
          <div
            role="grid"
            aria-label={messages.gridLabel}
            className="w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[340px] flex flex-col gap-1.5 sm:gap-2 mx-auto"
          >
            {Array.from({ length: MAX_GUESSES }, (_, row) => {
              const confirmed = confirmedGuesses[row];
              if (confirmed) {
                return (
                  <Row
                    key={row}
                    letters={confirmed.word.split("")}
                    marks={confirmed.marks}
                    shake={false}
                    animateReveal={row === lastConfirmedRow}
                  />
                );
              }
              const isActiveRow = row === confirmedGuesses.length && isPlaying;
              return (
                <Row
                  key={row}
                  letters={isActiveRow ? draft.split("") : []}
                  marks={null}
                  shake={isActiveRow && shakeRow === row}
                  animateReveal={false}
                />
              );
            })}
          </div>

          {/* Mensagem de resultado */}
          {isFinished && (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-lg font-semibold" role="status">
                {state.status === "WON" ? messages.won(confirmedGuesses.length) : messages.lost}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <DailyShareAction onShare={onShare} status={shareStatus} />

                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => onStatsOpenChange(true)}
                >
                  <BarChart2 className="h-4 w-4" />
                  {messages.viewStats}
                </Button>
              </div>
            </div>
          )}

          {/* Teclado virtual */}
          {isPlaying && (
            <div
              className="w-full max-w-[480px] px-1 sm:px-2 mx-auto"
              role="group"
              aria-label={messages.keyboardLabel}
            >
              {KEYBOARD_ROWS.map((row, ri) => (
                <div key={ri} className="mb-1 sm:mb-1.5 flex justify-center gap-1 sm:gap-1.5">
                  {row.map((key) => {
                    const isAction = key === "ENTER" || key === "⌫";
                    const mark = !isAction ? keyMap[key] : undefined;
                    return (
                      <button
                        key={key}
                        aria-label={
                          key === "⌫"
                            ? messages.keyDelete
                            : key === "ENTER"
                              ? messages.keyEnter
                              : messages.keyLetter(key)
                        }
                        className={keyClasses(mark, isAction)}
                        onClick={() => onKey(key)}
                        disabled={guessPending}
                        type="button"
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ranking */}
      <DailyRanking
        titleClassName="mt-6 font-semibold"
        loading={ranking.loading}
        error={ranking.error}
        onRetry={ranking.onRetry}
        entries={ranking.items?.map((item) => ({
          username: item.username,
          name: item.name,
          href: item.href,
          detail: messages.rankingDetail(item.attempts),
        }))}
      />

      {/* ── Modal Como Jogar ── */}
      <Dialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{messages.howToPlay}</DialogTitle>

            <DialogDescription className="text-sm pt-1">
              {messages.howToPlayIntro}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm mt-2">
            {/* Exemplo 1: TURMA */}
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <span className="grid h-10 w-10 place-items-center rounded bg-[#21a35d] font-bold text-white">
                  T
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  U
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  R
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  M
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  A
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {messages.letterIntro} <strong className="text-foreground">T</strong>{" "}
                {messages.exampleCorrect}
              </p>
            </div>

            {/* Exemplo 2: VIOLA */}
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  V
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  I
                </span>

                <span className="grid h-10 w-10 place-items-center rounded bg-[#c8a227] font-bold text-white">
                  O
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  L
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  A
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {messages.letterIntro} <strong className="text-foreground">O</strong>{" "}
                {messages.examplePresent}
              </p>
            </div>

            {/* Exemplo 3: PULGA */}
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  P
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  U
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  L
                </span>

                <span className="grid h-10 w-10 place-items-center rounded bg-muted font-bold text-muted-foreground">
                  G
                </span>

                <span className="grid h-10 w-10 place-items-center rounded border-2 border-border/60 font-bold">
                  A
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {messages.letterIntro} <strong className="text-foreground">G</strong>{" "}
                {messages.exampleAbsent}
              </p>
            </div>

            <div className="border-t border-border/60 pt-3 space-y-2 text-xs text-muted-foreground">
              <p>{messages.ruleAccents}</p>

              <p>{messages.ruleRepeated}</p>

              <p>{messages.ruleDaily}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal Estatísticas ── */}
      <Dialog open={statsOpen} onOpenChange={onStatsOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">{messages.stats}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            {/* 4 indicadores principais */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-2xl font-bold">{stats.played}</p>

                <p className="text-[11px] text-muted-foreground">{messages.statsPlayed}</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-2xl font-bold">
                  {stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%
                </p>

                <p className="text-[11px] text-muted-foreground">{messages.statsWins}</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-2xl font-bold">{stats.currentStreak}</p>

                <p className="text-[11px] text-muted-foreground">{messages.statsCurrentStreak}</p>
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5">
                <p className="text-2xl font-bold">{stats.maxStreak}</p>

                <p className="text-[11px] text-muted-foreground">{messages.statsMaxStreak}</p>
              </div>
            </div>

            {/* Gráfico de Distribuição de tentativas */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {messages.distribution}
              </h4>

              <div className="space-y-1.5 text-xs font-medium">
                {([1, 2, 3, 4, 5, 6] as const).map((attempt) => {
                  const count = stats.distribution[attempt] || 0;
                  const maxCount = Math.max(1, ...Object.values(stats.distribution));
                  const pct = Math.max(8, (count / maxCount) * 100);
                  const isToday =
                    isFinished && confirmedGuesses.length === attempt && state?.status === "WON";
                  return (
                    <div key={attempt} className="flex items-center gap-2">
                      <span className="w-2 text-right">{attempt}</span>

                      <div className="flex-1">
                        <div
                          className={`flex items-center justify-end px-2 py-1 rounded text-[11px] font-bold text-white transition-all duration-500 ${
                            isToday ? "bg-[#21a35d]" : "bg-muted-foreground/60"
                          }`}
                          style={{ width: `${pct}%` }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botão de compartilhar */}
            {isFinished && <DailyShareAction onShare={onShare} status={shareStatus} block />}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
