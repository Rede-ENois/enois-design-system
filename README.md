# Énois Design System

Tokens and React components of Énois, published as `@rede-enois/design-system` on GitHub Packages. `enois-frontend` consumes this package and only orchestrates data, routes and product copy.

## Layers

Each layer has its own entrypoint and may only import from the layers below it.

| Entrypoint                             | Contents                                           | Status  |
| -------------------------------------- | -------------------------------------------------- | ------- |
| `@rede-enois/design-system/styles.css` | Theme, palettes, base resets and component CSS     | shipped |
| `@rede-enois/design-system/ui`         | Primitives (button, dialog, input, toast...)       | shipped |
| `@rede-enois/design-system/patterns`   | Generic compositions (layouts, infinite scroll...) | shipped |
| `@rede-enois/design-system/domain`     | Énois views (post card, notifications, games...)   | shipped |
| `@rede-enois/design-system`            | `EnoisProvider`, `useMessages`, messages types     | shipped |

Rules:

- Components never import backend DTOs. The design system defines view models; the app maps API data into them.
- Components never fetch, route or read app stores. Data comes in through props, actions go out through callbacks.
- Content (titles, post text, names) is always a prop. Fixed component microcopy (accessible labels, counters, empty states) comes from `useMessages()` with pt-BR defaults.

## Using it in an app

`.npmrc` (GitHub Packages needs a token with `read:packages`, even for public packages):

```
@rede-enois:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @rede-enois/design-system
```

`react`, `react-dom`, `lucide-react` and `tailwindcss` are peer dependencies: the app provides them, so the
app and the design system share one copy (two `lucide-react` copies would ship two icon sets).

App stylesheet:

```css
@import "tailwindcss";
@import "@rede-enois/design-system/styles.css";
```

App root (the provider is optional; without it the pt-BR defaults apply):

```tsx
import { EnoisProvider } from "@rede-enois/design-system";
import { Button, ToastProvider } from "@rede-enois/design-system/ui";

<EnoisProvider messages={{ passwordInput: { show: "Show password" } }}>
  <ToastProvider>
    <App />
  </ToastProvider>
</EnoisProvider>;
```

### Input counter

`Input` shows a character counter by default when `maxLength` is set. Use
`showCounter={false}` to hide the counter while keeping the native length limit, for example
for a verification code:

```tsx
<Input maxLength={6} showCounter={false} inputMode="numeric" autoComplete="one-time-code" />
```

### Character counters

`MentionTextarea` shows its character counter when `maxLength` is set. Forms that render the same
`CharCounter` in their own footer can pass `showCounter={false}` while keeping the textarea limit.

## Project stack chips

`ProjectsManager` keeps confirmed technologies in the project's `stack` array and uses the text
field only as a draft. Comma, Enter and blur commit trimmed values and clear the field; pasted
comma-separated lists are supported. Chips wrap above the field and can be removed individually
with their labelled buttons. Duplicate values are compared without case or surrounding whitespace
and show an inline error. Saving also commits any remaining draft, including when activated without
a blur. Editing other fields preserves the stack and selected structured/HTML mode.

Chip colors, focus rings and errors use the existing theme tokens. The `Domain/Profile` →
`StackChips` story demonstrates editing and saving, including wrapping at mobile widths. This
behavior addresses [enois-frontend#360](https://github.com/Rede-ENois/enois-frontend/issues/360).

## Migrating components from the front

See [docs/component-migration.md](docs/component-migration.md).

## Development

```bash
npm install
npm run storybook        # http://localhost:6006
npm test
npm run lint
npm run typecheck
npm run build            # tsc to dist/, one module per component
```

## Releasing

1. Bump `version` in `package.json` (semver: breaking prop changes are a major).
2. Merge to `main`.
3. Push a tag `vX.Y.Z` matching that version. CI publishes it to GitHub Packages.

## License

GPL-3.0, same as `enois-frontend`.
