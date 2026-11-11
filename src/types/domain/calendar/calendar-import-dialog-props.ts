import type { CalendarImportResultData } from "./calendar-import-result-data.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * The `.ics` import dialog (fase 8, D23): the reader picks a file, chooses the target agenda and
 * sees what actually entered. The app owns the upload and the mutation; the dialog only reports
 * the chosen file and the scope, and draws the result the app hands back.
 */
export type CalendarImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Scope the import will land in; `null` is the consolidated agenda. */
  scope: CalendarScope | null;
  onScopeChange: (scope: CalendarScope | null) => void;
  /** The file the reader picked, or `null` before choosing. */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Runs the upload. Resolve with the counts, or `null` when it failed. */
  onImport: () => Promise<CalendarImportResultData | null>;
  /** The last upload failed; shown without dropping the chosen file. */
  error?: string | null;
  /** The server's ceiling, so the dialog can refuse a file before uploading it. */
  maxBytes?: number;
};
