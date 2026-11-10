import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MentionTextarea } from "../domain/post/editor/mention-textarea.js";

import { Input } from "./input.js";
import { Textarea } from "./textarea.js";

const components = [
  Input,
  Textarea,
  (props: { className: string }) => (
    <MentionTextarea
      {...props}
      value=""
      onChange={() => undefined}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />
  ),
];

describe("text field typography", () => {
  for (const Component of components) {
    it.each(["xs", "sm"])(
      `keeps compact %s text on desktop and readable text on mobile (${Component.name})`,
      (size) => {
        const html = renderToStaticMarkup(
          <Component className={`h-9 text-${size} text-primary leading-6`} />,
        );
        const classes = html.match(/<(?:input|textarea)[^>]*class="([^"]*)"/)?.[1].split(" ");

        expect(classes).toContain("text-base");
        expect(classes).toContain(`md:text-${size}`);
        expect(classes).toContain("text-primary");
        expect(classes).toContain("leading-6");
        expect(classes).not.toContain(`text-${size}`);
      },
    );

    it.each(["text-lg", "text-base", "text-[15px]"])(
      `preserves an explicit %s size on mobile and desktop (${Component.name})`,
      (size) => {
        const html = renderToStaticMarkup(<Component className={size} />);
        const classes = html.match(/<(?:input|textarea)[^>]*class="([^"]*)"/)?.[1].split(" ");
        expect(classes).toContain(size);
        expect(classes).toContain(`md:${size}`);
        expect(classes).not.toContain("md:text-sm");
      },
    );

    it.each(["text-lg md:text-xl", "md:text-xl text-lg"])(
      `keeps the explicit desktop override in %s (${Component.name})`,
      (className) => {
        const html = renderToStaticMarkup(<Component className={className} />);
        const classes = html.match(/<(?:input|textarea)[^>]*class="([^"]*)"/)?.[1].split(" ");
        expect(classes).toContain("text-lg");
        expect(classes).toContain("md:text-xl");
        expect(classes).not.toContain("md:text-lg");
        expect(classes).not.toContain("md:text-sm");
      },
    );
  }

  it("retains the requested compact desktop size", () => {
    const html = renderToStaticMarkup(<Input className="text-xs" />);
    expect(html).toContain("md:text-xs");
    expect(html).not.toContain("md:text-sm");
  });

  it("preserves responsive overrides regardless of their token order", () => {
    const html = renderToStaticMarkup(<Input className="md:text-lg text-xs" />);
    expect(html).toContain("md:text-lg");
    expect(html).not.toContain("md:text-xs");
  });

  it.each(["checkbox", "radio", "range", "color", "file", "hidden", "button", "submit", "reset"])(
    "does not normalize non-text %s inputs",
    (type) => {
      const html = renderToStaticMarkup(<Input type={type} className="text-xs" />);
      expect(html.match(/<input[^>]*class="([^"]*)"/)?.[1].split(" ")).toContain("text-xs");
    },
  );
});
