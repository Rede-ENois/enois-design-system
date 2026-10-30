export type EventRitualsFilterProps = {
  /** True shows only recurring events (`GET /events?recurring=true`). */
  value: boolean;
  onChange: (value: boolean) => void;
};
