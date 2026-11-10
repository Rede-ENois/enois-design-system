// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProfileBioDialog } from "./profile-bio-dialog.js";
import { ProfileEditMenu } from "./profile-edit-menu.js";
import { ProfileResumeDialog } from "./profile-resume-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function render(extra = {}) {
  const actions = {
    onEditInfo: vi.fn(),
    onEditPhoto: vi.fn(),
    onEditCover: vi.fn(),
    onEditStatus: vi.fn(),
    onEditResume: vi.fn(),
    onEditBioHtml: vi.fn(),
    onEditAppearance: vi.fn(),
    onEditLook: vi.fn(),
  };
  act(() => root.render(<ProfileEditMenu {...actions} {...extra} />));
  return actions;
}

const trigger = () => container.querySelector("button")!;
const entry = (label: string) =>
  [...document.body.querySelectorAll<HTMLElement>("button, a")].find((el) =>
    el.textContent?.startsWith(label),
  );

describe("ProfileEditMenu", () => {
  it("is one button that holds every profile edit", () => {
    render({ professional: { href: "/profissional/ana", setup: false } });
    expect(container.querySelectorAll("button")).toHaveLength(1);
    expect(trigger().textContent).toContain("Editar perfil");

    act(() => trigger().click());
    for (const label of [
      "Informações",
      "Foto",
      "Capa",
      "Status",
      "Perfil profissional",
      "Currículo",
      "Aparência do perfil",
      "Bio em HTML",
      "Cores da interface",
    ]) {
      expect(entry(label), label).toBeTruthy();
    }
    expect(entry("Perfil profissional")!.getAttribute("href")).toBe("/profissional/ana");
  });

  it("closes and reports the pick", () => {
    const actions = render();
    act(() => trigger().click());
    act(() => entry("Status")!.click());

    expect(actions.onEditStatus).toHaveBeenCalledOnce();
    expect(entry("Status")).toBeUndefined();
  });

  it("holds the photo while it uploads and leaves out a profile it cannot have", () => {
    render({ photoBusy: true });
    act(() => trigger().click());

    expect((entry("Enviando...") as HTMLButtonElement).disabled).toBe(true);
    expect(entry("Perfil profissional")).toBeUndefined();
    expect(entry("Ativar perfil profissional")).toBeUndefined();
  });
});

describe("dialogs opened by the menu", () => {
  it("draw no button of their own", () => {
    act(() =>
      root.render(
        <>
          <ProfileResumeDialog
            open={false}
            onOpenChange={() => {}}
            onUpload={() => {}}
            onRemove={() => {}}
          />
          <ProfileBioDialog
            open={false}
            onOpenChange={() => {}}
            trigger={false}
            initialHtml={null}
            maxLength={100}
            onSave={() => {}}
            renderHtmlFrame={() => null}
          />
        </>,
      ),
    );
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("the HTML bio opened from outside starts from the saved HTML", () => {
    const bio = (open: boolean, initialHtml: string) => (
      <ProfileBioDialog
        open={open}
        onOpenChange={() => {}}
        trigger={false}
        initialHtml={initialHtml}
        maxLength={100}
        onSave={() => {}}
        renderHtmlFrame={() => null}
      />
    );
    act(() => root.render(bio(false, "<p>a</p>")));
    act(() => root.render(bio(true, "<p>b</p>")));
    expect(document.body.querySelector("textarea")!.value).toBe("<p>b</p>");
  });
});
