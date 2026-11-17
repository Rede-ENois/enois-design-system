import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ThemeName } from "../../types/patterns/theme-name.js";

import { NoticeModal } from "./notice-modal.js";

const meta: Meta = {
  title: "Domain/Notices",
};

export default meta;

// A story espelha o contrato real: quem publica pinta o próprio conteúdo com as variáveis
// declaradas — o modal nunca impõe paleta nem padding no HTML publicado.
const DARK_NOTICE = [
  "<style>",
  ":root {",
  "  --notice-primary: #7c5cff;",
  "  --notice-background: #111015;",
  "  --notice-surface: #1a1726;",
  "  --notice-text: #e8e6ff;",
  "  --notice-muted: #b3b0c9;",
  "  --notice-border: #3f3d55;",
  "  --notice-button-text: #f4f2ff;",
  "}",
  "body { margin: 0; padding: 16px 20px; font-family: sans-serif; background: var(--notice-background); color: var(--notice-text); }",
  "h1 { margin: 0 0 8px; font-size: 18px; }",
  "p { margin: 0 0 12px; line-height: 1.6; }",
  "</style>",
  "<h1>Manutenção na rede</h1>",
  '<p style="margin:0">Na madrugada de sexta o chat entra em pausa por 40 minutos. Nada se perde: as mensagens cifradas ficam guardadas e voltam intactas.</p>',
].join("\n");

const LIGHT_NOTICE = [
  "<style>",
  ":root {",
  "  --notice-primary: #0f766e;",
  "  --notice-background: #f8fafc;",
  "  --notice-surface: #ffffff;",
  "  --notice-text: #0f172a;",
  "  --notice-muted: #64748b;",
  "  --notice-border: #e2e8f0;",
  "}",
  "body { margin: 0; padding: 16px 20px; font-family: sans-serif; background: var(--notice-background); color: var(--notice-text); }",
  "h1 { margin: 0 0 8px; font-size: 18px; }",
  "p { margin: 0 0 12px; line-height: 1.6; }",
  "</style>",
  "<h1>Mutirão de moderação</h1>",
  "<p>Este sábado tem mutirão para revisar denúncias antigas. Quem ajudar recebe um selo especial no perfil.</p>",
].join("\n");

const PLAIN_NOTICE =
  '<div style="padding:16px 20px"><h1 style="margin:0 0 8px;font-size:18px">Sem tema declarado</h1><p style="margin:0;line-height:1.6">Este aviso não declara identidade visual: o modal inteiro acompanha a identidade padrão do Énóis, em claro e em escuro.</p></div>';

const LONG_NOTICE = [
  "<style>",
  ":root { --notice-background: #111015; --notice-text: #e8e6ff; --notice-muted: #b3b0c9; }",
  "body { margin: 0; padding: 16px 20px; font-family: sans-serif; background: var(--notice-background); color: var(--notice-text); }",
  "p { line-height: 1.6; }",
  "</style>",
  "<h1>Relatório da comunidade</h1>",
  ...Array.from(
    { length: 24 },
    (_, i) =>
      `<p>Parágrafo ${i + 1}: acompanhamento mensal das metas, com os destaques de cada célula e o que muda no mês seguinte.</p>`,
  ),
].join("\n");

function NoticeStory({
  html,
  theme = "light",
  onConfirm,
}: {
  html: string;
  theme?: ThemeName;
  onConfirm?: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <NoticeModal
      open={open}
      onOpenChange={setOpen}
      title="Manutenção na rede"
      html={html}
      theme={theme}
      publishedAtLabel="publicado em 15/11/2026"
      onConfirm={onConfirm}
    />
  );
}

export const DarkPublishedNotice: StoryObj = {
  render: () => <NoticeStory html={DARK_NOTICE} />,
};

export const LightPublishedNotice: StoryObj = {
  render: () => <NoticeStory html={LIGHT_NOTICE} />,
};

export const NoDeclaredTheme: StoryObj = {
  render: () => <NoticeStory html={PLAIN_NOTICE} />,
};

export const NoDeclaredThemeOnDarkApp: StoryObj = {
  // The story fixes the storybook theme global so it reads as a self-contained dark app, toolbar
  // independent; the preview decorator mirrors it as `.dark` on <html>.
  globals: { theme: "dark" },
  render: () => <NoticeStory html={PLAIN_NOTICE} theme="dark" />,
};

export const LongContentScrolls: StoryObj = {
  render: () => <NoticeStory html={LONG_NOTICE} />,
};
