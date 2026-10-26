import type { ToastAction } from "./toast-action.js";
import type { ToastVariant } from "./toast-variant.js";

export type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant, action?: ToastAction) => void;
};
