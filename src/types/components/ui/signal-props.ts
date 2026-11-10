import type { SignalData } from "./signal-data.js";

export type SignalProps = {
  signal: SignalData;
  /** Draws a ring in the surface color so the signal reads on top of an icon. */
  onIcon?: boolean;
  className?: string;
};
