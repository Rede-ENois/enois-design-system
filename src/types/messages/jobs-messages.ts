export type JobsMessages = {
  applyByEmailButton: { action: string; hint: string };
  professionalSignature: { sendingAs: string; needsProfile: string; setup: string };
  applyFreelanceDialog: {
    title: string;
    hint: string;
    placeholder: string;
    message: (title: string) => string;
    send: string;
    sending: string;
    sent: string;
    openChat: string;
    cancel: string;
  };
  applyJobDialog: {
    title: (job: string) => string;
    intro: string;
    aboutYou: string;
    aboutYouProfile: string;
    aboutYouExperience: string;
    aboutYouReputation: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    requiredHint: string;
    success: string;
    successDescription: string;
    verifyIdentity: string;
    resumePrefill: string;
    resumePrefillHint: string;
    resumeReading: string;
    resumeFilled: (filled: number, total: number) => string;
    resumeNoSuggestion: string;
    resumeMissingField: string;
    close: string;
  };
  applicationFeedbackDialog: {
    title: string;
    hint: string;
    placeholder: string;
    send: string;
    cancel: string;
  };
  applyExternalJobDialog: {
    title: (job: string) => string;
    intro: string;
    loading: string;
    loadError: string;
    retry: string;
    to: string;
    subject: string;
    body: string;
    message: string;
    messagePlaceholder: string;
    resumeAttached: (name: string) => string;
    resumeMissing: string;
    resumeMissingHint: string;
    /** Aviso de que o envio sai pelo Énóis, não pelo cliente de e-mail da pessoa. */
    sendingThrough: string;
    confirmHint: string;
    confirm: string;
    sending: string;
    cancel: string;
    success: string;
    successWithResume: (name: string) => string;
    successWithoutResume: string;
    close: string;
    openMailClient: string;
    openMailClientHint: string;
  };
  externalJobFilters: {
    title: string;
    level: string;
    workModel: string;
    employmentType: string;
    location: string;
    city: string;
    cityPlaceholder: string;
    state: string;
    statePlaceholder: string;
    country: string;
    countryPlaceholder: string;
    salaryMin: string;
    salaryMinPlaceholder: string;
    remoteOnly: string;
    publishedAfter: string;
    publishedAny: string;
    publishedLast7: string;
    publishedLast30: string;
    sort: string;
    sortRecent: string;
    sortSalary: string;
    sortRelevance: string;
    clear: string;
    clearAll: string;
    activeCount: (count: number) => string;
    /** Screen names of the levels, by API code; unknown codes show as they come. */
    levels: Record<string, string>;
    /** Screen names of the work models, by API code. */
    workModels: Record<string, string>;
    /** Screen names of the employment types, by API code. */
    employmentTypes: Record<string, string>;
  };
  externalJobOrigin: {
    /** "Vaga externa · Adzuna" — a origem sempre visível, nunca escondida atrás de um clique. */
    from: (platform: string) => string;
    /** "Publicada em 3 de novembro" ou "Data de publicação não informada pela fonte". */
    published: (date: string) => string;
    publishedUnknown: string;
    /** "Verificada na fonte há 2 dias" — a última confirmação, não a publicação. */
    lastSeen: (when: string) => string;
    lastSeenUnknown: string;
    /** A fonte já não lista a vaga: não é mais uma oportunidade disponível. */
    removed: string;
    /** A vaga expirou pela própria fonte. */
    expired: string;
    /** Link para a publicação original. */
    openSource: string;
    /** "hoje", "ontem", "há 3 dias", "há 2 meses". */
    relative: (days: number) => string;
    today: string;
    yesterday: string;
  };
  /** Field labels shared by the job forms (edit and external registration). */
  jobFields: {
    title: string;
    titlePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    location: string;
    type: string;
    level: string;
    salaryMin: string;
    salaryMinPlaceholder: string;
    salaryMinHint: (symbol: string) => string;
    salaryMax: string;
    salaryMaxPlaceholder: string;
    salaryPeriod: string;
    salaryPeriodHour: string;
    salaryPeriodDay: string;
    salaryPeriodMonth: string;
    salaryPeriodYear: string;
    currency: string;
    skills: string;
    skillsPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
  };
  jobEditDialog: { title: string; description: string; save: string; saving: string };
  createExternalJobDialog: {
    title: string;
    description: string;
    gateTitle: string;
    gateRequirement: (min: number) => string;
    gateCurrent: (value: number) => string;
    gateMissing: (missing: number) => string;
    url: string;
    urlHint: string;
    locationPlaceholder: string;
    activities: string;
    activitiesPlaceholder: string;
    salaryRange: string;
    salaryNotInformed: string;
    salaryNotInformedHint: string;
    applyEmail: string;
    applyEmailHint: string;
    communityAgreement: string;
    action: string;
    publishing: string;
  };
  companyEditDialog: {
    title: string;
    description: string;
    nameLabel: string;
    descriptionLabel: string;
    sector: string;
    size: string;
    location: string;
    website: string;
    logo: string;
    cover: string;
    removeLogo: string;
    removeCover: string;
    cancel: string;
    save: string;
    saving: string;
  };
  companyTeamSection: {
    team: string;
    noMembers: string;
    memberSearch: string;
    memberAdd: string;
    cancel: string;
    roleLabel: string;
    /** Screen names of the roles, by API code; unknown codes show as they come. */
    roles: Record<string, string>;
  };
};
