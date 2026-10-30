import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { AccountIdentity } from "../../types/domain/account/account-identity.js";

import { AccountMenu } from "./account-menu.js";
import { AgeGate } from "./age-gate.js";
import { BlockUserDialog } from "./block-user-dialog.js";
import { ChangeEmailDialog } from "./change-email-dialog.js";
import { ChangePasswordDialog } from "./change-password-dialog.js";
import { DeleteAccountDialog } from "./delete-account-dialog.js";
import { LinkedAccountsDialog } from "./linked-accounts-dialog.js";
import { LinkedInSyncPrompt } from "./linkedin-sync-prompt.js";
import { PushToggle } from "./push-toggle.js";

const meta: Meta = {
  title: "Domain/Account",
};

export default meta;

const hrefs = {
  profile: "#",
  corporateProfile: "#",
  wallet: "#",
  marketplace: "#",
  support: "#",
  security: "#",
  blockedUsers: "#",
  myReports: "#",
  sanctions: "#",
  guardian: "#",
  moderator: "#",
  apoie: "#",
  notificationPreferences: "#",
};

export const Menu: StoryObj = {
  render: function MenuStory() {
    const [open, setOpen] = useState(true);
    const [identity, setIdentity] = useState<AccountIdentity>("SOCIAL");
    const [push, setPush] = useState(false);

    return (
      <div className="flex justify-end">
        <AccountMenu
          profile={{ name: "Ana Souza", email: "ana@example.com", avatar: null }}
          hrefs={hrefs}
          open={open}
          onOpenChange={setOpen}
          showIdentitySwitch
          corporateIdentityEnabled
          identity={identity}
          onChooseIdentity={setIdentity}
          onChangeEmail={() => {}}
          onChangePassword={() => {}}
          onOpenLinkedAccounts={() => {}}
          onOpenHealthyUsage={() => {}}
          onDeleteAccount={() => {}}
          onLogout={() => {}}
          loggingOut={false}
          pushToggle={
            <PushToggle
              active={push}
              busy={false}
              error={null}
              onToggle={() => setPush((value) => !value)}
            />
          }
        />
      </div>
    );
  },
};

const ageGateBase = {
  open: true,
  onClose: () => {},
  minDate: "1906-01-01",
  maxDate: "2026-10-26",
  error: null,
  declaring: false,
  inviting: false,
  checking: false,
  onSubmitDate: () => {},
  onSubmitInvite: () => {},
  onCheckAgain: () => {},
};

export const AgeGateDate: StoryObj = {
  render: () => <AgeGate {...ageGateBase} mode="date" inviteSentTo={null} />,
};

export const AgeGateParental: StoryObj = {
  render: () => <AgeGate {...ageGateBase} mode="parental" inviteSentTo={null} />,
};

export const AgeGateInviteSent: StoryObj = {
  render: () => <AgeGate {...ageGateBase} mode="parental" inviteSentTo="mae@example.com" />,
};

export const ChangeEmail: StoryObj = {
  render: () => (
    <ChangeEmailDialog
      open
      onOpenChange={() => {}}
      currentEmail="ana@example.com"
      onSubmit={() => {}}
    />
  ),
};

export const ChangeEmailDone: StoryObj = {
  render: () => (
    <ChangeEmailDialog
      open
      done
      onOpenChange={() => {}}
      currentEmail="ana@example.com"
      onSubmit={() => {}}
    />
  ),
};

export const ChangePassword: StoryObj = {
  render: () => (
    <ChangePasswordDialog open onOpenChange={() => {}} hasPassword onSubmit={() => {}} />
  ),
};

export const CreatePassword: StoryObj = {
  render: () => (
    <ChangePasswordDialog open onOpenChange={() => {}} hasPassword={false} onSubmit={() => {}} />
  ),
};

export const DeleteAccount: StoryObj = {
  render: () => <DeleteAccountDialog open onOpenChange={() => {}} onSubmit={() => {}} />,
};

export const LinkedAccounts: StoryObj = {
  render: () => (
    <LinkedAccountsDialog
      open
      onOpenChange={() => {}}
      providers={[
        {
          provider: "GOOGLE",
          label: "Google",
          current: { email: "ana@example.com" },
          linkable: true,
        },
        { provider: "LINKEDIN", label: "LinkedIn", current: { email: null }, linkable: true },
        { provider: "GITHUB", label: "GitHub", current: null, linkable: true },
      ]}
      onLink={() => {}}
      onUnlink={() => {}}
      linkedinSync={{ postSync: true, canPost: false, reason: null, lastShareStatus: "HTTP_403" }}
      onSyncChange={() => {}}
      onReconnect={() => {}}
    />
  ),
};

export const LinkedInSync: StoryObj = {
  render: () => (
    <LinkedInSyncPrompt
      notReady={false}
      serverKeyMissing={false}
      onClose={() => {}}
      onAnswer={() => {}}
    />
  ),
};

export const BlockUser: StoryObj = {
  render: function BlockUserStory() {
    const [open, setOpen] = useState(false);
    return (
      <BlockUserDialog
        name="Ana Souza"
        blocked={false}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    );
  },
};
