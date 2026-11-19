import type { StudyPairIcebreakerAnswers } from "./study-pair-icebreaker-answers.js";
import type { StudyPairIcebreakerField } from "./study-pair-icebreaker-field.js";
import type { StudyPairProposal } from "./study-pair-proposal.js";

export type StudyPairProposalsProps = {
  /** Sem propostas a seção não renderiza (o app não precisa decidir). */
  proposals: StudyPairProposal[];
  /** Perguntas do quebra-gelo, na ordem; o app traduz pelos ids do catálogo do servidor. */
  fields: StudyPairIcebreakerField[];
  /** Mostra o estado de carregamento do catálogo em vez do formulário. */
  fieldsLoading?: boolean;
  onAccept: (proposalId: string, answers: StudyPairIcebreakerAnswers) => void;
  acceptingId?: string | null;
  onDecline: (proposalId: string) => void;
  decliningId?: string | null;
  /** Mensagem por proposta (falha do servidor), mostrada sob os botões. */
  errors?: Record<string, string | null | undefined>;
};
