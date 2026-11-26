export type RecruiterModeSwitchProps = {
  /** `isRecruiter` from `/me`: the declaration lives on the account, not on the profile view. */
  value: boolean;
  onChange: (value: boolean) => void;
  /** Save in flight: the switch stays put and reads as busy. */
  pending?: boolean;
};
