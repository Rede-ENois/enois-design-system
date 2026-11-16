import type { RecruitmentMoveKind } from "./recruitment-move-kind.js";

/** Where a batch goes. `stageId = null` only makes sense with `REJECT`. */
export type RecruitmentBatchTarget = {
  stageId: string | null;
  kind: RecruitmentMoveKind;
};
