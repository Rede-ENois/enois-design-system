import * as React from "react";

import { maskTime } from "../lib/time-input.js";
import { useMessages } from "../messages/messages-context.js";
import type { TimeTextInputProps } from "../types/components/ui/time-text-input-props.js";

import { Input } from "./input.js";

const CLOCK = /^\d{2}:\d{2}$/;

/**
 * Clock field (`HH:mm`) that opens the numeric keypad on a phone, the companion of
 * `DateTextInput`. The native `type="time"` on Android Chrome only lets you pick through its own
 * wheel, and an agenda entry is typed far more often than picked.
 *
 * Validation is set on the input itself, so a plain form submit is blocked by the browser with a
 * message in the reader's language, and the app still reads the value through the hidden input when
 * the form is uncontrolled.
 */
export const TimeTextInput = React.forwardRef<HTMLInputElement, TimeTextInputProps>(
  ({ value, defaultValue, onValueChange, name, required, ...props }, ref) => {
    const messages = useMessages().timeTextInput;
    const [display, setDisplay] = React.useState(() => maskTime(value ?? defaultValue ?? ""));
    const complete = CLOCK.test(display);

    // The controlled value changed outside (entry loaded, start time copied from the end): mirror it.
    React.useEffect(() => {
      if (value !== undefined && value !== display) {
        setDisplay(maskTime(value));
      }
    }, [value]);

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
      innerRef.current?.setCustomValidity(display && !complete ? messages.invalid : "");
    }, [display, complete, messages.invalid]);

    return (
      <>
        <Input
          {...props}
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={props.autoComplete ?? "off"}
          placeholder={props.placeholder ?? messages.placeholder}
          required={required}
          value={display}
          onChange={(event) => {
            const next = maskTime(event.target.value);
            setDisplay(next);
            onValueChange?.(next);
          }}
        />
        {name && <input type="hidden" name={name} value={complete ? display : ""} />}
      </>
    );
  },
);

TimeTextInput.displayName = "TimeTextInput";
