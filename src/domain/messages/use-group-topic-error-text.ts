import { useMessages } from "../../messages/messages-context.js";
import type { GroupTopicError } from "../../types/domain/messages/group-topic-error.js";

/** Erro do servidor traduzido; código desconhecido cai no genérico. */
export function useGroupTopicErrorText(): (code: GroupTopicError) => string {
  const messages = useMessages().groupTopics;
  return (code) => {
    switch (code) {
      case "ALREADY_EXISTS":
        return messages.errors.nameTaken;
      case "INVALID_NAME":
        return messages.errors.invalidName;
      case "TOO_MANY":
        return messages.errors.tooManyTopics;
      case "FORBIDDEN":
        return messages.errors.notManager;
    }
  };
}
