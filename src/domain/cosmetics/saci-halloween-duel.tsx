import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { SaciHalloweenDuelProps } from "../../types/domain/cosmetics/saci-halloween-duel-props.js";
import type { SaciHalloweenTeam } from "../../types/domain/cosmetics/saci-halloween-team.js";

import { CosmeticIcon } from "./cosmetic-icon.js";
import { saciShare } from "./saci-share.js";

const TEAMS: readonly { team: SaciHalloweenTeam; icon: string }[] = [
  { team: "saci", icon: "carapuca" },
  { team: "halloween", icon: "morcegoRoxo" },
];

/**
 * The Saci × Halloween duel of October 31: pick a team once (it grants the team badge), see
 * the tally, and after the day the winner. The app saves the choice through `onChoose`.
 */
export function SaciHalloweenDuel({
  active,
  upcoming = false,
  counts,
  myChoice,
  winner,
  pending = false,
  onChoose,
  className,
}: SaciHalloweenDuelProps) {
  const messages = useMessages().saciHalloweenDuel;
  const share = saciShare(counts);
  const closed = !active;

  let state: string;
  if (upcoming) state = messages.upcoming;
  else if (closed && winner) state = messages.winner(messages.teams[winner]);
  else if (closed && share !== null && counts.saci === counts.halloween) state = messages.tie;
  else if (closed) state = messages.closed;
  else if (myChoice) state = messages.chosen(messages.teams[myChoice]);
  else state = messages.choose;

  return (
    <section className={cn("cos-event", className)} aria-label={messages.title}>
      <div>
        <span className="cos-event__tag">{messages.tag}</span>

        <h3>{messages.title}</h3>

        <p>{messages.text}</p>

        <div className="cos-duel">
          {TEAMS.map(({ team, icon }) => (
            <button
              key={team}
              type="button"
              className={cn("cos-duel__team", winner === team && "is-winner")}
              aria-pressed={myChoice === team}
              disabled={closed || pending || myChoice !== null}
              onClick={() => onChoose(team)}
            >
              <CosmeticIcon icon={icon} />
              {messages.teams[team]}
            </button>
          ))}

          <div className="cos-duel__tally">
            <span>{share === null ? messages.noVotes : messages.tally(share, 100 - share)}</span>

            <div className="cos-duel__bar" aria-hidden>
              <i style={{ width: `${share ?? 50}%` }} />
            </div>
          </div>
        </div>

        <p className="cos-duel__state" aria-live="polite">
          {state}
        </p>
      </div>
    </section>
  );
}
