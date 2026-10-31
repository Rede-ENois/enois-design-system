import type { Messages } from "../types/messages/messages.js";

import { accountMessages } from "./defaults/account.js";
import { appearanceMessages } from "./defaults/appearance.js";
import { authMessages } from "./defaults/auth.js";
import { avatarMessages } from "./defaults/avatar.js";
import { blogMessages } from "./defaults/blog.js";
import { communitiesMessages } from "./defaults/communities.js";
import { companiesMessages } from "./defaults/companies.js";
import { conversationsMessages } from "./defaults/conversations.js";
import { cosmeticsMessages } from "./defaults/cosmetics.js";
import { developersMessages } from "./defaults/developers.js";
import { editorMessages } from "./defaults/editor.js";
import { eventsMessages } from "./defaults/events.js";
import { gamesMessages } from "./defaults/games.js";
import { jobsMessages } from "./defaults/jobs.js";
import { legalMessages } from "./defaults/legal.js";
import { marketplaceMessages } from "./defaults/marketplace.js";
import { moderationMessages } from "./defaults/moderation.js";
import { networkMessages } from "./defaults/network.js";
import { notificationsMessages } from "./defaults/notifications.js";
import { onboardingMessages } from "./defaults/onboarding.js";
import { patternsMessages } from "./defaults/patterns.js";
import { postMessages } from "./defaults/post.js";
import { profileMessages } from "./defaults/profile.js";
import { pwaMessages } from "./defaults/pwa.js";
import { releaseNotesMessages } from "./defaults/release-notes.js";
import { searchMessages } from "./defaults/search.js";
import { securityMessages } from "./defaults/security.js";
import { shellMessages } from "./defaults/shell.js";
import { streakMessages } from "./defaults/streak.js";
import { studyPairsMessages } from "./defaults/study-pairs.js";
import { supportUsMessages } from "./defaults/support-us.js";
import { supportMessages } from "./defaults/support.js";
import { uiMessages } from "./defaults/ui.js";
import { walletMessages } from "./defaults/wallet.js";
import { wellbeingMessages } from "./defaults/wellbeing.js";
import { whatsNewMessages } from "./defaults/whats-new.js";

export const defaultMessages: Messages = {
  ...uiMessages,
  ...avatarMessages,
  ...communitiesMessages,
  ...patternsMessages,
  ...shellMessages,
  ...authMessages,
  ...legalMessages,
  ...accountMessages,
  ...notificationsMessages,
  ...searchMessages,
  ...supportUsMessages,
  ...pwaMessages,
  ...wellbeingMessages,
  ...editorMessages,
  ...postMessages,
  ...gamesMessages,
  ...appearanceMessages,
  ...walletMessages,
  ...securityMessages,
  ...profileMessages,
  ...developersMessages,
  ...supportMessages,
  ...conversationsMessages,
  ...marketplaceMessages,
  ...blogMessages,
  ...jobsMessages,
  ...moderationMessages,
  ...cosmeticsMessages,
  ...onboardingMessages,
  ...streakMessages,
  ...eventsMessages,
  ...studyPairsMessages,
  ...networkMessages,
  ...companiesMessages,
  ...whatsNewMessages,
  ...releaseNotesMessages,
};
