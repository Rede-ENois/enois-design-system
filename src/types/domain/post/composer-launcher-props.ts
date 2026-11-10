export type ComposerLauncherProps = {
  /** Who signs the post: the social photo, or the professional one in that interface. */
  avatar: string | null | undefined;
  avatarFrame?: string | null;
  name: string;
  /** Opens the full composer, focused. */
  onOpen: () => void;
  /** Opens the composer straight into adding media. */
  onAddMedia?: () => void;
};
