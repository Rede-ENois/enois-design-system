import type { AuthorNameStyle } from "../name/author-name-style.js";

/** What a notification row shows. The app maps its notification records into this shape. */
export type NotificationData = {
  id: string;
  kind: string;
  actorId: string | null;
  actorName: string | null;
  /** Personalização do nome de quem agiu (tema/fonte/cor). */
  actorStyle?: AuthorNameStyle | null;
  actorAvatar: string | null;
  /** Actor profile page; null when the actor has no username. */
  actorHref: string | null;
  title: string;
  body: string;
  /**
   * Short excerpt of the post the notification is about, already trimmed by the app. Shown under
   * `body`; absent or empty means the row looks exactly as before.
   */
  preview?: string | null;
  /**
   * The place it came from when it is not a person (a community or group): drawn as that place's
   * colored table instead of an avatar.
   */
  place?: { id?: string; name: string; avatar?: string | null; color?: string | null } | null;
  /** Day of the month of the event it is about ("03"): drawn as a ticket. */
  eventDay?: string | null;
  /** Day group the row is listed under on the full page ("Hoje", "Ontem", "12 de out."). */
  dayLabel?: string;
  /** Already formatted relative time ("há 2 horas"). */
  timeLabel: string;
  read: boolean;
  /** Destination handed back to `onOpen` when the row is clicked. */
  href: string;
  ctaLabel: string;
};
