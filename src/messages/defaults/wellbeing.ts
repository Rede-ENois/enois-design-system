import type { WellbeingMessages } from "../../types/messages/wellbeing-messages.js";

export const wellbeingMessages: WellbeingMessages = {
  nightRestReminder: {
    title: "Tá com insônia?",
    body: "Tenta cuidar melhor de ti, ouvir um ruído branco e tentar dormir. É bom ter você aqui pra fazer companhia, mas é melhor ainda ter você saudável.",
    rest: "Vou tentar descansar",
    keep: "Continuar no Énóis",
  },
  healthyUsageDialog: {
    title: "Uso saudável",
    description:
      "Defina um limite de tempo para receber um lembrete gentil de pausa enquanto usa o Énóis.",
    switchLabel: "Ativar lembrete de pausa",
    switchHint: "O contador roda em segundo plano nesta sessão; fechar o app zera o tempo.",
    minutesLabel: "Lembrar depois de",
    minutesUnit: "minutos",
    minutesHint: "Escolha entre 1 e 240 minutos. O tempo configurado continua salvo.",
    save: "Salvar",
    liteTitle: "Modo lite",
    liteDescription:
      "Aparelho antigo, bateria curta ou internet ruim? O Modo lite desliga as animações, busca tudo em blocos maiores e segura os dados por mais tempo em cache: menos requisições e menos trabalho pro seu celular. A interface é a mesma.",
    liteWhy:
      "A gente pensou em otimização de recursos: aparelho antigo não é aparelho de segunda classe. Em vez de pedir um celular novo, o Énóis se adapta ao que você tem.",
    forceMotionTitle: "Manter as animações neste aparelho",
    forceMotionDescription:
      "Seu sistema está pedindo pra reduzir movimento e a gente respeita: as molduras animadas e os efeitos ficam parados. Ligue aqui pra ver as animações mesmo assim.",
    nightRestTitle: "Lembrete de descanso durante a madrugada",
    nightRestDescription:
      "Receba uma mensagem de cuidado ao acessar o feed entre meia-noite e cinco da manhã.",
    likeTitle: "O que quero ver",
    likeHint:
      "Escolha os assuntos que você gostaria de encontrar com mais frequência. Eles ganham prioridade nas recomendações, e o resto do feed continua aí.",
    dislikeTitle: "Assuntos que não gosto",
    dislikeHint:
      "Assuntos que você prefere evitar nos seus feeds personalizados. Publicações sem assunto nunca são escondidas, e o conteúdo continua no ar para as outras pessoas.",
    modulesTitle: "O que não quero ver",
    modulesHint:
      "Desative as áreas do Énóis que não fazem parte da experiência que você deseja. Nada é apagado: some só da sua interface e volta quando você reativar.",
    modules: [
      { id: "COMMUNITIES", label: "Comunidades" },
      { id: "GROUPS", label: "Grupos" },
      { id: "MESSAGES", label: "Mensagens" },
      { id: "BLOGS", label: "Blogs" },
      { id: "JOBS", label: "Vagas" },
      { id: "COMPANIES", label: "Empresas" },
      { id: "MENTORING", label: "Mentoria" },
      {
        id: "EVENTS",
        label: "Eventos",
        hint: "Desativar Eventos desativa também o Acontecendo agora.",
      },
      { id: "DAILY_GAMES", label: "Jogos diários" },
      { id: "COMMUNITY_GAMES", label: "Jogos da comunidade" },
      { id: "COMMUNITY_PROJECTS", label: "Projetos da comunidade" },
    ],
  },
  healthyUsageReminder: {
    title: "Hora de uma pausa",
    brandName: "Énóis",
    noise:
      "Ei, respira! Bebe uma água, olha pela janela e volta quando quiser. Eu também preciso de uma pausa.",
    body: "Ops, acho que já passou um tempo que você tá scrollando. Vamos dar uma parada?",
    cta: "Vou dar uma pausa",
  },
};
