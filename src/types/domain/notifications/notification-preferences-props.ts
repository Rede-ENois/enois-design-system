import type { NotificationPreferenceKey } from "./notification-preference-key.js";
import type { NotificationPreferencesSaveStatus } from "./notification-preferences-save-status.js";
import type { NotificationPreferencesValues } from "./notification-preferences-values.js";

export type NotificationPreferencesProps = {
  /** Null while the first load has not finished (or failed). */
  values: NotificationPreferencesValues | null;
  loading?: boolean;
  /** First load failed: shows the retry notice instead of the toggles. */
  loadError?: boolean;
  onRetry: () => void;
  /** Called with the new value; the app updates `values` optimistically and saves. */
  onChange: (key: NotificationPreferenceKey, value: boolean) => void;
  /** Keys whose save is in flight: their switch shows a saving indicator and is locked. */
  pending?: Partial<Record<NotificationPreferenceKey, boolean>>;
  saveStatus?: NotificationPreferencesSaveStatus;
  /** Push subscription state on this device. Off: the category switches stay usable, with a note. */
  pushEnabled: boolean;
  /** Turns push on for this device. Without it, the note shows no button. */
  onEnablePush?: () => void;
  pushBusy?: boolean;
};
