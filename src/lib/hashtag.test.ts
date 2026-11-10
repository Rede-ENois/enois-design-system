import { describe, expect, it } from "vitest";

import { toHashtag } from "./hashtag.js";

describe("toHashtag", () => {
  it("keeps a single word as it is", () => {
    expect(toHashtag("Tecnologia")).toBe("#Tecnologia");
  });

  it("glues the words and capitalizes each one", () => {
    expect(toHashtag("Carreira e mercado")).toBe("#CarreiraEMercado");
  });

  it("keeps accents and drops punctuation", () => {
    expect(toHashtag("Dúvidas / ajuda!")).toBe("#DúvidasAjuda");
  });

  it("keeps the case the label came in", () => {
    expect(toHashtag("CONTRASTE")).toBe("#CONTRASTE");
    expect(toHashtag("contraste")).toBe("#contraste");
  });

  it("is stable when the result goes through it again", () => {
    const tag = toHashtag("Carreira e mercado");

    expect(toHashtag(tag)).toBe(tag);
  });

  it("returns nothing for a blank label", () => {
    expect(toHashtag("   ")).toBe("");
  });
});
