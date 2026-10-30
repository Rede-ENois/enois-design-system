import type { InterfaceContext } from "./interface-context.js";

export type ContextSwitcherProps = {
  value: InterfaceContext;
  onChange: (next: InterfaceContext) => void;
  /** Icon-only rail (collapsed sidebar): one button that swaps to the other interface. */
  collapsed?: boolean;
  /**
   * Shown under the switch while the professional identity is not active yet: the link to
   * create or activate it. Null hides it.
   */
  professionalSetupHref?: string | null;
  /** Called when the setup link is followed (closes the mobile drawer). */
  onNavigate?: () => void;
  className?: string;
};
