import type { CompanyPersonView } from "./company-person-view.js";

/** A proposal as the company team sees it. */
export type MicroProjectProposalItem = {
  id: string;
  person: CompanyPersonView;
  message: string;
  status: "SENT" | "SELECTED" | "DECLINED";
  /** Already formatted ("Enviada em 3 de out."). */
  sentLabel: string;
  /** The professional conversation with the proposer, when there is one. */
  conversationHref?: string | null;
};
