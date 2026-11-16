/**
 * Visual identity a published notice can declare. Each entry carries the raw computed value of the
 * matching `--notice-*` custom property on the frame document (the integration contract with the
 * published HTML); absent entries fall back to the platform identity.
 */
export type NoticeTheme = {
  primary?: string;
  background?: string;
  surface?: string;
  text?: string;
  muted?: string;
  border?: string;
  buttonText?: string;
};
