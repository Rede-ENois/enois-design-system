import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";

import noJsxLiteralText from "./no-jsx-literal-text.js";
import styleOnlyCssVars from "./style-only-css-vars.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    ecmaVersion: 2020,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-jsx-literal-text", noJsxLiteralText, {
  valid: [
    { code: "const a = <span>{messages.post.like}</span>;" },
    { code: "const a = <span>{author.name} · {count}</span>;" },
    { code: "const a = <button aria-label={messages.close}><XIcon /></button>;" },
    { code: "const a = <div className='flex gap-2' data-state='open' />;" },
    { code: "const a = <span>{' '}·{' '}</span>;" },
  ],
  invalid: [
    {
      code: "const a = <button>Publicar</button>;",
      errors: [{ messageId: "literalText" }],
    },
    {
      code: "const a = <p>Nenhuma notificação por aqui</p>;",
      errors: [{ messageId: "literalText" }],
    },
    {
      code: "const a = <button aria-label='Fechar'><XIcon /></button>;",
      errors: [{ messageId: "literalText" }],
    },
    {
      code: "const a = <input placeholder={`Buscar`} />;",
      errors: [{ messageId: "literalText" }],
    },
  ],
});

ruleTester.run("style-only-css-vars", styleOnlyCssVars, {
  valid: [
    { code: "const a = <span style={{ '--swatch': color }} className='bg-[var(--swatch)]' />;" },
    { code: 'const a = <span style={{ "--x": 1 }} />;' },
  ],
  invalid: [
    {
      code: "const a = <span style={{ backgroundColor: color }} />;",
      errors: [{ messageId: "notCustomProperty" }],
    },
    {
      code: "const a = <span style={{ '--ok': 1, top: 0 }} />;",
      errors: [{ messageId: "notCustomProperty" }],
    },
    {
      code: "const a = <span style={styles} />;",
      errors: [{ messageId: "notObjectLiteral" }],
    },
    {
      code: "const a = <span style={{ ...base }} />;",
      errors: [{ messageId: "notObjectLiteral" }],
    },
  ],
});
