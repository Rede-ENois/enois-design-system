// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { IdentityVerificationStatus } from "../../types/domain/security/identity-verification-status.js";

import { IdentityVerificationSection } from "./identity-verification-section.js";
import { resolveIdentityReleaseView } from "./resolve-identity-release-view.js";

const base = {
  onStart: () => {},
  onRefresh: () => {},
  onRevoke: () => {},
};

const render = (status?: IdentityVerificationStatus) =>
  renderToStaticMarkup(<IdentityVerificationSection {...base} status={status} />);

describe("resolveIdentityReleaseView", () => {
  it("shows the progressive wait when the account has no invite yet", () => {
    expect(resolveIdentityReleaseView(undefined)).toBe("WAITING");
    expect(resolveIdentityReleaseView({ state: "NOT_VERIFIED", released: false })).toBe("WAITING");
    expect(resolveIdentityReleaseView({ state: "REVOKED" })).toBe("WAITING");
  });

  it("opens the procedure for an invited account", () => {
    expect(resolveIdentityReleaseView({ state: "NOT_VERIFIED", released: true })).toBe("ELIGIBLE");
  });

  it("keeps a rejection with the invited account eligible to try again", () => {
    expect(resolveIdentityReleaseView({ state: "REJECTED", released: true })).toBe("DECLINED");
    expect(resolveIdentityReleaseView({ state: "EXPIRED", released: true })).toBe("DECLINED");
  });

  it("reports the in-progress attempt and the approved seal", () => {
    expect(resolveIdentityReleaseView({ state: "PENDING", released: true })).toBe("IN_PROGRESS");
    expect(resolveIdentityReleaseView({ state: "VERIFIED", released: true })).toBe("APPROVED");
    expect(resolveIdentityReleaseView({ state: "NOT_VERIFIED", verified: true })).toBe("APPROVED");
  });
});

describe("IdentityVerificationSection", () => {
  it("shows the arrival notice without score, ranking or an action button", () => {
    const html = render({ state: "NOT_VERIFIED", released: false, providerAvailable: true });

    expect(html).toContain("A verificação de identidade está chegando!");
    expect(html).toContain("Estamos liberando o acesso progressivamente");
    expect(html).toContain("Continue participando do Énóis");
    expect(html).not.toContain("Verificar minha identidade");
    expect(html).not.toContain("ranking");
  });

  it("offers the start button and the button copy of the project when the turn arrives", () => {
    const html = render({ state: "NOT_VERIFIED", released: true, providerAvailable: true });

    expect(html).toContain("Sua vez chegou!");
    expect(html).toContain("Verificar minha identidade");
  });

  it("tells an unavailable provider instead of rendering a dead button", () => {
    const html = render({ state: "NOT_VERIFIED", released: true, providerAvailable: false });

    expect(html).toContain("não está disponível no momento");
  });

  it("shows the in-progress attempt with the refresh action only", () => {
    const html = render({ state: "PENDING", released: true, providerAvailable: true });

    expect(html).toContain("Você possui uma verificação em andamento.");
    expect(html).toContain("Atualizar estado");
    expect(html).not.toContain("Desvincular identidade");
  });

  it("shows the seal and the explanation once approved", () => {
    const html = render({ state: "VERIFIED", verified: true, released: true });

    expect(html).toContain("Humanidade Comprovada");
    expect(html).toContain("provedor especializado");
    expect(html).toContain("Desvincular identidade");
  });

  it("explains the refusal without blaming the person", () => {
    const html = render({ state: "REJECTED", released: true, providerAvailable: true });

    expect(html).toContain("Não foi possível aprovar sua verificação.");
    expect(html).not.toContain("Verificar minha identidade");
  });

  it("never promises that no documents are stored by the provider", () => {
    const html = render({ state: "NOT_VERIFIED", released: true, providerAvailable: true });

    expect(html).toContain("Nunca CPF, documento, selfie, biometria ou dados sensíveis.");
  });
});
