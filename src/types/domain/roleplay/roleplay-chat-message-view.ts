/** One line of the table chat; the channel is IC or OOC and pinning is the master's. */
export type RoleplayChatMessageView = {
  id: string;
  channel: "IC" | "OOC";
  content: string;
  pinned: boolean;
};
