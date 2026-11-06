/**
 * Turns a label into a hashtag: "Carreira e mercado" becomes "#CarreiraEMercado".
 *
 * Accents stay (a tag in Portuguese reads better with them); spaces and punctuation go away. The
 * first word keeps the case it came in (a label written in upper case stays upper case) and each
 * word after it starts in upper case. Passing a tag back in returns the same tag.
 */
export function toHashtag(label: string): string {
  const trimmed = label.trim();

  // Already a tag (our own output comes back in): keep its words, only drop stray punctuation.
  if (trimmed.startsWith("#")) {
    return `#${trimmed.slice(1).replace(/[^\p{L}\p{N}_]/gu, "")}`;
  }

  const words = trimmed
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}_]/gu, ""))
    .filter(Boolean);

  const [first = "", ...rest] = words;
  const tail = rest.map((word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1));
  const tag = `${first}${tail.join("")}`;

  // Nothing left to tag (blank label): the caller falls back to its own placeholder.
  return tag ? `#${tag}` : "";
}
