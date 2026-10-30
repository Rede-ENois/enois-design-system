// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NetworkRequest } from "../../types/domain/network/network-request.js";
import type { NetworkRequestsProps } from "../../types/domain/network/network-requests-props.js";

import { NetworkRequests } from "./network-requests.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const text = () => container.textContent ?? "";
const byLabel = (label: string) =>
  [...container.querySelectorAll("button")].find(
    (b) => (b.getAttribute("aria-label") ?? b.textContent) === label,
  ) ?? null;
const click = (label: string) => act(() => byLabel(label)!.click());

const person = (patch: Partial<NetworkRequest>): NetworkRequest => ({
  userId: "u1",
  direction: "INCOMING",
  name: "Ana",
  username: "ana",
  profileHref: "/perfil/ana",
  dateLabel: "há 2 dias",
  status: "pending",
  ...patch,
});

const setup = (patch: Partial<NetworkRequestsProps> = {}) => {
  const props: NetworkRequestsProps = {
    requests: [],
    loading: false,
    onAccept: vi.fn(),
    onDecline: vi.fn(),
    onCancel: vi.fn(),
    ...patch,
  };
  act(() => root.render(<NetworkRequests {...props} />));
  return props;
};

describe("NetworkRequests", () => {
  it("answers a received invitation in place, by the other person's id", () => {
    const props = setup({ requests: [person({})] });
    click("Aceitar o convite de Ana");
    click("Recusar o convite de Ana");
    expect(props.onAccept).toHaveBeenCalledWith("u1");
    expect(props.onDecline).toHaveBeenCalledWith("u1");
    expect(text()).toContain("1 pessoa quer se conectar com você.");
  });

  it("keeps the outcome on the row instead of dropping it under the cursor", () => {
    setup({ requests: [person({ status: "accepted" })] });
    expect(text()).toContain("Agora vocês estão conectados");
    expect(byLabel("Aceitar o convite de Ana")).toBeNull();
    // Answered invitations no longer count as waiting.
    expect(text()).toContain("Ninguém esperando a sua resposta.");
  });

  it("locks both answers while one is on its way", () => {
    setup({ requests: [person({ status: "accepting" })] });
    expect(byLabel("Recusar o convite de Ana")!.disabled).toBe(true);
    expect(byLabel("Aceitar o convite de Ana")!.disabled).toBe(true);
  });

  it("separates sent invitations in their own tab, opening on what needs an answer", () => {
    const props = setup({
      requests: [person({}), person({ userId: "u2", name: "Bia", direction: "OUTGOING" })],
    });
    expect(text()).not.toContain("Bia");
    click("Enviados (1)");
    click("Cancelar convite para Bia");
    expect(props.onCancel).toHaveBeenCalledWith("u2");
  });

  it("opens on the sent tab when nothing was received", () => {
    setup({ requests: [person({ direction: "OUTGOING" })] });
    expect(byLabel("Cancelar convite para Ana")).not.toBeNull();
  });

  it("shows a few rows first and the rest on demand", () => {
    setup({
      requests: Array.from({ length: 6 }, (_, i) => person({ userId: `u${i}`, name: `P${i}` })),
    });
    expect(text()).not.toContain("P5");
    click("Ver todos os 6");
    expect(text()).toContain("P5");
  });

  it("says when loading failed and offers a retry", () => {
    const onRetry = vi.fn();
    setup({ error: true, onRetry });
    click("Tentar de novo");
    expect(onRetry).toHaveBeenCalled();
  });
});
