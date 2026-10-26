import type { ToastAction } from "./toast-action.js";
import type { ToastVariant } from "./toast-variant.js";

export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
};
