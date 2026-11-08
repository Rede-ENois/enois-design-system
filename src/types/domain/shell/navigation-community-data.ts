/** A community shortcut in the navigation (mine or favorite). */
export type NavigationCommunityData = {
  id: string;
  name: string;
  href: string;
  /** Avatar or preview image URL for the community; when absent or broken, initials are shown. */
  avatar?: string | null;
  /** The community's own color, painted on its mark; without one, its id picks a table color. */
  color?: string | null;
  /** Unread notifications from this community. */
  hasNews?: boolean;
};
