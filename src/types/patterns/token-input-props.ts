import type { Ref } from "react";

import type { TokenInputHandle } from "./token-input-handle.js";

export type TokenInputProps = {
  values: string[];
  /** Called once per confirmation when allowMultiple is false; batches need functional updates. */
  onAdd: (token: string) => void;
  onRemove: (token: string) => void;
  label: string;
  hint?: string;
  placeholder?: string;
  max: number;
  maxLength: number;
  /** Defaults to true. Disable for consumers that accept one token per event. */
  allowMultiple?: boolean;
  suggestions?: string[];
  suggestionsLabel?: string;
  limitMessage?: string;
  /** Optional domain-specific feedback when an existing token is entered again. */
  duplicateMessage?: string;
  count?: (count: number, max: number) => string;
  removeLabel?: (token: string) => string;
  disabled?: boolean;
  id?: string;
  ref?: Ref<TokenInputHandle>;
};
