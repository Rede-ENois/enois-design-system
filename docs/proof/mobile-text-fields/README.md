# Mobile text field typography

Origin: frontend PR [#651](https://github.com/Rede-ENois/enois-frontend/pull/651).
The correction belongs to the DS controls rather than a global application reset.

`Input`, `Textarea` and `MentionTextarea` normalize unprefixed `text-xs` and
`text-sm` to `text-base` on mobile and retain the requested compact desktop size.
Explicit larger sizes and responsive overrides remain intact. Non-text inputs
and unrelated native controls retain their styles. The shared helper does not
attempt to interpret arbitrary CSS or inline styles; new text fields should use
`text-base md:text-sm` or `text-base md:text-xs` directly.

Native text fields in appearance search, Explore, messages, monitoring, user
search and the frame shop have explicit mobile sizes. The frame shop's existing
12px rule has a component-scoped mobile override; there is no new global reset.

## Reproduce

After installing dependencies, run `npm run storybook -- --port 6007 --ci`.
With Playwright available, run `node scripts/verify-mobile-text-fields.mjs`.
`PLAYWRIGHT_MODULE` can identify an existing Playwright module and
`BROWSER_EXECUTABLE` an installed Chromium browser. `PROOF_URL` can point to the
same story in a static Storybook build.

The script fails on incorrect computed sizes, clipped lines in the sample text
controls, horizontal overflow, browser errors or warnings. It writes
[`result.json`](result.json), including browser version, viewport dimensions and
computed sizes. It measures the actual Input, Textarea and MentionTextarea at
390, 412, 767, 768 and 1280px, and the native controls in five existing domain
stories at 390 and 1280px.

- [390px screenshot](390.png)
- [1280px screenshot](1280.png)

Both screenshots were visually inspected. Compact fields show 16px text on
mobile; the larger field remains 18px. Desktop compact fields retain 12px/14px.
The negative-control native input/select retain 12px/14px on mobile. The
non-text checkbox retains its existing 12px mobile and 14px desktop typography.
No console errors or warnings were recorded. Storybook now supplies an empty
favicon, and its Explore example uses distinct destinations to avoid duplicate
React keys.

## Regression and integration

The 20-case component regression test passed on the changed tree. Running that
same test against `a1227ee` produced seven expected failures, proving that it
detects the missing mobile typography behavior.

The package was built and packed locally, then unpacked into the frontend's
ignored dependency directory for integration checks. No package was published
and no release tag was pushed. The frontend removes the original global rule
and consumes DS primitives for its remaining poll/channel native fields.

Desktop Chromium checks CSS, focus scale and layout. It does not reproduce the
native iOS keyboard's automatic zoom or a manual pinch gesture. Physical iPhone
verification is still required; these artifacts do not claim it was performed.

## Completed checks

- DS lint and typecheck: passed.
- DS unit tests: 147 files, 1,214 tests passed.
- Package build and `test:dist`: passed for all four entrypoints.
- Storybook production build: passed, with its existing large-chunk warning.
- Frontend integration: typecheck, build and ESLint rule tests passed; the full
  frontend suite passed 192 files / 1,014 tests using the packed DS.
- Frontend and Storybook browser proofs passed with no console errors/warnings.

The suites emit existing test-environment warnings (React `act` in DS tests and
a RichText key warning in the frontend). They are not browser-proof errors and
are not represented as a warning-free unit test run.
