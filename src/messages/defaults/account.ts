import type { AccountMessages } from "../../types/messages/account-messages.js";

export const accountMessages: AccountMessages = {
  accountMenu: {
    trigger: "Menu da conta",
    triggerLabel: "Perfil",
    profile: "Ver perfil",
    corporateProfile: "Perfil profissional",
    wallet: "Carteira",
    marketplace: "Marketplace",
    changeEmail: "Alterar e-mail",
    changePassword: "Trocar senha",
    support: "Ajuda e suporte",
    blockedUsers: "Usuários bloqueados",
    myReports: "Minhas denúncias",
    moderator: "Painel de moderador",
    sanctions: "Penalidades",
    linkedAccounts: "Contas vinculadas",
    healthyUsage: "Uso saudável",
    guardian: "Supervisão parental",
    security: "Segurança e verificação",
    apoie: "Apoie o Énóis",
    deleteAccount: "Excluir conta",
    logout: "Sair",
    loggingOut: "Saindo...",
    notificationPreferences: "Preferências de notificação",
  },
  pushToggle: {
    on: "Notificações no celular ativadas",
    off: "Ativar notificações no celular",
    working: "Ativando...",
  },
  ageGate: {
    title: "Confirme sua data de nascimento",
    description:
      "A plataforma exige a data de nascimento para publicar, comentar e enviar mensagens. Ela fica guardada com a sua conta e não aparece para outras pessoas.",
    label: "Data de nascimento",
    confirm: "Confirmar e continuar",
    later: "Agora não",
    invalid: "Confira a data: ela não pode estar no futuro.",
    parental: {
      title: "Conta de adolescente protegida",
      description:
        "Sua conta é de menor de 18 anos. Para publicar, comentar e enviar mensagens, um responsável legal precisa autorizar o uso da rede.",
      howItWorks:
        "Envie o convite para o e-mail do seu responsável. Ele precisa entrar no Énóis com uma conta de adulto e aceitar o convite. Até lá, a conta fica somente leitura.",
      emailLabel: "E-mail do responsável",
      invite: "Enviar convite",
      inviting: "Enviando...",
      sentFor: (email) => `Convite enviado para ${email}.`,
      waiting:
        "Quando o responsável aceitar, a conta é liberada. Se ele já aceitou, verifique de novo.",
      checkAgain: "Verificar de novo",
      checking: "Verificando...",
      later: "Agora não",
      invalidEmail: "Informe um e-mail válido.",
    },
  },
  changeEmailDialog: {
    title: "Alterar e-mail",
    description:
      "Enviaremos um link de confirmação para o novo endereço. A troca só vale depois do clique.",
    current: (email) => `E-mail atual: ${email}`,
    newEmail: "Novo e-mail",
    newEmailPlaceholder: "novo@exemplo.com",
    password: "Senha atual",
    passwordHint: "Confirme sua senha para concluir a troca.",
    action: "Salvar e-mail",
    saving: "Salvando...",
    success:
      "Enviamos um link de confirmação para o novo e-mail. Abra a mensagem para concluir a troca.",
    invalidEmail: "Digite um e-mail válido.",
    sameEmail: "Esse já é o seu e-mail atual.",
    close: "Fechar",
  },
  changePasswordDialog: {
    title: "Trocar senha",
    titleCreate: "Criar senha",
    description: "Por segurança, você entrará de novo com a nova senha.",
    descriptionCreate:
      "Sua conta entrou por login social e ainda não tem senha. Crie uma para ligar o segundo fator e entrar sem o provedor.",
    current: "Senha atual",
    newPassword: "Nova senha",
    confirm: "Confirmar nova senha",
    action: "Salvar nova senha",
    actionCreate: "Criar senha",
    saving: "Salvando...",
    tooShort: "A senha precisa ter pelo menos 8 caracteres.",
    mismatch: "As senhas não conferem.",
  },
  deleteAccountDialog: {
    title: "Excluir conta",
    description: "Esta ação é permanente e não pode ser desfeita.",
    consequences: [
      "Seus dados de perfil (nome, e-mail, bio e links) são removidos.",
      "Você perde o acesso à conta e precisa criar outra para voltar.",
      "O conteúdo já publicado fica atribuído a um perfil anonimizado.",
    ],
    password: "Confirme com sua senha",
    confirm: "Entendo que a exclusão é permanente.",
    action: "Excluir minha conta",
    deleting: "Excluindo...",
  },
  linkedAccountsDialog: {
    title: "Contas vinculadas",
    description:
      "Vincule um provedor para entrar com um clique. Nunca vinculamos automaticamente: só a partir de uma conta que já é sua.",
    linked: "Vinculado",
    notLinked: "Não vinculado",
    link: (provider) => `Vincular ${provider}`,
    unlink: "Desvincular",
    linkedinSync: {
      toggle: "Publicar minhas publicações no LinkedIn",
      toggleHint: "Cada post novo vira um post no LinkedIn com o link do Énóis.",
      lastShareOk: "Última tentativa: o LinkedIn aceitou · ",
      lastShareFailed: (detail) =>
        detail === "HTTP_401" || detail === "HTTP_403"
          ? "A última tentativa não foi: o LinkedIn recusou a permissão — reconecte o LinkedIn e publique de novo. · "
          : detail === "HTTP_422"
            ? "A última tentativa não foi: o LinkedIn recusou o conteúdo do post. · "
            : `A última tentativa não foi (${detail}) — reconecte o LinkedIn e publique de novo. · `,
      notReady: "Reconecte o LinkedIn para autorizar a publicação em seu nome.",
      serverKey:
        "A publicação no LinkedIn ainda não está disponível nesta instalação. Avise o time de suporte.",
      reconnect: "Reconectar LinkedIn",
      reconnectHint:
        'Se o LinkedIn mostrar “Ocorreu um erro”, o app do Énóis ainda não tem o produto "Share on LinkedIn" (w_member_social) aprovado. É uma aprovação do LinkedIn, não um problema da sua conta.',
    },
  },
  linkedInSyncPrompt: {
    promptTitle: "Sincronizar publicações com o LinkedIn?",
    promptBody:
      "Suas próximas publicações no Énóis podem ser publicadas também no seu feed do LinkedIn, com o link para o post original. Você pode mudar isso depois em Contas vinculadas.",
    notReady: "Reconecte o LinkedIn para autorizar a publicação em seu nome.",
    serverKey:
      "A publicação no LinkedIn ainda não está disponível nesta instalação. Avise o time de suporte.",
    yes: "Sim, sincronizar",
    no: "Não, obrigado",
    close: "Fechar",
  },
  blockUserDialog: {
    blockUser: "Bloquear",
    unblockUser: "Desbloquear",
    blockTitle: (name) => `Bloquear ${name}?`,
    unblockTitle: (name) => `Desbloquear ${name}?`,
    blockDescription:
      "A pessoa some para você: os posts, comentários e notificações dela deixam de aparecer, e a conexão é desfeita. Ela não é avisada. Isso vale para sempre, até você desbloquear.",
    unblockDescription:
      "O conteúdo dela volta a aparecer para você. Nada é restaurado automaticamente além disso (a conexão precisa ser refeita).",
    blockError: "Não foi possível concluir. Tente novamente.",
    cancel: "Cancelar",
  },
};
