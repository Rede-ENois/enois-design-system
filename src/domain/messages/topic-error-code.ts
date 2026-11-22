import type { GroupTopicError } from "../../types/domain/messages/group-topic-error.js";

/** What the server can answer about a topic; anything else is mapped to the generic error. */
const SERVER_CODES: Record<string, GroupTopicError> = {
  TOPIC_EXISTS: "ALREADY_EXISTS",
  INVALID_TOPIC_NAME: "INVALID_NAME",
  TOPIC_NOT_FOUND: "INVALID_NAME",
  TOPIC_ARCHIVED: "INVALID_NAME",
  TOO_MANY_TOPICS: "TOO_MANY",
  NOT_MANAGER: "FORBIDDEN",
  FORBIDDEN: "FORBIDDEN",
  NOT_PARTICIPANT: "FORBIDDEN",
};

/**
 * The server's error code for a topic action, translated to the view's vocabulary. A code the
 * DS does not know yet returns `null` so a future server code reads as "try again" instead of
 * making the view believe the name is wrong.
 */
export function groupTopicErrorFromServer(code: string | null | undefined): GroupTopicError | null {
  if (!code) return null;
  return SERVER_CODES[code] ?? null;
}
