import { useMessages } from "../../messages/messages-context.js";

/** The rules-system family in one word; unknown families show as themselves. */
export function RoleplaySystemFamilyLabel({ family }: { family: string }) {
  const messages = useMessages().roleplay;
  return <>{messages.systemFamilies[family] ?? family}</>;
}
