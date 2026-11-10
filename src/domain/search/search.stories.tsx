import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wallet } from "lucide-react";

import { GlobalSearch } from "./global-search.js";
import { UserPicker } from "./user-picker.js";

const meta: Meta = {
  title: "Domain/Search",
};

export default meta;

const people = [
  {
    id: "u1",
    type: "users",
    title: "Ana Souza",
    subtitle: "@ana",
    image: null,
    href: "/users/ana",
  },
  {
    id: "u2",
    type: "users",
    title: "Bruno Lima",
    subtitle: "@bruno",
    image: null,
    href: "/users/bruno",
  },
  {
    id: "carteira",
    type: "feature",
    title: "Carteira",
    subtitle: "Faíscas, extrato e loja",
    image: null,
    href: "/carteira",
    icon: Wallet,
    color: "var(--table-6)",
  },
];

export const Global: StoryObj = {
  render: function GlobalStory() {
    const [query, setQuery] = useState("");

    return (
      <div className="flex">
        <GlobalSearch
          results={people.filter((person) =>
            person.title.toLowerCase().includes(query.toLowerCase()),
          )}
          isFetching={false}
          onQueryChange={setQuery}
          onSelect={() => {}}
        />
      </div>
    );
  },
};

export const Picker: StoryObj = {
  render: function PickerStory() {
    const [value, setValue] = useState("");
    const [query, setQuery] = useState("");

    return (
      <div className="max-w-sm">
        <UserPicker
          value={value}
          onChange={setValue}
          options={people
            .filter((person) => person.title.toLowerCase().includes(query.toLowerCase()))
            .map((person) => ({
              username: person.subtitle.slice(1),
              name: person.title,
              avatar: null,
            }))}
          isFetching={false}
          onQueryChange={setQuery}
        />
      </div>
    );
  },
};
