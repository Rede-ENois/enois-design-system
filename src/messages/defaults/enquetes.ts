import type { EnquetesMessages } from "../../types/messages/enquetes-messages.js";

/** Enquete: o voto pode ser trocado enquanto está aberta; depois do prazo, só o resultado. */
export const enquetesMessages: EnquetesMessages = {
  enqueteCard: {
    votos: (total) => (total === 1 ? "1 voto" : `${total} votos`),
    semVotos: "Nenhum voto ainda",
    multipla: "Múltipla escolha",
    trocarVoto: "Trocar voto",
    manterVoto: "Manter meu voto",
    confirmarVoto: "Confirmar voto",
    votando: "Registrando voto…",
    terminaEm: (dia) => `Termina em ${dia}`,
    encerradaEm: (dia) => `Encerrada em ${dia}`,
  },
  enqueteComposer: {
    opcoesRotulo: "Alternativas",
    opcaoPlaceholder: (posicao) => `Alternativa ${posicao}`,
    adicionarOpcao: "Adicionar alternativa",
    removerOpcao: "Remover alternativa",
    dica: "De 2 a 6 alternativas, até 120 caracteres cada.",
    multiplaEscolha: "Múltipla escolha",
    prazoRotulo: "Termina em",
    prazoDica: "Opcional: depois do prazo, ninguém vota mais.",
  },
};
