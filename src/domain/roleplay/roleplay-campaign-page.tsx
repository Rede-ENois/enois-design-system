import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayCampaignPageProps } from "../../types/domain/roleplay/roleplay-campaign-page-props.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";

import { RoleplayCampaignHeader } from "./roleplay-campaign-header.js";
import { RoleplayChatPanel } from "./roleplay-chat-panel.js";
import { RoleplayDicePanel } from "./roleplay-dice-panel.js";
import { RoleplaySheetPanel } from "./roleplay-sheet-panel.js";
import { RoleplayTablesPanel } from "./roleplay-tables-panel.js";
import { RoleplayWorldPanel } from "./roleplay-world-panel.js";

/**
 * The campaign page: header plus the five member panels. Everything arrives already cut by the
 * server; the view owns only the active tab. A non-member sees the header and the member-only line.
 */
export function RoleplayCampaignPage({
  header,
  panels,
  memberOnlyMessage,
  activeTab,
  onTabChange,
}: RoleplayCampaignPageProps) {
  const messages = useMessages().roleplay;
  const [localTab, setLocalTab] = useState("table");
  const tab = activeTab ?? localTab;
  const setTab = (next: string) => (onTabChange ? onTabChange(next) : setLocalTab(next));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <RoleplayCampaignHeader {...header} />

      {panels ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full justify-start overflow-x-auto rounded-xl border border-border-soft bg-surface-1 p-1">
            <TabsTrigger value="table">{messages.tabTable}</TabsTrigger>

            <TabsTrigger value="sheet">{messages.tabSheet}</TabsTrigger>

            <TabsTrigger value="dice">{messages.tabDice}</TabsTrigger>

            <TabsTrigger value="chat">{messages.tabChat}</TabsTrigger>

            <TabsTrigger value="world">{messages.tabWorld}</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="min-w-0">
            <RoleplayTablesPanel {...panels.tables} />
          </TabsContent>

          <TabsContent value="sheet" className="min-w-0">
            <RoleplaySheetPanel {...panels.sheet} />
          </TabsContent>

          <TabsContent value="dice" className="min-w-0">
            <RoleplayDicePanel {...panels.dice} />
          </TabsContent>

          <TabsContent value="chat" className="min-w-0">
            <RoleplayChatPanel {...panels.chat} />
          </TabsContent>

          <TabsContent value="world" className="min-w-0">
            <RoleplayWorldPanel {...panels.world} />
          </TabsContent>
        </Tabs>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-soft p-8 text-center text-sm text-text-subtle">
          {memberOnlyMessage ?? messages.memberOnly}
        </p>
      )}
    </div>
  );
}
