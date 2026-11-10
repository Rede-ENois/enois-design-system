import type { ReactNode } from "react";

import type { ThemeCardLabels } from "./theme-card-labels.js";

/** Um cartão da galeria de temas: prévia, identidade e as duas ações do tema. */
export type ThemeCardProps = {
  name: string;
  description: string;
  /** Rótulo da família; `null` quando o tema não declara categoria. */
  categoryLabel: string | null;
  /** É o tema aplicado de vez. */
  active: boolean;
  /** É o tema em prévia agora (pode ser outro que não o aplicado). */
  previewing: boolean;
  labels: ThemeCardLabels;
  onPreview: () => void;
  onApply: () => void;
  preview: ReactNode;
};
