import type { StudyPairProposalsMessages } from "../../types/messages/study-pair-proposals-messages.js";

export const studyPairProposalsMessages: StudyPairProposalsMessages = {
  studyPairProposals: {
    title: "Propostas de par",
    hint: "Encontramos alguém com o mesmo objetivo. Vejam se combinam: só viram par quando os dois aceitarem.",
    deadline: (label) => `Até ${label} para responder`,
    partnerAccepted: "Já aceitou e escreveu o quebra-gelo dela.",
    partnerWaiting: "Ainda não aceitou.",
    accept: "Aceitar",
    accepting: "Aceitando…",
    decline: "Recusar",
    declining: "Recusando…",
    partnerIcebreaker: "O quebra-gelo de",
    noAnswer: "Sem resposta.",
    icebreakerTitle: "Antes de fechar, conte por que esse objetivo agora",
    icebreakerHint: "A outra pessoa só vê as suas respostas depois que aceitar também.",
    required: "Obrigatória",
    optional: "Opcional",
    requiredError: "Responda a pergunta obrigatória para aceitar.",
    myAccepted: "Você aceitou. Falta o aceite da outra pessoa para o par começar.",
    loading: "Carregando as perguntas do quebra-gelo",
  },
};
