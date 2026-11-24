import type { TalentBankEditorValues } from "./talent-bank-editor-values.js";

export type TalentBankEditorProps = {
  values: TalentBankEditorValues;
  onChange: (values: TalentBankEditorValues) => void;
  discoverable: boolean;
  onDiscoverableChange: (value: boolean) => void;
  onSave: () => void;
  createdAt: string | null;
  pending?: boolean;
  error?: string | null;
};
