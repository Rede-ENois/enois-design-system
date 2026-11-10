import type { ThemeName } from "./theme-name.js";

export type ThemeSwitchProps = {
  theme: ThemeName;
  onChange: (theme: ThemeName) => void;
};
