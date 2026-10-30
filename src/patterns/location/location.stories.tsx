import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { useMessages } from "../../messages/messages-context.js";

import { CityStateField } from "./city-state-field.js";
import { validateCityState } from "./city-state.js";
import { LocationLine } from "./location-line.js";

const meta: Meta = {
  title: "Patterns/Location",
};

export default meta;

export const Field: StoryObj = {
  render: function FieldStory() {
    const [value, setValue] = useState({ city: "", state: "" });
    const errors = useMessages().cityStateField.errors;
    const code = validateCityState(value);

    return (
      <div className="max-w-md">
        <CityStateField value={value} onChange={setValue} error={code && errors[code]} />
      </div>
    );
  },
};

export const FieldWithError: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <CityStateField
        value={{ city: "Belo Horizonte", state: "" }}
        onChange={() => undefined}
        error="Informe a cidade e o estado juntos, ou deixe os dois em branco."
      />
    </div>
  ),
};

export const Line: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      <LocationLine city="Belo Horizonte" state="MG" />
      <LocationLine state="SP" />
    </div>
  ),
};
