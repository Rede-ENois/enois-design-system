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

## Work cycle

Read the state, pick the highest-value unclaimed task, implement **one complete scope**, test,
commit, open the PR to `qa`.

- **Never ask when the repository evidence can answer.** Read the code, the test, the log. A question
  is for a product decision, not for a fact that is already in a file.
- **Never end a turn with uncommitted work, and never end a turn with only a summary.**
- Exactly one todo item may be `in_progress`.
- **Done means proven, not intended.**
- Stop and report when the decision needs product or visual language (maintainers only), when a
  collision with another agent's lane is unavoidable, or when it needs access you do not have.

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

## Quality gate (Q0–Q7)

Fix flow: **reproduce → fix the root cause → add the proof test → run the focused tests → run the
suite → hunt edge cases → commit → push.**

- **Q0 — root cause.** A bug is fixed at the cause, not the symptom. The proof test **fails on the old
  code** and passes on the new one. A test that passes before and after proves nothing.
- **Q1 — coverage.** Every feature has a test; every fix has a regression test; test and
  implementation share the commit; a refactor preserves the existing proof.
- **Q2 — green before push.** Lint, typecheck, test, build and `test:dist` green **before** pushing.
- **Q3 — edge cases.** Cover when applicable: empty/null, long text, missing optional prop, error
  state, loading state, 390px viewport, both themes, RTL-safe layout. **The happy path alone is not
  enough.**
- **Q4 — hunt.** Actively look for: extreme content, contract boundary (prop types and entrypoints),
  regression in a neighbouring view, uncovered behaviour.
- **Q5 — honest green.** No false green, no weakened assertion, no hidden `.skip`. Your red is fixed
  or reverted.
- **Q6 — the suite is the floor, not the ceiling.**
- **Q7 — forbidden.** Stub, placeholder, `TODO`/`FIXME` pretending to be done, a component that
  returns `null` to hide a missing state, a swallowed unhandled branch, support faked as
  "not implemented". Unsupported behaviour renders an explicit state, never "maybe it works".

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
  error, bug or security flaw you find is fixed in the same task, even if it predates your change.
  If the fix is truly out of reach (needs a maintainer decision, infrastructure access, or is too big
  for the task), record it (issue or backlog item) and say so in the PR. Never leave it silent.
- **Evidence before inference.** Never invent a component, hook or prop; check the source.
- **Accessibility is a requirement:** labels on controls, keyboard support, focus visible,
  `aria-hidden` on decoration.
- **Responsiveness is a requirement:** views work at 390px and desktop. Flex/grid children that
  hold text need `min-w-0`, or they overflow on mobile.
- **Never claim green without executed proof.** "It should pass" is not a result. An environmental
  failure (broken local `node_modules`, stale `dist`) is not your regression — but it must be stated
  in the PR with the evidence that the same failure exists on a clean `qa` worktree.

## Design contract (what consumers depend on)

The consumers are `enois-frontend` and every product surface built on it. This package is a
**contract**, not a suggestion.

- **Tokens, not magic values.** Colour, spacing, radius, typography and shadow come from theme
  tokens. No raw hex, no arbitrary `px`, no `!important` to beat the theme.
- **Theme is data, not code.** A component never assumes a mode (light/dark) or a fixed palette.
  Every view must hold up in both modes and in every shipped theme.
- **Contrast is a requirement.** Every text/background pair passes WCAG AA in both modes and in the
  shipped themes. A new component ships with numeric contrast verification, not with "looks fine".
- **Accessibility is a requirement:** real button or link elements, accessible name (`aria-label`
  when there is no visible text), visible focus, keyboard navigation, `aria-hidden` on decoration.
- **Don't repaint a token in a scope** without listing every use of it there first (`--primary`
  paints text and background) and proving contrast in light and dark.
- **Semver is the contract.** A removed or renamed export, a changed prop type or a changed default
  is a major bump and a coordinated consumer PR. Never publish a silent breaking change under a
  minor.
- **No inline style to solve layout.** If layout breaks, the problem is the structure (grid/flex,
  `min-w-0`, minimum width), not an emergency `style=`.
- **Every exported view has a story and a test.** A component without a story and a test is not
  done — it is a stub with a type.

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
- A doc that describes behaviour the code does not have is a documentation bug — fix it or remove it.

## Contributing with AI

This project accepts and uses AI-assisted code — under the same rules as always, plus these:

1. **Declare the use.** Check the AI box in the PR template. No tool name and no attribution line
   (Co-Authored-By, "Generated with") in commits or PRs: the checkbox is the record.
2. **Whoever submits answers for the code.** Understand every line before opening the PR. AI output
   pasted without review is the fastest way to introduce a subtle regression.
3. **Proof, not promise.** "It should work" is not verification: run the checks and describe the
   result in the PR.
4. **Zero slop.** No comment narrating the obvious, no mass-generated files, no new dependency
   without justification, no refactor the task did not ask for, no speculative abstraction.
5. **Security comes first.** The rules above apply in full.
6. **Human review before merge remains the rule**, with approval from someone who did not push.

## Final self-check

Before saying you are done, verify every item. **If any is false, the state is `not-ready`.**

- [ ] lint, typecheck, test, build and `test:dist` green on the final tree
- [ ] root cause fixed, not the symptom
- [ ] proof test fails on the old code
- [ ] edge cases covered (empty, loading, error, 390px, both themes)
- [ ] no false green, no weakened assertion, no hidden skip
- [ ] no stub, no placeholder, no TODO pretending to be done
- [ ] no secret, no personal data, no security-fix detail in public text
- [ ] tokens only, contrast AA proven, accessibility checked
- [ ] story and test exist for every new exported view
- [ ] semver respected; consumer impact stated in the PR
- [ ] module documentation updated in the same commit
- [ ] clean tree, no conflict marker, no one else's work
- [ ] remote in sync

`if_any_false: state: not-ready — next: fix-before-delivery`
