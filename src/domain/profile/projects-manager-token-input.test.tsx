// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ProjectsManagerProps } from "../../types/domain/profile/projects-manager-props.js";

import { ProjectsManager } from "./projects-manager.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const messages = defaultMessages.projectsManager;
let host: HTMLDivElement;
let root: Root;
const save = vi.fn();
const button = (label: string) =>
  [...document.querySelectorAll("button")].find((item) => item.textContent?.trim() === label)!;
const click = async (label: string) => {
  await act(async () => button(label).click());
};
function type(input: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
const stack = () => {
  const label = [...document.querySelectorAll("label")].find(
    (item) => item.textContent === messages.stackField,
  )!;
  return document.getElementById(label.htmlFor) as HTMLInputElement;
};
const chip = (name: string) =>
  document.querySelector<HTMLButtonElement>(`[aria-label="${messages.stackRemove(name)}"]`);
const render = (projects: ProjectsManagerProps["projects"] = []) =>
  act(() =>
    root.render(
      <ProjectsManager
        open
        onOpenChange={() => undefined}
        projects={projects}
        onSave={save}
        onDelete={() => undefined}
        renderHtmlFrame={() => null}
      />,
    ),
  );

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  save.mockReset().mockResolvedValue(true);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("ProjectsManager token stack", () => {
  it("keeps chips when editing another field and saves the pending token", async () => {
    render();
    await click(messages.add);
    type(stack(), "React, TypeScript, react, , typescript,");
    expect(chip("React")).not.toBeNull();
    expect(chip("react")).toBeNull();
    type(
      document.querySelector<HTMLInputElement>('input[placeholder="https://github.com/…"]')!,
      "https://github.com/example/project",
    );
    expect(chip("React")).not.toBeNull();
    expect(stack().value).toBe("");
    act(() => stack().focus());
    type(stack(), "Node");
    act(() => stack().blur());
    expect(chip("Node")).not.toBeNull();
    act(() => chip("React")!.click());
    type(stack(), " Redis ");
    await click(messages.save);
    expect(save).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ stack: ["TypeScript", "Node", "Redis"] }),
    );
  });

  it("loads the existing stack for editing and keeps the project id", async () => {
    render([
      {
        id: "project-local",
        title: "Local project",
        stack: ["Go", "Postgres"],
        description: null,
        repoUrl: null,
        status: "em andamento",
        diary: [],
        html: null,
        banner: null,
        icon: null,
      },
    ]);
    await click(messages.edit);
    expect(chip("Go")).not.toBeNull();
    expect(chip("Postgres")).not.toBeNull();
    act(() => chip("Go")!.click());
    type(stack(), "Redis,");
    await click(messages.save);
    expect(save).toHaveBeenCalledWith(
      "project-local",
      expect.objectContaining({ stack: ["Postgres", "Redis"] }),
    );
  });

  it("blocks saving an overlong pending token instead of dropping or truncating it", async () => {
    render();
    await click(messages.add);
    type(stack(), "x".repeat(41));
    await click(messages.save);
    expect(save).not.toHaveBeenCalled();
    expect(stack().value).toHaveLength(41);
    expect(document.querySelector('[role="alert"]')!.textContent).toBe(
      defaultMessages.tokenInput.tooLong(40),
    );
  });
});
