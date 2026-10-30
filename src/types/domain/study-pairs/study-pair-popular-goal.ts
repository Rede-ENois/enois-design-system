export type StudyPairPopularGoal = {
  goalKey: string;
  goal: string;
  /** Topic value (one of the `topics` options) the chip also selects. */
  topic: string | null;
  openRequests: number;
};
