# CLAUDE.md

@AGENTS.md

`AGENTS.md` (imported above) is the operating contract for every AI agent in this repository. All of
it applies. The rules below are repeated because they are the ones agents break most here:

- **You never merge, never push to `qa`/`main`, never tag, never publish.** Open a PR to `qa` and
  stop. `.claude/settings.json` blocks these commands; do not look for a way around it.
- **You never revert or redo someone else's work, and never change the visual language, without a
  maintainer's written go.** If the task seems to need it, stop and ask.
- **One release carries many changes.** Never open a `chore(release)` PR per fix; add to the open
  one.
- **The DS draws, the front orchestrates.** No fetching, routing or stores here; data in through
  props, actions out through callbacks, copy through `useMessages()`.
- **Two failed attempts at the same bug: stop and report** what you measured and ruled out.
- **Done means proven:**
  `npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist`, plus the
  story at 390px and desktop when the change is visible.
- **Boy scout rule:** every failure you find is fixed in the same task, even if it predates you. If
  it is truly out of reach, open an issue and say so in the PR. Never silent.
