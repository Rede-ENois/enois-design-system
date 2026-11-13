export type ProfileReplyCardProps = {
  /** Comment author name. */
  authorName: string | null;
  /** Comment author avatar URL. */
  authorAvatar: string | null;
  /** Comment text content. */
  content: string;
  /** Renders the content with rich text (emotes, mentions). Falls back to plain text. */
  renderContent?: (content: string) => React.ReactNode;
  /** Name of the post author being replied to. */
  replyToAuthor: string | null;
  /** Snippet of the original post content. */
  replyToSnippet: string | null;
  /** Called when the card is clicked (navigates to the original post). */
  onClick?: () => void;
};
