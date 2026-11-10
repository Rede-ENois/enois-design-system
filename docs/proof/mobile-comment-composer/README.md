# Mobile comment composer

Origin: the reviews of frontend PR [#652](https://github.com/Rede-ENois/enois-frontend/pull/652).
The layout now belongs to the DS `PostComments` view, with one submit control.
The application supplies only the writing field and data/action callbacks.
There is no frontend selector matching the DS form IDs, wrappers or buttons.

## Reproduce

Build Storybook with `npm run build-storybook`, then run:

```sh
node docs/proof/mobile-comment-composer/verify.mjs
```

Playwright must be available to the script. `PLAYWRIGHT_MODULE` can identify an
existing installation, and `BROWSER_EXECUTABLE` an installed Chromium executable.
No new runtime dependency is required. The script serves the static Storybook on
an ephemeral loopback port and closes the server/browser when finished. Its test
server answers the otherwise absent favicon with HTTP 204. It does not start
the application or contact a backend. Optional `MEASUREMENTS_PATH` records the
complete measurements outside the repository; PNGs are written in this folder.

The story renders the actual DS `PostComments` and `MentionTextarea`. Local
callbacks simulate a 1.5-second submission, attachments and replies. The GIF
check verifies its callback and closing the tools, not the application-owned GIF
search dialog. Audio uses Chromium's fake microphone input with the actual
MediaRecorder API; it does not access a physical microphone.

## Measured layout

Viewport height: 1000px. Browser: Microsoft Edge 156.0.4314.58 (Chromium).
All measurements are CSS pixels.

| Viewport | Field width | Closed submit width | Open submit width | Submit height | Recording tool rows | Page overflow |
| -------- | ----------- | ------------------- | ----------------- | ------------- | ------------------- | ------------- |
| 320      | 272         | 80.02               | 36                | 36            | 2                   | No            |
| 390      | 342         | 80.02               | 36                | 36            | 1                   | No            |
| 412      | 364         | 80.02               | 36                | 36            | 1                   | No            |
| 640      | 492         | 36                  | 36                | 36            | 1                   | No            |
| 1280     | 492         | 36                  | 36                | 36            | 1                   | No            |

Thirty state/viewport combinations passed: empty, text, open tools, pending
submission, media without text and recording at 0:12. Every form has exactly one
submit, and the toggle/submit targets remain at least 36px in both dimensions.
In the ordinary mobile open state, Photo/Audio/GIF share a row. In recording at
320px, the longer label wraps the tools to two rows; bounds checks prove that
GIF and the other controls remain inside the clipping container.

Interaction checks also passed: submit disabled when empty; enabled by text or
media; blocked during sending; one completion after a duplicate click; removal
of media disables an otherwise empty composer; GIF invokes its callback; reply
moves the same form and focuses the writing field; recording produces an audio
attachment. No browser errors or warnings were recorded.

## Inspected screenshots

| Width | Closed                    | Open tools              | Recording                       |
| ----- | ------------------------- | ----------------------- | ------------------------------- |
| 320   | [Closed](320-closed.png)  | [Tools](320-tools.png)  | [Recording](320-recording.png)  |
| 390   | [Closed](390-closed.png)  | [Tools](390-tools.png)  | [Recording](390-recording.png)  |
| 1280  | [Closed](1280-closed.png) | [Tools](1280-tools.png) | [Recording](1280-recording.png) |

Additional 390px states: [sending](390-sending.png), [media without text](390-media-only.png).
These are isolated DS stories, not an authenticated application/backend session.
They do not claim physical-device microphone, native keyboard or Safari testing.

## Original integration checks (before the qa sync)

- DS: lint, typecheck, 146 test files / 1,195 tests, package build, all four
  `test:dist` entrypoints and production Storybook build passed.
- Frontend with the local packed DS: typecheck, lint (three existing Fast Refresh
  warnings), production build, ESLint rule tests and 192 test files / 1,016 tests
  passed. Its eight comment tests include media-only submission and duplicate
  submission prevention.
- The frontend checks ran in an isolated LF checkout to avoid unrelated Windows
  CRLF formatting differences. Existing jsdom/React warnings are present in the
  unit suites; this does not claim warning-free unit test output.
- The package remains local. No dependency pin, release, commit or PR update was
  made as part of this verification.

## QA sync, 2026-11-07

The in-progress merge includes upstream `qa` at `3f7a756`. Both conflicting
files were reconciled: the DS still owns the responsive layout and single submit,
and composer errors from #138 remain next to the field without replacing the
loaded thread. The error occupies grid row 2, spanning the mobile field width
and aligning with column 2 on desktop. Only when an error exists do the mobile
footer and tools move to row 3; the ordinary layout keeps its original spacing.

The new parameterized regression checks send errors with the tools open and
closed. It fails against the pre-merge component and passes on the final tree.
The existing QA tests for preserving loaded comments and replacing the list only
on a load failure are retained.

Final DS checks: lint (zero errors, five existing hook warnings), typecheck,
153 test files / 1,292 tests, package build, all four distribution entrypoints,
ESLint rule tests and production Storybook build passed. The frontend integration
results above are historical; a fresh frontend integration suite was not run.
The current frontend QA already supplies a field-only `composerField`, so this
DS layout does not depend on frontend #652. That PR concerns media-only sending;
release the DS through the normal maintainer process before a consumer bump.

Browser verification also passed: the original 30 state/viewport combinations,
plus eight send-error combinations at 390px and 1280px, light/dark, tools
open/closed. Error and field left edges match within 1px; the gap is at most
7px. On mobile both footer controls remain below the error. Screenshots inspected
at both widths and in both themes show the error directly under the field.
Examples: [mobile, dark, open](390-error-dark-open.png),
[mobile, light, closed](390-error-light-closed.png),
[desktop, light, closed](1280-error-light-closed.png), and
[desktop, dark, open](1280-error-dark-open.png).
