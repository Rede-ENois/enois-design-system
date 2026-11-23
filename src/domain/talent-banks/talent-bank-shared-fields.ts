import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankSharedFieldOption } from "../../types/domain/talent-banks/talent-bank-shared-field-option.js";

/** The information a bank may ask for, in the order it is shown to the person. */
const SHARED_FIELD_KEYS = [
  "PROFILE",
  "SKILLS",
  "EXPERIENCES",
  "EDUCATION",
  "CERTIFICATIONS",
  "RESUME",
] as const;

/**
 * The catalog of what a bank can ask for, with the wording shown before the consent.
 *
 * <p>The keys are the ones the API uses; the labels and descriptions are fixed microcopy, so they
 * come from the messages and not from the app.</p>
 */
export function useTalentBankSharedFields(): TalentBankSharedFieldOption[] {
  const messages = useMessages().talentBank.fields;

  return SHARED_FIELD_KEYS.map((key) => ({
    key,
    label: messages[key].label,
    description: messages[key].description,
  }));
}

/** The catalog entries whose key is in the given list, in the catalog order. */
export function sharedFieldsOf(
  options: TalentBankSharedFieldOption[],
  keys: string[],
): TalentBankSharedFieldOption[] {
  const wanted = new Set(keys);

  return options.filter((option) => wanted.has(option.key));
}
