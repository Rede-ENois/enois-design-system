export type ProfileCityPrivacyProps = {
  /** `showCity` from the profile: off by default, the city stays private. */
  value: boolean;
  onChange: (value: boolean) => void;
  /** Save in flight: the switch stays put and reads as busy. */
  pending?: boolean;
};
