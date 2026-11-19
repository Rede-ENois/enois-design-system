import assert from "node:assert/strict";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
});
const output = process.env.PROOF_DIR;
assert.ok(output, "PROOF_DIR must name an existing artifact directory");
const root = fileURLToPath(new URL("../../../storybook-static/", import.meta.url));
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/favicon.ico") {
    response.writeHead(204).end();
    return;
  }
  const target = path.resolve(root, `.${decodeURIComponent(pathname)}`);
  if (!target.startsWith(root) || !(await stat(target).catch(() => null))?.isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Content-Type": mime[path.extname(target)] || "application/octet-stream",
  });
  response.end(await readFile(target));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const results = [];
const errors = [];
try {
  for (const width of [390, 1280]) {
    for (const mode of ["dark", "light"]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(
        `${base}/iframe.html?id=domain-messages--reply-navigation&viewMode=story&globals=theme:${mode}`,
        { waitUntil: "networkidle" },
      );
      const quotes = page.getByRole("button", { name: "Ir para mensagem original", exact: true });
      await quotes.first().waitFor({ state: "visible" });
      assert.equal(await quotes.count(), 2);
      const target = page.locator('[id="message-demo-original"]');
      const missingAction = page.getByText("Citação sem ação de navegação disponível.");
      assert.equal(await missingAction.count(), 1);
      assert.equal(await page.locator("div.border-l-2").count(), 1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `horizontal overflow at ${width}/${mode}`);
      const focusStyles = [];
      for (let i = 0; i < 2; i++) {
        await quotes.nth(i).click();
        assert.equal(await target.evaluate((e) => e === document.activeElement), true);
        await quotes.nth(i).focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        const style = await quotes.nth(i).evaluate((e) => {
          const s = getComputedStyle(e);
          return {
            focused: e === document.activeElement,
            focusVisible: e.matches(":focus-visible"),
            outlineStyle: s.outlineStyle,
            outlineWidth: s.outlineWidth,
            outlineColor: s.outlineColor,
            color: s.color,
            background: s.backgroundColor,
            parentBackground: getComputedStyle(e.parentElement).backgroundColor,
            rootBackground: getComputedStyle(document.documentElement).backgroundColor,
          };
        });
        assert.equal(style.focused, true);
        assert.equal(style.focusVisible, true);
        assert.ok(parseFloat(style.outlineWidth) >= 2);
        assert.notEqual(style.outlineStyle, "none");
        const contrast = await quotes.nth(i).evaluate((e) => {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d");
          const parse = (color) => {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            return [...context.getImageData(0, 0, 1, 1).data].map((v, i) =>
              i === 3 ? v / 255 : v,
            );
          };
          const over = (f, b) => [...f.slice(0, 3).map((v, i) => v * f[3] + b[i] * (1 - f[3])), 1];
          const luminance = (c) =>
            c
              .slice(0, 3)
              .map((v) => v / 255)
              .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          const ratio = (a, b) =>
            (Math.max(luminance(a), luminance(b)) + 0.05) /
            (Math.min(luminance(a), luminance(b)) + 0.05);
          const s = getComputedStyle(e),
            parent = parse(getComputedStyle(e.parentElement).backgroundColor),
            bg = over(parse(s.backgroundColor), parent);
          return {
            outline: ratio(over(parse(s.outlineColor), parent), parent),
            text: ratio(over(parse(s.color), bg), bg),
          };
        });
        assert.ok(
          contrast.outline >= 3,
          `focus contrast ${contrast.outline} at ${width}/${mode}/side-${i}`,
        );
        assert.ok(
          contrast.text >= 4.5,
          `text contrast ${contrast.text} at ${width}/${mode}/side-${i}`,
        );
        focusStyles.push({ ...style, contrast });
        if (i === 1)
          await page.screenshot({
            path: `${output}/ds-${width}-${mode}-focus.png`,
            fullPage: true,
          });
        await page.keyboard.press("Enter");
        assert.equal(await target.evaluate((e) => e === document.activeElement), true);
        await quotes.nth(i).focus();
        await page.keyboard.press("Space");
        assert.equal(await target.evaluate((e) => e === document.activeElement), true);
      }
      await page.getByRole("button", { name: "Selecionar mensagens", exact: true }).click();
      assert.equal(await quotes.count(), 0);
      const selectedQuote = page.locator('[id="message-demo-reply-false"] .border-l-2');
      assert.equal(await selectedQuote.evaluate((e) => e.tagName), "DIV");
      await selectedQuote.click();
      assert.equal(await page.locator('[id="message-demo-reply-false"] .ring-2').count(), 1);
      assert.equal(await target.evaluate((e) => e === document.activeElement), false);
      await page.getByRole("button", { name: "Sair da seleção", exact: true }).click();
      assert.equal(await quotes.count(), 2);
      results.push({
        width,
        mode,
        mouse: true,
        enter: true,
        space: true,
        nativeButton: true,
        selection: true,
        optionalCallback: true,
        noHorizontalOverflow: true,
        focusStyles,
      });
      await page.close();
    }
  }
  const thread = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  thread.on("pageerror", (e) => errors.push(e.message));
  await thread.goto(`${base}/iframe.html?id=domain-messages--thread&viewMode=story`, {
    waitUntil: "networkidle",
  });
  await thread.getByRole("button", { name: "Ir para mensagem original", exact: true }).click();
  assert.equal(
    await thread
      .locator('[id="message-story-original"]')
      .evaluate((e) => e === document.activeElement),
    true,
  );
  assert.equal(
    await thread.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
  );
  await thread.screenshot({ path: `${output}/ds-thread-390.png`, fullPage: true });
  assert.deepEqual(errors, []);
  const report = {
    browser: await browser.version(),
    scope: "Built Storybook, synthetic data; not frontend integration",
    results,
    threadFocus: true,
    pageErrors: errors,
  };
  await writeFile(`${output}/ds-browser-results.json`, JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
} catch (error) {
  process.stderr.write(JSON.stringify({ errors }) + "\n");
  for (const context of browser.contexts())
    for (const page of context.pages()) {
      process.stderr.write(
        page.url() + "\n" + (await page.locator("body").innerText()).slice(0, 5000) + "\n",
      );
      await page.screenshot({ path: `${output}/ds-browser-failure.png` });
    }
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
