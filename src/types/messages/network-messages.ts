export type NetworkMessages = {
  networkRequests: {
    title: string;
    summary: (incoming: number) => string;
    tabsLabel: string;
    received: (count: number) => string;
    sent: (count: number) => string;
    receivedAt: (date: string) => string;
    sentAt: (date: string) => string;
    accept: string;
    acceptFrom: (name: string) => string;
    decline: string;
    declineFrom: (name: string) => string;
    cancel: string;
    cancelTo: (name: string) => string;
    accepted: string;
    declined: string;
    cancelled: string;
    failed: string;
    viewProfile: string;
    emptyReceived: string;
    emptySent: string;
    showAll: (count: number) => string;
    showLess: string;
    loading: string;
    loadError: string;
    retry: string;
  };
};
