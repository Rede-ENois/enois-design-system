import type { AccountMessages } from "./account-messages.js";
import type { AppearanceMessages } from "./appearance-messages.js";
import type { AuthMessages } from "./auth-messages.js";
import type { AvatarMessages } from "./avatar-messages.js";
import type { BlogDraftsMessages } from "./blog-drafts-messages.js";
import type { BlogMessages } from "./blog-messages.js";
import type { CalendarMessages } from "./calendar-messages.js";
import type { ColagemMessages } from "./colagem-messages.js";
import type { ColecoesMessages } from "./colecoes-messages.js";
import type { CommunitiesMessages } from "./communities-messages.js";
import type { CompaniesMessages } from "./companies-messages.js";
import type { ConfessionarioMessages } from "./confessionario-messages.js";
import type { ConversationsMessages } from "./conversations-messages.js";
import type { CosmeticsMessages } from "./cosmetics-messages.js";
import type { DesabafosMessages } from "./desabafos-messages.js";
import type { DesafiosMessages } from "./desafios-messages.js";
import type { DevelopersMessages } from "./developers-messages.js";
import type { DiarioMessages } from "./diario-messages.js";
import type { DoacoesMessages } from "./doacoes-messages.js";
import type { EditorMessages } from "./editor-messages.js";
import type { EmotesMessages } from "./emotes-messages.js";
import type { EnquetesMessages } from "./enquetes-messages.js";
import type { EventsMessages } from "./events-messages.js";
import type { GamesMessages } from "./games-messages.js";
import type { GroupAdminMessages } from "./group-admin-messages.js";
import type { JobsMessages } from "./jobs-messages.js";
import type { LegalMessages } from "./legal-messages.js";
import type { MarketplaceMessages } from "./marketplace-messages.js";
import type { ModerationMessages } from "./moderation-messages.js";
import type { ModeratorWorkspaceMessages } from "./moderator-workspace-messages.js";
import type { MuraisMessages } from "./murais-messages.js";
import type { NetworkMessages } from "./network-messages.js";
import type { NoticesMessages } from "./notices-messages.js";
import type { NotificationsMessages } from "./notifications-messages.js";
import type { OnboardingMessages } from "./onboarding-messages.js";
import type { PaporetoMessages } from "./paporeto-messages.js";
import type { PatternsMessages } from "./patterns-messages.js";
import type { PostDestinosMessages } from "./post-destinos-messages.js";
import type { PostMessages } from "./post-messages.js";
import type { ProfileMessages } from "./profile-messages.js";
import type { PwaMessages } from "./pwa-messages.js";
import type { ReleaseNotesMessages } from "./release-notes-messages.js";
import type { ReportsMessages } from "./reports-messages.js";
import type { RoleplayMessages } from "./roleplay-messages.js";
import type { SearchMessages } from "./search-messages.js";
import type { SecurityMessages } from "./security-messages.js";
import type { ShellMessages } from "./shell-messages.js";
import type { StreakMessages } from "./streak-messages.js";
import type { StudyPairProposalsMessages } from "./study-pair-proposals-messages.js";
import type { StudyPairsMessages } from "./study-pairs-messages.js";
import type { SupportMessages } from "./support-messages.js";
import type { SupportUsMessages } from "./support-us-messages.js";
import type { TermometroMessages } from "./termometro-messages.js";
import type { UiMessages } from "./ui-messages.js";
import type { WalletMessages } from "./wallet-messages.js";
import type { WellbeingMessages } from "./wellbeing-messages.js";
import type { WhatsNewMessages } from "./whats-new-messages.js";

/**
 * Fixed microcopy owned by the design system components (accessible labels, headings, empty
 * states, counters), keyed by component. Content and product copy never live here: they come
 * from the app through props. Each feature adds its own `<Feature>Messages` type to this union.
 */
export type Messages = UiMessages &
  AvatarMessages &
  DoacoesMessages &
  CommunitiesMessages &
  PatternsMessages &
  ShellMessages &
  AuthMessages &
  LegalMessages &
  AccountMessages &
  NotificationsMessages &
  NetworkMessages &
  NoticesMessages &
  SearchMessages &
  SupportUsMessages &
  PwaMessages &
  WellbeingMessages &
  EditorMessages &
  EmotesMessages &
  EmotesMessages &
  PostMessages &
  PostDestinosMessages &
  GamesMessages &
  AppearanceMessages &
  WalletMessages &
  SecurityMessages &
  ProfileMessages &
  JobsMessages &
  BlogDraftsMessages &
  BlogMessages &
  MarketplaceMessages &
  ConversationsMessages &
  GroupAdminMessages &
  SupportMessages &
  DevelopersMessages &
  ModerationMessages &
  ModeratorWorkspaceMessages &
  CosmeticsMessages &
  OnboardingMessages &
  StreakMessages &
  EventsMessages &
  StudyPairsMessages &
  StudyPairProposalsMessages &
  CompaniesMessages &
  WhatsNewMessages &
  ReleaseNotesMessages &
  ReportsMessages &
  CalendarMessages &
  RoleplayMessages &
  ColagemMessages &
  MuraisMessages &
  ColecoesMessages &
  EnquetesMessages &
  DiarioMessages &
  DesabafosMessages &
  ConfessionarioMessages &
  TermometroMessages &
  DesafiosMessages &
  PaporetoMessages;
