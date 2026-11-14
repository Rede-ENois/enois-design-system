import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve(fileURLToPath(new URL("../../../storybook-static/", import.meta.url)));
assert(
  process.env.PROOF_OUTPUT,
  "Defina PROOF_OUTPUT para o diretório de artefatos da verificação.",
);
const output = path.resolve(process.env.PROOF_OUTPUT, "ds-231-proof");
await mkdir(output, { recursive: true });
const index = JSON.parse(await readFile(path.join(root, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter(
  (entry) => entry.title === "Domain/Moderation/Sanctions" && entry.type === "story",
);
assert.equal(stories.length, 23);
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const target = path.resolve(root, `.${decodeURIComponent(pathname)}`);
  if (!target.startsWith(root + path.sep) || !(await stat(target).catch(() => null))?.isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Content-Type": mime[path.extname(target)] || "application/octet-stream",
  });
  response.end(await readFile(target));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
const rows = [];
const errors = [];
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
  });
  const address = server.address();
  assert(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on("pageerror", (error) => errors.push(error.message));
      const open = async (name) => {
        await page.goto(
          `${origin}/iframe.html?id=domain-moderation-sanctions--${name}&viewMode=story&globals=theme:${theme}`,
        );
        await page.locator("#storybook-root h1").waitFor();
        assert.equal(
          await page.locator("html").evaluate((el) => el.classList.contains("dark")),
          theme === "dark",
        );
      };
      for (const story of stories) {
        const name = story.id.split("--")[1];
        await open(name);
        const result = await page.locator("#storybook-root").evaluate((element) => {
          const overflow = document.documentElement.scrollWidth > innerWidth;
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          const rgba = (color) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            return [...ctx.getImageData(0, 0, 1, 1).data].map((v, i) => v / (i === 3 ? 255 : 1));
          };
          const over = (front, back) =>
            front.slice(0, 3).map((v, i) => v * front[3] + back[i] * (1 - front[3]));
          const luminance = (color) =>
            color
              .map((v) => {
                const c = v / 255;
                return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
              })
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          const ratios = [];
          for (const node of element.querySelectorAll(
            "h1,h2,h3,p,label,button,a,time,select,textarea,span",
          )) {
            const style = getComputedStyle(node);
            if (
              (!node.textContent?.trim() && !node.value) ||
              node.closest(":disabled,.sr-only") ||
              !node.getBoundingClientRect().height
            )
              continue;
            let background = [255, 255, 255];
            const ancestors = [];
            for (let ancestor = node; ancestor; ancestor = ancestor.parentElement)
              ancestors.unshift(ancestor);
            for (const ancestor of ancestors)
              background = over(rgba(getComputedStyle(ancestor).backgroundColor), background);
            const foreground = over(rgba(style.color), background);
            const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
            const ratio = (values[0] + 0.05) / (values[1] + 0.05);
            ratios.push({ text: (node.textContent || node.value).slice(0, 60), ratio });
          }
          return {
            overflow,
            minimumContrast: Math.min(...ratios.map((item) => item.ratio)),
            failures: ratios.filter((item) => item.ratio < 4.5),
          };
        });
        rows.push({ width, theme, story: name, ...result });
        assert.equal(result.overflow, false, `${width} ${theme} ${name}: overflow`);
        assert.deepEqual(result.failures, [], `${width} ${theme} ${name}: contraste`);
        if ((width === 390 && name === "long-content") || (width === 1280 && name === "suspended"))
          await page.screenshot({
            path: path.join(output, `${width}-${theme}-${name}.png`),
            fullPage: true,
          });
      }
      await open("suspended");
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => ({
        tag: document.activeElement.tagName,
        shadow: getComputedStyle(document.activeElement).boxShadow,
        outline: getComputedStyle(document.activeElement).outlineStyle,
      }));
      assert.equal(focus.tag, "TEXTAREA");
      assert(focus.shadow !== "none" || focus.outline !== "none");
      await page.keyboard.type("Mensagem ficticia para solicitar revisao.");
      await page.keyboard.press("Tab");
      assert.equal(await page.locator(":focus").textContent(), "Recorrer");
      await page.keyboard.press("Enter");
      await page.getByText("Recurso em análise", { exact: true }).waitFor();
      assert.equal(await page.locator("form").count(), 0);
      await open("clock-transition");
      await page.getByRole("button", { name: "Avançar o horário recebido até o prazo" }).click();
      await page.getByText("Prazo encerrado", { exact: true }).waitFor();
      assert(
        !/conta liberada|conta banida/i.test(await page.locator("#storybook-root").textContent()),
      );
      await page.close();
    }
  }
  assert.deepEqual(errors, []);
  const report = {
    stories: stories.length,
    renders: rows.length,
    keyboardScenarios: 4,
    clockScenarios: 4,
    minimumContrast: Math.min(...rows.map((row) => row.minimumContrast)),
    errors,
    rows,
  };
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify({ ...report, rows: undefined, output }, null, 2) + "\n");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
  if (rows.length)
    await writeFile(path.join(output, "partial-report.json"), JSON.stringify(rows, null, 2));
}
