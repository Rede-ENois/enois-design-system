/** One toggle of `GET/PUT /me/notification-preferences`. */
export type NotificationPreferenceKey =
  | "weeklyDigest"
  | "pushSocial"
  | "pushMessages"
  | "pushGroups"
  | "pushJobs"
  | "pushSystem"
  /** O aviso nem nasce: some da caixa e do push. */
  | "muteReactions"
  | "mutePostComments";
