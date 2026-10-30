import type { QuestionStatus } from "./question-status.js";

export type QuestionStatusFilterProps = {
  value: QuestionStatus;
  onChange: (value: QuestionStatus) => void;
  className?: string;
};
