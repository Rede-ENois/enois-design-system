import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { DesafioParticipacaoView } from "../../types/domain/desafios/desafio-participacao-view.js";
import type { DesafioView } from "../../types/domain/desafios/desafio-view.js";

import { DesafiosCard } from "./desafios-card.js";
import { DesafiosComposer } from "./desafios-composer.js";
import { DesafiosDetalhe } from "./desafios-detalhe.js";
import { DesafiosFeed } from "./desafios-feed.js";

const meta: Meta = {
  title: "Domain/Desafios",
};

export default meta;

const ana = {
  id: "user_1",
  name: "Ana Mel",
  username: "mel",
  avatar: null,
  avatarFrame: null,
  nameStyle: null,
};

const bia = {
  id: "user_2",
  name: "Bia Souza",
  username: "bia",
  avatar: null,
  avatarFrame: null,
  nameStyle: null,
};

const desafio: DesafioView = {
  id: "desafio_1",
  title: "Um desafio de escrita",
  description: "Escreva um poema de quatro versos sobre o seu bairro.",
  author: ana,
  createdAt: "2026-11-15T10:30:00Z",
  endsAt: "2026-11-20T10:30:00Z",
  status: "ACTIVE",
  destaqueId: null,
  participacoes: 1,
  isMine: false,
};

const participacao: DesafioParticipacaoView = {
  id: "part_1",
  desafioId: "desafio_1",
  author: bia,
  content: "Um poema sobre o meu bairro, feito na hora.",
  createdAt: "2026-11-15T11:00:00Z",
  cheers: 4,
  cheered: false,
  isMine: false,
};

export const LinhaDoTempo: StoryObj = {
  name: "Linha do tempo",
  render: () => (
    <div className="mx-auto max-w-xl space-y-4">
      <DesafiosFeed
        desafios={[desafio]}
        state={{ kind: "ready" }}
        hasMore={false}
        loadingMore={false}
        onLoadMore={() => undefined}
        renderCard={(item) => (
          <DesafiosCard
            key={item.id}
            desafio={item}
            timeLeft="em 3 dias"
            onOpen={() => undefined}
            onRemove={() => undefined}
            onReport={() => undefined}
          />
        )}
      />
    </div>
  ),
};

export const Compositor: StoryObj = {
  name: "Compositor",
  render: () => (
    <div className="mx-auto max-w-xl">
      <DesafiosComposer onPublish={async () => undefined} />
    </div>
  ),
};

/**
 * The challenge opens as a layer of the app, in the Dialog portal: the same paint containment the
 * feed applies (`[content-visibility:auto]`) would trap an inline overlay inside the card.
 */
export const DetalheEmTelaCheia: StoryObj = {
  name: "Detalhe em tela cheia",
  render: function DetalheStory() {
    const [open, setOpen] = useState(true);

    return (
      <article className="mx-auto max-w-xl [contain-intrinsic-size:auto_360px] [content-visibility:auto] rounded-2xl bg-surface-card p-5">
        <p className="text-sm text-text-subtle">Feed atrás do desafio</p>

        {open ? (
          <DesafiosDetalhe
            open
            onOpenChange={(next) => {
              setOpen(next);
            }}
            timeLeft="em 3 dias"
            desafio={desafio}
            state={{ kind: "ready" }}
            participacoes={[participacao]}
            onParticipate={async () => undefined}
            onCheer={() => undefined}
            onUncheer={() => undefined}
            onRemoveParticipacao={() => undefined}
            onClose={() => undefined}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Reabrir o desafio
          </button>
        )}
      </article>
    );
  },
};
