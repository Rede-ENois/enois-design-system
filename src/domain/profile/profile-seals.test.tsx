// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ProfileSeal } from "../../types/domain/profile/profile-seal.js";
import type { SealEvidenceListProps } from "../../types/domain/profile/seal-evidence-list-props.js";

import { ProfileSeals } from "./profile-seals.js";
import { SealEvidenceList } from "./seal-evidence-list.js";

const seal: ProfileSeal = {
  type: "CODE",
  category: "CODE",
  name: "Contribuidora",
  categoryName: "Código",
  description: "PRs aceitos.",
  minCount: 50,
  maxCount: null,
  evidenceCount: 1,
  grantedAtLabel: "12 out. 2026",
};

const list = (patch: Partial<SealEvidenceListProps>) =>
  renderToStaticMarkup(
    <SealEvidenceList
      total={2}
      open
      onOpenChange={() => undefined}
      loading={false}
      error={false}
      items={[
        { repository: "a/b", kind: "ISSUE", number: 7, title: "Bug", url: "https://x.dev/7" },
        {
          repository: "a/b",
          kind: "PULL_REQUEST",
          number: 8,
          title: "Fix",
          url: "https://x.dev/8",
        },
      ]}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => undefined}
      {...patch}
    />,
  );

describe("ProfileSeals", () => {
  it("sem selos não desenha nada", () => {
    expect(renderToStaticMarkup(<ProfileSeals seals={[]} renderEvidence={() => null} />)).toBe("");
  });

  it("faixa aberta, contagem no singular e a lista do app", () => {
    const html = renderToStaticMarkup(
      <ProfileSeals seals={[seal]} renderEvidence={(item) => <i>ev-{item.category}</i>} />,
    );
    expect(html).toContain("Código · 50+ · 1 contribuição verificada");
    expect(html).toContain("Concedido em 12 out. 2026");
    expect(html).toContain("<i>ev-CODE</i>");
    expect(html).not.toContain("<img");
  });

  it("com emblema desenha a imagem do nível no lugar do ícone", () => {
    const html = renderToStaticMarkup(
      <ProfileSeals
        seals={[{ ...seal, emblemSrc: "/seals/hardcore.png" }]}
        renderEvidence={() => null}
      />,
    );
    expect(html).toContain('src="/seals/hardcore.png"');
    expect(html).not.toContain("<svg");
  });
});

describe("SealEvidenceList", () => {
  it("sem evidências não desenha nada", () => {
    expect(list({ total: 0 })).toBe("");
  });

  it("aberta lista issue e PR com o tipo traduzido", () => {
    const html = list({});
    expect(html).toContain("Issue · a/b #7 · Bug");
    expect(html).toContain("PR · a/b #8 · Fix");
    expect(html).not.toContain("Carregar mais");
  });

  it("fechada não mostra o conteúdo; com erro mostra o aviso", () => {
    expect(list({ open: false })).not.toContain("a/b");
    expect(list({ error: true })).toContain("Não foi possível carregar as evidências.");
  });

  it("com mais páginas oferece carregar mais", () => {
    expect(list({ hasMore: true })).toContain("Carregar mais");
  });
});
