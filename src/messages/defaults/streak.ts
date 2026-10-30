import type { StreakMessages } from "../../types/messages/streak-messages.js";

const days = (count: number) => (count === 1 ? "1 dia" : `${count} dias`);

export const streakMessages: StreakMessages = {
  streakCard: {
    title: "Sua sequência",
    loading: "Carregando sua sequência",
    loadError: "Não deu para carregar sua sequência agora.",
    retry: "Tentar de novo",
    days: (count) => `${days(count)} seguido${count === 1 ? "" : "s"}`,
    longest: (count) => `Seu recorde: ${days(count)}`,
    zeroTitle: "Comece hoje, no seu ritmo",
    zeroHint:
      "Um post, um comentário, uma reação ou o jogo do dia já contam. Sem pressa e sem cobrança.",
    todayDone: "Hoje já conta",
    todayHint:
      "Para contar hoje, vale postar, comentar, reagir, jogar o jogo do dia, mandar uma mensagem ou entrar numa comunidade.",
    milestone: (count) =>
      count === 7
        ? "Uma semana seguida. Que bom ter você por aqui."
        : "Mais de uma semana seguida. Que bom ter você por aqui.",
    freezeAvailable: "1 descanso disponível nesta semana",
    freezeUsed: (date) => `Descanso usado em ${date}`,
    freezeSpent: "Descanso desta semana já usado",
    freezeHint: "Se faltar um dia, o descanso cobre sozinho e a sequência continua.",
    weekLabel: "Últimos 7 dias",
    dayState: {
      done: "contou",
      frozen: "descanso",
      missed: "sem registro",
      today: "hoje, ainda em aberto",
    },
    compactLabel: (count, todayDone) =>
      `Sequência de ${days(count)}${todayDone ? ", hoje já conta" : ""}`,
  },
};
