# Migrating a component from enois-frontend

How every component leaves `enois-frontend/src/components` and lands here. The goal: the design system draws, the front only orchestrates (routes, queries, mutations, stores, auth, mapping API data).

Reference migrations to copy from:

- Pure component moved as is: `src/domain/avatar/`.
- Data-coupled component split into view + container: `src/domain/communities/` and front `src/components/community-card.tsx` / `community-favorite-button.tsx`.

## Where it goes

| Kind                                                                                                        | Folder                  | Entrypoint                           |
| ----------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------ |
| Generic composition reusable by any feature (layouts, shells, infinite scroll, error banner, page skeleton) | `src/patterns/`         | `@rede-enois/design-system/patterns` |
| Énois feature view (post, games, profile, jobs, moderation...)                                              | `src/domain/<feature>/` | `@rede-enois/design-system/domain`   |
| Primitive (button, dialog...)                                                                               | `src/ui/`               | `@rede-enois/design-system/ui`       |

Imports only go down: domain → patterns → ui. A domain feature may import another domain feature (e.g. post uses avatar).

Props and data types live under `src/types/<layer>/<feature>/`, one type per file (lint rule `type-boundaries`). Each folder has an `index.ts` that exports its components, helpers and types; `src/domain/index.ts` and `src/patterns/index.ts` re-export the folders.

Components without UI (effects, hooks, providers wiring app services) stay in the front.

## Pure component (no data access)

1. Copy the file (and its test, prop types and the pure helpers only it uses) into the DS.
2. Rewrite imports: relative, ending in `.js` (`../../ui/button.js`); never `@/`.
3. Replace `texts.*` with `useMessages().<componentName>.*` (see Messages).
4. Replace `resolveCdnUrl(x)` with `useAdapters().resolveMediaUrl(x)` and `<Link to=... params=...>` with `<AppLink href=...>`; the href comes from props.
5. In the front, delete the file and point importers at the package by importing it from the package entrypoint instead.

## Data-coupled component (split)

The DS gets the **view**: everything it renders, fed by props. The front keeps a **container** at the same path with the same export name and props, so routes do not change.

- View props: a view model (`<Thing>Data`) with only the fields the view reads, plus callbacks (`onSave`, `onDelete`), flags (`pending`, `error`) and slots (`ReactNode`) for nested containers.
- Shape view models so the front can pass its records directly when the fields match (structural typing); map only what differs (e.g. `topicLabel`, hrefs).
- Hrefs are data: the container builds `/comunidades/${id}`; the view renders `<AppLink href>`.
- Router hooks (`useNavigate`, `useRouterState`) become callbacks or props.
- `useQuery`, `useMutation`, stores, `useAuth`, `useCurrentUser`, API modules stay in the container.
- `useToast` is a DS hook: views may call it for pure UI feedback; feedback about a mutation result belongs to the container.
- Forms: the view owns input state and client-side validation and calls `onSubmit(values)`; the container runs the mutation and passes `pending`/`error` back.
- The container imports the view aliased: `import { CommunityCard as CommunityCardView } from "@rede-enois/design-system/domain";`.
- When the container would be a pure pass-through (no data, no routing), drop it and import the DS component directly.

## Messages

Fixed copy of a component lives in the DS, keyed by component name in camelCase:

- Type: `src/types/messages/<feature>-messages.ts` exporting `<Feature>Messages`.
- Defaults: `src/messages/defaults/<feature>.ts` exporting `<feature>Messages`.
- Register both in `src/types/messages/messages.ts` (intersection) and `src/messages/default-messages.ts` (spread).

Copy the pt-BR strings verbatim from the front `src/texts.ts` (functions included). Content (names, post text, user input) and page-level copy stay props. Do not delete keys from the front `texts.ts`; it is pruned once at the end.

Copy has no em/en dashes (use a comma, colon, period or parentheses) and no decorative emojis. `src/messages/default-messages.test.ts` enforces it over every default; an emoji that is content (an icon) goes in its explicit key allowlist.

## Helpers and constants

- Pure presentation helpers/constants used only by moved views move with them (`src/domain/<feature>/` or `src/lib/`).
- If the front still uses them too, the DS exports them and the front imports from the package; never keep two copies.
- Catalogs that drive API calls or routing stay in the front; pass the resulting labels/values as props.
- New third-party dependencies of a view: `npm i <pkg>` in the DS with the same range the front uses.

## CSS

All app CSS already lives in `src/styles.css`. Do not edit the front stylesheet.

## Tests and stories

- Tests of moved views move to the DS (`jsdom` is installed; keep any `// @vitest-environment` pragma). Container tests stay in the front; update their mocks to the package (`vi.mock("@rede-enois/design-system/domain", async (importOriginal) => ({ ...(await importOriginal()), X: ... }))`).
- Each feature folder gets one `<feature>.stories.tsx` (`title: "Domain/<Feature>"` or `"Patterns/<Name>"`) showing its main views and states with inline mock data.

## Conventions

- Relative imports end in `.js`; CI loads `dist` in plain Node and fails otherwise.
- Components never import `@tanstack/*`, `zustand` or `@/` (ESLint enforces it).
- Images used by a view: put them in `src/assets/` and reference them with `new URL("../../assets/x.webp", import.meta.url).href`, never `import x from "./x.webp"`.
- New comments in English; comments copied from the front stay as they are.

## Validation

- Try a change in the front before publishing: `npm run build && npm pack` here, then `npm i ../enois-design-system/rede-enois-design-system-<version>.tgz` in the front.
- DS: `npm run typecheck && npm run lint && npm test && npm run build && npm run test:dist`.
- Front: `npm run typecheck && npm run lint && npx vitest run --reporter=dot`, and `npm run build` once per batch.
