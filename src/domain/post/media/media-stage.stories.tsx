import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { MediaStage } from "./media-stage.js";

const meta: Meta = {
  title: "Domain/Post/Media Stage",
};

export default meta;

/**
 * The stage is rendered inside a card with the same paint containment the feed applies
 * (`[content-visibility:auto]`): only the Dialog portal can escape it and cover the viewport.
 */
export const Open: StoryObj = {
  name: "Palco aberto sobre o card",
  render: function OpenStageStory() {
    const [open, setOpen] = useState(true);

    return (
      <article className="mx-auto max-w-xl [contain-intrinsic-size:auto_360px] [content-visibility:auto] rounded-2xl bg-surface-card p-5">
        <p className="text-sm text-text-subtle">Feed atrás do palco</p>

        {open ? (
          <MediaStage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            onClose={() => {
              setOpen(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
            className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Reabrir o palco
          </button>
        )}
      </article>
    );
  },
};
