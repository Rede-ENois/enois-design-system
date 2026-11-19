import type { Messages } from "../types/messages/messages.js";

import { accountMessages } from "./defaults/account.js";
import { appearanceMessages } from "./defaults/appearance.js";
import { authMessages } from "./defaults/auth.js";
import { avatarMessages } from "./defaults/avatar.js";
import { blogDraftsMessages } from "./defaults/blog-drafts.js";
import { blogMessages } from "./defaults/blog.js";
import { calendarMessages } from "./defaults/calendar.js";
import { colagemMessages } from "./defaults/colagem.js";
import { colecoesMessages } from "./defaults/colecoes.js";
import { communitiesMessages } from "./defaults/communities.js";
import { companiesMessages } from "./defaults/companies.js";
import { confessionarioMessages } from "./defaults/confessionario.js";
import { conversationsMessages } from "./defaults/conversations.js";
import { cosmeticsMessages } from "./defaults/cosmetics.js";
import { desabafosMessages } from "./defaults/desabafos.js";
import { desafiosMessages } from "./defaults/desafios.js";
import { developersMessages } from "./defaults/developers.js";
import { diarioMessages } from "./defaults/diario.js";
import { editorMessages } from "./defaults/editor.js";
import { emotesMessages } from "./defaults/emotes.js";
import { enquetesMessages } from "./defaults/enquetes.js";
import { eventsMessages } from "./defaults/events.js";
import { gamesMessages } from "./defaults/games.js";
import { jobsMessages } from "./defaults/jobs.js";
import { legalMessages } from "./defaults/legal.js";
import { marketplaceMessages } from "./defaults/marketplace.js";
import { moderationMessages } from "./defaults/moderation.js";
import { moderatorWorkspaceMessages } from "./defaults/moderator-workspace.js";
import { muraisMessages } from "./defaults/murais.js";
import { networkMessages } from "./defaults/network.js";
import { noticesMessages } from "./defaults/notices.js";
import { notificationsMessages } from "./defaults/notifications.js";
import { onboardingMessages } from "./defaults/onboarding.js";
import { paporetoMessages } from "./defaults/paporeto.js";
import { patternsMessages } from "./defaults/patterns.js";
import { postDestinosMessages } from "./defaults/post-destinos.js";
import { postMessages } from "./defaults/post.js";
import { profileMessages } from "./defaults/profile.js";
import { pwaMessages } from "./defaults/pwa.js";
import { releaseNotesMessages } from "./defaults/release-notes.js";
import { reportsMessages } from "./defaults/reports.js";
import { roleplayMessages } from "./defaults/roleplay.js";
import { searchMessages } from "./defaults/search.js";
import { securityMessages } from "./defaults/security.js";
import { shellMessages } from "./defaults/shell.js";
import { streakMessages } from "./defaults/streak.js";
import { studyPairProposalsMessages } from "./defaults/study-pair-proposals.js";
import { studyPairsMessages } from "./defaults/study-pairs.js";
import { supportUsMessages } from "./defaults/support-us.js";
import { supportMessages } from "./defaults/support.js";
import { termometroMessages } from "./defaults/termometro.js";
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
  ...emotesMessages,
  ...postMessages,
  ...postDestinosMessages,
  ...gamesMessages,
  ...appearanceMessages,
  ...walletMessages,
  ...securityMessages,
  ...profileMessages,
  ...developersMessages,
  ...supportMessages,
  ...conversationsMessages,
  ...marketplaceMessages,
  ...blogDraftsMessages,
  ...blogMessages,
  ...jobsMessages,
  ...moderationMessages,
  ...moderatorWorkspaceMessages,
  ...reportsMessages,
  ...cosmeticsMessages,
  ...onboardingMessages,
  ...streakMessages,
  ...eventsMessages,
  ...studyPairsMessages,
  ...studyPairProposalsMessages,
  ...networkMessages,
  ...noticesMessages,
  ...companiesMessages,
  ...whatsNewMessages,
  ...releaseNotesMessages,
  ...calendarMessages,
  ...roleplayMessages,
  ...colagemMessages,
  ...muraisMessages,
  ...colecoesMessages,
  ...enquetesMessages,
  ...diarioMessages,
  ...desabafosMessages,
  ...confessionarioMessages,
  ...termometroMessages,
  ...desafiosMessages,
  ...paporetoMessages,
};
