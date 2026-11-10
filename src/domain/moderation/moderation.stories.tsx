import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppealsSection } from "./appeals-section.js";
import { ContributionsSection } from "./contributions-section.js";
import { ContributorCard } from "./contributor-card.js";
import { ContributorsSection } from "./contributors-section.js";
import { DisputesSection } from "./disputes-section.js";
import { EmailLogSection } from "./email-log-section.js";
import { GamesReviewSection } from "./games-review-section.js";
import { IdentityReleaseSection } from "./identity-release-section.js";
import { MonitoringSection } from "./monitoring-section.js";
import { NotesSection } from "./notes-section.js";
import { PanicModeSection } from "./panic-mode-section.js";
import { ProjectsReviewSection } from "./projects-review-section.js";
import { PullRequestsSection } from "./pull-requests-section.js";
import { SupportTicketsSection } from "./support-tickets-section.js";
import { SuspiciousPostsSection } from "./suspicious-posts-section.js";
import { SuspiciousUsersSection } from "./suspicious-users-section.js";
import { TicketReply } from "./ticket-reply.js";
import { TicketThread } from "./ticket-thread.js";

const meta: Meta = {
  title: "Domain/Moderation",
};

export default meta;

const noop = () => {};
const resolved = async () => true;

export const Queues: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <PanicModeSection active={false} envLocked={false} onActivate={noop} onDeactivate={noop} />
      <AppealsSection
        loading={false}
        appeals={[
          { id: "a1", message: "Foi um engano, era ironia.", createdAtLabel: "18/10/2026, 10:30" },
        ]}
        onApprove={noop}
        onDeny={noop}
      />
      <DisputesSection
        loading={false}
        disputes={[
          {
            id: "d1",
            amountLabel: "1.500",
            reason: "GOLPE",
            createdAtLabel: "18/10/2026, 10:30",
            entryRef: "ref-1234567890abcdef",
          },
        ]}
        onUphold={noop}
        onReject={noop}
      />

      <ContributorsSection loading={false} error={false} empty={false} onRefresh={noop}>
        <ContributorCard
          application={{
            id: "c1",
            name: "Ana Silva",
            github: "ana",
            email: "ana@example.com",
            area: "frontend",
            experience: "pleno",
            message: "Quero ajudar com acessibilidade.",
            status: "NEW",
            githubVerified: false,
            formPending: false,
            sealName: null,
            evidenceCount: null,
            createdAtLabel: "18/10/2026, 10:30",
            acceptedTermsAtLabel: "18/10/2026",
          }}
          onReview={noop}
          onApprove={noop}
          onReject={noop}
        />
        <ContributorCard
          application={{
            id: null,
            name: "Bia Costa",
            github: "biacosta",
            email: null,
            area: null,
            experience: null,
            message: null,
            status: "APPROVED",
            githubVerified: true,
            formPending: true,
            sealName: "Código",
            evidenceCount: 3,
            createdAtLabel: "19/10/2026, 09:12",
            acceptedTermsAtLabel: null,
          }}
          onReview={noop}
          onApprove={noop}
          onReject={noop}
        />
      </ContributorsSection>

      <EmailLogSection
        loading={false}
        emails={[
          {
            id: "e1",
            toEmail: "ana@example.com",
            subject: "Bem-vinda",
            kind: "WELCOME",
            status: "SENT",
            error: null,
            createdAtLabel: "18/10/2026, 10:30",
          },
          {
            id: "e2",
            toEmail: "bia@example.com",
            subject: "Redefinir senha",
            kind: "PASSWORD_RESET",
            status: "FAILED",
            error: "SMTP timeout",
            createdAtLabel: "18/10/2026, 10:31",
          },
        ]}
      />
    </div>
  ),
};

export const Reviews: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <GamesReviewSection
        loading={false}
        games={[
          {
            id: "g1",
            userId: "u1",
            username: "ana",
            title: "Corrida",
            description: "Um jogo de corrida.",
            cover: "",
            url: "https://example.com/jogo",
            tags: "corrida",
            aspect: null,
            submittedAtLabel: "18/10/2026",
          },
        ]}
        onApprove={noop}
        onReject={noop}
      />
      <ProjectsReviewSection
        loading={false}
        error={false}
        projects={[
          {
            id: "p1",
            title: "Agenda comunitária",
            username: "ana",
            category: null,
            shortDescription: "Eventos do bairro.",
            url: "https://example.com",
            repoUrl: "https://github.com/ana/agenda",
          },
        ]}
        onApprove={noop}
        onReject={noop}
      />
      <SupportTicketsSection
        history={false}
        locked={false}
        categories={["BUG", "ACCOUNT", "CONTENT", "IDEA", "OTHER"]}
        category={undefined}
        onCategoryChange={noop}
        statusFilters={["ALL", "OPEN", "IN_PROGRESS"]}
        status="ALL"
        onStatusChange={noop}
        loading={false}
        tickets={[
          {
            id: "t1",
            category: "BUG",
            status: "OPEN",
            subject: "Não consigo entrar",
            message: "A página fica carregando.",
            contactEmail: "ana@example.com",
            imageUrl: null,
            adminReply: null,
            githubIssueNumber: 42,
            githubIssueUrl: "https://github.com",
            createdAtLabel: "18/10/2026, 10:30",
            repliedAtLabel: null,
          },
        ]}
        onStart={noop}
        onResolve={noop}
        onReopen={noop}
        renderThread={(ticket) => (
          <TicketThread
            mirrored={ticket.githubIssueNumber != null}
            legacyReply={null}
            legacyRepliedAtLabel={null}
            messages={[
              {
                id: "m1",
                direction: "GITHUB",
                authorGithubLogin: "bia",
                body: "Consegui reproduzir no Firefox.",
                createdAtLabel: "18/10/2026, 11:00",
              },
              {
                id: "m2",
                direction: "ENOIS",
                authorName: "Suporte",
                body: "Corrigido, pode testar de novo?",
                createdAtLabel: "18/10/2026, 12:10",
              },
            ]}
          />
        )}
        renderReply={() => <TicketReply onSubmit={resolved} />}
      />
      <NotesSection
        loading={false}
        reviewing={{ id: "cm0note0000abc123", status: "APPROVED" }}
        onReview={resolved}
        notes={[
          {
            id: "cm0note0000abc123",
            postHref: "/post/p1",
            body: "O dado citado é de 2019; o relatório de 2026 mostra outro número.",
            createdAtLabel: "18/10/2026, 10:31",
            authorId: "u1",
            authorUsername: "bia",
            authorName: "Bia",
          },
          {
            id: "cm0note0000def456",
            postHref: "/post/p2",
            body: "A foto é de outro evento.",
            createdAtLabel: "18/10/2026, 11:02",
            authorId: "u2",
            authorUsername: null,
            authorName: null,
          },
        ]}
      />
      <NotesSection loading={false} notes={[]} reviewing={null} onReview={resolved} />
    </div>
  ),
};

export const Github: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <PullRequestsSection
        loading={false}
        showWriteHint
        onConnectWrite={noop}
        reviewing={{ key: "rede-enois/frontend#12", decision: "APPROVE" }}
        onReview={resolved}
        pulls={[
          {
            repository: "rede-enois/frontend",
            number: 12,
            title: "Corrige o carregamento infinito do login",
            url: "https://github.com/rede-enois/frontend/pull/12",
            authorLogin: "bia",
            authorAvatarUrl: null,
            updatedAtLabel: "18/10/2026, 10:30",
          },
          {
            repository: "rede-enois/backend",
            number: 7,
            title: "Adiciona limite de taxa no envio de e-mail",
            url: "https://github.com/rede-enois/backend/pull/7",
            authorLogin: null,
            authorAvatarUrl: null,
            updatedAtLabel: null,
          },
        ]}
      />
      <ContributionsSection
        filter="PENDING"
        onFilterChange={noop}
        kind="ALL"
        onKindChange={noop}
        loading={false}
        loadError={false}
        onRefresh={noop}
        onReview={noop}
        onSync={noop}
        report={{
          created: 2,
          updated: 1,
          fetched: 10,
          issuesCreated: 1,
          issuesUpdated: 0,
          issuesFetched: 4,
          repositories: ["rede-enois/frontend", "rede-enois/backend"],
          detailsFetched: 3,
          revertedFlagged: 0,
          rateLimited: true,
          errors: [],
        }}
        contributions={[
          {
            id: "g1",
            kind: "PULL_REQUEST",
            title: "Corrige o carregamento infinito do login",
            url: "https://github.com/rede-enois/frontend/pull/12",
            repository: "rede-enois/frontend",
            number: 12,
            username: "bia",
            githubLogin: "bia",
            status: "PENDING",
            happenedAtLabel: "18/10/2026, 10:30",
            hasTests: true,
            changedFiles: 4,
            additions: 120,
            deletions: 30,
            score: 8,
            labels: '["bug","frontend"]',
            reverted: false,
            reviewNote: null,
          },
          {
            id: "g2",
            kind: "ISSUE",
            title: "Login trava no Firefox",
            url: "https://github.com/rede-enois/frontend/issues/9",
            repository: "rede-enois/frontend",
            number: 9,
            username: null,
            githubLogin: "carlos",
            status: "VALIDATED",
            happenedAtLabel: null,
            hasTests: false,
            changedFiles: 0,
            additions: 0,
            deletions: 0,
            score: 0,
            labels: null,
            reverted: false,
            reviewNote: "Reprodução clara e útil.",
          },
        ]}
        repositories={[
          { repository: "rede-enois/frontend", enabled: true },
          { repository: "rede-enois/legacy", enabled: false },
        ]}
        onToggleRepository={noop}
      />
    </div>
  ),
};

export const Triage: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <SuspiciousUsersSection
        loading={false}
        error={false}
        users={[
          {
            username: "teste123",
            name: "Teste",
            riskScore: 55,
            staff: false,
            posts: 0,
            comments: 0,
            reportsAgainst: 2,
            signals: ["NOME_SUSPEITO", "EMAIL_NAO_VERIFICADO"],
            createdAtLabel: "18/10/2026",
          },
        ]}
        banTypes={["BAN", "PERMABAN"]}
        onBan={resolved}
      />
      <SuspiciousPostsSection
        loading={false}
        posts={[
          {
            postId: "post-1234567890abcdefgh",
            reportId: "r1",
            score: 80,
            reason: "SPAM",
            signals: ["REASON_SPAM", "NEW_ACCOUNT"],
            href: "#",
          },
        ]}
        onDelete={resolved}
      />
    </div>
  ),
};

const series = Array.from({ length: 60 }, (_, index) => ({
  requests: 40 + Math.round(20 * Math.sin(index / 6)),
  errors4xx: index % 7 === 0 ? 3 : 0,
  errors5xx: index % 13 === 0 ? 1 : 0,
  p95Ms: 120 + (index % 10) * 5,
  p99Ms: 240 + (index % 10) * 8,
  maxMs: 400 + (index % 10) * 20,
  cpuPercent: 20 + (index % 15),
  heapMb: 300 + (index % 20) * 4,
}));

export const Monitoring: StoryObj = {
  render: () => (
    <MonitoringSection
      loading={false}
      overview={{
        uptimeSeconds: 93_784,
        requestsPerSecond: 0.8,
        requestsLastMinute: 48,
        inFlight: 2,
        peakInFlight: 14,
        requestsTotal: 182_330,
        p50Ms: 35,
        p95Ms: 140,
        p99Ms: 280,
        maxMs: 900,
        errors4xxLastMinute: 3,
        errors5xxLastMinute: 0,
        slowLastMinute: 1,
        rateLimitedLastMinute: 0,
        errorRate: 0.6,
        droppedEvents: 0,
        statusCounts: [
          { label: "2xx", count: 4200 },
          { label: "4xx", count: 31 },
        ],
        methodCounts: [{ label: "GET", count: 3900 }],
        topRoutes: [{ label: "GET /feed", count: 1200 }],
        series,
        jvm: { heapUsedBytes: 400 * 1024 ** 2, heapMaxBytes: 1024 ** 3, processors: 2 },
        resources: {
          heapUsedBytes: 400 * 1024 ** 2,
          heapMaxBytes: 1024 ** 3,
          nonHeapUsedBytes: 120 * 1024 ** 2,
          gcCount: 120,
          gcTimeMs: 900,
          threads: 48,
          peakThreads: 60,
          loadedClasses: 18_000,
          processCpuPercent: 22,
          systemCpuPercent: 35,
          loadAverage: 0.7,
          systemMemoryTotalBytes: 4 * 1024 ** 3,
          systemMemoryFreeBytes: 1024 ** 3,
          diskTotalBytes: 20 * 1024 ** 3,
          diskFreeBytes: 12 * 1024 ** 3,
          cgroupMemoryUsedBytes: 900 * 1024 ** 2,
          cgroupMemoryMaxBytes: 2 * 1024 ** 3,
          cgroupCpuCores: 1,
          cgroupCpuPercent: 30,
          dbPool: { active: 2, max: 10, waiting: 0 },
        },
      }}
      onRefresh={noop}
      generatedAtLabel="10:30:00"
      supply={{
        totalLabel: "21.000.000",
        cofreLabel: "20.000.000",
        circulacaoLabel: "1.000.000",
        coerente: true,
      }}
      paused={false}
      onTogglePaused={noop}
      levels={["ERROR", "WARN", "INFO", "DEBUG"]}
      level=""
      onLevelChange={noop}
      types={["HTTP"]}
      type=""
      onTypeChange={noop}
      search=""
      onSearchChange={noop}
      from=""
      to=""
      onFromChange={noop}
      onToChange={noop}
      onLastHour={noop}
      onClearDates={noop}
      onlyFailures={false}
      onOnlyFailures={noop}
      filtered={false}
      rows={[
        {
          id: "ev1",
          createdAt: "2026-10-18T13:30:00Z",
          timeLabel: "10:30:00",
          level: "ERROR",
          type: "HTTP",
          message: "Falha ao salvar o post",
          requestId: "req-1",
          method: "POST",
          path: "/posts",
          route: "/posts",
          status: 500,
          durationMs: 120,
          userId: null,
          clientIp: null,
          metadata: null,
        },
      ]}
      onLoadMore={noop}
    />
  ),
};

export const IdentityRelease: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <IdentityReleaseSection
        onRefresh={noop}
        onRunRound={resolved}
        onSavePolicy={() => {}}
        rounds={[
          {
            id: "r2",
            executedAtLabel: "09/11/2026, 10:00",
            eligibleCount: 14,
            releasedCount: 10,
            minReputation: 50,
            rankStart: 11,
            rankEnd: 20,
            state: "COMPLETED",
            reservedCapacityUsed: 2,
            note: null,
          },
          {
            id: "r1",
            executedAtLabel: "08/11/2026, 10:00",
            eligibleCount: 10,
            releasedCount: 10,
            minReputation: 70,
            rankStart: 1,
            rankEnd: 10,
            state: "PAUSED",
            reservedCapacityUsed: 3,
            note: "Pausada ao bater o teto de verificações simultâneas.",
          },
        ]}
        overview={{
          totalUsers: 3200,
          releasedUsers: 25,
          inFlight: 3,
          startedThisCycle: 12,
          remainingCapacity: 13,
          estimatedSpentUsdLabel: "3,96",
          budgetUsdLabel: "10,00",
          monthlyLimit: 25,
          lastRound: null,
          providerAvailable: true,
          policy: {
            usersPerRound: 10,
            intervalMinutes: 1440,
            minReputation: 50,
            reservedQuotaPercent: 20,
            maxSimultaneous: 5,
            paused: false,
            nextRoundAtLabel: "10/11/2026, 10:00",
          },
        }}
      />
    </div>
  ),
};

export const IdentityReleaseBlocked: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <IdentityReleaseSection
        overview={{
          totalUsers: 3200,
          releasedUsers: 25,
          inFlight: 0,
          startedThisCycle: 25,
          remainingCapacity: 0,
          estimatedSpentUsdLabel: "8,25",
          budgetUsdLabel: "10,00",
          monthlyLimit: 25,
          lastRound: null,
          providerAvailable: false,
          policy: {
            usersPerRound: 10,
            intervalMinutes: 1440,
            minReputation: 50,
            reservedQuotaPercent: 20,
            maxSimultaneous: 0,
            paused: true,
            nextRoundAtLabel: null,
          },
        }}
        rounds={[]}
        error
        onRefresh={noop}
        onRunRound={resolved}
        onSavePolicy={() => {}}
      />
    </div>
  ),
};
