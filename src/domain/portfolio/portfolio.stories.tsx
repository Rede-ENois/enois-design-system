import type { Meta, StoryObj } from "@storybook/react-vite";

import { SandboxedHtmlFrame } from "../../patterns/html-frame/sandboxed-html-frame.js";
import type { ProfileHtmlFrameProps } from "../../types/domain/profile/profile-html-frame-props.js";

import { PortfolioEditor } from "./portfolio-editor.js";
import { PortfolioShowcase } from "./portfolio-showcase.js";

const meta: Meta = {
  title: "Domain/Portfolio",
};

export default meta;

const html = `<main style="padding:24px;font-family:system-ui">
  <h1 style="margin:0">Ana Souza</h1>
  <p style="color:#555">Desenho e construo interfaces.</p>
</main>`;

const frame = (props: ProfileHtmlFrameProps) => (
  <SandboxedHtmlFrame {...props} theme="light" innerPadding={false} />
);

export const Showcase: StoryObj = {
  render: () => (
    <PortfolioShowcase
      author={{ username: "ana", name: "Ana Souza", avatarUrl: null, avatarFrame: null }}
      profileHref="/perfil/ana"
      html={html}
      publishedAt="2026-11-25"
      renderHtmlFrame={frame}
      blocks={[
        {
          id: "b1",
          kind: "PROJECT",
          title: null,
          text: null,
          linkUrl: null,
          mediaKind: null,
          fileUrl: null,
          imageUrl: null,
          project: {
            id: "p1",
            title: "Sistema de portaria",
            description: "Controle de acesso para condomínios.",
            stack: ["Java", "Spring", "React"],
            repoUrl: "https://github.com/exemplo/portaria",
            status: null,
          },
        },
        {
          id: "b2",
          kind: "TEXT",
          title: "Estudos de caso",
          text: "Documento cada decisão de produto e o que aprendi depois.",
          linkUrl: null,
          project: null,
          mediaKind: null,
          fileUrl: null,
          imageUrl: null,
        },
        {
          id: "b3",
          kind: "PDF",
          title: "Caderno de projetos",
          text: null,
          linkUrl: null,
          project: null,
          mediaKind: "PDF",
          fileUrl: "https://cdn.example.test/caderno.pdf",
          imageUrl: null,
        },
      ]}
    />
  ),
};

export const Editor: StoryObj = {
  render: () => (
    <PortfolioEditor
      state="ready"
      html={html}
      publishedVersion={2}
      publishedAt="2026-11-20"
      blocks={[
        {
          id: "b1",
          kind: "TEXT",
          title: "Estudos de caso",
          text: "Documento cada decisão de produto.",
          projectId: null,
          mediaId: null,
          linkUrl: null,
          unpublished: true,
        },
      ]}
      outros={[
        { id: "p1", title: "Sistema de portaria", state: "available" },
        { id: "p2", title: "Agenda da equipe", state: "used" },
      ]}
      error={null}
      pending={false}
      renderHtmlFrame={frame}
      onDraftChange={() => {}}
      onSaveDraft={() => {}}
      onSaveBlock={() => {}}
      onRemoveBlock={() => {}}
      onReorder={() => {}}
      onPublish={() => {}}
    />
  ),
};
