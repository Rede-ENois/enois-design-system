import type { AdminMemberRowData } from "./admin-member-row-data.js";

export type AdminMembersSectionProps = {
  /** Name of the community or group the members belong to. */
  entityName: string;
  items: AdminMemberRowData[];
  /** Total members BEFORE the search, so the header can say "12 de 340". */
  total: number;
  page: number;
  pages: number;
  loading?: boolean;
  error?: boolean;
  /** Current query, echoed back so the input stays controlled by the container. */
  query: string;
  onQuery: (query: string) => void;
  onPage: (page: number) => void;
  /** Removes a member (destructive); resolves `true` on success. Only shown when provided. */
  onRemove?: (userId: string, reason: string) => Promise<boolean>;
  pending?: boolean;
  /** Hides the list again; omitted means the list stays open. */
  onClose?: () => void;
};
