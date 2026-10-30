import type { CompanyDirectoryEntryView } from "../../types/domain/companies/company-directory-entry-view.js";
import type { CompanyPageViewProps } from "../../types/domain/companies/company-page-view-props.js";
import type { CompanyReviewView } from "../../types/domain/companies/company-review-view.js";
import type { MicroProjectActions } from "../../types/domain/companies/micro-project-actions.js";
import type { MicroProjectCardData } from "../../types/domain/companies/micro-project-card-data.js";
import type { MicroProjectProposalItem } from "../../types/domain/companies/micro-project-proposal-item.js";

/** Shared mock data of the company views, for the tests and the stories. Obviously fake. */

const noop = () => undefined;

export const project = (patch: Partial<MicroProjectCardData> = {}): MicroProjectCardData => ({
  id: "p1",
  title: "Painel de pedidos para a cozinha",
  problem:
    "Os pedidos chegam por três canais e a cozinha perde a ordem nos horários de pico. Queremos um painel único, simples de ler a dois metros de distância.",
  scope: "Uma tela web com a fila de pedidos. Integração só com o canal próprio no piloto.",
  deliverables: ["Painel web responsivo", "Guia curto de uso para a equipe"],
  acceptance: ["Pedido aparece em menos de 5 segundos", "Funciona em uma TV de 32 polegadas"],
  budget: "R$ 3.500",
  deadlineLabel: "até 30 de nov.",
  publishedLabel: "Publicado em 2 de out.",
  status: "OPEN",
  myProposal: null,
  proposalCount: 3,
  ...patch,
});

export const actions = (patch: Partial<MicroProjectActions> = {}): MicroProjectActions => ({
  onPropose: noop,
  onShowProposals: noop,
  onComplete: noop,
  signInHref: "/entrar",
  professionalSetupHref: "/profissional/ativar",
  busyId: null,
  ...patch,
});

export const entry = (
  patch: Partial<CompanyDirectoryEntryView> = {},
): CompanyDirectoryEntryView => ({
  key: "c1",
  name: "Cozinha Aberta",
  logo: null,
  sector: "Alimentação",
  location: "Belo Horizonte, MG",
  href: "/empresa/cozinha-aberta",
  external: false,
  openJobs: 2,
  openProjects: 1,
  followers: 48,
  ...patch,
});

export const review = (patch: Partial<CompanyReviewView> = {}): CompanyReviewView => ({
  projectTitle: "Cardápio digital",
  rating: 5,
  text: "Briefing claro, retorno rápido e pagamento no dia combinado.",
  dateLabel: "12 de out.",
  person: {
    name: "Ana Souza",
    username: "ana.souza",
    headline: "Dev front-end",
    avatar: null,
    href: "/profissional/ana.souza",
  },
  ...patch,
});

export const proposal = (
  patch: Partial<MicroProjectProposalItem> = {},
): MicroProjectProposalItem => ({
  id: "pr1",
  person: {
    name: "Caio Lima",
    username: "caio.lima",
    headline: "Engenheiro de software",
    avatar: null,
    href: "/profissional/caio.lima",
  },
  message: "Já fiz um painel parecido para uma padaria. Começaria pela fila do canal próprio.",
  status: "SENT",
  sentLabel: "Enviada em 3 de out.",
  conversationHref: "/mensagens/c1",
  ...patch,
});

export const companyPage = (patch: Partial<CompanyPageViewProps> = {}): CompanyPageViewProps => ({
  company: {
    name: "Cozinha Aberta",
    logo: null,
    cover: null,
    sector: "Alimentação",
    sizeLabel: "11 a 50 pessoas",
    location: "Belo Horizonte, MG",
    website: "https://cozinha-aberta.example",
    description:
      "Restaurante de bairro que abre a cozinha para quem quer aprender. Trabalhamos com microprojetos curtos e pagos.",
  },
  stats: { openProjects: 1, completedProjects: 4, openJobs: 2, followers: 48 },
  backHref: "/empresas",
  follow: { following: false, pending: false, onToggle: noop },
  team: null,
  jobs: [
    {
      id: "j1",
      title: "Cozinheira ou cozinheiro de linha",
      meta: "Presencial · Pleno",
      href: "/vagas/j1",
    },
    { id: "j2", title: "Social media", meta: "Remoto · Júnior", href: "/vagas/j2" },
  ],
  jobsHref: "/vagas?empresa=cozinha-aberta",
  projects: [project()],
  viewer: "OK",
  projectActions: actions(),
  reviews: [
    review(),
    review({
      rating: 4,
      text: null,
      person: { ...review().person, name: "Bia Rocha", username: "bia" },
    }),
  ],
  ...patch,
});
