export type ModeratorWorkspaceMessages = {
  moderatorWorkspace: {
    navigation: string;
    destination: string;
    search: string;
    searchPlaceholder: string;
    noDestinations: string;
    results: (count: number) => string;
    clear: string;
    chooseDestination: string;
  };
};
