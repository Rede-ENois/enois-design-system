export type EventTicketProps = {
  /** Day of the month, already formatted ("02"). */
  day: string;
  /** Short month, already formatted ("NOV"); omitted on the small ticket. */
  month?: string;
  tone?: "today" | "primary";
  size?: "sm" | "md";
  className?: string;
};
