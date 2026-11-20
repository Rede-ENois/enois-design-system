import { useMemo } from "react";

import { AdaptersContext, defaultAdapters } from "../adapters/adapters-context.js";
import { SpoilerPreferenceContext } from "../media/spoiler-preference.js";
import type { EnoisProviderProps } from "../types/messages/enois-provider-props.js";

import { mergeMessages } from "./merge-messages.js";
import { MessagesContext } from "./messages-context.js";

export function EnoisProvider({
  messages,
  Link,
  resolveMediaUrl,
  resolveMediaOriginalUrl,
  isOwnMediaUrl,
  appPathOf,
  revealSensitiveMedia = false,
  children,
}: EnoisProviderProps) {
  const messagesValue = useMemo(() => mergeMessages(messages), [messages]);
  const adaptersValue = useMemo(
    () => ({
      Link: Link ?? defaultAdapters.Link,
      resolveMediaUrl: resolveMediaUrl ?? defaultAdapters.resolveMediaUrl,
      resolveMediaOriginalUrl: resolveMediaOriginalUrl ?? defaultAdapters.resolveMediaOriginalUrl,
      isOwnMediaUrl: isOwnMediaUrl ?? defaultAdapters.isOwnMediaUrl,
      appPathOf: appPathOf ?? defaultAdapters.appPathOf,
    }),
    [Link, resolveMediaUrl, resolveMediaOriginalUrl, isOwnMediaUrl, appPathOf],
  );

  return (
    <AdaptersContext.Provider value={adaptersValue}>
      <MessagesContext.Provider value={messagesValue}>
        <SpoilerPreferenceContext value={revealSensitiveMedia}>{children}</SpoilerPreferenceContext>
      </MessagesContext.Provider>
    </AdaptersContext.Provider>
  );
}
