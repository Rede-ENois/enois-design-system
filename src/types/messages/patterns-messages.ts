import type { CityStateErrorCode } from "../patterns/city-state-error-code.js";

export type PatternsMessages = {
  appSidebar: { expandMenu: string; collapseMenu: string };
  navigationDrawer: { title: string };
  themeToggle: { light: string; dark: string };
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
