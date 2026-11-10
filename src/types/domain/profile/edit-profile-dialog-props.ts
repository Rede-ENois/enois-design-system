import type { ReactNode } from "react";

import type { BadgeKit } from "../badges/badge-kit.js";

import type { EditProfileData } from "./edit-profile-data.js";
import type { EditProfileListItem } from "./edit-profile-list-item.js";
import type { EditProfileListKind } from "./edit-profile-list-kind.js";
import type { EditProfileSaveError } from "./edit-profile-save-error.js";
import type { EditProfileTab } from "./edit-profile-tab.js";
import type { EditProfileValues } from "./edit-profile-values.js";

export type EditProfileDialogProps = {
  profile: EditProfileData;
  /** The dialog trigger. Without one, the app opens it through `open` (e.g. from `ProfileEditMenu`). */
  children?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: EditProfileTab;
  onTabChange: (tab: EditProfileTab) => void;
  savePending?: boolean;
  /** Valida e grava as informações; resolve com o erro a mostrar, ou `null` quando salvou. */
  onSave: (values: EditProfileValues) => Promise<EditProfileSaveError | null>;
  /** Uploads the badge image and returns its saved address; rejects with an Error whose message is shown to the person. */
  onUploadBadge: (file: File) => Promise<string>;
  /** The saved badge sets of this profile, most recent first (the history tab). */
  badgeKits: BadgeKit[];
  /** The kit history still loading. */
  kitsLoading?: boolean;
  experiences: EditProfileListItem[];
  education: EditProfileListItem[];
  certifications: EditProfileListItem[];
  /** Criação/edição em andamento em cada lista. */
  listPending: Record<EditProfileListKind, boolean>;
  onCreateItem: (kind: EditProfileListKind, data: Record<string, unknown>) => Promise<unknown>;
  onUpdateItem: (
    kind: EditProfileListKind,
    id: string,
    data: Record<string, unknown>,
  ) => Promise<unknown>;
  onDeleteItem: (kind: EditProfileListKind, id: string) => void;
};
