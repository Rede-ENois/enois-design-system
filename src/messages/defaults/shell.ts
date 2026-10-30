import type { ShellMessages } from "../../types/messages/shell-messages.js";

export const shellMessages: ShellMessages = {
  appBrand: { prefix: "É", accent: "nóis" },
  authenticatedAppHeader: { openMenu: "Abrir menu" },
  guestAppHeader: { enter: "Entrar" },
  navigationLinks: { myCommunities: "Suas comunidades", favoriteCommunities: "Favoritas" },
  contextSwitcher: {
    label: "Interface",
    social: "Social",
    professional: "Profissional",
    socialHint: "Comunidades, conversas e a vida no Énóis.",
    professionalHint: "Vagas, serviços e o seu trabalho.",
    setupProfessional: "Ative seu perfil profissional",
    switchToSocial: "Ir para a interface social",
    switchToProfessional: "Ir para a interface profissional",
  },
  platformSpacesCard: {
    title: "Novidades para explorar",
    subtitle: "Loja, marketplace, freelances e projetos da comunidade.",
  },
};
