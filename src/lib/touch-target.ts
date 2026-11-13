/**
 * Touch targets for controls drawn smaller than 44px. The `before` pseudo-element inflates only
 * the area that takes the tap; the control keeps its drawn size, so the layout does not move.
 *
 * Height always reaches 44px. Width grows by 4px a side: these controls sit in rows with a 4px
 * gap, and a wider area would take taps meant for the neighbour.
 */

/** For a control drawn 28px tall (`h-7`). */
export const TOUCH_TARGET_28 =
  "relative before:absolute before:-inset-x-1 before:-inset-y-2 before:content-['']";

/** For a control drawn 32px tall (`h-8`). */
export const TOUCH_TARGET_32 =
  "relative before:absolute before:-inset-x-1 before:-inset-y-1.5 before:content-['']";

/** For a control drawn 36px tall (`h-9`). */
export const TOUCH_TARGET_36 = "relative before:absolute before:-inset-1 before:content-['']";
