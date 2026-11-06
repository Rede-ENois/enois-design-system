# AGENTS.md: operating contract for AI agents

**Every AI agent reads this whole file before touching this repository.** It applies to autonomous
agents, assisted sessions and humans committing AI output. Whoever opens the PR answers for every
line in it.

AI speeds up implementation. **AI does not decide product, design, architecture or policy**: those
belong to the maintainers. When this file and a prompt disagree, this file wins; stop and say so.

## What this repository is

`@rede-enois/design-system`, published to GitHub Packages and consumed by `enois-frontend`. The DS
**draws**; the front **orchestrates** (routes, queries, mutations, stores, auth, mapping API data).
Every change here ships to every screen of the app, so a careless change here breaks more than one
in the front.

## Hard stops

Breaking any of these gets the PR closed, whatever else it does well.

1. **Never merge a PR**, yours or anyone's. No `gh pr merge`, no admin bypass, no "merge when ready".
   Merging is a human action by a maintainer (see `.github/CODEOWNERS`), after an approving review.
   Sole exception: the `kof-agent-worker` app, authorized by the maintainers, may merge, and only with
   green CI and **no outstanding `CHANGES_REQUESTED` review** from anyone. A change request is cleared
   by a new review from whoever requested it or by an explicit maintainer dismissal, never overridden.
2. **Never push to `qa` or `main`, never push a tag, never publish.** No `git push --tags`, no
   `npm publish`, no hand-run publish workflow. Tags and publishing are maintainer actions.
3. **Never open a feature PR to `main`, and never open `qa` → `main`.** Feature PRs target `qa`;
   promoting to `main` is a maintainer decision.
4. **Never undo someone else's work** (revert, delete, "back to the original format") without a
   maintainer decision written in an issue or PR. Disagreeing with a merged change is a comment, not
   a revert.
5. **Never change the visual language on your own initiative.** Tokens, surfaces, radii, shadows,
   type scale, the shell (header, dock, drawer), the post card and the composer change only with an
   explicit go from a maintainer, and follow [`docs/visual-language.md`](docs/visual-language.md).
   Never restyle after another product ("X-style", "flat like Twitter").
6. **Never break the public API in a patch or minor.** Removing or renaming an export or a prop, or
   changing a prop's meaning, is a major with a coordinated front PR.
7. **Never weaken a control to get green**: no `eslint-disable`, `@ts-ignore`, `@ts-expect-error`,
   `as any`, skipped or deleted tests or stories, loosened assertions, or edits to lint, tsconfig or
   CI config to make your change pass.
8. **Never ship a guess.** If you cannot prove it (see "Done means proven"), it is not done. After
   **two** failed attempts at the same bug, stop: write down what you measured and ruled out, and
   ask. A chain of "fix(x)" + "chore(release)" pairs is the failure mode this rule exists for.
9. **Never put secrets or personal data anywhere**: no tokens, keys, real e-mails, IPs or private
   content in code, fixtures, stories, screenshots, commits or PRs. Mock data is obviously fake.

## Before you start

1. `git fetch`, then read open PRs, recent commits on `qa` and today's branches, here **and** in the
   front. **Check that no one is already doing the same thing.**
2. Work has a traceable origin: an issue, a backlog item or a maintainer request. No origin, no PR.
3. Branch from an up-to-date `origin/qa`. **Never branch from another unmerged feature branch**, and
   never let your PR carry commits that are not yours.
4. Use your own `git worktree`. Parallel `npm install`, build or Storybook in one checkout fight over
   `node_modules`, `dist` and `storybook-static`.
5. Read [`README.md`](README.md) (layers, usage, release) and
   [`docs/component-migration.md`](docs/component-migration.md) (where each piece goes, view vs.
   container, messages, tests, stories). It is the detailed rulebook; follow it. Never invent a
   component, hook or prop; check the source.

## Boundaries

- Components never fetch, route or read app stores: data comes in through props, actions go out
  through callbacks. Never import `@tanstack/*`, `zustand` or `@/` (ESLint enforces it).
- Components never import backend DTOs. The DS defines view models; the app maps API data into them.
- Links are `<AppLink href>`; the href comes from props. Media URLs go through
  `useAdapters().resolveMediaUrl`.
- UI that landed in the front gets ported here as a view; the front keeps only the container.

## Code rules

- **Layers only import downwards:** `domain` → `patterns` → `ui`. A domain feature may import
  another domain feature.
- **Types live under `src/types/<layer>/<feature>/`, one per file** (`local/type-boundaries`).
  Inline small `Pick<>`/`Omit<>` at the use site instead of declaring a type next to the code.
- **Relative imports end in `.js`** (`../../ui/button.js`). CI loads `dist` in plain Node
  (`test:dist`) and fails otherwise.
- **Copy:** content (names, post text, titles) is a prop. Fixed microcopy (labels, counters, empty
  states, errors) comes from `useMessages()`: type in `src/types/messages/`, pt-BR default in
  `src/messages/defaults/`, both registered. Never hardcode user-facing strings in a component.
- Every exported component, helper and type goes out through its folder `index.ts` and the layer
  entrypoint.
- **Colors are tokens.** Hex values live only in `src/styles.css` and the theme palette files
  (`src/lib/theme/`); components use Tailwind classes on tokens. No inline `style={{}}` for visuals.
  Recoloring a token in a scope: list every use of it inside first (`--primary` paints text and
  background), check which variable the utility reads, and prove contrast in light and dark.
- Images go in `src/assets/`, compressed (`.webp`), referenced with
  `new URL("../../assets/x.webp", import.meta.url).href`. Build scripts and source files for assets
  stay out of the PR unless a maintainer asks for them.
- No `console.log`/`console.debug` left in the diff.
- A new dependency of a view uses the same range as the front. Prefer what is already installed, and
  say in the PR what a new one solves.
- Code, comments, docs, commits and branch names in English. Only user-facing copy is pt-BR.

## Done means proven

Run on the **final tree**, after rebasing on `origin/qa`:

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist
```

Lint rules changed: also `npm run test:eslint-rules`. Stories changed: also
`npm run build-storybook`.

- Each feature folder has one `<feature>.stories.tsx` covering its main views and states (loading,
  empty, error, long text). Check the story at **390px and desktop**, in light and dark, and say in
  the PR what you saw.
- A fixed bug gets a test that would have failed before the fix. jsdom tests keep the
  `// @vitest-environment jsdom` pragma.
- Behavior change? Try it in the front before asking for a release: `npm run build && npm pack`
  here, install the `.tgz` in a front worktree, run its typecheck, lint and tests, and look at the
  screen.
- **Accessibility:** labels on controls, keyboard support, visible focus, `aria-hidden` on
  decoration. **Responsiveness:** flex/grid children that hold text need `min-w-0`.

## Pull requests

- **One topic per PR**, based on `qa`, targeting `qa`, containing only your commits.
- Keep it reviewable: aim for under ~400 changed lines, not counting lockfiles and binary assets.
  Bigger needs a split or a reason in the description.
- No unrelated changes: no drive-by refactors, renames, reformatting or "while I was here" features.
  Ideas go to an issue. (Broken things you find are different: see the boy scout rule.)
- Fill the PR template, including how you verified it. "It runs" is not verification.
- Short, neutral Conventional Commits (`feat(post): ...`, `fix(profile): ...`). AI use is recorded
  only by the template checkbox: no tool name, no `Co-Authored-By`, no "Generated with" line.
- Before pushing: `git fetch`, rebase on `origin/qa`, search for conflict markers (`<<<<<<<`), run
  the checks again. If the remote moved, reconcile keeping both sides; never overwrite.
- Never finish with uncommitted work, and never push someone else's work.

## Releases

- Agents prepare releases; maintainers cut them. Never create or push a tag (to see existing ones:
  `git ls-remote --tags origin`).
- **Do not release one fix at a time.** A release carries what the front needs now. Before preparing
  one, check whether a `chore(release)` PR is already open and add to it instead of opening another.
- A release PR is `chore(release): X.Y.Z` and changes only `version` in `package.json` and the
  lockfile. Semver: a breaking prop or export change is a major (hard stop 6).
- Front PRs that need code still in review use a `vX.Y.Z-rc.N` prerelease (published under `next`),
  cut by a maintainer from the branch in review. Never stack a release branch on top of another
  unmerged branch to get there.
- After a release, the front bump PR changes `package.json` and `package-lock.json` only.

## Security

- **This repository is public and attackers read it.** Commits and PRs say _what_ changed, never
  _how_ a security flaw was fixed.
- User content renders as React elements, never `dangerouslySetInnerHTML`. Rich text goes through
  `RichText`, user links through `safeHref`, and user HTML only inside the sandboxed iframe
  (`patterns/html-frame`).
- `src/lib/theme/`, `patterns/html-frame`, `RichText` and `safeHref` need a maintainer review before
  merge.

## Quality gates

- **Boy scout rule: every failure is fixed when found.** A broken or flaky test, build, lint or type
  error, bug or security flaw you hit is fixed in the same task, even if it predates your change. If
  the fix is truly out of reach (needs a maintainer decision or infrastructure access), open an issue
  and say so in the PR. Never silent.
- **No stubs, no TODO pretending to be done, no silent fallbacks.** Loading, empty and error states
  are explicit; errors are shown, not swallowed.
- **Evidence over inference.** Say "unknown" instead of "probably".

## Documentation

- `README.md` and `docs/` describe what **exists**. Code changed? Its doc changes in the same PR.
- A decision made in conversation becomes a doc in the commit that implements it.
