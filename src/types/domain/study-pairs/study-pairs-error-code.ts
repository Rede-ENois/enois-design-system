/** Backend error codes the request form explains; anything else maps to `UNKNOWN`. */
export type StudyPairsErrorCode =
  | "STUDY_GOAL_REQUIRED"
  | "STUDY_GOAL_TOO_LONG"
  | "INVALID_TOPIC"
  | "STUDY_PAIRS_ADULTS_ONLY"
  | "BIRTH_DATE_REQUIRED"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_RESTRICTED"
  | "STUDY_REQUEST_ALREADY_OPEN"
  | "STUDY_PAIR_LIMIT"
  | "UNKNOWN";
