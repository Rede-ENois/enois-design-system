/**
 * Where the reader stands in an entry. `null` is the organizer; `INVITED` is waiting for an
 * answer, and the three answered states stay visible so the reader can change their mind.
 */
export type CalendarParticipation = "INVITED" | "ACCEPTED" | "DECLINED" | "TENTATIVE";
