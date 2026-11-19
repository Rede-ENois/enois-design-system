import type { StudyPairIcebreakerField } from "./study-pair-icebreaker-field.js";
import type { StudyPairProposal } from "./study-pair-proposal.js";
import type { StudyPairProposalsProps } from "./study-pair-proposals-props.js";

/** O que um card de proposta recebe; o `busy` vale para os dois botões do card. */
export type StudyPairProposalCardProps = {
  proposal: StudyPairProposal;
  fields: StudyPairIcebreakerField[];
  fieldsLoading: boolean;
  accepting: boolean;
  busy: boolean;
  declining: boolean;
  error: string | null;
  onAccept: StudyPairProposalsProps["onAccept"];
  onDecline: StudyPairProposalsProps["onDecline"];
};
