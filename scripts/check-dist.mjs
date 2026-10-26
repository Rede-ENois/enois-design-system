// Imports every package entrypoint from dist in plain Node, the way SSR and tests load it:
// fails on extensionless relative imports and on anything that only works inside a bundler.
import { readFileSync } from "node:fs";

const { exports } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

for (const [entry, target] of Object.entries(exports)) {
  const file = typeof target === "string" ? target : target.import;
  if (!file.endsWith(".js")) continue;
  await import(new URL(`../${file}`, import.meta.url));
  console.log(`ok ${entry}`);
}
