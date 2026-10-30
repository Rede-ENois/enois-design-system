export type MicroProjectProposalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  /** The professional identity that signs the proposal. */
  applicant: { name: string; username: string };
  pending: boolean;
  /** Sending failed, already as screen text. */
  error: string | null;
  /** Receives the trimmed message (20 to 2000 characters). */
  onSubmit: (message: string) => void;
};
