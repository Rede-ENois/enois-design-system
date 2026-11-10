import type { ProfileLook } from "./profile-look.js";

/** As duas vitrines de uma pessoa — social e profissional são independentes. */
export type ProfileLookPair = {
  social: ProfileLook;
  professional: ProfileLook;
};
