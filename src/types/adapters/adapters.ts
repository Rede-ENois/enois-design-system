import type { ComponentType } from "react";

import type { LinkProps } from "./link-props.js";

/**
 * App services the components need but must not implement: routing and media hosting. The app
 * plugs its own through `EnoisProvider`; the defaults keep components usable in tests and stories.
 */
export type Adapters = {
  /** Renders in-app navigation (e.g. the router's Link). Default: a plain `<a>`. */
  Link: ComponentType<LinkProps>;
  /** Turns a stored media path into a URL the browser can load. Default: returns it unchanged. */
  resolveMediaUrl: (url: string | null | undefined) => string | undefined;
  /**
   * Same as `resolveMediaUrl`, but for video and audio: the URL of the original file, without CDN
   * transformations. Default: returns it unchanged.
   */
  resolveMediaOriginalUrl: (url: string | null | undefined) => string | undefined;
  /**
   * Whether a URL points at the app's own media (relative path, app host or the app CDN). Rich text
   * only renders own images inline; third-party images become links. Default: relative paths and
   * the current host.
   */
  isOwnMediaUrl: (url: string) => boolean;
  /**
   * Whether a link points at a page of the app: returns the internal path when it does, `null`
   * when it does not. Rich text renders internal links through the router (`AppLink`, same tab)
   * and external links as plain anchors (`target="_blank"`). Default: relative paths and URLs on
   * the current host.
   */
  appPathOf: (url: string) => string | null;
};
