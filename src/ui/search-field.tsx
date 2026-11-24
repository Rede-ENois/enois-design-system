import { Search } from "lucide-react";

import type { SearchFieldProps } from "../types/components/ui/search-field-props.js";

import { Input } from "./input.js";

/**
 * O campo de busca das listas: lupa à esquerda e campo redondo. Só desenha e repassa cada tecla —
 * a consulta, a pausa na digitação e o estado do termo ficam com quem compõe.
 */
export function SearchField({ value, onChange, placeholder, id }: SearchFieldProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>

      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
      />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-full bg-surface-card pl-10"
        showCounter={false}
      />
    </div>
  );
}
