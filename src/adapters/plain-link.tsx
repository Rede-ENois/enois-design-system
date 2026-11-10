import type { LinkProps } from "../types/adapters/link-props.js";

/** The default link: a plain anchor, until the app plugs its router link in. */
export function PlainLink({ href, ...props }: LinkProps) {
  return <a href={href} {...props} />;
}
