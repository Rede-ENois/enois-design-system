import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmoteActionDialogView } from "./emote-action-dialog-view.js";

const meta: Meta = {
  title: "Domain/Emotes/Ações da figurinha",
};

export default meta;

const item = { code: "KEKW", src: "/emotes/image/BTTV/KEKW?variant=thumb" };
const semop = { onOpenChange: () => {} };

/** A conta comum segurando a figurinha de terceiros: só denunciar. */
export const ContaComum: StoryObj = {
  render: () => <EmoteActionDialogView {...semop} open item={item} onReport={() => {}} />,
};

/** O admin segurando a figurinha: denunciar e banir com motivo. */
export const Admin: StoryObj = {
  render: () => (
    <EmoteActionDialogView {...semop} open item={item} onReport={() => {}} onBan={() => {}} />
  ),
};

/** Figurinha já banida: desfazer o banimento no lugar de banir. */
export const Banida: StoryObj = {
  render: () => (
    <EmoteActionDialogView
      {...semop}
      open
      item={item}
      banned
      onReport={() => {}}
      onBan={() => {}}
      onUnban={() => {}}
    />
  ),
};

/** O pacote É Nóis nunca é alvo: o diálogo explica em vez de abrir vazio. */
export const PacoteEnois: StoryObj = {
  render: () => (
    <EmoteActionDialogView
      {...semop}
      open
      item={{ code: "enois_like", src: "/emojis/enois/like.webp" }}
    />
  ),
};
