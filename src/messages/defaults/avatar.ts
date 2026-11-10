import type { AvatarMessages } from "../../types/messages/avatar-messages.js";

export const avatarMessages: AvatarMessages = {
  userAvatar: { fallbackAlt: "Avatar", unknownInitial: "?" },
  contributorTag: { label: "Contribuinte" },
  humanitySeal: {
    label: "Humanidade Comprovada",
    description:
      "Este perfil passou por um processo de verificação de identidade realizado por um provedor especializado.",
  },
};
