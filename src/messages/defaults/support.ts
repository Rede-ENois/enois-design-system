import type { SupportMessages } from "../../types/messages/support-messages.js";

export const supportMessages: SupportMessages = {
  supportForm: {
    attachImage: "Anexar imagem",
    attachImageAction: "Anexar imagem (opcional)",
    uploading: "Enviando...",
    removeImage: "Remover imagem",
    imageUploadError: "Não foi possível enviar a imagem. Tente de novo.",
    subject: "Assunto",
    subjectPlaceholder: "Ex.: não consigo entrar na minha conta",
    category: "Categoria",
    categoryHint: "Ajuda o time a priorizar e encaminhar o pedido.",
    categories: [
      ["BUG", "Problema (bug)"],
      ["ACCOUNT", "Conta e acesso"],
      ["CONTENT", "Conteúdo e denúncia"],
      ["IDEA", "Ideia ou sugestão"],
      ["API_ACCESS", "Acesso à API de produção"],
      ["OTHER", "Outro"],
    ],
    apiAccessTemplate:
      "Pedido de acesso à API de produção (a API pública roda no sandbox).\n\nNome completo:\nRG:\nCPF:\nE-mail e telefone:\nEmpresa/projeto e site:\nTipo de integração (bot, painel, automação, app, cliente customizado):\nO que a integração vai fazer:\nVolume estimado de requisições e horários de uso:\n",
    message: "Descreva o problema",
    messagePlaceholder: "Quanto mais detalhes, melhor conseguimos ajudar.",
    contactEmail: "E-mail para contato",
    contactEmailHint: "Respondemos neste e-mail.",
    action: "Enviar pedido",
    sending: "Enviando...",
    successTitle: "Pedido enviado",
    successDescription:
      "Uma pessoa do time vai responder no e-mail informado. O pedido fica registrado no nosso painel de atendimento.",
    newRequest: "Abrir outro pedido",
    validationSubject: "Informe um assunto curto.",
    validationMessage: "Descreva o problema com pelo menos 10 caracteres.",
    validationEmail: "Informe um e-mail válido.",
  },
  mySupportRequests: {
    title: "Meus pedidos",
    description:
      "Acompanhe o que você abriu. Quando o time conclui, o pedido aparece como resolvido aqui.",
    empty: "Você ainda não abriu nenhum pedido.",
    loading: "Carregando pedidos...",
    status: {
      OPEN: "Aberto",
      IN_PROGRESS: "Em andamento",
      CLOSED: "Resolvido",
    },
    adminReplyLabel: "Resposta do suporte",
  },
  contributionForm: {
    fields: {
      name: "Nome",
      namePlaceholder: "Como podemos te chamar",
      github: "GitHub",
      githubPlaceholder: "@usuario ou https://github.com/usuario",
      email: "E-mail",
      emailPlaceholder: "voce@exemplo.com",
      area: "Área",
      areaPlaceholder: "Escolha uma área",
      experience: "Experiência",
      experiencePlaceholder: "Escolha uma faixa",
      message: "O que você quer contribuir?",
      messagePlaceholder:
        "Conte o que você já fez, o que quer aprender ou qual problema do projeto quer atacar.",
    },
    areas: [
      ["ENGENHARIA", "Engenharia"],
      ["DESIGN", "Design"],
      ["PRODUTO", "Produto"],
      ["DADOS", "Dados"],
      ["INFRA", "Infraestrutura"],
      ["DOCUMENTACAO", "Documentação"],
      ["COMUNIDADE", "Comunidade"],
      ["OUTRO", "Outro"],
    ],
    experiences: [
      ["INICIANTE", "Iniciante"],
      ["INTERMEDIARIO", "Intermediário"],
      ["AVANCADO", "Avançado"],
      ["MANTENEDOR", "Mantenedor(a)"],
    ],
    termsPrefix: "Li e aceito as ",
    termsLink: "regras de contribuição e os termos de uso",
    termsSuffix: ".",
    submit: "Enviar candidatura",
    confirm: "Confirmar meus dados",
    sending: "Enviando...",
    successTitle: "Recebemos sua candidatura",
    successDescription:
      "O registro fica na fila interna do projeto. Se houver uma issue ou um próximo passo para a sua área, a gente fala com você pelo GitHub ou pelo e-mail informado.",
    verifiedGithubHint:
      "O GitHub vem do seu vínculo verificado; ele não pode ser alterado por aqui.",
    verifiedSuccessTitle: "Dados confirmados",
    verifiedSuccessDescription:
      "Você já aparece no painel de contribuintes. A verificação é o próprio GitHub, sem aprovação manual.",
    again: "Enviar outra",
    validationName: "Informe seu nome (pelo menos 2 caracteres).",
    validationGithub: "Informe seu usuário do GitHub.",
    validationEmail: "Informe um e-mail válido.",
    validationTerms: "Para enviar, aceite as regras e os termos.",
  },
  contributorLinkStatus: {
    title: "GitHub vinculado, contribuição ainda não verificada",
    description: (login: string) =>
      `Vinculado como @${login}. Ainda não encontramos nenhum pull request integrado ou issue qualificada nos repositórios elegíveis. Se você acabou de contribuir, verifique de novo.`,
    error: "A última verificação falhou; tente de novo agora.",
    syncNow: "Verificar contribuições",
    syncing: "Verificando contribuições...",
    syncFailed: "Não foi possível verificar agora. Tente de novo em alguns minutos.",
    syncFound: (contributions: number, issues: number) => {
      const parts: string[] = [];
      if (contributions > 0) {
        parts.push(contributions === 1 ? "1 pull request" : `${contributions} pull requests`);
      }
      if (issues > 0) {
        parts.push(issues === 1 ? "1 issue" : `${issues} issues`);
      }
      return `Verificação concluída: ${parts.join(" e ")}.`;
    },
    syncEmpty:
      "Nenhuma contribuição encontrada ainda. Se você já teve PR integrado ou issue qualificada, tente de novo em alguns instantes.",
    settingsLink: "GitHub para selos de contribuição",
  },
  verifiedContributorPrompt: {
    title: "Você tem contribuições verificadas",
    description:
      "Confirme seus dados para aparecer no painel de contribuintes. A verificação é o próprio GitHub, sem aprovação manual.",
    action: "Preencher formulário",
    close: "Agora não",
    formTitle: "Confirme seus dados",
    formHint: "É o mesmo formulário da landing; o GitHub já comprovou a contribuição.",
    confirmedTitle: "Seus dados de contribuinte já estão confirmados",
    confirmedDescription:
      "A contribuição foi verificada pelo GitHub e seus dados já aparecem no painel de contribuintes. Não há mais nada para preencher.",
  },
};
