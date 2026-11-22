// Depois da publicação: o `package.json` do repositório volta a ser o original.
import { existsSync } from "node:fs";
import { copyFileSync, rmSync } from "node:fs";

const backup = new URL("../package.manifest.json", import.meta.url);

if (existsSync(backup)) {
  copyFileSync(backup, new URL("../package.json", import.meta.url));
  rmSync(backup);
}
