import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EphemeralExpiryBadge } from "./ephemeral-expiry-badge.js";

describe("EphemeralExpiryBadge", () => {
  it("instante mostra o prazo em minutos", () => {
    const expiresAt = new Date(Date.now() + 45 * 60_000).toISOString();
    const html = renderToStaticMarkup(
      <EphemeralExpiryBadge type="INSTANTE" expiresAt={expiresAt} />,
    );
    expect(html).toContain("some em 45 min");
    expect(html).toContain("Instante se apaga sozinho em 1 hora");
  });

  it("momento segue em horas", () => {
    const expiresAt = new Date(Date.now() + 23 * 3_600_000).toISOString();
    const html = renderToStaticMarkup(<EphemeralExpiryBadge type="MOMENT" expiresAt={expiresAt} />);
    expect(html).toContain("some em 23h");
    expect(html).toContain("Momento se apaga sozinho em 24 horas");
  });

  it("prazo vencido não renderiza nada (o worker ainda vai apagar)", () => {
    const expiresAt = new Date(Date.now() - 60_000).toISOString();
    const html = renderToStaticMarkup(
      <EphemeralExpiryBadge type="INSTANTE" expiresAt={expiresAt} />,
    );
    expect(html).toBe("");
  });
});
