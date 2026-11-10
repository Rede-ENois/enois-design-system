export type ProfileEditMenuProps = {
  onEditInfo: () => void;
  onEditPhoto: () => void;
  onEditCover: () => void;
  onEditStatus: () => void;
  onEditResume: () => void;
  onEditBioHtml: () => void;
  /** Interface colors on this device. */
  onEditAppearance: () => void;
  /** The theme visitors see on the profile. */
  onEditLook: () => void;
  /** Avatar or cover upload in progress: their entries say so and wait. */
  photoBusy?: boolean;
  coverBusy?: boolean;
  /**
   * Where the professional profile lives: `setup` when it still has to be turned on. Absent when
   * the person cannot have one, and the entry is left out.
   */
  professional?: { href: string; setup: boolean } | null;
};
