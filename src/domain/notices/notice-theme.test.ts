// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { extractNoticeTheme, readableTextOn } from "./notice-theme.js";

function docDeclaring(declarations: Record<string, string>): Document {
  const doc = document.implementation.createHTMLDocument();
  for (const [property, value] of Object.entries(declarations)) {
    doc.documentElement.style.setProperty(property, value);
  }
  return doc;
}

describe("extractNoticeTheme", () => {
  it("returns nothing without a document", () => {
    expect(extractNoticeTheme(null)).toEqual({});
  });

  it("returns nothing when the HTML declares no theme", () => {
    expect(extractNoticeTheme(document.implementation.createHTMLDocument())).toEqual({});
  });

  it("reads every declared notice property", () => {
    const theme = extractNoticeTheme(
      docDeclaring({
        "--notice-primary": "#7c5cff",
        "--notice-background": "#111015",
        "--notice-surface": "#1a1726",
        "--notice-text": "#e8e6ff",
        "--notice-muted": "#b3b0c9",
        "--notice-border": "#3f3d55",
        "--notice-button-text": "#f4f2ff",
      }),
    );

    expect(theme).toEqual({
      primary: "#7c5cff",
      background: "#111015",
      surface: "#1a1726",
      text: "#e8e6ff",
      muted: "#b3b0c9",
      border: "#3f3d55",
      buttonText: "#f4f2ff",
    });
  });

  it("leaves out unset and blank properties so consumers keep their fallbacks", () => {
    const theme = extractNoticeTheme(
      docDeclaring({ "--notice-primary": "  ", "--notice-muted": "rgb(20, 20, 30)" }),
    );

    expect(theme).toEqual({ muted: "rgb(20, 20, 30)" });
    expect(theme.background).toBeUndefined();
  });
});

describe("readableTextOn", () => {
  it("picks the near-black text on a light primary", () => {
    expect(readableTextOn("#f4f2ff")).toBe("#111015");
  });

  it("picks the near-white text on a dark primary", () => {
    expect(readableTextOn("#111015")).toBe("#f4f2ff");
  });

  it("parses the rgb() form the browser hands over", () => {
    expect(readableTextOn("rgb(20, 20, 30)")).toBe("#f4f2ff");
  });

  it("gives up on formats it does not parse so the token color stays", () => {
    expect(readableTextOn("rebeccapurple")).toBeNull();
    expect(readableTextOn(undefined)).toBeNull();
  });
});
