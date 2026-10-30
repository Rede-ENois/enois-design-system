import type { StudyPairPartner } from "./study-pair-partner.js";
import type { StudyPairWeek } from "./study-pair-week.js";

export type StudyPair = {
  id: string;
  goal: string;
  topicLabel?: string | null;
  /** Formatted start date, e.g. "2 de outubro". */
  sinceLabel: string;
  partner: StudyPairPartner;
  /** This week's own note: `null` before checking in, `""` for a check-in without words. */
  myCheckin: string | null;
  /** This week's partner note, same convention as `myCheckin`. */
  partnerCheckin: string | null;
  /** Previous weeks, newest first (the API returns the 3 before the current one). */
  history: StudyPairWeek[];
};
