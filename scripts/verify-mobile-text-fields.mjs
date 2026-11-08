import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const output = new URL("../docs/proof/mobile-text-fields/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
});
const errors = [];
const page = await browser.newPage();
page.on("response", (response) => {
  if (response.status() >= 400) console.error(response.status(), response.url());
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") errors.push(message.text());
});
const measurements = [];
const nativeMeasurements = [];
try {
  for (const width of [390, 412, 767, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(
      process.env.PROOF_URL ||
        "http://localhost:6007/iframe.html?id=ui-form-fields--mobile-typography&viewMode=story",
      { waitUntil: "networkidle" },
    );
    await page.getByLabel("Input xs", { exact: true }).waitFor();
    const beforeScale = await page.evaluate(() => window.visualViewport.scale);
    for (const field of await page.locator("input:not([type=checkbox]),textarea").all()) {
      await field.focus();
      assert.equal(await page.evaluate(() => window.visualViewport.scale), beforeScale);
    }
    await page.locator("input").first().blur();
    const result = await page.evaluate(() => ({
      width: innerWidth,
      height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      fields: [...document.querySelectorAll("input,textarea,select")].map((field) => {
        const style = getComputedStyle(field);
        const box = field.getBoundingClientRect();
        return {
          label: field.getAttribute("aria-label") || "MentionTextarea",
          type: field.type,
          fontSize: parseFloat(style.fontSize),
          lineHeight: parseFloat(style.lineHeight),
          width: box.width,
          height: box.height,
          right: box.right,
        };
      }),
    }));
    assert.ok(result.scrollWidth <= width, `Horizontal overflow at ${width}px`);
    const desktopSizes = [12, 14, 18, 14, 14, 14, 12, 14];
    assert.equal(result.fields.length, desktopSizes.length);
    for (const [index, field] of result.fields.entries()) {
      const expected =
        width < 768
          ? index < 5
            ? index === 2
              ? 18
              : 16
            : index === 5
              ? 12
              : desktopSizes[index]
          : desktopSizes[index];
      assert.equal(field.fontSize, expected, `${field.label} at ${width}px`);
      assert.ok(field.right <= width, `${field.label} exceeds viewport`);
      if (index < 5) assert.ok(field.lineHeight <= field.height, `${field.label} clips its line`);
    }
    if (width === 390 || width === 1280) {
      await page.screenshot({
        path: fileURLToPath(new URL(`${width}.png`, output)),
        fullPage: true,
      });
    }
    measurements.push(result);
  }
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [story, desktopSize] of [
      ["domain-search--picker", 14],
      ["domain-explore--hub", 15],
      ["domain-wallet--shop", 12],
      ["domain-messages--thread", 14],
      ["domain-moderation--monitoring", 12],
    ]) {
      const url = new URL(process.env.PROOF_URL || "http://localhost:6007/iframe.html");
      url.search = `?id=${story}&viewMode=story`;
      await page.goto(url.href, { waitUntil: "networkidle" });
      const fields = page.locator(
        'input:not([type="checkbox"]):not([type="file"]):not([type="hidden"]),textarea',
      );
      await fields.first().waitFor();
      const sizes = await fields.evaluateAll((elements) =>
        elements.map((field) => ({
          type: field.type,
          fontSize: parseFloat(getComputedStyle(field).fontSize),
        })),
      );
      for (const field of sizes)
        assert.equal(field.fontSize, width < 768 ? 16 : desktopSize, `${story} at ${width}px`);
      nativeMeasurements.push({ width, story, fields: sizes });
    }
  }
  assert.deepEqual(errors, [], "Browser errors or warnings");
  await writeFile(
    new URL("result.json", output),
    JSON.stringify(
      {
        browser: await browser.version(),
        url: process.env.PROOF_URL || "Storybook UI/Form fields/MobileTypography",
        measurements,
        nativeMeasurements,
        consoleErrorsAndWarnings: errors,
        limitations:
          "Desktop Chromium verifies CSS and layout, not native iOS keyboard focus zoom or manual pinch gestures.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log("Mobile text field measurements passed at 390, 412, 767, 768 and 1280px.");
} finally {
  await browser.close();
}
