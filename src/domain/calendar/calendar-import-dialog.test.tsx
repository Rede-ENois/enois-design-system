// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarImportDialogProps } from "../../types/domain/calendar/calendar-import-dialog-props.js";

import { CalendarImportDialog } from "./calendar-import-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar.importDialog;
const scopes = defaultMessages.calendar.scopes;

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarImportDialogProps> = {}) => {
  act(() =>
    root.render(
      <CalendarImportDialog
        open
        onOpenChange={() => {}}
        scope={null}
        onScopeChange={() => {}}
        file={null}
        onFileChange={() => {}}
        onImport={async () => null}
        {...props}
      />,
    ),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
};

const chooseFile = (file: File) => {
  const input = document.body.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("file input not found");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  act(() => input.dispatchEvent(new Event("change", { bubbles: true })));
};

const ics = (name = "agenda.ics", size = 32) =>
  new File([new Uint8Array(size)], name, { type: "text/calendar" });

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("diálogo de importação .ics", () => {
  it("sem arquivo, importar fica desabilitado", () => {
    render();

    expect(text()).toContain(messages.title);
    expect(text()).toContain(messages.chooseFile);
    expect(button(messages.import)?.disabled).toBe(true);
  });

  it("arquivo com extensão errada é recusado antes do upload", () => {
    const onFileChange = vi.fn();
    render({ onFileChange });

    chooseFile(ics("agenda.csv"));

    expect(text()).toContain(messages.wrongFormat);
    expect(onFileChange).not.toHaveBeenCalled();
  });

  it("arquivo acima do limite é recusado antes do upload", () => {
    const onFileChange = vi.fn();
    render({ onFileChange, maxBytes: 1024 });

    chooseFile(ics("agenda.ics", 2048));

    expect(text()).toContain(messages.tooLarge(1));
    expect(onFileChange).not.toHaveBeenCalled();
  });

  it("arquivo válido é entregue ao app", () => {
    const onFileChange = vi.fn();
    render({ onFileChange });

    const file = ics();
    chooseFile(file);

    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("escolher a agenda avisa o app com o escopo certo", () => {
    const onScopeChange = vi.fn();
    render({ onScopeChange });

    click(button(scopes.PROFESSIONAL));

    expect(onScopeChange).toHaveBeenCalledWith("PROFESSIONAL");
  });

  it("importar mostra as contagens do que entrou", async () => {
    const onImport = vi.fn(async () => ({
      received: 12,
      created: 9,
      moved: 2,
      cancelled: 1,
      skipped: 0,
    }));
    render({ file: ics(), onImport });

    await act(async () => click(button(messages.import)));

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(text()).toContain(messages.resultTitle);
    expect(text()).toContain(messages.resultReceived(12));
    expect(text()).toContain(messages.resultCreated(9));
    expect(text()).toContain(messages.resultMoved(2));
    expect(text()).toContain(messages.resultCancelled(1));
    expect(button(messages.done)).toBeTruthy();
  });

  it("arquivo sem evento utilizável diz que nada entrou", async () => {
    render({
      file: ics(),
      onImport: async () => ({ received: 3, created: 0, moved: 0, cancelled: 0, skipped: 3 }),
    });

    await act(async () => click(button(messages.import)));

    expect(text()).toContain(messages.resultEmpty);
  });

  it("erro do servidor aparece sem descartar o arquivo escolhido", () => {
    render({ file: ics(), error: "Não foi possível importar o arquivo." });

    expect(text()).toContain("Não foi possível importar o arquivo.");
    expect(text()).toContain(messages.chosenFile("agenda.ics"));
    expect(button(messages.import)?.disabled).toBe(false);
  });

  it("pendente desabilita importar e troca o rótulo", async () => {
    let release: (() => void) | undefined;
    const onImport = vi.fn(
      () =>
        new Promise<null>((resolve) => {
          release = () => resolve(null);
        }),
    );
    render({ file: ics(), onImport });

    act(() => click(button(messages.import)));

    expect(text()).toContain(messages.importing);
    expect(button(messages.importing)?.disabled).toBe(true);

    await act(async () => release?.());
  });
});
