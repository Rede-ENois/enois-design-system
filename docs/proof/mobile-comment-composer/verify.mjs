import assert from "node:assert/strict";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = fileURLToPath(new URL("../../../storybook-static/", import.meta.url));
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
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
const browser = await chromium.launch({
  headless: true,
  args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
});
const context = await browser.newContext({ permissions: ["microphone"] });
const errors = [];
const measurements = [];
const photo = {
  name: "example.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=",
    "base64",
  ),
};
try {
  for (const width of [320, 390, 412, 640, 1280]) {
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(
      `http://127.0.0.1:${server.address().port}/iframe.html?id=domain-post-comments--composer&viewMode=story`,
      { waitUntil: "networkidle" },
    );
    const form = page.locator("form");
    await form.waitFor();
    const submit = form.locator('button[type="submit"]');
    const plus = form.locator("button[aria-controls]");
    const field = form.locator("textarea");
    const snapshot = async (state) => {
      await page.waitForTimeout(250);
      assert.equal(await submit.count(), 1);
      const result = await form.evaluate((node) => {
        const rect = (element) => {
          const r = element.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            right: r.right,
            bottom: r.bottom,
            centerY: r.y + r.height / 2,
          };
        };
        const plus = node.querySelector("button[aria-controls]");
        const tray = document.getElementById(plus.getAttribute("aria-controls"));
        const submit = node.querySelector('button[type="submit"]');
        return {
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          field: rect(node.querySelector("textarea").parentElement.parentElement),
          plus: rect(plus),
          submit: rect(submit),
          labelWidth: submit.querySelector("span").getBoundingClientRect().width,
          toolsOpen: plus.getAttribute("aria-expanded") === "true",
          tools: [...tray.querySelectorAll("button")].map((button) => ({
            label: button.textContent.trim(),
            ...rect(button),
            clip: rect(button.parentElement.parentElement),
          })),
        };
      });
      assert.ok(result.scrollWidth <= width, `${state}: horizontal overflow at ${width}`);
      assert.ok(result.plus.width >= 36 && result.plus.height >= 36);
      assert.ok(result.submit.width >= 36 && result.submit.height >= 36);
      assert.ok(result.submit.right <= width);
      if (width < 640) {
        assert.ok(result.field.bottom <= result.plus.y, `${state}: field must be above footer`);
        assert.ok(
          Math.abs(result.plus.centerY - result.submit.centerY) < 3,
          `${state}: footer controls misaligned`,
        );
        assert.ok(result.toolsOpen ? result.labelWidth <= 1 : result.labelWidth > 1);
      } else {
        assert.ok(Math.abs(result.plus.bottom - result.submit.bottom) < 3);
        assert.ok(result.labelWidth <= 1);
      }
      if (result.toolsOpen) {
        for (const button of result.tools) {
          assert.ok(
            button.x >= button.clip.x - 1 && button.right <= button.clip.right + 1,
            `${button.label}: clipped horizontally`,
          );
          assert.ok(
            button.y >= button.clip.y - 1 && button.bottom <= button.clip.bottom + 1,
            `${button.label}: clipped vertically`,
          );
        }
        if (width < 640 && state === "tools")
          assert.ok(
            result.tools.every((button) => Math.abs(button.centerY - result.tools[0].centerY) < 3),
            "Photo/audio/GIF should share the normal mobile row",
          );
      }
      measurements.push({ width, state, ...result });
      if (
        ([320, 390, 1280].includes(width) && ["closed", "tools", "recording"].includes(state)) ||
        (width === 390 && ["sending", "media-only"].includes(state))
      )
        await page.screenshot({
          path: fileURLToPath(new URL(`${width}-${state}.png`, import.meta.url)),
          fullPage: true,
        });
    };
    assert.ok(await submit.isDisabled());
    await snapshot("empty");
    await field.fill("Comentário de demonstração");
    assert.ok(await submit.isEnabled());
    await snapshot("closed");
    await plus.click();
    await snapshot("tools");
    await submit.click();
    assert.ok(await submit.isDisabled());
    assert.equal(await submit.getAttribute("aria-busy"), "true");
    await submit.evaluate((button) => button.click());
    await snapshot("sending");
    await page.waitForFunction(
      () => document.querySelector('output[aria-label="Envios concluídos"]')?.textContent === "1",
    );
    await form.locator('input[type="file"]').setInputFiles(photo);
    await snapshot("media-only");
    assert.ok(await submit.isEnabled());
    await submit.click();
    await page.waitForFunction(
      () => document.querySelector('output[aria-label="Envios concluídos"]')?.textContent === "2",
    );
    assert.equal(
      await page.getByLabel("Anexos no último envio", { exact: true }).textContent(),
      "1",
    );
    await form.locator('input[type="file"]').setInputFiles(photo);
    await form.getByRole("button", { name: "Remover mídia", exact: true }).click();
    assert.ok(await submit.isDisabled());
    await plus.click();
    await form.getByRole("button", { name: "GIF", exact: true }).click();
    assert.equal(
      await page.getByLabel("Chamadas do seletor de GIF", { exact: true }).textContent(),
      "1",
    );
    assert.equal(await plus.getAttribute("aria-expanded"), "false");
    await page.getByRole("button", { name: "Responder", exact: true }).click();
    assert.equal(await page.locator("form").count(), 1);
    assert.equal(await field.evaluate((element) => element === document.activeElement), true);
    await field.fill("Resposta de demonstração");
    await submit.click();
    await page.waitForFunction(
      () => document.querySelector('output[aria-label="Envios concluídos"]')?.textContent === "3",
    );
    await plus.click();
    await page.clock.install();
    await form.getByRole("button", { name: "Gravar áudio", exact: true }).click();
    const stop = form.getByRole("button", { name: "Parar a gravação", exact: true });
    await stop.waitFor();
    await page.clock.runFor(12000);
    assert.ok((await stop.textContent()).includes("0:12"));
    await snapshot("recording");
    assert.ok(await plus.isDisabled());
    await stop.click();
    await form.locator("audio").waitFor();
    assert.ok(await submit.isEnabled());
    await page.close();
  }
  assert.deepEqual(errors, []);
  const summary = measurements.map((row) => ({
    width: row.width,
    state: row.state,
    fieldWidth: row.field.width,
    submitWidth: row.submit.width,
    submitHeight: row.submit.height,
    toolsRows: [...new Set(row.tools.map((button) => Math.round(button.y)))].length,
    overflow: row.scrollWidth > row.width,
  }));
  if (process.env.MEASUREMENTS_PATH)
    await writeFile(
      process.env.MEASUREMENTS_PATH,
      JSON.stringify(
        { browser: await browser.version(), measurements, consoleErrorsAndWarnings: errors },
        null,
        2,
      ),
    );
  console.log(JSON.stringify(summary));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
