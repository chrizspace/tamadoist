// Builds design/preview.html: the React design-system app (real components + real core logic) inlined into one file.
// Usage: pnpm design:build
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(root, p);

const out = await build({
  entryPoints: [r("design/app/main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  minify: true,
  target: "es2020",
  jsx: "automatic",
  nodePaths: [r("packages/ui/node_modules")],
  alias: { "@tamadoist/ui": r("packages/ui/src/index.ts"), "@tamadoist/core": r("packages/core/src/index.ts") },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

const css = (p) => readFileSync(r(p), "utf8").replace(/@import url\([^)]*\);\n?/g, "");
const js = out.outputFiles[0].text.replace(/<\/script>/gi, "<\\/script>");
const html = readFileSync(r("design/template.html"), "utf8")
  .replace("/*__PRODUCT_CSS__*/", () => css("packages/ui/src/styles.css"))
  .replace("/*__PAGE_CSS__*/", () => css("design/page.css"))
  .replace("/*__APP_JS__*/", () => js);
writeFileSync(r("design/preview.html"), html);
console.log(`design/preview.html written (${(html.length / 1024).toFixed(0)} KB)`);
