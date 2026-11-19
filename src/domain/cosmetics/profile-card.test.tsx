// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProfileCard } from "./profile-card.js";
import { ProfileMiniCard } from "./profile-mini-card.js";

const plain = { name: "Ana Souza", username: "ana", pronouns: "ela/dela", bio: "Front-end." };

const dressed = {
  ...plain,
  avatarFrame: "moldura-asas-morcego",
  nameStyle: { theme: "nome-assombrado" as const },
  badges: ["emblema-morcego", "https://cdn.test/b.png"],
  bannerItem: "banner-halloween",
  cardTheme: "tema-halloween",
  profileEffect: "efeito-morcegos",
  statusText: "Deploy na sexta 13",
  statusIcon: "morcego",
};

describe("ProfileCard", () => {
  it("works with no cosmetics, on the design system tokens", () => {
    const html = renderToStaticMarkup(<ProfileCard profile={plain} />);

    expect(html).toContain('aria-label="Perfil de Ana Souza"');
    expect(html).toContain("Ana Souza");
    expect(html).toContain("@ana · ela/dela");
    expect(html).toContain("Front-end.");
    expect(html).not.toContain("--p-top");
    expect(html).not.toContain("cos-card--themed");
    expect(html).not.toContain("cos-card__status");
    expect(html).not.toContain("cos-card__ambient");
    expect(html).not.toContain("cos-card__badges");
  });

  it("wears every cosmetic: theme, banner, frame, name, badges, status and effect", () => {
    const html = renderToStaticMarkup(<ProfileCard profile={dressed} />);

    expect(html).toContain("--p-top:#1e1b4b");
    // The app content in the slots repaints on the theme colors, not the page ones.
    expect(html).toContain("cos-card--themed");
    expect(html).toContain("--primary-text:color-mix(in srgb, #f97316 30%, #fff)");
    expect(html).toContain("--p-accent:#f97316");
    expect(html).toContain('viewBox="0 0 300 100"');
    expect(html).toContain('data-avatar-frame="moldura-asas-morcego"');
    expect(html).toContain("Creepster");
    expect(html).toContain("Deploy na sexta 13");
    expect(html).toContain('src="https://cdn.test/b.png"');
    expect(html.match(/cos-anim cos-blink/g)?.length).toBe(16);
    expect(html).toContain("cos-fx-layer");
  });

  it("with onAvatarClick the avatar becomes a real, labelled button; without it it stays as is", () => {
    const html = renderToStaticMarkup(
      <ProfileCard profile={plain} onAvatarClick={() => undefined} />,
    );

    expect(html).toContain("<button");
    expect(html).toContain('aria-label="Trocar foto do perfil"');
    expect(html).toContain("cos-card__avatar--action");
    // A fixture não tem foto: o avatar clicável continua caindo nas iniciais.
    expect(html).toContain(">AS</span>");
    const plainHtml = renderToStaticMarkup(<ProfileCard profile={plain} />);
    expect(plainHtml).not.toContain("<button");
    expect(plainHtml).toContain(">AS</span>");
  });

  it("shows the uploaded photo or the custom banner, and the official banner over both", () => {
    const photo = renderToStaticMarkup(
      <ProfileCard profile={{ ...plain, banner: "https://cdn.test/capa.jpg" }} />,
    );
    expect(photo).toContain('src="https://cdn.test/capa.jpg"');

    const slot = renderToStaticMarkup(
      <ProfileCard
        profile={{ ...plain, banner: "https://cdn.test/capa.jpg" }}
        bannerSlot={<iframe title="banner" />}
      />,
    );
    expect(slot).toContain("<iframe");
    expect(slot).not.toContain("capa.jpg");

    const official = renderToStaticMarkup(
      <ProfileCard
        profile={{ ...plain, bannerItem: "banner-pipas" }}
        bannerSlot={<iframe title="banner" />}
      />,
    );
    expect(official).not.toContain("<iframe");
    expect(official).toContain('viewBox="0 0 300 100"');
  });

  it("ignores cosmetics this client does not know", () => {
    const html = renderToStaticMarkup(
      <ProfileCard
        profile={{ ...plain, cardTheme: "tema-futuro", profileEffect: "efeito-futuro" }}
      />,
    );

    expect(html).not.toContain("--p-top");
    expect(html).not.toContain("cos-card__ambient");
  });
});

describe("ProfileMiniCard", () => {
  it("is compact, without ambient or effect, and links to the profile", () => {
    const html = renderToStaticMarkup(<ProfileMiniCard profile={dressed} href="/perfil/ana" />);

    expect(html).toContain("cos-card--compact");
    expect(html).toContain('href="/perfil/ana"');
    expect(html).toContain("Ver perfil");
    expect(html).not.toContain("cos-card__ambient");
    expect(html).not.toContain("cos-fx-layer");
  });
});
