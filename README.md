# Énois Design System

Tokens and React components of Énois, published as `@rede-enois/design-system` on GitHub Packages. `enois-frontend` consumes this package and only orchestrates data, routes and product copy.

## Layers

Each layer has its own entrypoint and may only import from the layers below it.

| Entrypoint                             | Contents                                           | Status  |
| -------------------------------------- | -------------------------------------------------- | ------- |
| `@rede-enois/design-system/styles.css` | Theme, palettes, base resets and component CSS     | shipped |
| `@rede-enois/design-system/ui`         | Primitives (button, dialog, input, toast...)       | shipped |
| `@rede-enois/design-system/patterns`   | Generic compositions (layouts, infinite scroll...) | shipped |
| `@rede-enois/design-system/domain`     | Énois views (post card, notifications, games...)   | shipped |
| `@rede-enois/design-system`            | `EnoisProvider`, `useMessages`, messages types     | shipped |

Rules:

- Components never import backend DTOs. The design system defines view models; the app maps API data into them.
- Components never fetch, route or read app stores. Data comes in through props, actions go out through callbacks.
- Content (titles, post text, names) is always a prop. Fixed component microcopy (accessible labels, counters, empty states) comes from `useMessages()` with pt-BR defaults.

See [`docs/visual-language.md`](docs/visual-language.md) for the default look: surfaces, semantic
contours (person, community, event) and the signal vocabulary.

## Using it in an app

`.npmrc` (GitHub Packages needs a token with `read:packages`, even for public packages):

```
@rede-enois:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @rede-enois/design-system
```

`react`, `react-dom`, `lucide-react` and `tailwindcss` are peer dependencies: the app provides them, so the
app and the design system share one copy (two `lucide-react` copies would ship two icon sets).

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

### Token input

`TokenInput` from `@rede-enois/design-system/patterns` provides the same removable
chips for onboarding skills and profile project technologies. Pass `values`,
`onAdd`, `onRemove`, `label`, `max` and `maxLength`; suggestions, `duplicateMessage`
and copy overrides are optional. `allowMultiple` defaults to `true`: callbacks must
use functional state updates because a pasted list can add several tokens in one
input event. With `allowMultiple={false}`, a confirmation adds at most one token;
multi-item text is kept for correction with an accessible message.

Enter, commas (including Android input events), and moving to another input or
blurring the field confirm pending text. Buttons and links defer confirmation to
their action handler so a layout change cannot cancel the pointer click.
Blank tokens and case-insensitive duplicates are ignored. Invalid
lengths or batches exceeding the item cap leave the text available for correction
and show an accessible error. IME composition is preserved. Suggestions exclude
selected values and show at most eight matches.

Forms can pass a `ref` typed as `TokenInputHandle` and call `commit()` before
saving: it returns the complete list including pending text, or `null` when
invalid. This avoids depending on a blur state update to build the save payload.
Onboarding uses `allowMultiple={false}` with limits of 20 skills and 60 characters,
preserving its existing single-skill frontend callbacks. Projects accept pasted
lists with limits of 10 technologies and 40 characters. No frontend change is
required to consume these views.

### Mobile text fields

`Input`, `Textarea` and `MentionTextarea` keep compact `text-xs` and `text-sm`
overrides at 16px below 768px, retaining their requested size on desktop. The
internal `textFieldClasses` helper merges classes before converting these compact
sizes. Other unprefixed font sizes are also mirrored at `md:`, so `text-lg`,
`text-base` and `text-[15px]` override the desktop default too. Explicit responsive
overrides, colors and line heights remain available. The helper is not part of
the package's public API. Native text fields in DS views use explicit
mobile and desktop sizes. Non-text inputs and unrelated app controls are not
targeted by a global font rule. Manual page zoom remains available.

Use `text-base md:text-sm` (or `md:text-xs`) when adding a compact text field.
Custom arbitrary sizes and responsive mobile overrides must also stay at least
16px; `textFieldClasses` only normalizes the unprefixed `text-xs` and `text-sm`
utilities. It does not inspect inline styles or compute arbitrary CSS values.

### Input counter

`Input` shows a character counter by default when `maxLength` is set. Use
`showCounter={false}` to hide the counter while keeping the native length limit, for example
for a verification code:

```tsx
<Input maxLength={6} showCounter={false} inputMode="numeric" autoComplete="one-time-code" />
```

### Comment composer

`PostComments` owns the responsive composer layout and its single submit button.
The `composerField` slot supplies only the writing field; applications continue
to supply `canSend`, `sending`, media and submission/upload callbacks. On mobile,
the field spans the first row. The footer places the tools toggle on the left
and the 36px submit control on the right. The closed footer shows "Comentar";
opening the tools switches the submit to an accessible icon. Photo, audio and
GIF share the remaining space, wrapping when a recording label needs more room.
Composer errors stay directly below the field in the same grid, above the mobile
footer, without hiding loaded comments. Desktop aligns the error with the field
and keeps the icon beside the field and the tools below it. Fixed submit
copy comes from `postComments.submit` and `postComments.sending` messages.

### Character counters

`MentionTextarea` shows its character counter when `maxLength` is set. Forms that render the same
`CharCounter` in their own footer can pass `showCounter={false}` while keeping the field limit.

Formatting buttons, keyboard shortcuts, emoji and mention suggestions also respect `maxLength`:
an insertion that would exceed it leaves the current text unchanged. The `onChange` callback emits
only selected mention IDs whose complete usernames remain as rendered mentions, including inside
Markdown formatting. Literal code does not count as a mention. Removing a mention or
clearing the controlled `value` removes that recipient from subsequent edits; typing a username
manually does not restore a previously removed selection.

### Inline stickers in `MentionTextarea`

The field is a `contenteditable` element (`role="textbox"`, `aria-multiline`), not a `<textarea>`:
tests and app code query `[role="textbox"]`, and there is no `selectionStart`. `value` and
`onChange(value, mentionedUserIds)` are unchanged and the value stays plain text.

Pass `stickers` (code to `{ url, alt }`) and any whitespace-delimited word equal to a code is drawn
as an inline image (`url` goes through `useAdapters().resolveMediaUrl`). The image is atomic: the
caret skips it, Backspace/Delete remove it whole and copy/cut give the code. Without `stickers` the
field shows text only.

To insert text where the person was writing (for example from a sticker dialog), keep a `ref`:

```tsx
const field = useRef<MentionTextareaHandle>(null);

<MentionTextarea ref={field} stickers={stickers} {...rest} />;

// when a sticker is picked (the field may have lost the focus to the dialog):
field.current?.insertAtCaret(code); // " CODE " spacing, respects maxLength, returns false if refused
// when the dialog closes:
field.current?.focus();
```

`insertAtCaret` remembers the caret while the field has no focus, adds spaces around the text when
its neighbours are not whitespace, goes through the same mention reconciliation as a typed edit and
does nothing past `maxLength`. It replaces `querySelector("textarea")` plus `selectionStart`.

The field keeps its own history, because redrawing the DOM wipes the browser's undo stack:
Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z and Ctrl+Y redo, and the `historyUndo`/`historyRedo` input events
(Edit menu, phone) do the same. Consecutive typing, or consecutive deleting, is one step; a sticker,
a mention, an emoji, a paste, a cut and a format each are a step. Undo and redo go through `onChange`
(with the mentioned ids restored) and never exceed `maxLength`. The history is dropped when the
parent replaces `value` with something the field did not write (clearing the draft, for example).
ArrowLeft/ArrowRight (and with Shift) cross a sticker as one character.

### Profile garden

`ProfileGarden` (domain) draws a profile's reputation as a small static garden: the tree is
`trajectory`, the flowers `relations`, the raised bed and its fruits `contribution` and the grass
`tenure`, each at stage 0 to 3. `health` (0 to 2) only softens the colors; nothing ever dries or
dies. The style comes from the equipped `GARDEN` cosmetic (`garden-cerrado`,
`garden-mata-atlantica`, `garden-caatinga`, `garden-pampa`); map its id with `gardenStyleOf`, which
falls back to the default `quintal`. The owner sees a hint about the part that grows next.

`ProfileGamificationPanel` takes `garden` and `gardenStyle` and draws it next to the reputation:

```tsx
<ProfileGamificationPanel
  {...panelProps}
  garden={profile.garden}
  gardenStyle={gardenStyleOf(equippedGardenItemId)}
/>
```

### Card themes

`cardTheme(id)` maps a shop `CARD_THEME` item to the colors of the profile card: the seasonal
collections plus one theme for each of the 85 appearance themes (`tema-<themeId>`), taken from that
theme's own gradient and accent. `card-themes.test.ts` keeps every card at AA contrast on both stops.
An id without a card theme renders no art, so a new item needs its entry here.

## Migrating components from the front

See [docs/component-migration.md](docs/component-migration.md).

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
