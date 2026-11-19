/** Uma pergunta do quebra-gelo, já traduzida pelo app, na ordem do aceite. */
export type StudyPairIcebreakerField = {
  id: string;
  question: string;
  required: boolean;
  /** Vazio quando a pergunta é de texto livre. */
  options: string[];
  /** Dica do campo de texto livre; o app decide se tem uma. */
  placeholder?: string;
};
