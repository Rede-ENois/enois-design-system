import type { ReactNode } from "react";

/** The public facts of a company page, already formatted by the app. */
export type CompanyPageData = {
  name: string;
  logo: string | null;
  cover: string | null;
  sector: string | null;
  /** Already a label ("11 a 50 pessoas"). */
  sizeLabel: string | null;
  location: string | null;
  website: string | null;
  /** Rendered rich text (the app passes `RichText` or plain paragraphs); null when empty. */
  description: ReactNode;
};
