import type { OnboardingCommunityItem } from "./onboarding-community-item.js";
import type { OnboardingGroupItem } from "./onboarding-group-item.js";
import type { OnboardingPersonItem } from "./onboarding-person-item.js";
import type { OnboardingStep } from "./onboarding-step.js";
import type { OnboardingTopicOption } from "./onboarding-topic-option.js";

/**
 * Controlled onboarding flow. The app owns every value and calls the API; the view only draws
 * and reports intent. Caps mirror the backend (`POST /me/onboarding/complete`): an item past its
 * cap cannot be selected, so the request never needs trimming.
 */
export type OnboardingViewProps = {
  step: OnboardingStep;
  onStepChange: (step: OnboardingStep) => void;

  topics: OnboardingTopicOption[];
  selectedTopics: string[];
  onToggleTopic: (value: string) => void;

  skills: string[];
  /** Suggestions shown under the skill field; the ones already added are hidden. */
  skillSuggestions: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  /** Defaults to 20. */
  maxSkills?: number;
  /** Defaults to 60. */
  maxSkillLength?: number;

  packLoading: boolean;
  /** True when the starter pack request failed. */
  packError: boolean;
  onRetryPack: () => void;
  communities: OnboardingCommunityItem[];
  groups: OnboardingGroupItem[];
  people: OnboardingPersonItem[];
  selectedCommunityIds: string[];
  selectedGroupIds: string[];
  selectedPersonIds: string[];
  onToggleCommunity: (id: string) => void;
  onToggleGroup: (id: string) => void;
  onTogglePerson: (id: string) => void;
  /** Defaults to 6. */
  maxCommunities?: number;
  /** Defaults to 6. */
  maxGroups?: number;
  /** Defaults to 8. */
  maxPeople?: number;

  /** Complete or skip in flight: every action is disabled. */
  submitting: boolean;
  /** Failure of the last complete/skip attempt, already worded for people. */
  errorMessage?: string | null;
  onComplete: () => void;
  onSkip: () => void;
};
