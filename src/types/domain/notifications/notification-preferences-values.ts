import type { NotificationPreferenceKey } from "./notification-preference-key.js";

/** Current value of every notification toggle. The app maps the API record into this shape. */
export type NotificationPreferencesValues = Record<NotificationPreferenceKey, boolean>;
