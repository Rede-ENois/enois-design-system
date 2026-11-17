/** Who is at the table right now; presence is a server read, never a client guess. */
export type RoleplayChatPresenceView = {
  name: string;
  role: "GAME_MASTER" | "PLAYER";
};
