import type { GroupAdminMessages } from "../../types/messages/group-admin-messages.js";

export const groupAdminMessages: GroupAdminMessages = {
  groupAdmin: {
    section: {
      title: "Grupo",
      count: (count) => (count === 1 ? "1 pessoa" : `${count} pessoas`),
    },
    participants: {
      owner: "Dono",
      admin: "Administrador",
      member: "Membro",
      promote: (name) => `Tornar ${name} administrador`,
      demote: (name) => `Voltar ${name} a membro`,
      ownerOnly: "Só o dono mexe em outro administrador",
      remove: (name) => `Remover ${name} do grupo`,
      confirmRemove: (name) =>
        `Remover ${name} do grupo? A pessoa deixa de ver as mensagens daqui.`,
      confirmRemoveAction: "Remover",
      confirmRemoveCancel: "Cancelar",
    },
    add: {
      title: "Adicionar ao grupo",
      search: "Buscar pessoas",
      searchPlaceholder: "Nome de quem você quer adicionar",
      noResults: "Ninguém encontrado",
      searching: "Buscando pessoas…",
      alreadyMember: "Já está no grupo",
      submit: (count) => (count === 1 ? "Adicionar 1 pessoa" : `Adicionar ${count} pessoas`),
    },
  },
  groupTopics: {
    title: "Tópicos",
    empty: "Nenhum tópico ainda. Os tópicos separam os assuntos dentro do grupo.",
    name: "Nome do tópico",
    namePlaceholder: "Ex.: Jogatinas de sexta",
    create: "Criar tópico",
    rename: (name) => `Renomear o tópico ${name}`,
    save: "Salvar nome",
    cancel: "Cancelar",
    archive: (name) => `Arquivar o tópico ${name}`,
    confirmArchive: (name) =>
      `Arquivar ${name}? As mensagens continuam guardadas, mas ninguém manda mais nele.`,
    confirmArchiveAction: "Arquivar",
    archived: "Arquivado",
    close: "Fechar",
    allTopics: "Todos os assuntos",
    moveUp: (name) => `Mover o tópico ${name} para cima`,
    moveDown: (name) => `Mover o tópico ${name} para baixo`,
    historyNote: "As conversas de antes de os tópicos existirem ficam em Todos os assuntos.",
    errors: {
      generic: "Algo deu errado. Tente de novo.",
      nameTaken: "Já existe um tópico com esse nome.",
      invalidName: "O nome do tópico precisa ter de 1 a 60 caracteres.",
      tooManyTopics: "O grupo atingiu o limite de tópicos.",
      notManager: "Só o dono e os administradores mexem nos tópicos.",
    },
  },
};
