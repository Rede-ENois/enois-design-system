import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { GitHubLinkCard } from "./github-link-card.js";
import { IdentitySection } from "./identity-section.js";
import { IdentityVerificationSection } from "./identity-verification-section.js";
import { LinkedinContactsSection } from "./linkedin-contacts-section.js";
import { LinkedinImportSection } from "./linkedin-import-section.js";

const meta: Meta = {
  title: "Domain/Security",
};

export default meta;

const badgeArt =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='%236746f5'/></svg>";

const otherBadgeArt =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' rx='8' fill='%23f59e0b'/></svg>";

const sampleKits = [
  { id: "bkit_1", badges: [badgeArt, otherBadgeArt], createdAtLabel: "05/11/2026" },
  { id: "bkit_2", badges: [otherBadgeArt], createdAtLabel: "28/10/2026" },
];

export const Identity: StoryObj = {
  render: function IdentityStory() {
    const [badges, setBadges] = useState<string[]>([badgeArt]);
    return (
      <IdentitySection
        identity={{ socialName: "Ana", nickname: null, pronouns: "ela/dela" }}
        onSave={() => {}}
        badges={badges}
        onAddBadge={() => {}}
        onRemoveBadge={(url) => setBadges(badges.filter((badge) => badge !== url))}
        badgeKits={sampleKits}
        onApplyBadgeKit={(kit) => setBadges(kit.badges)}
      />
    );
  },
};

export const VerificationWaiting: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "NOT_VERIFIED", released: false, providerAvailable: true }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

export const VerificationEligible: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "NOT_VERIFIED", released: true, providerAvailable: true }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

export const VerificationInProgress: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "PENDING", released: true, providerAvailable: true }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

export const Verification: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "VERIFIED", verified: true, released: true, providerAvailable: true }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

export const VerificationDeclined: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "REJECTED", released: true, providerAvailable: true }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

export const VerificationUnavailable: StoryObj = {
  render: () => (
    <IdentityVerificationSection
      status={{ state: "NOT_VERIFIED", released: true, providerAvailable: false }}
      onStart={() => {}}
      onRefresh={() => {}}
      onRevoke={() => {}}
    />
  ),
};

const base = {
  onImportArchive: () => {},
  onImportText: () => {},
  onImportResume: () => {},
  onSave: () => {},
  onCancelPreview: () => {},
};

export const LinkedinImport: StoryObj = {
  render: function LinkedinImportStory() {
    const [pasteOpen, setPasteOpen] = useState(false);
    return (
      <LinkedinImportSection
        {...base}
        linkedinConnected
        preview={null}
        selected={{}}
        onToggle={() => {}}
        pasteOpen={pasteOpen}
        onPasteOpenChange={setPasteOpen}
        contactsSection={
          <LinkedinContactsSection
            summary={{
              autoInvite: true,
              contacts: 42,
              invited: 12,
              pending: 2,
              alreadyConnected: 5,
              noMatch: 20,
              ambiguous: 1,
              skipped: 0,
              queued: 2,
            }}
            onRetry={() => {}}
            onAutoInviteChange={() => {}}
            onImport={() => {}}
          />
        }
      />
    );
  },
};

export const LinkedinImportPreview: StoryObj = {
  render: function LinkedinImportPreviewStory() {
    const [selected, setSelected] = useState<Record<string, boolean>>({ perfil: true, exp0: true });
    return (
      <LinkedinImportSection
        {...base}
        linkedinConnected
        preview={{
          profile: { headline: "Dev front-end", location: "Recife", summary: "Resumo" },
          skills: ["React", "TypeScript"],
          experiences: [{ title: "Dev", company: "Énóis" }],
          education: [],
          certifications: [],
          projects: [],
          semEstrutura: { Idiomas: 2 },
          found: 3,
        }}
        selected={selected}
        onToggle={(key) => setSelected({ ...selected, [key]: !selected[key] })}
        pasteOpen={false}
        onPasteOpenChange={() => {}}
      />
    );
  },
};

const gitHubLinkBase = {
  onLink: () => {},
  onUnlink: () => {},
  onSync: () => {},
  criteriaHref: "/selos",
};

export const GitHubLinkUnlinked: StoryObj = {
  render: () => <GitHubLinkCard {...gitHubLinkBase} status={{ linked: false }} />,
};

export const GitHubLinkSynced: StoryObj = {
  render: () => (
    <GitHubLinkCard
      {...gitHubLinkBase}
      status={{ linked: true, login: "ana", syncState: "OK", lastSyncLabel: "27/10/2026 às 14:30" }}
      syncResult={{ contributions: 3, issues: 1, rateLimited: false }}
    />
  ),
};
