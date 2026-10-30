import type { StudyPairOpenRequest } from "./study-pair-open-request.js";
import type { StudyPairPopularGoal } from "./study-pair-popular-goal.js";
import type { StudyPairRequestInput } from "./study-pair-request-input.js";
import type { StudyPairSaveStatus } from "./study-pair-save-status.js";
import type { StudyPairTopicOption } from "./study-pair-topic-option.js";
import type { StudyPair } from "./study-pair.js";
import type { StudyPairsErrorCode } from "./study-pairs-error-code.js";

export type StudyPairsViewProps = {
  /** First load in flight: shows a skeleton. */
  loading?: boolean;
  /** First load failed: shows a retry notice instead of the page. */
  loadError?: boolean;
  onRetry: () => void;

  pairs: StudyPair[];
  openRequest: StudyPairOpenRequest | null;
  /** Active pair limit; at the limit the request form is replaced by a note. Default 2. */
  maxPairs?: number;

  topics?: StudyPairTopicOption[];
  /** Chips that fill the form. Hidden when empty. */
  popularGoals?: StudyPairPopularGoal[];
  onRequest: (input: StudyPairRequestInput) => void;
  requesting?: boolean;
  requestError?: StudyPairsErrorCode | null;
  /** Where to add a birth date (shown with `BIRTH_DATE_REQUIRED`). */
  birthDateHref?: string;
  /** Where to verify the e-mail (shown with `EMAIL_NOT_VERIFIED`). */
  verifyEmailHref?: string;

  onCancelRequest: () => void;
  cancelling?: boolean;

  /** Saves this week's note (create or edit). */
  onSaveCheckin: (pairId: string, note: string) => void;
  /** Per pair id; "saved" closes the editor, "error" keeps the draft. */
  checkinStatus?: Partial<Record<string, StudyPairSaveStatus>>;
  onEndPair: (pairId: string) => void;
  endingPairId?: string | null;
};
