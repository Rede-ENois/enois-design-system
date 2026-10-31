// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ProjectsManagerProps } from "../../types/domain/profile/projects-manager-props.js";

import { ProjectsManager } from "./projects-manager.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.projectsManager;
const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
const project = {
  id: "sample-project",
  title: "Sample project",
  description: "Sample description",
  stack: ["React", "TypeScript"],
  repoUrl: null,
  status: "em andamento",
  diary: [],
  html: null,
};

let host: HTMLDivElement;
let root: Root;

function render(props: Partial<ProjectsManagerProps> = {}) {
  const onSave = vi.fn(async () => true);
  act(() =>
    root.render(
      <ProjectsManager
        open
        onOpenChange={() => {}}
        projects={[]}
        onSave={onSave}
        onDelete={() => {}}
        renderHtmlFrame={({ html }) => <div>{html}</div>}
        {...props}
      />,
    ),
  );
  return onSave;
}

function button(label: string) {
  const element = [...document.body.querySelectorAll("button")].find(
    (node) => node.textContent === label || node.getAttribute("aria-label") === label,
  );
  expect(element, label).toBeDefined();
  return element!;
}

function click(label: string) {
  act(() => button(label).click());
}

function stackInput() {
  const label = [...document.body.querySelectorAll("label")].find(
    (node) => node.textContent === messages.stackField,
  )!;
  return document.getElementById(label.htmlFor) as HTMLInputElement;
}

function chips() {
  return [...document.body.querySelectorAll("li > span")].map((node) => node.textContent);
}

function type(input: HTMLInputElement, value: string) {
  act(() => {
    setValue.call(input, value);
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  });
}

function press(key: string, isComposing = false) {
  const event = new KeyboardEvent("keydown", { key, isComposing, bubbles: true, cancelable: true });
  act(() => stackInput().dispatchEvent(event));
  return event;
}

function blur() {
  act(() => stackInput().focus());
  act(() => stackInput().blur());
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("ProjectsManager stack chips", () => {
  it.each([",", "Enter", "blur"])("adds a trimmed chip on %s and clears the draft", (trigger) => {
    render();
    click(messages.add);
    type(stackInput(), "  React  ");

    if (trigger === "blur") blur();
    else expect(press(trigger).defaultPrevented).toBe(true);

    expect(chips()).toEqual(["React"]);
    expect(stackInput().value).toBe("");
  });

  it("accepts pasted and mobile comma-separated input without empty or repeated chips", () => {
    render();
    click(messages.add);
    type(stackInput(), "React, TypeScript, , react,");

    expect(chips()).toEqual(["React", "TypeScript"]);
    expect(stackInput().value).toBe("");
    expect(document.querySelector('[role="alert"]')?.textContent).toBe(messages.stackDuplicate);
  });

  it.each([",", "Enter", "blur"])(
    "rejects duplicates ignoring case and whitespace on %s",
    (trigger) => {
      render({ projects: [project] });
      click(messages.edit);
      type(stackInput(), "  rEaCt  ");
      if (trigger === "blur") blur();
      else press(trigger);

      expect(chips()).toEqual(["React", "TypeScript"]);
      expect(stackInput().value).toBe("");
      expect(stackInput().getAttribute("aria-invalid")).toBe("true");
      const error = document.querySelector('[role="alert"]')!;
      expect(error.textContent).toBe(messages.stackDuplicate);
      expect(stackInput().getAttribute("aria-describedby")).toContain(error.id);

      type(stackInput(), "Postgres");
      expect(document.querySelector('[role="alert"]')).toBeNull();
      press("Enter");
      expect(chips()).toEqual(["React", "TypeScript", "Postgres"]);
    },
  );

  it("ignores blank input and Enter during IME composition", () => {
    render();
    click(messages.add);
    type(stackInput(), "  ");
    press(",");
    press("Enter");
    blur();
    expect(chips()).toEqual([]);

    type(stackInput(), "日本語");
    expect(press("Enter", true).defaultPrevented).toBe(false);
    expect(chips()).toEqual([]);
    expect(stackInput().value).toBe("日本語");
    press("Enter");
    expect(chips()).toEqual(["日本語"]);
  });

  it("loads existing chips, removes one and allows adding it again", () => {
    render({ projects: [project] });
    click(messages.edit);
    expect(stackInput().value).toBe("");
    expect(chips()).toEqual(["React", "TypeScript"]);

    click(messages.stackRemove("React"));
    expect(chips()).toEqual(["TypeScript"]);
    type(stackInput(), "React");
    press("Enter");
    expect(chips()).toEqual(["TypeScript", "React"]);
    expect(project.stack).toEqual(["React", "TypeScript"]);
  });

  it("preserves a chip committed on blur when removing a different chip", () => {
    render({ projects: [project] });
    click(messages.edit);
    type(stackInput(), "Postgres");
    blur();
    click(messages.stackRemove("React"));
    expect(chips()).toEqual(["TypeScript", "Postgres"]);
  });

  it("keeps chips and the chosen mode when other fields change, and saves the stack array", async () => {
    const onSave = render({ projects: [project] });
    click(messages.edit);
    type(stackInput(), "Postgres");
    blur();
    const repo = document.querySelector<HTMLInputElement>(
      'input[placeholder="https://github.com/…"]',
    )!;
    type(repo, "https://github.com/example/sample");
    expect(chips()).toEqual(["React", "TypeScript", "Postgres"]);

    click(messages.modeHtml);
    type(document.querySelector("input")!, "Updated project");
    expect(button(messages.modeHtml).getAttribute("aria-pressed")).toBe("true");
    click(messages.modeStructured);
    expect(chips()).toEqual(["React", "TypeScript", "Postgres"]);

    await act(async () => button(messages.save).click());
    expect(onSave).toHaveBeenCalledWith(
      project.id,
      expect.objectContaining({
        title: "Updated project",
        stack: ["React", "TypeScript", "Postgres"],
        repoUrl: "https://github.com/example/sample",
      }),
    );
    expect(button(messages.add)).toBeDefined();
  });

  it("includes unconfirmed input when saving without a blur and preserves it after a failed save", async () => {
    const onSave = vi.fn(async () => false);
    render({ onSave });
    click(messages.add);
    type(stackInput(), "React");

    await act(async () => button(messages.save).click());

    expect(onSave).toHaveBeenCalledWith(undefined, expect.objectContaining({ stack: ["React"] }));
    expect(chips()).toEqual(["React"]);
    expect(stackInput().value).toBe("");
  });

  it("clears draft and validation when editing another project or starting a new one", () => {
    render({ projects: [project] });
    click(messages.edit);
    type(stackInput(), "React");
    press("Enter");
    click(messages.cancel);
    click(messages.edit);
    expect(chips()).toEqual(["React", "TypeScript"]);
    expect(document.querySelector('[role="alert"]')).toBeNull();

    type(stackInput(), "Unsaved");
    click(messages.cancel);
    click(messages.add);
    expect(chips()).toEqual([]);
    expect(stackInput().value).toBe("");
  });
});
