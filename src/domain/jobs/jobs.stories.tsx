import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ExternalJobFilterValues } from "../../types/domain/jobs/external-job-filter-values.js";
import { Button } from "../../ui/button.js";

import { ApplicationFeedbackDialog } from "./application-feedback-dialog.js";
import { ApplyByEmailButton } from "./apply-by-email-button.js";
import { ApplyExternalJobDialog } from "./apply-external-job-dialog.js";
import { ApplyFreelanceDialog } from "./apply-freelance-dialog.js";
import { ApplyJobDialog } from "./apply-job-dialog.js";
import { CompanyEditDialog } from "./company-edit-dialog.js";
import { CompanyTeamSection } from "./company-team-section.js";
import { CreateExternalJobDialog } from "./create-external-job-dialog.js";
import { ExternalJobFilters } from "./external-job-filters.js";
import { JobCardSkeletons } from "./job-card-skeletons.js";
import { JobEditDialog } from "./job-edit-dialog.js";
import { ProfessionalSignature } from "./professional-signature.js";

const meta: Meta = {
  title: "Domain/Jobs",
};

export default meta;

const noop = () => {};

const options = {
  locations: ["Remoto", "Híbrido", "Presencial"],
  types: [
    { value: "CLT", label: "CLT" },
    { value: "PJ", label: "PJ" },
    { value: "INTERN", label: "Estágio" },
  ],
  levels: [
    { value: "JUNIOR", label: "Júnior" },
    { value: "MID", label: "Pleno" },
    { value: "SENIOR", label: "Sênior" },
    { value: "LEAD", label: "Liderança" },
  ],
  salaryPeriods: [
    { value: "HOUR", label: "por hora" },
    { value: "DAY", label: "por dia" },
    { value: "MONTH", label: "por mês" },
    { value: "YEAR", label: "por ano" },
  ],
  currencies: [
    { code: "BRL", symbol: "R$", label: "Real (R$)" },
    { code: "USD", symbol: "US$", label: "Dólar (US$)" },
    { code: "EUR", symbol: "€", label: "Euro (€)" },
  ],
};

export const ApplyByEmail: StoryObj = {
  render: () => <ApplyByEmailButton busy={false} onClick={noop} />,
};

export const ApplyJob: StoryObj = {
  render: () => (
    <ApplyJobDialog
      job={{
        title: "Pessoa Desenvolvedora Back-end",
        applicationFields: [
          { id: "f1", label: "Anos de experiência com Java", type: "NUMBER", required: true },
          { id: "f2", label: "Portfólio", type: "LINK", required: false },
        ],
      }}
      onOpenChange={noop}
      pending={false}
      done={false}
      error={null}
      verifyHref={null}
      onSubmit={noop}
      onPrefill={async () => ({ suggestedMessage: null, fields: [], filled: 0, total: 2 })}
    >
      <Button className="rounded-full">Candidatar-se</Button>
    </ApplyJobDialog>
  ),
};

export const ApplyFreelance: StoryObj = {
  render: () => (
    <ApplyFreelanceDialog
      freelance={{ title: "Landing page para ONG", username: "ana" }}
      open
      onOpenChange={noop}
      pending={false}
      error={null}
      sent={false}
      onSend={noop}
      onOpenChat={noop}
    />
  ),
};

const externalDraft = {
  recipientEmail: "vagas@empresa.com",
  subject: "Candidatura — Pessoa Desenvolvedora Java Sênior (ID 42)",
  body: "Olá!\n\nMe chamo Mel Santos e tenho interesse na vaga de Pessoa Desenvolvedora Java Sênior.\n\nAbraço,\nMel Santos",
  resumeAvailable: true,
  resumeName: "curriculo-mel-santos.pdf",
  jobTitle: "Pessoa Desenvolvedora Java Sênior",
  company: "Empresa Exemplo",
  jobUrl: "https://exemplo.com/vagas/42",
};

export const ApplyExternalJob: StoryObj = {
  render: () => (
    <ApplyExternalJobDialog
      onOpenChange={noop}
      draft={externalDraft}
      loading={false}
      loadError={null}
      pending={false}
      error={null}
      result={null}
      onConfirm={noop}
      onOpenMailClient={noop}
      onRetry={noop}
    >
      <Button className="rounded-full">Candidatar-se</Button>
    </ApplyExternalJobDialog>
  ),
};

export const ApplyExternalJobWithoutResume: StoryObj = {
  render: () => (
    <ApplyExternalJobDialog
      onOpenChange={noop}
      draft={{ ...externalDraft, resumeAvailable: false, resumeName: null }}
      loading={false}
      loadError={null}
      pending={false}
      error={null}
      result={null}
      onConfirm={noop}
      onOpenMailClient={noop}
      onRetry={noop}
    >
      <Button className="rounded-full">Candidatar-se</Button>
    </ApplyExternalJobDialog>
  ),
};

export const ApplyExternalJobSentWithoutAttachment: StoryObj = {
  render: () => (
    <ApplyExternalJobDialog
      onOpenChange={noop}
      draft={externalDraft}
      loading={false}
      loadError={null}
      pending={false}
      error={null}
      result={{
        recipientEmail: "vagas@empresa.com",
        subject: externalDraft.subject,
        resumeAttached: false,
        resumeName: null,
        status: "SENT",
        appliedAt: "2026-11-10T12:00:00Z",
      }}
      onConfirm={noop}
      onOpenMailClient={noop}
      onRetry={noop}
    >
      <Button className="rounded-full">Candidatar-se</Button>
    </ApplyExternalJobDialog>
  ),
};

const filtersValue: ExternalJobFilterValues = {
  level: "SENIOR",
  workModel: "REMOTE",
  employmentType: null,
  city: "",
  state: "SP",
  country: "Brasil",
  salaryMin: 15000,
  remoteOnly: false,
  publishedAfter: null,
  sort: "recent",
};

export const ExternalJobFiltersBar: StoryObj = {
  render: () => (
    <div className="max-w-3xl">
      <ExternalJobFilters value={filtersValue} onChange={noop} onClear={noop} activeCount={4} />
    </div>
  ),
};

export const ProfessionalSignatureStates: StoryObj = {
  render: () => (
    <div className="max-w-md space-y-3">
      <ProfessionalSignature
        identity={{ name: "Mel Santos", username: "mel.pro" }}
        setupHref={null}
      />
      <ProfessionalSignature identity={null} setupHref="#profissional" />
    </div>
  ),
};

export const ApplicationFeedback: StoryObj = {
  render: () => (
    <ApplicationFeedbackDialog open onOpenChange={noop} onSubmit={noop} pending={false} />
  ),
};

export const EditJob: StoryObj = {
  render: () => (
    <JobEditDialog
      job={{
        id: "j1",
        title: "Pessoa Desenvolvedora Back-end",
        company: "Énóis",
        location: "Remoto",
        type: "CLT",
        level: "MID",
        salaryMin: "8.000",
        salaryMax: null,
        salaryPeriod: "MONTH",
        currency: "BRL",
        skills: ["Java", "Spring"],
        description: "Responsabilidades, requisitos e diferenciais.",
      }}
      onOpenChange={noop}
      options={options}
      saving={false}
      error={null}
      onSave={noop}
    />
  ),
};

export const CreateExternalJob: StoryObj = {
  render: () => (
    <CreateExternalJobDialog
      open
      onOpenChange={noop}
      gate={null}
      pending={false}
      error={null}
      onSubmit={noop}
    />
  ),
};

export const CreateExternalJobLocked: StoryObj = {
  render: () => (
    <CreateExternalJobDialog
      open
      onOpenChange={noop}
      gate={{ minReputation: 150, reputation: 40, missing: 111 }}
      pending={false}
      error={null}
      onSubmit={noop}
    />
  ),
};

export const EditCompany: StoryObj = {
  render: () => (
    <CompanyEditDialog
      company={{
        name: "Énóis",
        description: "Rede de jornalismo e tecnologia.",
        sector: "Tecnologia",
        size: "11-50",
        location: "São Paulo",
        website: "https://enois.com.br",
        logo: null,
        cover: null,
      }}
      open
      onOpenChange={noop}
      savePending={false}
      uploading={false}
      onSave={noop}
      onUploadImage={async () => null}
      teamSection={
        <CompanyTeamSection
          members={[
            { userId: "u1", role: "OWNER", name: "Ana Souza", username: "ana.souza", avatar: null },
            { userId: "0b6f0c1e-2c55-4d6a-9f3e-6a2f1c9d7e11", role: "EDITOR" },
          ]}
          search=""
          onSearchChange={noop}
          results={[]}
          selected={null}
          onSelectedChange={noop}
          role="EDITOR"
          onRoleChange={noop}
          addPending={false}
          onAdd={noop}
        />
      }
    />
  ),
};

export const Skeletons: StoryObj = {
  render: () => <JobCardSkeletons />,
};
