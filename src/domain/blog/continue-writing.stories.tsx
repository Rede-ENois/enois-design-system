import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ContinueWritingDraft } from "../../types/domain/blog/continue-writing-draft.js";

import { ContinueWriting } from "./continue-writing.js";

const meta: Meta = {
  title: "Domain/Blog",
};

export default meta;

const DRAFTS: ContinueWritingDraft[] = [
  { id: "draft_1", title: "Ensaio sobre redes comunitárias", updatedAtLabel: "16/11/2026 10:00" },
  { id: "draft_2", title: "Caderno de campo — mutirão", updatedAtLabel: "15/11/2026 09:00" },
  { id: "draft_3", title: "   ", updatedAtLabel: "14/11/2026 18:30" },
];

export const WithDrafts: StoryObj = {
  render: () => (
    <ContinueWriting
      drafts={DRAFTS}
      resumeHref={(id) => `/blog/post/new?rascunho=${id}`}
      onDiscard={() => {}}
    />
  ),
};

export const Empty: StoryObj = {
  render: () => <ContinueWriting drafts={[]} resumeHref={(id) => id} onDiscard={() => {}} />,
};
