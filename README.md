# Énois Design System

Tokens and React components of Énois, published as `@rede-enois/design-system` on GitHub Packages. `enois-frontend` consumes this package and only orchestrates data, routes and product copy.

## Layers

Each layer has its own entrypoint and may only import from the layers below it.

| Entrypoint                             | Contents                                           | Status  |
| -------------------------------------- | -------------------------------------------------- | ------- |
| `@rede-enois/design-system/styles.css` | Theme, palettes, base resets and component CSS     | shipped |
| `@rede-enois/design-system/ui`         | Primitives (button, dialog, input, toast...)       | shipped |
| `@rede-enois/design-system/patterns`   | Generic compositions (layouts, infinite scroll...) | planned |
| `@rede-enois/design-system/domain`     | Énois views (post card, notifications, games...)   | planned |
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
