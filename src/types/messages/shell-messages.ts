export type ShellMessages = {
  appBrand: { prefix: string; accent: string };
  authenticatedAppHeader: { openMenu: string };
  guestAppHeader: { enter: string };
  exploreHub: { title: string; searchLabel: string; searchPlaceholder: string; empty: string };
  navigationLinks: {
    myCommunities: string;
    favoriteCommunities: string;
    sections: Record<"community" | "work", string>;
  };
  contextSwitcher: {
    label: string;
    social: string;
    professional: string;
    socialHint: string;
    professionalHint: string;
    setupProfessional: string;
    switchToSocial: string;
    switchToProfessional: string;
  };
  platformSpacesCard: { title: string; subtitle: string };
};
