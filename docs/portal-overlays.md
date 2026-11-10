# Portal overlays: full-screen views inside a post card

**Rule: a full-screen overlay that renders inside a post card MUST mount through the shared dialog
wrapper (`src/ui/dialog.tsx`), which portals to `document.body`.**

## The trap

`PostCard` adds `[content-visibility:auto]` to non-page posts in non-virtualized lists
(`src/domain/post/post-card.tsx`). That switches on layout and paint containment, and a
paint-contained element becomes the containing block for `position: fixed` descendants. An overlay rendered inline with `fixed inset-0` therefore
fills the **card's** box, not the viewport: it is clipped to the card and scrolls with the feed.

That is what kept the lite-mode video stage inside the feed card instead of covering the screen
(Rede-ENois/enois-design-system#162, reported with visual evidence in
Rede-ENois/enois-frontend#729).

## The rule

- Render the overlay through `Dialog` and `DialogContent` (plus `DialogTitle`) from
  `src/ui/dialog.tsx`. `DialogContent` already renders `DialogPortal` and the overlay, and owns the
  dialog plumbing.
- Give the content a `DialogTitle`; add `className="sr-only"` when the title is not visible. Radix
  requires an accessible name. Pass `aria-describedby={undefined}` when there is no description,
  otherwise Radix warns about the missing `DialogDescription`.
- When the view draws its own close control, pass `hideClose` and use `DialogClose` for the button,
  so the wrapper does not render a second X.
- Full-bleed content overrides the wrapper defaults through `className`. The wrapper builds its
  classes with `cn`, so `h-dvh w-screen max-w-none bg-black p-0 shadow-none` wins over the centered
  dialog box. Do not copy the portal code into the view.
- Closing has one path: Escape, the close button and a click on the backdrop all end in
  `onOpenChange(false)`.

## What stays in the view

Dialog plumbing belongs to the wrapper. Behaviour specific to the content stays with the view:

- `MediaStage` suspends and restores the rest of the page's media, resumes at the second the stage
  closed, and keeps the muted-autoplay fallback.

## Checklist for a new overlay

- [ ] Does it need the whole viewport? Render it through `src/ui/dialog.tsx`, not inline.
- [ ] Does it have an accessible name (`DialogTitle`, `sr-only` when invisible) and no
      missing-description warning?
- [ ] Do Escape, the close button and the backdrop all close exactly once?
- [ ] Are scroll lock, focus trap and `aria-modal` left to the wrapper, with nothing manual in the
      view?
