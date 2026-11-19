export type StudyPairProposalsMessages = {
  studyPairProposals: {
    title: string;
    hint: string;
    deadline: (label: string) => string;
    partnerAccepted: string;
    partnerWaiting: string;
    accept: string;
    accepting: string;
    decline: string;
    declining: string;
    partnerIcebreaker: string;
    noAnswer: string;
    icebreakerTitle: string;
    icebreakerHint: string;
    required: string;
    optional: string;
    requiredError: string;
    myAccepted: string;
    loading: string;
  };
};
