export type CommunitiesMessages = {
  communityCard: {
    members: (count: number) => string;
    participating: string;
    enter: string;
    ownerLeaveBlocked: string;
  };
  communityFavoriteButton: { favorite: string; unfavorite: string };
  communityChannels: {
    title: string;
    subtitle: string;
    locked: string;
    create: string;
    createTitle: string;
    name: string;
    namePlaceholder: string;
    topic: string;
    topicNone: string;
    description: string;
    descriptionPlaceholder: string;
    cancel: string;
    confirm: string;
    creating: string;
    empty: string;
    invalidName: string;
  };
  localCommunitiesSection: {
    title: string;
    loading: string;
    error: string;
    retry: string;
    emptyTitle: string;
    emptyBody: string;
    noCityTitle: string;
    noCityBody: string;
    setCity: string;
  };
  communityLocationFilter: {
    label: string;
    hint: string;
    apply: string;
    clear: string;
    cityNeedsState: string;
  };
};
