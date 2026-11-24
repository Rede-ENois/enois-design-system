import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TalentBankCandidateFilters } from "../../types/domain/talent-banks/talent-bank-candidate-filters.js";
import type { TalentBankDetail } from "../../types/domain/talent-banks/talent-bank-detail.js";
import type { TalentBankEditorValues } from "../../types/domain/talent-banks/talent-bank-editor-values.js";
import type { TalentBankMyEnrollment } from "../../types/domain/talent-banks/talent-bank-my-enrollment.js";
import type { TalentBankSummary } from "../../types/domain/talent-banks/talent-bank-summary.js";

import { TalentBankCandidateDetail } from "./talent-bank-candidate-detail.js";
import { TalentBankCandidateList } from "./talent-bank-candidate-list.js";
import { TalentBankConsent } from "./talent-bank-consent.js";
import { TalentBankDiscovery } from "./talent-bank-discovery.js";
import { TalentBankEditor } from "./talent-bank-editor.js";
import { TalentBankMyEnrollments } from "./talent-bank-my-enrollments.js";

const meta: Meta = {
  title: "Domain/TalentBanks",
};

export default meta;

const noop = () => {};

const recruiter = {
  userId: "user_1",
  name: "Recrutadora de Produto",
  username: "recrutadora",
  avatar: null,
  headline: "Recrutamento de tecnologia",
  location: "Remoto",
};

const sharedFields = [
  {
    key: "PROFILE",
    label: "Perfil profissional",
    description: "Nome, título, localização e foto.",
  },
  { key: "SKILLS", label: "Competências", description: "As competências registradas." },
  { key: "RESUME", label: "Currículo", description: "O arquivo de currículo." },
];

const banks: TalentBankSummary[] = [
  {
    id: "bank_1",
    href: "/bancos-de-talentos/bank_1",
    title: "Time de produto",
    purpose: "Receber pessoas interessadas em produto digital e empregos de tecnologia.",
    focusArea: "Tecnologia",
    desiredSkills: ["Produto", "Pesquisa com usuários"],
    requestedFields: sharedFields,
    createdAt: "2026-11-20T12:00:00Z",
    recruiter,
  },
  {
    id: "bank_2",
    href: "/bancos-de-talentos/bank_2",
    title: "Comunidade de design",
    purpose:
      "Um banco aberto para quem trabalha com design, com foco em contratos, mentoria e troca de referências entre profissionais da comunidade.",
    focusArea: null,
    desiredSkills: [],
    requestedFields: [],
    createdAt: "2026-11-10T12:00:00Z",
    recruiter,
  },
];

const bank: TalentBankDetail = {
  id: "bank_1",
  title: "Time de produto",
  purpose: "Receber pessoas interessadas em produto digital e empregos de tecnologia.",
  description: "Respondemos por aqui quando há encaixe, normalmente em uma semana.",
  handlingConditions:
    "O acesso dura enquanto a inscrição estiver ativa, e pode ser revogado a qualquer momento.",
  focusArea: "Tecnologia",
  desiredSkills: ["Produto", "Pesquisa com usuários"],
  requestedFields: sharedFields,
  consentVersion: "2026-11",
  createdAt: "2026-11-20T12:00:00Z",
  recruiter,
  myState: null,
};

const editorValues: TalentBankEditorValues = {
  title: "Time de produto",
  purpose: "Receber pessoas interessadas em produto digital.",
  description: "",
  handlingConditions: "O acesso dura enquanto a inscrição estiver ativa.",
  focusArea: "Tecnologia",
  desiredSkills: "Produto, Pesquisa com usuários",
  requestedFields: ["PROFILE", "SKILLS"],
};

const filters: TalentBankCandidateFilters = {
  search: "",
  state: "",
  skill: "",
  minExperiences: "",
  education: "",
};

const myEnrollments: TalentBankMyEnrollment[] = [
  {
    enrollmentId: "enrollment_1",
    bankId: "bank_1",
    bankTitle: "Time de produto",
    bankPurpose: "Receber pessoas interessadas em produto digital.",
    recruiterName: "Recrutadora de Produto",
    recruiterUsername: "recrutadora",
    state: "ACTIVE",
    sharedFields: ["PROFILE", "SKILLS"],
    requestedAt: "2026-11-20T12:00:00Z",
    consentedAt: "2026-11-20T13:00:00Z",
  },
];

export const Discovery: StoryObj = {
  render: () => (
    <TalentBankDiscovery
      banks={banks}
      search=""
      onSearchChange={noop}
      areas={["Tecnologia", "Design"]}
      area=""
      onAreaChange={noop}
      state={{ kind: "ready" }}
    />
  ),
};

export const DiscoveryLoading: StoryObj = {
  render: () => (
    <TalentBankDiscovery
      banks={[]}
      search=""
      onSearchChange={noop}
      areas={[]}
      area=""
      onAreaChange={noop}
      state={{ kind: "loading" }}
    />
  ),
};

export const DiscoveryEmpty: StoryObj = {
  render: () => (
    <TalentBankDiscovery
      banks={[]}
      search="design"
      onSearchChange={noop}
      areas={["Tecnologia"]}
      area=""
      onAreaChange={noop}
      state={{ kind: "ready" }}
    />
  ),
};

export const DiscoveryError: StoryObj = {
  render: () => (
    <TalentBankDiscovery
      banks={[]}
      search=""
      onSearchChange={noop}
      areas={[]}
      area=""
      onAreaChange={noop}
      state={{ kind: "error" }}
      onRetry={noop}
    />
  ),
};

export const ConsentDetails: StoryObj = {
  render: () => (
    <TalentBankConsent
      bank={bank}
      selectedFields={[]}
      onToggleField={noop}
      note=""
      onNoteChange={noop}
      step="details"
      enrollment={null}
      onStart={noop}
      onConfirm={noop}
      onBack={noop}
      onRevoke={noop}
      onErase={noop}
    />
  ),
};

export const ConsentAuthorize: StoryObj = {
  render: () => (
    <TalentBankConsent
      bank={bank}
      selectedFields={["PROFILE", "SKILLS"]}
      onToggleField={noop}
      note=""
      onNoteChange={noop}
      step="authorize"
      enrollment={{
        id: "enrollment_1",
        state: "PENDING",
        sharedFields: ["PROFILE", "SKILLS"],
        requestedAt: "2026-11-20T12:00:00Z",
        consentedAt: null,
        revokedAt: null,
        closedAt: null,
      }}
      onStart={noop}
      onConfirm={noop}
      onBack={noop}
      onRevoke={noop}
      onErase={noop}
    />
  ),
};

export const Editor: StoryObj = {
  render: () => (
    <TalentBankEditor
      values={editorValues}
      onChange={noop}
      discoverable
      onDiscoverableChange={noop}
      onSave={noop}
      createdAt="2026-11-20T12:00:00Z"
    />
  ),
};

export const CandidateList: StoryObj = {
  render: () => (
    <TalentBankCandidateList
      candidates={[
        {
          enrollmentId: "enrollment_1",
          state: "ACTIVE",
          userId: "user_2",
          name: "Ana Souza",
          username: "ana",
          headline: "Product manager",
          avatar: null,
          location: "Remoto",
          experienceCount: 3,
          sharedFields: ["PROFILE", "SKILLS"],
          note: null,
          consentedAt: "2026-11-20T13:00:00Z",
          resumeAvailable: true,
          resumeName: "curriculo.pdf",
        },
        {
          enrollmentId: "enrollment_2",
          state: "PENDING",
          userId: "user_3",
          name: null,
          username: "bruno",
          headline: null,
          avatar: null,
          location: null,
          experienceCount: 0,
          sharedFields: [],
          note: null,
          consentedAt: null,
          resumeAvailable: false,
          resumeName: null,
        },
      ]}
      filters={filters}
      onFiltersChange={noop}
      activeTotal={1}
      pendingTotal={1}
      hasMore
      onLoadMore={noop}
      onOpenCandidate={noop}
    />
  ),
};

export const CandidateListEmpty: StoryObj = {
  render: () => (
    <TalentBankCandidateList
      candidates={[]}
      filters={filters}
      onFiltersChange={noop}
      activeTotal={0}
      pendingTotal={0}
      hasMore={false}
      onOpenCandidate={noop}
    />
  ),
};

export const CandidateDetail: StoryObj = {
  render: () => (
    <TalentBankCandidateDetail
      candidate={{
        enrollmentId: "enrollment_1",
        state: "ACTIVE",
        sharedFields: ["PROFILE", "SKILLS", "EXPERIENCES", "RESUME"],
        consentVersion: "2026-11",
        purposeSnapshot: "Receber pessoas interessadas em produto digital.",
        note: "Gosto muito de produto.",
        consentedAt: "2026-11-20T13:00:00Z",
        identity: {
          name: "Ana Souza",
          username: "ana",
          headline: "Product manager",
          avatar: null,
          location: "Remoto",
        },
        skills: ["Produto", "Dados"],
        experiences: [
          {
            id: "experience_1",
            title: "Product manager",
            company: "Empresa",
            location: "Remoto",
            description: "Liderança de squad.",
            startDate: "2024-01-01",
            endDate: null,
          },
        ],
        educations: [
          {
            id: "education_1",
            school: "Universidade",
            degree: "Bacharelado",
            field: "Administração",
            startDate: "2019-01-01",
            endDate: "2022-12-31",
          },
        ],
        certifications: [],
        resumeAuthorized: true,
        resumeAvailable: true,
        resumeName: "curriculo.pdf",
      }}
      onDownloadResume={noop}
      onClose={noop}
    />
  ),
};

export const MyEnrollments: StoryObj = {
  render: () => (
    <TalentBankMyEnrollments
      enrollments={myEnrollments}
      onOpen={noop}
      onRevoke={noop}
      onErase={noop}
    />
  ),
};

export const MyEnrollmentsEmpty: StoryObj = {
  render: () => <TalentBankMyEnrollments enrollments={[]} />,
};
