import type { AccountMessages } from "./account-messages.js";
import type { AppearanceMessages } from "./appearance-messages.js";
import type { AuthMessages } from "./auth-messages.js";
import type { AvatarMessages } from "./avatar-messages.js";
import type { BlogMessages } from "./blog-messages.js";
import type { CommunitiesMessages } from "./communities-messages.js";
import type { ConversationsMessages } from "./conversations-messages.js";
import type { CosmeticsMessages } from "./cosmetics-messages.js";
import type { DevelopersMessages } from "./developers-messages.js";
import type { EditorMessages } from "./editor-messages.js";
import type { EventsMessages } from "./events-messages.js";
import type { GamesMessages } from "./games-messages.js";
import type { JobsMessages } from "./jobs-messages.js";
import type { LegalMessages } from "./legal-messages.js";
import type { MarketplaceMessages } from "./marketplace-messages.js";
import type { ModerationMessages } from "./moderation-messages.js";
import type { NotificationsMessages } from "./notifications-messages.js";
import type { OnboardingMessages } from "./onboarding-messages.js";
import type { PatternsMessages } from "./patterns-messages.js";
import type { PostMessages } from "./post-messages.js";
import type { ProfileMessages } from "./profile-messages.js";
import type { PwaMessages } from "./pwa-messages.js";
import type { SearchMessages } from "./search-messages.js";
import type { SecurityMessages } from "./security-messages.js";
import type { ShellMessages } from "./shell-messages.js";
import type { StreakMessages } from "./streak-messages.js";
import type { SupportMessages } from "./support-messages.js";
import type { SupportUsMessages } from "./support-us-messages.js";
import type { UiMessages } from "./ui-messages.js";
import type { WalletMessages } from "./wallet-messages.js";
import type { WellbeingMessages } from "./wellbeing-messages.js";

/**
 * Fixed microcopy owned by the design system components (accessible labels, headings, empty
 * states, counters), keyed by component. Content and product copy never live here: they come
 * from the app through props. Each feature adds its own `<Feature>Messages` type to this union.
 */
export type Messages = UiMessages &
  AvatarMessages &
  CommunitiesMessages &
  PatternsMessages &
  ShellMessages &
  AuthMessages &
  LegalMessages &
  AccountMessages &
  NotificationsMessages &
  SearchMessages &
  SupportUsMessages &
  PwaMessages &
  WellbeingMessages &
  EditorMessages &
  PostMessages &
  GamesMessages &
  AppearanceMessages &
  WalletMessages &
  SecurityMessages &
  ProfileMessages &
  JobsMessages &
  BlogMessages &
  MarketplaceMessages &
  ConversationsMessages &
  SupportMessages &
  DevelopersMessages &
  ModerationMessages &
  CosmeticsMessages &
  OnboardingMessages &
  StreakMessages &
  EventsMessages;
