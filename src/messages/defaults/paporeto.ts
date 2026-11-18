import type { PaporetoMessages } from "../../types/messages/paporeto-messages.js";

export const paporetoMessages: PaporetoMessages = {
  papoPanel: {
    title: "Papo Reto",
    subtitle: "O que a rede está conversando, medido do que já é público. Ninguém é perguntado.",
    loading: "Ouvindo o papo…",
    error: "Não foi possível abrir o Papo Reto. Tente de novo.",
    retry: "Tentar de novo",
    falasAnalisadas: (count) =>
      count === 1
        ? "1 fala analisada na última semana"
        : `${count} falas analisadas na última semana`,
    semAssuntos: "Sem assunto em alta por aqui ainda. O papo aquece com a rede.",
    filtroTodos: "Todos",
    filtroEmergente: "Emergendo",
    filtroPersistente: "Persistindo",
    filtroHot: "Aquecendo",
    statusEmergente: "Emergindo",
    statusPersistente: "Persistindo",
    statusHot: "Aquecendo",
    abrirTimeline: (subject) => `Ver a linha do tempo de ${subject}`,
    fecharTimeline: (subject) => `Fechar a linha do tempo de ${subject}`,
    pessoas: (count) => (count === 1 ? "1 pessoa distinta" : `${count} pessoas distintas`),
    falasPost: (count) => (count === 1 ? "1 publicação" : `${count} publicações`),
    falasComentario: (count) => (count === 1 ? "1 comentário" : `${count} comentários`),
    crescimento: (percent) => `Subiu ${Math.round(percent)}% nas últimas 24 horas`,
    semCrescimento: "Estável",
    falasUltimaHora: (count) =>
      count === 1 ? "1 fala na última hora" : `${count} falas na última hora`,
    ultimas24: "últimas 24 horas",
    privacidade:
      "Aqui não tem quem falou o quê: só expressões que nomeiam a conversa, contadas do que já é público. Uma expressão que só uma pessoa repetiu não vira alta; o assunto precisa de gente de verdade.",
  },
  papoTimeline: {
    rotuloJanela: (janela) =>
      janela === "24h" ? "24 horas" : janela === "7d" ? "7 dias" : "30 dias",
    falas: (count) => (count === 1 ? "1 fala" : `${count} falas`),
    semFalas: "Sem falas nesta janela.",
    carregando: "Contando as falas…",
    eixo: "Falas por hora",
  },
};
