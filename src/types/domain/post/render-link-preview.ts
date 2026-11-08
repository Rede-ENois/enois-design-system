import type { ReactNode } from "react";

/**
 * Draws the card of one link from a post or comment. The app owns it because the card needs data
 * the DS cannot fetch (the page's title, description and thumbnail) and the app's own routes.
 *
 * The DS calls it only for links that are neither direct media nor a player — those show
 * themselves. Returning `null` leaves the link out, which is what the app does while the preview
 * is still loading.
 */
export type RenderLinkPreview = (url: string, options: { compact: boolean }) => ReactNode;
