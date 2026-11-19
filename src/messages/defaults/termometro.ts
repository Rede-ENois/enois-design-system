import type { TermometroMessages } from "../../types/messages/termometro-messages.js";

export const termometroMessages: TermometroMessages = {
  termometroPanel: {
    title: "Termômetro da comunidade",
    subtitle: "Como a rede soa, medido pelo que a comunidade publicou. Ninguém é perguntado.",
    loading: "Medindo o clima…",
    error: "Não foi possível abrir o Termômetro. Tente de novo.",
    retry: "Tentar de novo",
    periodoHoje: "Hoje",
    periodo24h: "24 horas",
    periodo7d: "7 dias",
    periodo30d: "30 dias",
    manifestacoes: (count) =>
      count === 1 ? "1 manifestação analisada" : `${count} manifestações analisadas`,
    participantes: (count) => (count === 1 ? "1 pessoa distinta" : `${count} pessoas distintas`),
    amostraInsuficiente:
      "Ainda há gente de menos nesta janela para mostrar um indicador confiável. Tudo aqui é contado só quando o conjunto é grande o bastante.",
    semManifestacoes: "Nada a medir nesta janela ainda.",
    dominante: "O que domina nesta janela",
    semDominante: "Sem emoção dominante. A rede está variada.",
    comparacaoComJanelaAnterior: (delta) =>
      delta > 0
        ? `Aumentou ${delta}% em relação à janela anterior`
        : `Caiu ${Math.abs(delta)}% em relação à janela anterior`,
    semComparacao: "Sem mudança em relação à janela anterior",
    privacidade:
      "Aqui não tem quem escreveu o quê: só porcentagens do conjunto, contadas de tudo que já é público. Ninguém é identificada e nada de conversa privada entra na conta.",
    emocaoAlegre: "Alegre",
    emocaoPesada: "Pesada",
    emocaoCansada: "Cansada",
    emocaoPrecisando: "Precisando de apoio",
    emocaoCuriosa: "Curiosa",
    emocaoCelebrando: "Celebrando",
  },
};
