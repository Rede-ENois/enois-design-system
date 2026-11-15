/** Someone else's sheet as the server cut it: only what the owner opened to the viewer. */
import type { RoleplaySheetDerived } from "./roleplay-sheet-derived.js";

export type RoleplaySheetCard = {
  id: string;
  name: string;
  fields: RoleplaySheetDerived[];
  published: boolean;
};
