// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CommunityCardProps } from "../../types/domain/communities/community-card-props.js";

import { CommunityCard } from "./community-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const community = {
  id: "c1",
  name: "Devs BH",
  description: null,
  topicLabel: null,
  members: 3,
  joined: false,
  cover: null,
  avatar: null,
};

const card = (extra: object, renderHtmlFrame?: CommunityCardProps["renderHtmlFrame"]) =>
  act(() =>
    root.render(
      <CommunityCard
        community={{ ...community, ...extra }}
        href="#"
        joinPending={false}
        leavePending={false}
        ownerBlocked={false}
        onJoin={() => undefined}
        onLeave={() => undefined}
        renderHtmlFrame={renderHtmlFrame}
      />,
    ),
  );

describe("CommunityCard capa", () => {
  it("uma comunidade com capa em HTML desenha o quadro isolado no lugar da capa vazia", () => {
    const renderHtmlFrame = vi.fn(() => <div data-testid="quadro" />);
    card({ bannerHtml: "<div>capa animada</div>" }, renderHtmlFrame);

    expect(container.querySelector("[data-testid=quadro]")).not.toBeNull();
    expect(container.querySelector(".bg-gradient-to-br")).toBeNull();
    expect(renderHtmlFrame).toHaveBeenCalledWith(
      expect.objectContaining({
        html: "<div>capa animada</div>",
        title: "Capa da comunidade",
        innerPadding: false,
        autoHeight: false,
        clip: true,
      }),
    );
  });

  it("a capa em HTML vence a foto, igual ao detalhe da comunidade", () => {
    card({ bannerHtml: "<div>capa</div>", cover: "https://cdn.exemplo/foto.jpg" }, () => (
      <div data-testid="quadro" />
    ));

    expect(container.querySelector("[data-testid=quadro]")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("sem capa em HTML, a foto segue como antes", () => {
    card({ cover: "https://cdn.exemplo/foto.jpg" });

    const foto = container.querySelector("img");
    expect(foto).not.toBeNull();
    expect(foto?.getAttribute("src")).toBe("https://cdn.exemplo/foto.jpg");
  });

  it("capa em HTML sem renderizador cai para o gradiente em vez de capa em branco", () => {
    card({ bannerHtml: "<div>capa</div>" });

    expect(container.querySelector(".bg-gradient-to-br")).not.toBeNull();
  });
});
