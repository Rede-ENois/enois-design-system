import type { RecruitmentStatus } from "./recruitment-status.js";

/** One filter choice: the status code and the label the app shows for it. */
export type RecruitmentStatusOption = {
  value: RecruitmentStatus;
  label: string;
};
