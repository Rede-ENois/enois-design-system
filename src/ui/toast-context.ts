import * as React from "react";

import type { ToastContextValue } from "../types/components/ui/toast-context-value.js";

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  // Sem provider (ex.: teste isolado) devolve um no-op em vez de quebrar a tela.
  return context ?? { toast: () => {} };
}
