/** One member row of the administrative member list (community or group). */
export type AdminMemberRowData = {
  userId: string;
  /** "@" without the sign; null when the profile was already deleted. */
  username: string | null;
  name: string | null;
  avatar: string | null;
  /** Already localized role label ("Dono", "Admin", "Membro"...). */
  roleLabel: string;
  /** Already formatted join date. */
  joinedAtLabel: string;
};
