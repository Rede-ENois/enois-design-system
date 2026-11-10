import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommunityMark } from "./community-mark.js";
import { EventTicket } from "./event-ticket.js";
import { Signal } from "./signal.js";

const meta: Meta = {
  title: "UI/Signals and shapes",
};

export default meta;

/** Each kind of news has its own shape: count pill, message balloon, news dot, "hoje" tag. */
export const Signals: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      <Signal signal={{ kind: "count", count: 3 }} />
      <Signal signal={{ kind: "count", count: 140 }} />
      <Signal signal={{ kind: "messages", count: 2 }} />
      <Signal signal={{ kind: "new" }} />
      <Signal signal={{ kind: "today" }} />
    </div>
  ),
};

/** Communities are tables (squircles); without a color, the id picks a stable table color. */
export const CommunityMarks: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <CommunityMark name="Mulheres na Tecnologia" color="#be185d" />
      <CommunityMark name="Design aberto" seed="c2" />
      <CommunityMark name="Rust BH" seed="c3" size="sm" />
      <CommunityMark name="Go Brasil" seed="c4" size="xs" />
    </div>
  ),
};

/** Events are tickets: amber when it happens today, violet otherwise. */
export const EventTickets: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <EventTicket day="02" month="NOV" />
      <EventTicket day="14" month="NOV" tone="primary" />
      <EventTicket day="02" size="sm" />
    </div>
  ),
};
