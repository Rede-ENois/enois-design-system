import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { StudyPairSaveStatus } from "../../types/domain/study-pairs/study-pair-save-status.js";
import type { StudyPair } from "../../types/domain/study-pairs/study-pair.js";
import type { StudyPairsViewProps } from "../../types/domain/study-pairs/study-pairs-view-props.js";

import { StudyPairsView } from "./study-pairs-view.js";

const meta: Meta = {
  title: "Domain/StudyPairs",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

const noop = () => {};

const history: StudyPair["history"] = [
  {
    weekKey: "2026-W43",
    label: "Semana de 19 out",
    myNote: "Terminei o capítulo de ownership. Borrow checker ainda me assusta.",
    partnerNote: "Fiz os exercícios do rustlings até structs.",
  },
  {
    weekKey: "2026-W42",
    label: "Semana de 12 out",
    myNote: "",
    partnerNote: null,
  },
];

const bothIn: StudyPair = {
  id: "pair-1",
  goal: "Aprender Rust",
  topicLabel: "Programação",
  sinceLabel: "2 de outubro",
  partner: { id: "u-2", username: "marina.dev", name: "Marina Souza", href: "/u/marina.dev" },
  myCheckin: "Comecei traits e generics. Semana corrida, mas rendeu.",
  partnerCheckin: "Montei um CLI pequeno com clap. Travei em lifetimes.",
  history,
};

const pending: StudyPair = {
  ...bothIn,
  id: "pair-2",
  goal: "Passar no ENEM com redação nota mil",
  topicLabel: null,
  sinceLabel: "20 de outubro",
  partner: { id: "u-3", username: "joao_p", name: "João Pedro", href: "/u/joao_p" },
  myCheckin: null,
  partnerCheckin: "Fiz duas redações e revisei coesão.",
  history: [],
};

const topics = [
  { value: "programming", label: "Programação" },
  { value: "languages", label: "Idiomas" },
  { value: "exams", label: "Vestibular e concursos" },
];

const base: StudyPairsViewProps = {
  pairs: [],
  openRequest: null,
  topics,
  popularGoals: [
    { goalKey: "aprender rust", goal: "Aprender Rust", topic: "programming", openRequests: 12 },
    { goalKey: "ingles b2", goal: "Chegar no inglês B2", topic: "languages", openRequests: 5 },
    { goalKey: "enem", goal: "ENEM 2027", topic: "exams", openRequests: 1 },
  ],
  onRetry: noop,
  onRequest: noop,
  onCancelRequest: noop,
  onSaveCheckin: noop,
  onEndPair: noop,
  birthDateHref: "/settings/account",
  verifyEmailHref: "/settings/security",
};

export const NoPair: StoryObj = { render: () => <StudyPairsView {...base} /> };

export const Waiting: StoryObj = {
  render: () => (
    <StudyPairsView {...base} openRequest={{ goal: "Aprender Rust", topicLabel: "Programação" }} />
  ),
};

export const BothCheckedIn: StoryObj = {
  render: () => <StudyPairsView {...base} pairs={[bothIn]} />,
};

/** Interactive: saving takes 1s, like the mutation in the app. */
export const CheckinPending: StoryObj = {
  render: function CheckinPendingStory() {
    const [pair, setPair] = useState(pending);
    const [status, setStatus] = useState<StudyPairSaveStatus>("idle");

    return (
      <StudyPairsView
        {...base}
        pairs={[pair]}
        checkinStatus={{ [pair.id]: status }}
        onSaveCheckin={(_, note) => {
          setStatus("saving");
          setTimeout(() => {
            setPair((prev) => ({ ...prev, myCheckin: note }));
            setStatus("saved");
          }, 1000);
        }}
      />
    );
  },
};

export const TwoPairs: StoryObj = {
  render: () => <StudyPairsView {...base} pairs={[bothIn, pending]} />,
};

export const RequestErrors: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <StudyPairsView {...base} requestError="BIRTH_DATE_REQUIRED" />
      <StudyPairsView {...base} requestError="EMAIL_NOT_VERIFIED" />
      <StudyPairsView {...base} requestError="STUDY_PAIRS_ADULTS_ONLY" popularGoals={[]} />
    </div>
  ),
};

export const CheckinSaveError: StoryObj = {
  render: () => (
    <StudyPairsView {...base} pairs={[pending]} checkinStatus={{ [pending.id]: "error" }} />
  ),
};

export const Loading: StoryObj = { render: () => <StudyPairsView {...base} loading /> };

export const LoadError: StoryObj = { render: () => <StudyPairsView {...base} loadError /> };
