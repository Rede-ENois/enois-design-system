import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DailyShareStatus } from "../../types/domain/games/daily-share-status.js";

import { DailyBlocks } from "./daily/daily-blocks.js";
import { DailyGamesPanel } from "./daily/daily-games-panel.js";
import { DailyMaze } from "./daily/daily-maze.js";
import { DailyWord } from "./daily/daily-word.js";
import { GameAnalyticsCard } from "./game-analytics-card.js";
import { GameCommentsSection } from "./game-comments-section.js";
import { GameDetail } from "./game-detail.js";
import { GamePlayer } from "./game-player.js";
import { GameReviewsSection } from "./game-reviews-section.js";
import { GameStatsLine } from "./game-stats-line.js";
import { TodayGamesCard } from "./today-games-card.js";

const meta: Meta = {
  title: "Domain/Games",
};

export default meta;

const game = {
  id: "g1",
  username: "estudio-pixel",
  title: "Corrida no Cerrado",
  description: "Um corredor infinito entre ipês e lobos-guará.",
  cover: null,
  url: "https://jogo.exemplo.com/",
  status: "PUBLISHED",
  genres: ["Ação", "Corrida"],
  languages: ["Português"],
  controls: "Setas ou toque",
  requirements: null,
  contentWarnings: null,
  stage: "EARLY_ACCESS",
  distribution: "FREE",
  priceCoins: 0,
  version: "1.2",
  mediaIds: [],
};

const ranking = {
  loading: false,
  error: false,
  onRetry: () => {},
  items: [
    {
      username: "ana",
      name: "Ana Lima",
      href: "#",
      attempts: 3,
      elapsedMillis: 41200,
      moves: 52,
      score: 1240,
      lines: 10,
    },
  ],
};

const noop = () => {};

export const Detail: StoryObj = {
  render: () => (
    <GameDetail
      notFound={false}
      game={game}
      username="estudio-pixel"
      gamesHref="#"
      developerHref="#"
      owned
      favorited={false}
      favoriteDisabled={false}
      onToggleFavorite={noop}
      onShare={noop}
      onEdit={noop}
      onNewUpdate={noop}
      renderBannerFrame={() => null}
      accountChanged={false}
      player={
        <GamePlayer
          url={game.url}
          title={game.title}
          stats={<GameStatsLine plays={12} players={5} favorites={3} />}
        />
      }
      spend={null}
      spendPending={false}
      onSpendDismiss={noop}
      onSpendConfirm={noop}
      achievement={null}
      achievementPending={false}
      onAchievementDismiss={noop}
      onAchievementPublish={noop}
      reviews={
        <GameReviewsSection
          data={{ average: 4.5, count: 2, items: [] }}
          loading={false}
          viewerId="u2"
          ownerId="u1"
          onSave={noop}
          onRemove={async () => {}}
        />
      }
      comments={
        <GameCommentsSection
          data={{ count: 0, items: [] }}
          loading={false}
          viewerId={null}
          ownerId="u1"
          onAdd={async () => {}}
          onRemove={noop}
        />
      }
      updates={[
        { id: "u1", title: "Versão 1.2 no ar", version: "1.2", dateLabel: "20 de outubro de 2026" },
      ]}
    />
  ),
};

export const TodayCard: StoryObj = {
  render: () => (
    <div className="max-w-xs">
      <TodayGamesCard
        loading={false}
        games={[{ id: "g1", title: game.title, url: game.url, players: 8, href: "#" }]}
      />
    </div>
  ),
};

export const Analytics: StoryObj = {
  render: function AnalyticsStory() {
    const [days, setDays] = useState(7);

    return (
      <GameAnalyticsCard
        days={days}
        onDaysChange={setDays}
        loading={false}
        error={false}
        data={{
          plays: 40,
          players: 21,
          favorites: 6,
          updates: 1,
          series: Array.from({ length: days }, (_, i) => ({
            date: `2026-10-${String(i + 1).padStart(2, "0")}`,
            pageViews: (i * 7) % 13,
            plays: i % 4,
            players: i % 3,
          })),
        }}
      />
    );
  },
};

export const DailyPanel: StoryObj = {
  render: () => (
    <DailyGamesPanel
      wordsStatus="WON"
      mazeStatus="IN_PROGRESS"
      communityHref="#"
      prizes={[{ label: "1º lugar", amountLabel: "50" }]}
      words={
        <DailyWord
          loading={false}
          loadError={false}
          onRetryLoad={noop}
          canTogglePrevious={false}
          showPrevious={false}
          onTogglePrevious={noop}
          state={{
            date: "2026-10-26",
            status: "IN_PROGRESS",
            streak: 2,
            guesses: [
              { word: "TURMA", marks: ["CORRECT", "ABSENT", "PRESENT", "ABSENT", "ABSENT"] },
            ],
          }}
          onStart={noop}
          startPending={false}
          startError={false}
          draft="VI"
          shakeRow={null}
          lastConfirmedRow={null}
          localError={null}
          guessPending={false}
          onKey={noop}
          stats={{
            played: 4,
            won: 3,
            currentStreak: 2,
            maxStreak: 3,
            distribution: { 3: 2, 4: 1 },
          }}
          statsOpen={false}
          onStatsOpenChange={noop}
          onShare={noop}
          ranking={ranking}
        />
      }
      maze={
        <DailyMaze
          loading={false}
          loadError={false}
          onRetryLoad={noop}
          canTogglePrevious={false}
          showPrevious={false}
          onTogglePrevious={noop}
          state={{
            date: "2026-10-26",
            status: "NOT_STARTED",
            passages: null,
            position: 0,
            moves: 0,
            startedAt: null,
            completedAt: null,
          }}
          onStart={noop}
          startPending={false}
          startError={false}
          movePending={false}
          moveFailed={false}
          moveErrorMessage={null}
          onMove={noop}
          ranking={ranking}
        />
      }
      blocks={null}
    />
  ),
};

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
};

const wordStats = {
  played: 5,
  won: 4,
  currentStreak: 3,
  maxStreak: 3,
  distribution: { 3: 2, 4: 2 },
};

/** Finished word with the share button; clicking it shows the polite "copied" line. */
export const DailyWordShare: StoryObj = {
  render: function Render() {
    const [status, setStatus] = useState<DailyShareStatus>("idle");
    return (
      <DailyWord
        {...challenge}
        state={{
          date: "2026-10-30",
          status: "WON",
          streak: 3,
          guesses: [
            { word: "TURMA", marks: ["CORRECT", "ABSENT", "PRESENT", "ABSENT", "ABSENT"] },
            { word: "TRENS", marks: ["CORRECT", "CORRECT", "ABSENT", "ABSENT", "PRESENT"] },
            { word: "TROCA", marks: ["CORRECT", "CORRECT", "CORRECT", "CORRECT", "CORRECT"] },
          ],
        }}
        draft=""
        shakeRow={null}
        lastConfirmedRow={null}
        localError={null}
        guessPending={false}
        onKey={noop}
        stats={wordStats}
        statsOpen={false}
        onStatsOpenChange={noop}
        onShare={() => setStatus("copied")}
        shareStatus={status}
        ranking={ranking}
      />
    );
  },
};

/** Maze exit found, share already sent through the native sheet. */
export const DailyMazeShared: StoryObj = {
  render: () => (
    <DailyMaze
      {...challenge}
      state={{
        date: "2026-10-30",
        status: "WON",
        passages: null,
        position: 80,
        moves: 42,
        startedAt: "2026-10-30T12:00:00.000Z",
        completedAt: "2026-10-30T12:00:37.400Z",
      }}
      movePending={false}
      moveFailed={false}
      moveErrorMessage={null}
      onMove={noop}
      ranking={ranking}
      onShare={noop}
      shareStatus="shared"
    />
  ),
};

/** Blocks result when sharing failed: calm muted line, no error toast. */
export const DailyBlocksShareError: StoryObj = {
  render: () => (
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
      ranking={ranking}
      onShare={noop}
      shareStatus="error"
    />
  ),
};
