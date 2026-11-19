import type { StudyPairIcebreakerAnswers } from "./study-pair-icebreaker-answers.js";
import type { StudyPairProposalPartner } from "./study-pair-proposal-partner.js";

/**
 * Uma proposta de par: o casamento nasce pendente e só vira par com o aceite dos dois. O
 * quebra-gelo da outra pessoa só chega depois do meu aceite (a revelação é simétrica, decidida no
 * servidor).
 */
export type StudyPairProposal = {
  id: string;
  goal: string;
  partner: StudyPairProposalPartner;
  myAccepted: boolean;
  partnerAccepted: boolean;
  partnerIcebreaker: StudyPairIcebreakerAnswers | null;
  /** Prazo já formatado pelo app ("26 nov"). */
  deadlineLabel: string;
};
