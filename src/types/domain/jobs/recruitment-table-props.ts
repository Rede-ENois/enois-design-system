import type { RecruitmentBatchTarget } from "./recruitment-batch-target.js";
import type { RecruitmentStage } from "./recruitment-stage.js";
import type { RecruitmentStatusOption } from "./recruitment-status-option.js";
import type { RecruitmentStatus } from "./recruitment-status.js";
import type { RecruitmentTableRow } from "./recruitment-table-row.js";

export type RecruitmentTableProps = {
  rows: RecruitmentTableRow[];
  stages: RecruitmentStage[];
  statusOptions: RecruitmentStatusOption[];
  statusFilter: RecruitmentStatus | null;
  onStatusFilter: (status: RecruitmentStatus | null) => void;
  search: string;
  onSearch: (search: string) => void;
  selectedIds: string[];
  onToggleSelected: (applicationId: string) => void;
  onTogglePage: (selectAll: boolean) => void;
  onOpen: (applicationId: string) => void;
  onBatchMove: (target: RecruitmentBatchTarget) => void;
  hasMore: boolean;
  loadingMore?: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  pending?: boolean;
  error?: string | null;
  resultNote?: string | null;
};
