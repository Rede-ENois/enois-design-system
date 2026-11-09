# How to contribute

Thanks for the interest. This is `@rede-enois/design-system`, published to GitHub Packages and
consumed by `enois-frontend` and every product surface built on it. The frontend repository is
`enois-frontend`.

Before you start: read [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) and [`AGENTS.md`](AGENTS.md).
A security flaw is **not** an issue — the channel is in [`SECURITY.md`](SECURITY.md).

## What this package is

The design system **draws**; the front **orchestrates**. Views, layout, styling, view models, default
microcopy, tokens and themes live here. Routes, queries, mutations, stores, auth and the mapping of
API data into view models live in the front.

If you are about to write a route-aware, data-fetching component here, you are in the wrong layer. If
you are about to write a panel or modal with its own layout in the front, it belongs here instead.

## Local setup

```bash
npm ci
npm run storybook        # the gallery, on http://localhost:6006
```

## Before opening a pull request

Run on the **final tree**, after rebasing on `origin/qa`:

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist
```

- Lint rules changed: also `npm run test:eslint-rules`
- Stories changed: also `npm run build-storybook`
- Behaviour changed: try it in the front before publishing — `npm run build && npm pack` here, then
  install the `.tgz` in the front and run its typecheck, lint and tests. Say in the PR what you saw.

**Never claim green without executed proof.** "It should pass" is not a result.

## Code rules

- **Layers only import downwards:** `domain` → `patterns` → `ui`. A domain feature may import another
  domain feature.
- **Components never fetch, route or read stores.** Data comes in through props, actions go out
  through callbacks. Never import `@tanstack/*`, `zustand` or `@/` — ESLint enforces it.
- **No backend DTOs.** The design system defines view models; the app maps API data into them.
- **Types live under `src/types/<layer>/<feature>/`, one per file.**
- **Relative imports end in `.js`** (`../../ui/button.js`).
- **Copy:** content is a prop. Fixed microcopy comes from `useMessages()`; never hardcode a
  user-facing string in a component.
- **Tokens, not magic values.** No raw hex, no arbitrary `px`, no `!important` to beat the theme.
- **Every export goes through its folder `index.ts` and the layer entrypoint.**
- **One view per responsibility.** Target ≤500 lines per file; split by responsibility, never by
  numeric suffix.
- **Code, comments, docs, commits and branch names in English.** Only user-facing copy is pt-BR.
- **No comment narrating the obvious.** A comment records a constraint the code cannot show.

## Design contract

This package is a contract, not a suggestion. Consumers depend on it.

- **Theme is data, not code.** A component never assumes a mode (light/dark) or a fixed palette.
- **Contrast is a requirement.** Every text/background pair passes WCAG AA in both modes and in the
  shipped themes. A new component ships with numeric contrast verification, not with "looks fine".
- **Accessibility is a requirement:** real button or link elements, accessible name, visible focus,
  keyboard navigation, `aria-hidden` on decoration.
- **Responsiveness is a requirement.** Views work at 390px and desktop; flex/grid children holding
  text need `min-w-0`.
- **Semver is the contract.** A removed or renamed export, a changed prop type or a changed default
  is a major bump and a coordinated consumer PR. Never publish a silent breaking change under a
  minor.
- **Every exported view has a story and a test.** A component without both is not done.

## Commits and pull requests

- Imperative subject with scope: `feat(post): ...`, `fix(profile): ...`.
- The body says what was wrong and what changes — the diff already shows the how.
- Describe **how you verified**: which test, how many passed, what you checked by hand, which
  viewport and theme.

### Pull request rules

A PR is only reviewed if it satisfies all six points. A PR that does not goes back without review.

1. **One feature per PR.** Bug fix, refactor and feature do not travel together.
2. **A test for every behaviour change.** A new view has a story and a test; a fixed bug has a
   regression test that fails on the old code. Test and implementation in the same commit.
3. **Documentation updated in the same PR.** `README.md` and `docs/` describe what exists.
4. **No comment narrating the obvious.**
5. **Lint, typecheck, test, build and `test:dist` green before pushing.**
6. **An open issue with the implementation plan.** The PR references it. Work with no traceable
   origin does not land.

Plus: the PR declares AI use through the template checkbox, and the merge needs approval from
someone who did not push the code.

## Releases

Releasing is a maintainer action. Agents prepare, they do not publish.

1. Open a `chore(release): X.Y.Z` PR that bumps `version` in `package.json` and the lockfile.
2. After the merge, a maintainer pushes the tag `vX.Y.Z`; CI publishes.
3. Open the front PR that bumps the `@rede-enois/design-system` pin.

A `vX.Y.Z-rc.N` tag publishes under `next`, for front PRs that need code still in review.
Never push tags, edit the publish workflow or publish by hand.

## Contributing with AI

This project accepts and uses AI-assisted code — under the same rules as always, plus these:

1. **Declare the use.** Check the AI box in the PR template. No tool name and no attribution line
   (Co-Authored-By, "Generated with") in commits or PRs: the checkbox is the record.
2. **Whoever submits answers for the code.** Understand every line before opening the PR.
3. **Proof, not promise.** Run the checks and describe the result in the PR.
4. **Zero slop.** No comment narrating the obvious, no mass-generated files, no new dependency
   without justification, no refactor the task did not ask for, no speculative abstraction.
5. **Security comes first.** The rules in [`AGENTS.md`](AGENTS.md) apply in full.
6. **Human review before merge remains the rule**, with approval from someone who did not push.

The full operating contract for agents is in [`AGENTS.md`](AGENTS.md).
