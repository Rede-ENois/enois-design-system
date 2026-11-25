import type { Meta, StoryObj } from "@storybook/react-vite";

import type { WrappedEstado } from "../../types/domain/wrapped/wrapped-estado.js";
import type { WrappedRetrospectiva } from "../../types/domain/wrapped/wrapped-retrospectiva.js";

import { WrappedExperience } from "./wrapped-experience.js";

const meta: Meta = {
  title: "Domain/Wrapped",
  parameters: { layout: "centered" },
};

export default meta;

const retrospectiva: WrappedRetrospectiva = {
  ano: 2026,
  dadosInsuficientes: false,
  metricas: {
    publicacoes: 42,
    comentarios: 87,
    interacoesFeitas: 310,
    interacoesRecebidas: 260,
    comunidades: 4,
    diasAtivos: 150,
    mesMaisAtivo: 7,
  },
  assuntosPublicados: [
    { expressao: "inteligencia artificial", ocorrencias: 18 },
    { expressao: "mercado de trabalho", ocorrencias: 12 },
    { expressao: "meetup de rust", ocorrencias: 9 },
  ],
  assuntosComentados: [
    { expressao: "carreira", ocorrencias: 22 },
    { expressao: "remoto", ocorrencias: 15 },
  ],
  publicacoesMarcantes: [
    {
      id: "p1",
      href: "/post/p1",
      autorNome: "Ana",
      autorUsername: "ana",
      autorHref: "/perfil/ana",
      trecho: "Um texto sobre aprender rust depois dos 30",
      metrica: 64,
      motivo: "PROPRIA",
      dataLabel: "2026-05-12",
    },
  ],
  tretas: [
    {
      publicacaoId: "p2",
      href: "/post/p2",
      comentarios: 7,
      diasDistintos: 2,
      duracaoDias: 1,
      trecho: null,
    },
  ],
  interacoes: [
    {
      userId: "u2",
      username: "bia",
      nome: "Bia",
      href: "/perfil/bia",
      vezes: 14,
      tipo: "INTERAGI",
    },
    {
      userId: "u3",
      username: "caio",
      nome: "Caio",
      href: "/perfil/caio",
      vezes: 9,
      tipo: "INTERAGIRAM",
    },
  ],
  ritmo: {
    diaSemanaMaisAtivo: 2,
    horaMaisAtiva: 21,
    mesMaisAtivo: 7,
    porMes: [10, 20, 30, 25, 40, 12, 55, 34, 28, 31, 45, 20],
    porDiaSemana: [40, 50, 60, 45, 35, 30, 25],
    porHora: Array.from({ length: 24 }, (_, h) => (h >= 19 && h <= 23 ? 40 : 5)),
  },
  perfil: {
    principal: "DEBATEDOR",
    caracteristicas: [
      { chave: "DEBATEDOR", motivo: "87 comentários em 42 publicações" },
      { chave: "ESPECIALISTA", motivo: 'o assunto "inteligencia artificial" apareceu 18 vezes' },
    ],
  },
  impacto: {
    publicacoesComConversa: 12,
    interacoesRecebidas: 260,
    comunidades: 4,
    credibilidade: 712,
  },
  comunidades: [
    { communityId: "c1", nome: "Mulheres na Tecnologia", href: "/comunidades/c1", publicacoes: 8 },
  ],
  encerramento: {
    temaPrincipal: "inteligencia artificial",
    caracteristica: "DEBATEDOR",
    estatistica: "42 publicações, 150 dias de Énóis",
  },
};

const pronto: WrappedEstado = { kind: "ready", retrospectiva };

export const Completa: StoryObj = {
  render: () => <WrappedExperience state={pronto} nome="Ana" />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const SemDados: StoryObj = {
  render: () => <WrappedExperience state={{ kind: "sem-dados" }} nome="Ana" />,
};

export const NaoPronta: StoryObj = {
  render: () => <WrappedExperience state={{ kind: "nao-pronta" }} nome="Ana" />,
};

export const ForaDaJanela: StoryObj = {
  render: () => <WrappedExperience state={{ kind: "fora-da-janela" }} nome="Ana" />,
};

export const Carregando: StoryObj = {
  render: () => <WrappedExperience state={{ kind: "loading" }} nome="Ana" />,
};

export const Erro: StoryObj = {
  render: () => (
    <WrappedExperience
      state={{ kind: "error", message: "Falha de rede" }}
      nome="Ana"
      onRetry={() => {}}
    />
  ),
};
