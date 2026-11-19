// @vitest-environment node
import type { ReactNode } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { GithubOrgImportDialogProps } from "../../types/domain/profile/github-org-import-dialog-props.js";

import { GithubOrgImportDialog } from "./github-org-import-dialog.js";

// The Radix portal renders nothing on the server: the dialog parts become plain wrappers here.
vi.mock("../../ui/dialog.js", () => {
  const Plain = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    Dialog: Plain,
    DialogContent: Plain,
    DialogHeader: Plain,
    DialogTitle: Plain,
    DialogDescription: Plain,
  };
});

const noop = () => undefined;

const orgs = [
  { login: "enoise", name: "Énois", htmlUrl: "https://github.com/enoise" },
  { login: "outra", name: null, htmlUrl: "https://github.com/outra" },
];

const render = (patch: Partial<GithubOrgImportDialogProps> = {}) =>
  renderToStaticMarkup(
    <GithubOrgImportDialog
      open
      onOpenChange={noop}
      title="Organizações"
      hint="Transforme uma organização em empresa."
      chooseLabel="Escolha a organização"
      orgs={{ loading: false, error: false, items: orgs }}
      selectedOrg="enoise"
      onSelectOrg={noop}
      activeOrg={orgs[0]}
      repos={{
        loading: false,
        error: false,
        rows: [
          {
            name: "connect",
            fullName: "enoise/connect",
            description: "A rede",
            language: "TypeScript",
            stars: 3,
            forks: 1,
            fork: false,
            archived: true,
            updatedAtLabel: "20 out. 2026",
            url: "https://github.com/enoise/connect",
          },
        ],
      }}
      selected={["enoise/connect"]}
      onToggle={noop}
      onSelectAll={noop}
      onClear={noop}
      importing={false}
      onImport={noop}
      {...patch}
    />,
  );

describe("GithubOrgImportDialog", () => {
  it("lista as organizações com a escolhida marcada", () => {
    const html = render();
    expect(html).toContain("Énois");
    expect(html).toContain("outra");
    expect(html).toContain('aria-pressed="true"');
  });

  it("mostra os repositórios, os marcadores e o link do GitHub", () => {
    const html = render();
    expect(html).toContain("enoise/connect");
    expect(html).toContain("connect");
    expect(html).toContain("arquivado");
    expect(html).toContain("3 estrelas");
    expect(html).toContain("atualizado em 20 out. 2026");
    expect(html).toContain("https://github.com/enoise");
    expect(html).toContain("Importar 1 projeto");
  });

  it("sem repositórios públicos diz que não há", () => {
    const html = render({ repos: { loading: false, error: false, rows: [] } });
    expect(html).toContain("Nenhum repositório público encontrado.");
  });

  it("sem organizações explica quem pode importar", () => {
    const html = render({
      orgs: { loading: false, error: false, items: [] },
      activeOrg: null,
      selectedOrg: null,
    });
    expect(html).toContain("administrar (ou participar de) uma organização");
  });

  it("não abre o link de um endereço inseguro", () => {
    const html = render({
      activeOrg: { login: "x", name: null, htmlUrl: "javascript:alert(1)" },
    });
    expect(html).not.toContain("javascript:");
  });
});
