import { act } from "react";

import { readSelection, readText, writeSelection } from "./editor-dom.js";

/** The editable field of a rendered `MentionTextarea`. */
export function fieldIn(container: HTMLElement): HTMLElement {
  const field = container.querySelector<HTMLElement>('[role="textbox"]');
  if (!field) throw new Error("MentionTextarea field not rendered");
  return field;
}

export function selectText(field: HTMLElement, start: number, end = start): void {
  writeSelection(field, start, end);
}

export function selectionOf(field: HTMLElement) {
  return readSelection(field);
}

/** Replaces the field content the way typing would: the DOM changes, then `input` fires. */
export function typeInto(field: HTMLElement, text: string): void {
  act(() => {
    field.textContent = text;
    writeSelection(field, text.length, text.length);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/** The value the field shows: stickers count as their code. */
export function valueOf(field: HTMLElement): string {
  return readText(field);
}
