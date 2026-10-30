import type { NetworkRequest } from "./network-request.js";

export type NetworkRequestsProps = {
  requests: NetworkRequest[];
  loading: boolean;
  /** The list could not be loaded; `onRetry` asks again. */
  error?: boolean;
  onRetry?: () => void;
  onAccept: (userId: string) => void;
  onDecline: (userId: string) => void;
  onCancel: (userId: string) => void;
};
