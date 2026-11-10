import type { CityStateErrorCode } from "../patterns/city-state-error-code.js";

export type PatternsMessages = {
  tokenInput: {
    hint: string;
    full: string;
    count: (count: number, max: number) => string;
    remove: (token: string) => string;
    suggestions: string;
    tooLong: (maxLength: number) => string;
    tooMany: (max: number) => string;
    singleItem: string;
  };
  appSidebar: { expandMenu: string; collapseMenu: string };
  navigationDrawer: { title: string };
  mobileDock: { label: string };
  themeToggle: { light: string; dark: string };
  themeSwitch: { label: string; light: string; dark: string };
  errorBanner: {
    show: string;
    hide: string;
    copied: string;
    copy: string;
    error: (message: string) => string;
    suggestion: (hint: string) => string;
  };
  cityStateField: {
    legend: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    hint: string;
    errors: Record<CityStateErrorCode, string>;
  };
  moduleDisabledView: { title: string; body: string; reenable: string; backToFeed: string };
};
