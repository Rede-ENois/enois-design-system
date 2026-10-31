import type { SecurityMessages } from "../../types/messages/security-messages.js";

export const securityMessages: SecurityMessages = {
  identitySection: {
    title: "Nome e identidade",
    hint: "O nome social substitui o seu nome de cadastro para todo mundo; o apelido entra entre parênteses depois do nome; os pronomes aparecem só no seu perfil. O nome de cadastro continua visível para você e para as empresas que recebem a sua candidatura.",
    socialName: "Nome social",
    nickname: "Apelido",
    pronouns: "Pronomes",
    placeholderOptional: "opcional",
    pronounsPlaceholder: "ela/dela",
    save: "Salvar identidade",
    badgesTitle: "Emblemas",
    badgesHint: "Até 5 PNGs pequenos. O primeiro acompanha o seu nome em todo o app.",
    badgesAdd: "Adicionar emblema",
    badgesRemove: "Remover",
    badgesFull: "Você já tem 5 emblemas.",
    sending: "Enviando...",
  },
  identityVerificationSection: {
    title: "Identidade verificada",
    subtitle:
      "Comprove que você é uma pessoa real usando um provedor de identidade. Énóis não guarda documento, selfie nem biometria: só o resultado e a validade.",
    states: {
      NOT_VERIFIED: "Ainda não verificada",
      PENDING: "Verificação em andamento",
      VERIFIED: "Identidade verificada",
      REJECTED: "Verificação recusada",
      EXPIRED: "Verificação expirada",
      REVOKED: "Verificação desvinculada",
      ERROR: "Falha técnica na verificação",
    },
    start: "Verificar identidade",
    refresh: "Atualizar estado",
    revoke: "Desvincular identidade",
    unavailable:
      "A verificação de identidade ainda não está disponível: o Énóis precisa de um provedor autorizado. Assim que houver, o botão fica ativo aqui.",
    whatWeStore:
      "O que o Énóis guarda: o estado da verificação, o provedor e as datas. Nunca CPF, documento, selfie, biometria ou tokens do provedor.",
    whoProcesses:
      "Quem processa os dados é o provedor de identidade. O Énóis recebe apenas a confirmação do resultado.",
    badgeLabel: "Identidade verificada",
    badgeHint:
      "Identidade confirmada por um provedor. Não significa que a pessoa é confiável em tudo.",
  },
  linkedinImportSection: {
    semEstrutura: (lista) =>
      `Também vieram no arquivo, mas ainda não têm um lugar no perfil do Énóis: ${lista}.`,
    connectFirst: "Conecte o LinkedIn para importar seus dados.",
    title: "Sincronizar com LinkedIn",
    hint: "O vínculo confirma a identidade pelo login. Experiências, certificações e projetos o LinkedIn só entrega no arquivo de dados (pela API vem só o básico, nome e e-mail, salvo aprovação no programa de parceiros deles). Sem baixar nada: copie o texto do seu perfil e cole; ou use o ZIP da exportação. O app mostra a prévia de tudo antes de salvar.",
    button: "Enviar o ZIP do LinkedIn",
    getArchive: "Baixar meu arquivo no LinkedIn",
    tooLarge: (mb) =>
      `O arquivo passa de ${mb} MB. Use o arquivo BÁSICO da exportação do LinkedIn (o completo vem com senha e é enorme).`,
    pasteToggle: "Colar o perfil",
    pastePlaceholder:
      "Abra seu perfil no LinkedIn, selecione tudo (Ctrl+A), copie e cole aqui. O app extrai experiências, formação, certificações e projetos.",
    pasteRead: "Ler o perfil colado",
    found: (count) => `${count} itens encontrados. Marque o que quer importar:`,
    save: "Importar selecionados",
    resumeButton: "Enviar o currículo",
    resumeHint:
      "Sem LinkedIn? Suba o currículo: o app lê o arquivo e mostra a mesma prévia antes de salvar. Vale PDF (até 10 MB e 20 páginas) ou .txt/.md. Se for DOC/DOCX, exporte em PDF no seu editor.",
    resumeWrongFormat:
      "Esse formato não entra: exporte o currículo em PDF no seu editor (Arquivo → Exportar como PDF).",
    resumeTooLarge:
      "Arquivo grande demais: o currículo vai até 10 MB (PDF de até 20 páginas) ou 512 KB em texto.",
    readingResume: "Lendo o currículo...",
    loading: "Carregando...",
    cancel: "Cancelar",
    profileRow: "Perfil: ",
    profileRowSummary: " · com o seu resumo",
    skillsRow: "Habilidades: ",
  },
  linkedinContactsSection: {
    title: "Convidar contatos do LinkedIn",
    hint: "O LinkedIn não entrega a sua lista de conexões pela API. Baixe o Connections.csv no arquivo de dados e envie aqui: o Énóis encontra quem já tem conta e manda a solicitação de conexão.",
    import: "Enviar Connections.csv",
    importHint:
      "Aceita o CSV (ou o ZIP da exportação), até 5 MB. Só nome e e-mail são usados para encontrar a pessoa; empresa, cargo e URL são descartados.",
    tooLarge: (mb) => `O arquivo passa de ${mb} MB.`,
    importing: "Lendo seus contatos...",
    loadError: "Não foi possível carregar os seus contatos do LinkedIn.",
    retry: "Tentar de novo",
    autoInvite: "Enviar convites automaticamente",
    autoInviteHint:
      "Ligado, cada contato importado que ainda não está conectado recebe uma solicitação sua. Quem tiver mais de um perfil com o mesmo nome fica de fora.",
    summary: (contacts, invited) =>
      `${contacts} ${contacts === 1 ? "contato importado" : "contatos importados"} · ` +
      `${invited} ${invited === 1 ? "convite enviado" : "convites enviados"}`,
    details: (detalhes) => `Também: ${detalhes}.`,
    already: (count) => `${count} já ${count === 1 ? "era conexão" : "eram conexões"}`,
    pending: (count) =>
      `${count} já ${count === 1 ? "tinha pedido" : "tinham pedido"} para conectar`,
    queued: (count) => `${count} na fila`,
    missing: (count) => `${count} sem conta no Énóis`,
    ambiguous: (count) => `${count} com nome ambíguo`,
    skipped: (count) => `${count} não ${count === 1 ? "enviado" : "enviados"}`,
  },
  gitHubLinkCard: {
    title: "GitHub para selos de contribuição",
    description:
      "Vincule sua conta GitHub para que o Énóis possa verificar PRs integrados nos repositórios oficiais. O vínculo não altera seu login nem sua verificação de identidade.",
    linkedAs: (login) => `Vinculado como @${login}`,
    lastSync: (date) => `Última sincronização: ${date}`,
    neverSynced: "Ainda não sincronizou. Use “Verificar contribuições” para buscar os dados agora.",
    syncStale:
      "Os dados podem estar desatualizados. Use “Verificar contribuições” para atualizar agora.",
    syncError:
      "A última sincronização falhou; os números podem estar desatualizados. Tente verificar de novo.",
    syncNow: "Verificar contribuições",
    syncing: "Verificando contribuições...",
    syncEmpty:
      "Nenhuma contribuição encontrada ainda. Se você já teve PR integrado ou issue qualificada, tente de novo em alguns instantes.",
    syncFound: (contributions, issues) => {
      const parts: string[] = [];
      if (contributions > 0) {
        parts.push(contributions === 1 ? "1 pull request" : `${contributions} pull requests`);
      }
      if (issues > 0) {
        parts.push(issues === 1 ? "1 issue" : `${issues} issues`);
      }
      return `Verificação concluída: ${parts.join(" e ")}.`;
    },
    syncFailed: "Não foi possível verificar agora. Tente de novo em alguns minutos.",
    link: "Vincular GitHub",
    unlink: "Desvincular GitHub",
    linking: "Abrindo GitHub...",
    unlinkConfirm:
      "Desvincular o GitHub? Os selos já concedidos permanecem, mas novas contribuições não serão vinculadas.",
    error: "Não foi possível alterar o vínculo com o GitHub.",
    unlinkError: "Não foi possível desvincular o GitHub.",
    criteria: "Ler os critérios dos selos",
    notConfigured:
      "O vínculo com GitHub ainda não está configurado neste ambiente. Fale com a administração.",
  },
};
