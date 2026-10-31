// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";

import { WhatsNewDialog } from "./whats-new-dialog.js";

const messages = defaultMessages.whatsNewDialog;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const items = [
  { id: "a", title: "Par de estudo", description: "Estude junto." },
  { id: "b", title: "Comunidades locais", description: "Perto de você." },
];

it("lists every item in order under the release label", () => {
  act(() =>
    root.render(
      <WhatsNewDialog open onOpenChange={() => {}} releaseLabel="Outubro de 2026" items={items} />,
    ),
  );

  const titles = [...document.querySelectorAll("ol li p:first-child")].map(
    (node) => node.textContent,
  );
  expect(titles).toEqual(["Par de estudo", "Comunidades locais"]);
  expect(document.body.textContent).toContain(`${messages.eyebrow} · Outubro de 2026`);
});

it("confirming closes the dialog", () => {
  const onOpenChange = vi.fn();
  act(() => root.render(<WhatsNewDialog open onOpenChange={onOpenChange} items={items} />));

  const confirm = [...document.querySelectorAll("button")].find(
    (button) => button.textContent === messages.confirm,
  );
  act(() => confirm?.click());

  expect(onOpenChange).toHaveBeenCalledWith(false);
});
