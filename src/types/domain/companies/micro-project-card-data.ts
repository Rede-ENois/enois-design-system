export type MicroProjectCardData = {
  id: string;
  title: string;
  problem: string;
  scope?: string | null;
  deliverables: string[];
  acceptance: string[];
  budget?: string | null;
  /** Already formatted ("até 30 de nov."). */
  deadlineLabel?: string | null;
  /** Already formatted ("Publicado em 2 de out."). */
  publishedLabel: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  /** The viewer's own proposal, when there is one. */
  myProposal?: "SENT" | "SELECTED" | "DECLINED" | null;
  /** Proposals received; shown to the team only. */
  proposalCount?: number | null;
};
