import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContributionForm } from "./contribution-form.js";
import { ContributorLinkStatus } from "./contributor-link-status.js";
import { MySupportRequests } from "./my-support-requests.js";
import { SupportForm } from "./support-form.js";
import { VerifiedContributorPrompt } from "./verified-contributor-prompt.js";

const meta: Meta = {
  title: "Domain/Support",
};

export default meta;

export const Form: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <SupportForm
        defaultContactEmail="pessoa@exemplo.com"
        onUploadImage={async () => null}
        onSubmit={async () => null}
      />
    </div>
  ),
};

export const FormDark: StoryObj = {
  globals: { theme: "dark" },
  render: Form.render,
};

export const Requests: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <MySupportRequests
        loading={false}
        tickets={[
          {
            id: "t1",
            status: "CLOSED",
            createdAtLabel: "12/10/2026 14:30",
            subject: "Não consigo entrar",
            message: "Aparece erro ao fazer login.",
            adminReply: "Resolvido: o acesso foi liberado.",
          },
          {
            id: "t2",
            status: "OPEN",
            createdAtLabel: "20/10/2026 09:12",
            subject: "Ideia",
            message: "Modo escuro no editor.",
            adminReply: null,
          },
        ]}
      />
    </div>
  ),
};

export const RequestsEmpty: StoryObj = {
  render: () => <MySupportRequests loading={false} tickets={[]} />,
};

export const Contribution: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <ContributionForm termsHref="#" onSubmit={async () => null} />
    </div>
  ),
};

export const ContributionVerified: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <ContributionForm
        termsHref="#"
        onSubmit={async () => null}
        mode="verified"
        initial={{ name: "Marina Rocha", email: "marina@example.com", github: "marinarocha" }}
      />
    </div>
  ),
};

export const LinkStatus: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <ContributorLinkStatus
        login="marinarocha"
        syncState="ERROR"
        syncPending={false}
        syncResult={{ contributions: 2, issues: 1, rateLimited: false }}
        syncError={false}
        onSync={() => {}}
        securityHref="#"
      />
    </div>
  ),
};

export const VerifiedPrompt: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <VerifiedContributorPrompt
        confirmed={false}
        form={
          <ContributionForm
            termsHref="#"
            onSubmit={async () => null}
            mode="verified"
            initial={{ name: "Marina Rocha", email: "marina@example.com", github: "marinarocha" }}
          />
        }
      />
    </div>
  ),
};

export const VerifiedConfirmed: StoryObj = {
  render: () => (
    <div className="max-w-2xl">
      <VerifiedContributorPrompt confirmed />
    </div>
  ),
};
