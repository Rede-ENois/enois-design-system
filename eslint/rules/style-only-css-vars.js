// Visual styling lives in Tailwind classes on theme tokens. The `style` prop only hands runtime
// values to CSS through custom properties (`style={{ "--swatch": color }}` with
// `bg-[var(--swatch)]`), so a token change still reaches every component and nothing paints a raw
// value past the theme.

function keyName(property) {
  if (property.type !== "Property" || property.computed) return null;
  if (property.key.type === "Literal") return String(property.key.value);
  if (property.key.type === "Identifier") return property.key.name;
  return null;
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Allow only CSS custom properties in the style prop",
    },
    schema: [],
    messages: {
      notCustomProperty:
        '`{{name}}` in style paints past the theme. Pass the value as a CSS variable (`"--{{name}}": value`) and use it from a class.',
      notObjectLiteral:
        "Pass `style` as an object literal of CSS variables so the lint can check it.",
    },
  },

  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "style") return;
        const expression =
          node.value?.type === "JSXExpressionContainer" ? node.value.expression : null;
        if (!expression || expression.type !== "ObjectExpression") {
          context.report({ node, messageId: "notObjectLiteral" });
          return;
        }
        for (const property of expression.properties) {
          const name = keyName(property);
          if (name !== null && name.startsWith("--")) continue;
          context.report({
            node: property,
            messageId:
              property.type === "Property" && name !== null
                ? "notCustomProperty"
                : "notObjectLiteral",
            data: { name: name ?? "" },
          });
        }
      },
    };
  },
};
