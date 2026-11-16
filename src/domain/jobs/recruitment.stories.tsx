import type { Meta, StoryObj } from "@storybook/react-vite";

import type { RecruitmentCandidate } from "../../types/domain/jobs/recruitment-candidate.js";
import type { RecruitmentScore } from "../../types/domain/jobs/recruitment-score.js";
import type { RecruitmentTableRow } from "../../types/domain/jobs/recruitment-table-row.js";

import { RecruitmentBoard } from "./recruitment-board.js";
import { RecruitmentDetailDialog } from "./recruitment-detail-dialog.js";
import { RecruitmentScoreLine } from "./recruitment-score-line.js";
import { RecruitmentTable } from "./recruitment-table.js";

const meta: Meta = {
  title: "Domain/Jobs/Recruitment",
};

export default meta;

const noop = () => {};

const score: RecruitmentScore = {
  total: 78,
  available: true,
  components: [
    {
      code: "SKILLS",
      label: "3 de 5 requisitos da vaga: Java, Spring, SQL",
      points: 45,
      maxPoints: 75,
    },
    { code: "IDENTITY", label: "Identidade verificada", points: 25, maxPoints: 25 },
  ],
};

const unavailable: RecruitmentScore = {
  total: 0,
  available: false,
  components: [{ code: "IDENTITY", label: "Identidade não verificada", points: 0, maxPoints: 25 }],
};

const card = (overrides: Partial<RecruitmentCandidate> = {}): RecruitmentCandidate => ({
  applicationId: "app_1",
  userId: "user_1",
  name: "Ana Souza",
  avatarUrl: null,
  headline: "Engenheira de software",
  status: "IN_REVIEW",
  statusLabel: "Em análise",
  appliedAt: "2026-11-01T12:00:00Z",
  stageId: "stage_1",
  rejected: false,
  score,
  ...overrides,
});

const stages = [
  { id: "stage_1", name: "Triagem", position: 0 },
  { id: "stage_2", name: "Entrevista", position: 1 },
  { id: "stage_3", name: "Proposta", position: 2 },
];

const rows: RecruitmentTableRow[] = [
  { ...card(), stageName: "Triagem" },
  {
    ...card({ applicationId: "app_2", name: "Bruno Lima", headline: null, score: unavailable }),
    stageName: "Entrevista",
  },
];

export const Board: StoryObj = {
  render: () => (
    <RecruitmentBoard
      stages={stages}
      columns={[
        {
          stageId: "stage_1",
          cards: [card(), card({ applicationId: "app_3", name: "Carla Dias" })],
        },
        {
          stageId: "stage_2",
          cards: [card({ applicationId: "app_2", name: "Bruno Lima", score: unavailable })],
        },
        { stageId: "stage_3", cards: [] },
      ]}
      rejected={[
        card({
          applicationId: "app_4",
          name: "Diego Reis",
          status: "NOT_SELECTED",
          statusLabel: "Não selecionado",
          rejected: true,
        }),
      ]}
      summary={{ total: 4, inProcess: 3, rejected: 1 }}
      selectedIds={["app_3"]}
      onToggleSelected={noop}
      onOpen={noop}
      onBatchMove={noop}
      resultNote="2 movidas, 1 recusada: esta candidatura foi reprovada e não se move no pipeline."
    />
  ),
};

export const BoardWithoutConfiguredFlow: StoryObj = {
  render: () => (
    <RecruitmentBoard
      stages={[]}
      columns={[{ stageId: null, cards: [card({ stageId: null })] }]}
      rejected={[]}
      summary={{ total: 1, inProcess: 1, rejected: 0 }}
      selectedIds={[]}
      onToggleSelected={noop}
      onOpen={noop}
      onBatchMove={noop}
    />
  ),
};

export const Table: StoryObj = {
  render: () => (
    <RecruitmentTable
      rows={rows}
      stages={stages}
      statusOptions={[
        { value: "APPLIED", label: "Nova" },
        { value: "IN_REVIEW", label: "Em análise" },
        { value: "ADVANCED", label: "Avançou" },
        { value: "NOT_SELECTED", label: "Não selecionado" },
      ]}
      statusFilter={null}
      onStatusFilter={noop}
      search=""
      onSearch={noop}
      selectedIds={["app_1"]}
      onToggleSelected={noop}
      onTogglePage={noop}
      onOpen={noop}
      onBatchMove={noop}
      hasMore
      onLoadMore={noop}
    />
  ),
};

export const TableEmpty: StoryObj = {
  render: () => (
    <RecruitmentTable
      rows={[]}
      stages={stages}
      statusOptions={[]}
      statusFilter={null}
      onStatusFilter={noop}
      search=""
      onSearch={noop}
      selectedIds={[]}
      onToggleSelected={noop}
      onTogglePage={noop}
      onOpen={noop}
      onBatchMove={noop}
      hasMore={false}
      onLoadMore={noop}
    />
  ),
};

export const ScorePill: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <RecruitmentScoreLine score={score} />
      <RecruitmentScoreLine score={unavailable} />
      <RecruitmentScoreLine score={null} />
    </div>
  ),
};

export const DetailDialog: StoryObj = {
  render: () => (
    <RecruitmentDetailDialog
      open
      onOpenChange={noop}
      detail={{
        applicationId: "app_1",
        name: "Ana Souza",
        avatarUrl: null,
        headline: "Engenheira de software",
        identityVerified: true,
        reputation: 120,
        experienceYears: 5,
        experiencesCount: 3,
        location: "São Paulo",
        skills: ["Java", "Spring", "SQL"],
        message: "Tenho interesse na vaga porque já trabalhei com pagamentos.",
        answers: [{ label: "Disponibilidade", value: "Imediata" }],
        statusLabel: "Em análise",
        score,
      }}
    />
  ),
};
