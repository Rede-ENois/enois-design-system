export type GroupAdminMessages = {
  groupAdmin: {
    section: {
      title: string;
      /** Contagem no cabeçalho da seção de participantes. */
      count: (count: number) => string;
    };
    participants: {
      owner: string;
      admin: string;
      member: string;
      promote: (name: string) => string;
      demote: (name: string) => string;
      /** Por que a ação de administrador aparece desligada para quem não é o dono. */
      ownerOnly: string;
      remove: (name: string) => string;
      confirmRemove: (name: string) => string;
      confirmRemoveAction: string;
      confirmRemoveCancel: string;
    };
    add: {
      title: string;
      search: string;
      searchPlaceholder: string;
      noResults: string;
      searching: string;
      alreadyMember: string;
      submit: (count: number) => string;
    };
  };
  groupTopics: {
    title: string;
    empty: string;
    name: string;
    namePlaceholder: string;
    create: string;
    rename: (name: string) => string;
    save: string;
    cancel: string;
    archive: (name: string) => string;
    confirmArchive: (name: string) => string;
    confirmArchiveAction: string;
    archived: string;
    close: string;
    allTopics: string;
    moveUp: (name: string) => string;
    moveDown: (name: string) => string;
    historyNote: string;
    errors: {
      generic: string;
      nameTaken: string;
      invalidName: string;
      tooManyTopics: string;
      notManager: string;
    };
  };
};
