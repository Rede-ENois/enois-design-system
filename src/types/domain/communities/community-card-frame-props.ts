import type { SandboxedHtmlFrameProps } from "../../patterns/sandboxed-html-frame-props.js";

/** O quadro isolado da capa em HTML do card, sem o tema: quem desenha é o app (tema e modo lite). */
export type CommunityCardFrameProps = Omit<
  SandboxedHtmlFrameProps,
  "theme" | "themeStyleElementId" | "lite"
>;
