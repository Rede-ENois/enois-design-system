/** A ready outfit of one collection: every slot of the card at once. */
export type CosmeticShopLook = {
  id: string;
  title: string;
  /** Item ids: theme, frame, name style, effect, banner, plate, badges. */
  items: string[];
  statusIcon?: string | null;
  statusText?: string | null;
  /** Price of the missing items with the look discount, formatted by the app. */
  priceLabel?: string | null;
  /** Every piece is the viewer's: the card wears or takes the look off with a click. */
  owned?: boolean;
  /** The look is on the profile right now. */
  equipped?: boolean;
};
