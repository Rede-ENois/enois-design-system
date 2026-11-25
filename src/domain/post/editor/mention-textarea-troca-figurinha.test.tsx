// @vitest-environment jsdom
import { act, createRef, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { MentionTextareaHandle } from "../../../types/domain/post/mention-textarea-handle.js";

import { fieldIn, selectText, typeInto } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const changed = vi.fn();
const handle = createRef<MentionTextareaHandle>();

afterEach(() => {
  act(() => root.render(null));
  changed.mockClear();
});

/** O mesmo `:palavra` que o app acha (`(:ke` no começo da busca). */
function consulta(termo: string, inicio: number, fim: number) {
  return { query: termo, start: inicio, end: fim };
}

function Field({ initial }: { initial: string }) {
  const [value, setText] = useState(initial);
  return (
    <MentionTextarea
      ref={handle}
      value={value}
      onChange={(next) => {
        setText(next);
        changed(next);
      }}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />
  );
}

describe("MentionTextarea: escolha do autocomplete de figurinhas", () => {
  it("troca o :termo pelo código completo e deixa o cursor depois dele", () => {
    const field = (() => {
      act(() => root.render(<Field initial="" />));
      return fieldIn(container);
    })();
    typeInto(field, "olha :ke");
    act(() => {
      handle.current?.replaceStickerQuery("kekw", consulta("ke", 5, 8));
    });
    expect(changed).toHaveBeenLastCalledWith("olha :kekw:");
  });

  it("entra como texto comum quando o cursor não está mais no termo", () => {
    act(() => root.render(<Field initial="" />));
    typeInto(fieldIn(container), "olha ");
    act(() => {
      handle.current?.replaceStickerQuery("kekw", consulta("ke", 2, 4));
    });
    expect(changed).toHaveBeenLastCalledWith("olha :kekw:");
  });
});
