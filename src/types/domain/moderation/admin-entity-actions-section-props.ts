export type AdminEntityActionsSectionProps = {
  /** "community" or "group": the wording of the confirmation changes, the flow does not. */
  kind: "community" | "group";
  entityName: string;
  /** Why the administrators can see this block, shown as the description. */
  description: string;
  deleting?: boolean;
  closing?: boolean;
  /**
   * Deletes the entity with the trimmed reason; resolves `true` on success (the container redirects).
   * The confirmation closes either way.
   */
  onDelete: (reason: string) => Promise<boolean>;
  /** Optional "close without deleting" action (groups only); hidden when absent. */
  onClose?: (reason: string) => Promise<boolean>;
  error?: string | null;
};
