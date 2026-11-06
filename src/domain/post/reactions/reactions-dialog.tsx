import { useEffect, useRef, useState } from "react";

import { Smile, Users } from "lucide-react";

import { sortReactionTabsStable } from "../../../lib/reactions/summary.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { ReactionRowData } from "../../../types/domain/post/reaction-row-data.js";
import type { ReactionsDialogProps } from "../../../types/domain/post/reactions-dialog-props.js";
import type { ReactionTab } from "../../../types/lib/reactions/reaction-tab.js";
import { AppLink } from "../../../ui/app-link.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs.js";
import { UserAvatar } from "../../avatar/user-avatar.js";

/** Lista quem reagiu ao post, filtrável por tipo. */
export function ReactionsDialog<T extends string>({
  open,
  onOpenChange,
  reactions,
  summary,
  users,
  currentUserId,
  emojis,
  profileHref,
  isLoading,
  isError,
}: ReactionsDialogProps<T>) {
  const messages = useMessages().reactionsDialog;
  const [activeTab, setActiveTab] = useState("all");

  // Mesmo princípio das pílulas: abas abertas não pulam de lugar a cada clique otimista; só um
  // tipo novo (ou o primeiro load) entra reordenando pela contagem.
  const tabsRef = useRef<ReactionTab<T>[]>([]);
  const tabs = sortReactionTabsStable(tabsRef.current, summary);
  tabsRef.current = tabs;
  const tabKey = tabs.map((tab) => tab.type).join(",");

  // Se a aba ativa sumiu (a reação zerou com a remoção otimista), volta para "Todas".
  useEffect(() => {
    if (activeTab !== "all" && !tabs.some((tab) => tab.type === activeTab)) setActiveTab("all");
    // tabKey é a identidade estável de tabs
  }, [activeTab, tabKey]);

  const total = reactions.length;

  const renderList = (rows: ReactionRowData<T>[]) => {
    if (rows.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Smile className="h-6 w-6 text-text-subtle" aria-hidden />

          <p className="text-sm font-normal text-text-subtle">{messages.emptyType}</p>
        </div>
      );
    }

    return (
      <ul className="list-none divide-y divide-border-soft">
        {rows.map((r) => {
          const profile = users?.[r.userId];
          const mine = r.userId === currentUserId;

          const href = profile?.username && profileHref ? profileHref(profile.username) : null;

          const avatarEl = (
            <UserAvatar
              frame={profile?.avatarFrame}
              src={profile?.avatar ?? undefined}
              alt={profile?.name}
              className="h-8 w-8 shrink-0"
            />
          );

          const nameEl = (
            <span className="min-w-0 flex-1 truncate text-sm font-normal text-text-strong">
              {profile?.name ?? messages.loading}
              {mine && <span className="text-text-subtle"> {messages.you}</span>}
            </span>
          );

          return (
            <li key={`${r.userId}-${r.type}`} className="flex h-12 items-center gap-3 px-3">
              {href ? (
                <AppLink
                  href={href}
                  onClick={() => onOpenChange(false)}
                  className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80"
                >
                  {avatarEl}
                  {nameEl}
                </AppLink>
              ) : (
                <>
                  {avatarEl}
                  {nameEl}
                </>
              )}

              <span className="text-base leading-none">{emojis[r.type] ?? r.type}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>
        </DialogHeader>

        {isError ? (
          <p className="py-8 text-center text-sm font-normal text-text-subtle">
            {messages.loadError}
          </p>
        ) : isLoading ? (
          <p className="py-8 text-center text-sm font-normal text-text-subtle">
            {messages.loading}
          </p>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="scrollbar-hide w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">
                <Users className="h-3.5 w-3.5" aria-hidden />

                <>{messages.all}</>

                <span className="tabular-nums">{total}</span>
              </TabsTrigger>

              {tabs.map((tab) => (
                <TabsTrigger key={tab.type} value={tab.type}>
                  <span>{emojis[tab.type] ?? tab.type}</span>

                  <span className="tabular-nums">{tab.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">{renderList(reactions)}</TabsContent>

            {tabs.map((tab) => (
              <TabsContent key={tab.type} value={tab.type}>
                {renderList(reactions.filter((r) => r.type === tab.type))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
