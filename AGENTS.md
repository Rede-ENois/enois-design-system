# AGENTS.md: operating contract for AI agents

Adapted from the `enois-frontend` contract for the design system. **Every AI agent reads this file
before working here.** The rules apply to autonomous agents, assisted sessions and human
contributions made with AI.

## Role and authority

- **AI speeds up implementation; AI does not decide architecture, product or policy.**
- Design, priorities and merges to `main` are the maintainers' decision.
- Delivery flow: **feature → `qa` → `main`**. A PR needs approval from someone who did not push the
  code.
- Every relevant change has a traceable origin (issue, backlog item or maintainer request).
- **Every delivery has proof**: tests run, a story checked, the package tried in the front.
  Done means proven, not intended.

## What this repository is

`@rede-enois/design-system`, published to GitHub Packages and consumed by `enois-frontend`. The DS
**draws**; the front **orchestrates** (routes, queries, mutations, stores, auth, mapping API data).

- New UI is born here as a view; the front only keeps a container that feeds it. UI that lands in the
  front `qa` gets ported here.
- Components never fetch, route or read app stores: data comes in through props, actions go out
  through callbacks. Never import `@tanstack/*`, `zustand` or `@/` (ESLint enforces it).
- Components never import backend DTOs. The DS defines view models; the app maps API data into them.
- Links are `<AppLink href>`; the href comes from props. Media URLs go through
  `useAdapters().resolveMediaUrl`.

## Read the state before working

1. `git fetch` + recent `git log`, open PRs and branches: **check that no one is already doing the
   same thing** (here and in the front).
2. [`README.md`](README.md): layers, usage and release.
3. [`docs/component-migration.md`](docs/component-migration.md): where each piece goes, view vs.
   container, messages, tests and stories. It is the detailed rulebook; follow it.
4. The contract with the front is the public API (entrypoints and prop types). Breaking it needs a
   major bump and a coordinated front PR.

## Code rules

- **Layers only import downwards:** `domain` → `patterns` → `ui`. A domain feature may import
  another domain feature.
- **Types live under `src/types/<layer>/<feature>/`, one per file** (lint rule
  `local/type-boundaries`). Inline small `Pick<>`/`Omit<>` at the use site instead of declaring a type
  next to the code.
- **Relative imports end in `.js`** (`../../ui/button.js`). CI loads `dist` in plain Node
  (`test:dist`) and fails otherwise.
- **Copy:** content (names, post text, titles) is a prop. Fixed microcopy (labels, counters, empty
  states, errors) comes from `useMessages()`: type in `src/types/messages/`, pt-BR default in
  `src/messages/defaults/`, both registered. Never hardcode user-facing strings in a component.
- Every exported component, helper and type goes out through its folder `index.ts` and the layer
  entrypoint.
- Images go in `src/assets/` and are referenced with
  `new URL("../../assets/x.webp", import.meta.url).href`.
- Styles go in `src/styles.css` and Tailwind classes; reuse theme tokens, never hardcoded colors.
  Recoloring a token in a scope: list every use of it inside first (`--primary` paints text and
  background) and prove contrast in light and dark.
- A new dependency of a view uses the same range as the front. Prefer what is already installed.
- Code, comments, docs, commits and branch names in English. Only user-facing copy is pt-BR.

## Work cycle

1. Read the state (above).
2. Implement **one complete scope**: view, types, messages, exports, test and story together.
3. Check, in this order, on the final tree:
   `npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist`.
   Lint rules changed: `npm run test:eslint-rules`. Stories changed: `npm run build-storybook`.
4. Behavior change? Try it in the front before publishing: `npm run build && npm pack` here, then
   install the `.tgz` in the front and run its typecheck, lint and tests.
5. Short, neutral commit message (Conventional Commits: `feat(post): ...`, `fix(profile): ...`).
6. Push your branch and open a PR to `qa`. Never finish with uncommitted work. Fill the PR template;
   AI use is recorded only by its checkbox (no tool name, no Co-Authored-By or "Generated with" line).
7. Before pushing: `git fetch`, reconcile with the remote, look for conflict markers (`<<<<<<<`), run
   the checks again.

## Releases

- Releasing is a maintainer action. Agents prepare, they do not publish.
- Prepare a `chore(release): X.Y.Z` PR that bumps `version` in `package.json` and the lockfile
  (semver: a breaking prop or export change is a major).
- After the merge, a maintainer pushes the tag `vX.Y.Z`; CI publishes. A `vX.Y.Z-rc.N` tag publishes
  under `next`, for front PRs that need code still in review.
- Then open the front PR that bumps the `@rede-enois/design-system` pin.
- Never push tags, edit the publish workflow or publish by hand.

## Security rules (non-negotiable)

- **The repository is public and attackers read it.** Commit messages and PR descriptions are
  neutral: say _what_ changed, **never _how_ a security flaw was fixed**.
- **Secrets never appear in code, logs, commits, PRs or reports.** No tokens, keys or personal data
  (e-mail, IP, phone), not even in test fixtures or stories. Mock data is obviously fake.
- **Never disable a security or quality control to make the build or tests pass.**
- User content renders as React elements, never `dangerouslySetInnerHTML`. Rich text goes through
  `RichText`, user links through `safeHref`, and user HTML only inside the sandboxed iframe
  (`patterns/html-frame`).

## Quality gates

- **Boy scout rule: every failure is fixed when found.** A broken or flaky test, build, lint or type
  error, bug or security flaw you find is fixed in the same task, even if it predates your change.
  If the fix is truly out of reach (needs a maintainer decision, infrastructure access, or is too big
  for the task), record it (issue or backlog item) and say so in the PR. Never leave it silent.
- **Zero regressions.** A fixed bug gets a test that would have failed before the fix.
- **No stubs, no TODO pretending to be done, no weakened assertions, no silent fallbacks.** Loading,
  empty and error states are explicit; errors are shown, not swallowed.
- **Evidence before inference.** Never invent a component, hook or prop; check the source.
- **Accessibility is a requirement:** labels on controls, keyboard support, focus visible,
  `aria-hidden` on decoration.
- **Responsiveness is a requirement:** views work at 390px and desktop. Flex/grid children that
  hold text need `min-w-0`, or they overflow on mobile.
- Each feature folder has one `<feature>.stories.tsx` covering its main views and states. jsdom tests
  keep the `// @vitest-environment jsdom` pragma.

## Multi-agent

- Several agents work on this repository and on the front in parallel. **Never push someone else's
  work** or force someone else's branch, unless the author asked for it.
- Parallel `npm install` or build? Use a separate `git worktree`; processes fight over the same
  `node_modules` and `dist`.
- If a push fails because the remote moved, **reconcile with the current content** (keep both sides),
  never overwrite.

## Documentation

- `README.md` and `docs/` describe what **exists**. Code changed? The doc changes in the same PR.
- A decision made in conversation becomes a doc in the same commit that implements it.
