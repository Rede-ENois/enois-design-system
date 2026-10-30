import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { OnboardingStep } from "../../types/domain/onboarding/onboarding-step.js";
import type { OnboardingViewProps } from "../../types/domain/onboarding/onboarding-view-props.js";

import { OnboardingView } from "./onboarding-view.js";

const meta: Meta = {
  title: "Domain/Onboarding",
};

export default meta;

const topics = [
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "DESIGN", label: "Design" },
  { value: "CARREIRA", label: "Carreira" },
  { value: "GAMES", label: "Games" },
  { value: "MUSIC", label: "Música" },
  { value: "LIVROS", label: "Livros" },
  { value: "FOTOGRAFIA", label: "Fotografia" },
  { value: "SAUDE", label: "Saúde" },
  { value: "EMPREENDER", label: "Empreendedorismo" },
  { value: "PETS", label: "Pets" },
];

const communities = [
  {
    id: "c1",
    name: "Mulheres na Tecnologia",
    description:
      "Troca de experiências, vagas e mentorias para mulheres que trabalham com tecnologia.",
    topicLabel: "Tecnologia",
    avatar: null,
    memberCount: 1280,
  },
  {
    id: "c2",
    name: "Design de Produto BR",
    description: "Críticas de tela, portfólios e conversas sobre pesquisa com gente de verdade.",
    topicLabel: "Design",
    avatar: null,
    memberCount: 642,
  },
  {
    id: "c3",
    name: "Primeiro Emprego",
    description: null,
    topicLabel: "Carreira",
    avatar: null,
    memberCount: 1,
  },
];

const groups = [
  {
    id: "g1",
    name: "Clube do livro técnico",
    description: "Um capítulo por semana, sem pressa.",
    topicLabel: "Livros",
    avatar: null,
    memberCount: 87,
  },
  {
    id: "g2",
    name: "Retro games aos domingos",
    description: "Speedrun, nostalgia e muita conversa fiada.",
    topicLabel: "Games",
    avatar: null,
    memberCount: 213,
  },
];

const people = [
  {
    id: "p1",
    username: "ana.exemplo",
    name: "Ana Exemplo",
    headline: "Dev front-end",
    avatar: null,
  },
  { id: "p2", username: "bruno.teste", name: "Bruno Teste", headline: null, avatar: null },
  {
    id: "p3",
    username: "carla.demo",
    name: "Carla Demo",
    headline: "Designer de produto, apaixonada por acessibilidade",
    avatar: null,
  },
];

const suggestions = ["React", "TypeScript", "Figma", "Go", "Fotografia", "Gestão de times", "SQL"];

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

/** Interactive harness: owns state like the app container would. */
function Flow(overrides: Partial<OnboardingViewProps> & { initialStep?: OnboardingStep }) {
  const { initialStep = "interests", ...rest } = overrides;
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [selectedTopics, setTopics] = useState(["TECNOLOGIA", "DESIGN"]);
  const [skills, setSkills] = useState(["React"]);
  const [communityIds, setCommunityIds] = useState(["c1", "c2"]);
  const [groupIds, setGroupIds] = useState(["g1"]);
  const [personIds, setPersonIds] = useState(["p1", "p3"]);

  return (
    <OnboardingView
      step={step}
      onStepChange={setStep}
      topics={topics}
      selectedTopics={selectedTopics}
      onToggleTopic={(value) => setTopics((list) => toggle(list, value))}
      skills={skills}
      skillSuggestions={suggestions}
      onAddSkill={(skill) => setSkills((list) => [...list, skill])}
      onRemoveSkill={(skill) => setSkills((list) => list.filter((item) => item !== skill))}
      packLoading={false}
      packError={false}
      onRetryPack={() => {}}
      communities={communities}
      groups={groups}
      people={people}
      selectedCommunityIds={communityIds}
      selectedGroupIds={groupIds}
      selectedPersonIds={personIds}
      onToggleCommunity={(id) => setCommunityIds((list) => toggle(list, id))}
      onToggleGroup={(id) => setGroupIds((list) => toggle(list, id))}
      onTogglePerson={(id) => setPersonIds((list) => toggle(list, id))}
      submitting={false}
      onComplete={() => {}}
      onSkip={() => {}}
      {...rest}
    />
  );
}

export const Interests: StoryObj = { render: () => <Flow /> };

export const StarterPack: StoryObj = { render: () => <Flow initialStep="pack" /> };

export const Loading: StoryObj = { render: () => <Flow initialStep="pack" packLoading /> };

export const EmptyPack: StoryObj = {
  render: () => <Flow initialStep="pack" communities={[]} groups={[]} people={[]} />,
};

export const PackError: StoryObj = { render: () => <Flow initialStep="pack" packError /> };

export const AtCap: StoryObj = {
  render: () => <Flow initialStep="pack" maxCommunities={2} maxPeople={2} />,
};

export const Submitting: StoryObj = { render: () => <Flow initialStep="pack" submitting /> };

export const SubmitError: StoryObj = {
  render: () => (
    <Flow initialStep="pack" errorMessage="Não deu pra salvar agora. Tenta de novo em instantes." />
  ),
};

export const Mobile: StoryObj = {
  render: () => (
    <div className="mx-auto w-[390px] max-w-full">
      <Flow initialStep="pack" />
    </div>
  ),
};
