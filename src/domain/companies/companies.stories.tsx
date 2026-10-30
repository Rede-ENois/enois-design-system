import type { Meta, StoryObj } from "@storybook/react-vite";

import { actions, companyPage, entry, project, proposal, review } from "./companies.fixture.js";
import { CompanyDirectory } from "./company-directory.js";
import { CompanyPageView } from "./company-page-view.js";
import { CompleteMicroProjectDialog } from "./complete-micro-project-dialog.js";
import { CreateCompanyDialog } from "./create-company-dialog.js";
import { MicroProjectCard } from "./micro-project-card.js";
import { MicroProjectProposalDialog } from "./micro-project-proposal-dialog.js";
import { MicroProjectProposalsDialog } from "./micro-project-proposals-dialog.js";
import { NewMicroProjectDialog } from "./new-micro-project-dialog.js";

const meta: Meta = {
  title: "Domain/Companies",
};

export default meta;

const noop = () => {};

const directory = {
  query: "",
  onQueryChange: noop,
  sectors: ["Alimentação", "Educação", "Tecnologia", "Varejo"],
  sector: null,
  onSectorChange: noop,
  loading: false,
  error: false,
  onRetry: noop,
  myPages: null,
  entries: [
    entry(),
    entry({
      key: "c2",
      name: "Trilha Escola de Código",
      sector: "Educação",
      openJobs: 0,
      openProjects: 2,
      followers: 210,
    }),
    entry({
      key: "c3",
      name: "Mercadinho do Zé",
      sector: "Varejo",
      location: "Contagem, MG",
      openJobs: 0,
      openProjects: 0,
      followers: 12,
    }),
    entry({
      key: "c4",
      name: "Agência Externa Exemplo",
      sector: null,
      location: null,
      external: true,
      href: "/vagas?empresa=agencia",
      openJobs: 3,
      openProjects: 0,
      followers: 0,
    }),
  ],
};

export const Directory: StoryObj = {
  render: () => (
    <CompanyDirectory
      {...directory}
      myPages={[
        { slug: "cozinha", name: "Cozinha Aberta", logo: null, href: "#" },
        { slug: "trilha", name: "Trilha Escola de Código", logo: null, href: "#" },
      ]}
      onCreatePage={noop}
    />
  ),
};

export const DirectorySignedOut: StoryObj = {
  render: () => <CompanyDirectory {...directory} />,
};

export const DirectoryLoading: StoryObj = {
  render: () => <CompanyDirectory {...directory} entries={[]} loading />,
};

export const DirectoryError: StoryObj = {
  render: () => <CompanyDirectory {...directory} entries={[]} error />,
};

export const DirectoryEmptyFiltered: StoryObj = {
  render: () => <CompanyDirectory {...directory} entries={[]} query="xyz" sector="Varejo" />,
};

const team = {
  checklist: [
    { key: "logo", label: "Logo e capa", done: true },
    { key: "about", label: "Descrição da empresa", done: true },
    { key: "site", label: "Adicionar o site", done: false, onAction: noop },
    { key: "project", label: "Publicar um microprojeto", done: false, onAction: noop },
  ],
  counts: { open: 1, newProposals: 2, inProgress: 1, completed: 4 },
  onNewProject: noop,
};

export const PageVisitor: StoryObj = {
  render: () => <CompanyPageView {...companyPage()} />,
};

export const PageSignedOut: StoryObj = {
  render: () => <CompanyPageView {...companyPage({ follow: null, viewer: "SIGN_IN" })} />,
};

export const PageProfessionalRequired: StoryObj = {
  render: () => <CompanyPageView {...companyPage({ viewer: "PROFESSIONAL_REQUIRED" })} />,
};

export const PageTeam: StoryObj = {
  render: () => (
    <CompanyPageView
      {...companyPage({
        team,
        roleLabel: "Dono",
        onEdit: noop,
        viewer: "TEAM",
        follow: { following: true, pending: false, onToggle: noop },
        projects: [
          project(),
          project({
            id: "p2",
            title: "Landing page do curso de confeitaria",
            status: "IN_PROGRESS",
            proposalCount: 5,
            budget: null,
          }),
        ],
      })}
    />
  ),
};

export const PageEmpty: StoryObj = {
  render: () => (
    <CompanyPageView
      {...companyPage({
        company: { ...companyPage().company, description: null, website: null, sizeLabel: null },
        stats: { openProjects: 0, completedProjects: 0, openJobs: 0, followers: 0 },
        jobs: [],
        jobsHref: null,
        projects: [],
        reviews: [],
      })}
    />
  ),
};

export const ProjectCards: StoryObj = {
  render: () => (
    <div className="mx-auto max-w-2xl space-y-4">
      <MicroProjectCard project={project()} viewer="OK" actions={actions()} />
      <MicroProjectCard project={project({ myProposal: "SENT" })} viewer="OK" actions={actions()} />
      <MicroProjectCard
        project={project({ myProposal: "SELECTED", status: "IN_PROGRESS" })}
        viewer="OK"
        actions={actions()}
      />
      <MicroProjectCard project={project()} viewer="SIGN_IN" actions={actions()} />
      <MicroProjectCard project={project()} viewer="PROFESSIONAL_REQUIRED" actions={actions()} />
      <MicroProjectCard
        project={project({ status: "IN_PROGRESS" })}
        viewer="TEAM"
        actions={actions()}
      />
      <MicroProjectCard
        project={project({ status: "COMPLETED", scope: null, deliverables: [], acceptance: [] })}
        viewer="OK"
        actions={actions()}
      />
    </div>
  ),
};

export const ProposalDialog: StoryObj = {
  render: () => (
    <MicroProjectProposalDialog
      open
      onOpenChange={noop}
      projectTitle={project().title}
      applicant={{ name: "Ana Souza", username: "ana.souza" }}
      pending={false}
      error={null}
      onSubmit={noop}
    />
  ),
};

export const ProposalsDialog: StoryObj = {
  render: () => (
    <MicroProjectProposalsDialog
      open
      onOpenChange={noop}
      projectTitle={project().title}
      projectStatus="OPEN"
      loading={false}
      proposals={[
        proposal(),
        proposal({
          id: "pr2",
          person: { ...review().person },
          conversationHref: null,
          message: "Posso entregar em duas semanas, com uma versão de teste já na primeira.",
        }),
      ]}
      selectingId={null}
      onSelect={noop}
    />
  ),
};

export const ProposalsDialogDecided: StoryObj = {
  render: () => (
    <MicroProjectProposalsDialog
      open
      onOpenChange={noop}
      projectTitle={project().title}
      projectStatus="IN_PROGRESS"
      loading={false}
      proposals={[proposal({ status: "SELECTED" }), proposal({ id: "pr2", status: "DECLINED" })]}
      selectingId={null}
      onSelect={noop}
    />
  ),
};

export const ProposalsDialogLoading: StoryObj = {
  render: () => (
    <MicroProjectProposalsDialog
      open
      onOpenChange={noop}
      projectTitle={project().title}
      projectStatus="OPEN"
      loading
      proposals={[]}
      selectingId={null}
      onSelect={noop}
    />
  ),
};

export const CompleteDialog: StoryObj = {
  render: () => (
    <CompleteMicroProjectDialog
      open
      onOpenChange={noop}
      personName="Ana Souza"
      pending={false}
      onConfirm={noop}
    />
  ),
};

export const NewProjectDialog: StoryObj = {
  render: () => (
    <NewMicroProjectDialog open onOpenChange={noop} pending={false} error={null} onSubmit={noop} />
  ),
};

export const CreatePageDialog: StoryObj = {
  render: () => (
    <CreateCompanyDialog
      open
      onOpenChange={noop}
      pending={false}
      error={null}
      sizeOptions={[
        { value: "1-10", label: "1 a 10 pessoas" },
        { value: "11-50", label: "11 a 50 pessoas" },
        { value: "51-200", label: "51 a 200 pessoas" },
      ]}
      onSubmit={noop}
    />
  ),
};
