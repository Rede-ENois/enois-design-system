// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import { EMPTY_PROFILE_LOOK } from "../../types/lib/theme/profile-look.js";

import { ProfileLookDialog } from "./profile-look-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const labels = defaultMessages.collectionGrid;

let host: HTMLDivElement;
let root: Root;

const badges = (text: string) =>
  [...document.body.querySelectorAll("span")].filter((span) => span.textContent === text).length;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

/**
 * Neste diálogo os dois botões do cartão só mexem no rascunho, então não existe "prévia"
 * separada do "em uso": o tema do rascunho é o que está em uso, e nenhum cartão fica em prévia.
 */
describe("ProfileLookDialog", () => {
  it("marca o tema da vitrine como em uso e nenhum como em prévia", () => {
    act(() =>
      root.render(
        <ProfileLookDialog
          open
          onOpenChange={() => {}}
          value={{
            social: { ...EMPTY_PROFILE_LOOK, theme: "arcade-8bit" },
            professional: EMPTY_PROFILE_LOOK,
          }}
          onSave={() => {}}
        />,
      ),
    );

    expect(badges(labels.inUse)).toBe(1);
    expect(badges(labels.previewing)).toBe(0);
  });
});
