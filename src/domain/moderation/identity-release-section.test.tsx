// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { IdentityReleaseOverview } from "../../types/domain/moderation/identity-release-overview.js";
import type { IdentityReleaseRound } from "../../types/domain/moderation/identity-release-round.js";

import { IdentityReleaseSection } from "./identity-release-section.js";

const overview: IdentityReleaseOverview = {
  totalUsers: 3200,
  releasedUsers: 25,
  inFlight: 3,
  startedThisCycle: 12,
  remainingCapacity: 13,
  estimatedSpentUsdLabel: "US$ 3,96",
  budgetUsdLabel: "US$ 10,00",
  monthlyLimit: 25,
  policy: {
    usersPerRound: 10,
    intervalMinutes: 1440,
    minReputation: 50,
    reservedQuotaPercent: 20,
    maxSimultaneous: 5,
    paused: false,
    nextRoundAtLabel: null,
  },
  lastRound: null,
  providerAvailable: true,
};

const round: IdentityReleaseRound = {
  id: "r-1",
  executedAtLabel: "09/11/2026, 10:00",
  eligibleCount: 14,
  releasedCount: 10,
  minReputation: 50,
  rankStart: 1,
  rankEnd: 10,
  state: "COMPLETED",
  reservedCapacityUsed: 2,
  note: null,
};

function render(props: Partial<Parameters<typeof IdentityReleaseSection>[0]> = {}) {
  return renderToStaticMarkup(
    <IdentityReleaseSection
      overview={overview}
      rounds={[round]}
      onRefresh={() => {}}
      onRunRound={() => {}}
      onSavePolicy={() => {}}
      {...props}
    />,
  );
}

describe("IdentityReleaseSection", () => {
  it("shows the queue KPIs, the budget line and the round history", () => {
    const html = render();
    expect(html).toContain("3.200");
    expect(html).toContain("US$ 3,96");
    expect(html).toContain("Mínimo atual");
    expect(html).toContain("10 de 14 liberadas");
    expect(html).toContain("Concluída");
  });

  it("has no button that grants the seal manually", () => {
    const html = render();
    expect(html).not.toContain("Conceder selo");
    expect(html).toContain("Rodar rodada agora");
  });

  it("warns when the provider is unavailable and shows the empty history", () => {
    const html = render({ overview: { ...overview, providerAvailable: false }, rounds: [] });
    expect(html).toContain("sem credenciais");
    expect(html).toContain("Nenhuma rodada executada ainda.");
  });

  it("shows the loading skeleton", () => {
    expect(render({ loading: true, overview: undefined, rounds: [] })).toContain("animate-pulse");
  });
});
