// Fixed microcopy comes from useMessages() and content comes from props, so the app can translate
// and reword every label without a design system release. Words written straight into JSX skip
// both. Stories and tests are exempt (see eslint.config.js).

// Attributes people read or hear.
const READABLE_ATTRIBUTES = new Set([
  "alt",
  "aria-description",
  "aria-label",
  "aria-roledescription",
  "aria-valuetext",
  "label",
  "placeholder",
  "title",
]);

const LETTER = /\p{L}/u;

function attributeText(value) {
  if (!value) return null;
  if (value.type === "Literal" && typeof value.value === "string") return value.value;
  if (value.type !== "JSXExpressionContainer") return null;
  const { expression } = value;
  if (expression.type === "Literal" && typeof expression.value === "string")
    return expression.value;
  if (expression.type === "TemplateLiteral" && expression.expressions.length === 0) {
    return expression.quasis[0].value.cooked;
  }
  return null;
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Keep user-facing words out of JSX: microcopy comes from useMessages(), content from props",
    },
    schema: [],
    messages: {
      literalText:
        "User-facing text in JSX. Fixed microcopy goes through useMessages() (src/types/messages + src/messages/defaults); content is a prop.",
    },
  },

  create(context) {
    return {
      JSXText(node) {
        if (LETTER.test(node.value)) context.report({ node, messageId: "literalText" });
      },

      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || !READABLE_ATTRIBUTES.has(node.name.name)) return;
        const text = attributeText(node.value);
        if (text !== null && LETTER.test(text)) context.report({ node, messageId: "literalText" });
      },
    };
  },
};
