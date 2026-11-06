## What changes

<!-- 2 to 5 lines: the problem and what the change does -->

Closes #<!-- issue of origin: every PR has one -->

## How it was verified

<!-- Proof, not promise: commands run, how many tests passed, what you checked by hand -->

- `npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist` → <!-- green/red -->
- story checked at <!-- 390px and desktop, light and dark -->
- front tried with `npm pack` → <!-- what you saw -->

## Consumer impact

<!-- semver: patch/minor/major and why. Breaking a prop or export needs a major bump and a front PR. -->

## Checklist

- [ ] PR targets `qa`
- [ ] One feature per PR — no unrelated refactor or fix riding along
- [ ] An open issue with the implementation plan, referenced above
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:dist` pass
- [ ] Story added or updated for new or changed views, checked in desktop and mobile
- [ ] Test added: fails on the old code, passes on the new one
- [ ] No stub, placeholder, TODO pretending to be done, or silent fallback
- [ ] No weakened assertion, no hidden skip
- [ ] Tokens only: no raw hex, no arbitrary `px`, no `!important` to beat the theme
- [ ] Contrast AA verified numerically in light and dark
- [ ] Accessibility: real button/link, accessible name, visible focus, keyboard
- [ ] User-facing copy lives in the messages defaults, without dashes or emojis
- [ ] Semver respected; consumer impact stated above
- [ ] No secret, token or personal data in the diff
- [ ] No security-fix detail in public text (commit and PR)
- [ ] Self-review done: read the `git diff` line by line and understand every line
- [ ] AI tools helped write this change (check if yes; no tool name or attribution line needed)
