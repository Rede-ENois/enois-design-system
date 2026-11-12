import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { BadgeSelection } from "./badge-selection.js";
import { UserBadges } from "./user-badges.js";

const meta: Meta = {
  title: "Domain/Badges",
};

export default meta;

const badge =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='%236746f5'/></svg>";

export const Badges: StoryObj = {
  render: () => (
    <p className="inline-flex items-center gap-1 text-sm">
      Ana Souza
      <UserBadges badges={[badge, badge, badge]} />
    </p>
  ),
};

export const OfficialAndUploaded: StoryObj = {
  render: () => (
    <p className="inline-flex items-center gap-1 text-sm">
      Ana Souza
      <UserBadges badges={["emblema-carapuca", badge, "emblema-vitoria-saci", "emblema-cafe"]} />
    </p>
  ),
};

const otherBadge =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' rx='8' fill='%23f59e0b'/></svg>";

const kits = [
  { id: "bkit_1", badges: [badge, otherBadge], createdAtLabel: "05/11/2026" },
  { id: "bkit_2", badges: [otherBadge], createdAtLabel: "28/10/2026" },
];

export const BadgeSelectionCurrent: StoryObj = {
  render: function BadgeSelectionCurrentStory() {
    const [badges, setBadges] = useState<string[]>([badge, otherBadge]);
    return (
      <BadgeSelection
        badges={badges}
        onAddBadge={() => {}}
        onRemoveBadge={(url) => setBadges(badges.filter((item) => item !== url))}
        badgeKits={kits}
        onApplyBadgeKit={(kit) => setBadges(kit.badges)}
      />
    );
  },
};

export const BadgeSelectionHistory: StoryObj = {
  render: function BadgeSelectionHistoryStory() {
    const [badges, setBadges] = useState<string[]>([otherBadge]);
    return (
      <BadgeSelection
        badges={badges}
        onAddBadge={() => {}}
        onRemoveBadge={() => {}}
        badgeKits={kits}
        onApplyBadgeKit={(kit) => setBadges(kit.badges)}
        initialTab="history"
      />
    );
  },
};

export const BadgeSelectionFull: StoryObj = {
  render: () => (
    <BadgeSelection
      badges={[badge, otherBadge, badge, otherBadge, badge]}
      onAddBadge={() => {}}
      onRemoveBadge={() => {}}
      badgeKits={[]}
      onApplyBadgeKit={() => {}}
    />
  ),
};
