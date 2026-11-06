/** "Conta e segurança" page: every account, privacy and preference item the account menu left out. */
export type AccountSettingsProps = {
  hrefs: {
    security: string;
    blockedUsers: string;
    myReports: string;
    sanctions: string;
    /** Parental supervision; the row only shows when it is set. */
    guardian?: string;
    /** Muted people; the row only shows when it is set. */
    mutedUsers?: string;
    /** Notification preferences page; the row only shows when it is set. */
    notificationPreferences?: string;
    /** Feed preferences page; the row only shows when it is set. */
    feedPreferences?: string;
    /** Support the project; the row only shows when it is set. */
    supportUs?: string;
  };
  onChangeEmail: () => void;
  onChangePassword: () => void;
  onOpenLinkedAccounts: () => void;
  onDeleteAccount: () => void;
  /** "Uso saudável" dialog; the row only shows when it is set. */
  onOpenHealthyUsage?: () => void;
};
