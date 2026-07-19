#!/usr/bin/env node
/* ============================================================
   HATCHLINE — static page builder
   ------------------------------------------------------------
   Run this before deploying (the GitHub Action does this
   automatically on every push to main — see
   .github/workflows/deploy.yml). You should not normally need
   to run it by hand.

   WHAT IT DOES
   For every extension in assets/js/extensions-data.js, writes a
   real static file — e.g. bulk-export.html — with the correct
   <title>, <meta description>, and fully pre-rendered page
   content already baked in. This means search engines (and
   anything else that doesn't run JavaScript) see the real page
   immediately, instead of a generic "Loading…" placeholder.

   The existing extension.html?slug=... page keeps working too
   (it renders client-side, same as before) - this script just
   adds a crawlable static file alongside it. index.html's cards
   are updated to link to the static file directly.

   HOW IT WORKS
   1. Reads extensions-data.js as plain JS (using Node's vm
      module, since it's a browser <script> file, not a module).
   2. Calls the SAME render-extension.js function the browser
      uses, so the static markup can never drift from what
      detail.js renders live.
   3. Takes extension.html as a template and swaps in the real
      title/meta/body/nav for each extension, writing the result
      to <slug>.html in the repo root.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");

// ---- load extensions-data.js safely in a sandbox ----
const dataSrc = fs.readFileSync(path.join(root, "assets/js/extensions-data.js"), "utf8");
const dataSandbox = {};
vm.createContext(dataSandbox);
vm.runInContext(dataSrc + "\nthis.__EXPORTED__ = HATCHLINE_EXTENSIONS;", dataSandbox);
const extensions = dataSandbox.__EXPORTED__;

if (!Array.isArray(extensions) || !extensions.length) {
  console.error("No extensions found in extensions-data.js — aborting.");
  process.exit(1);
}

// ---- load the shared renderer (this one's already Node-compatible via module.exports) ----
const { renderExtensionPage } = require(path.join(root, "assets/js/render-extension.js"));

// ---- load extension.html as the template ----
const template = fs.readFileSync(path.join(root, "extension.html"), "utf8");

let built = 0;

extensions.forEach((ext) => {
  const rendered = renderExtensionPage(ext);

  let page = template;

  // Real <title>
  page = page.replace(
    /<title id="pageTitle">.*?<\/title>/,
    `<title id="pageTitle">${rendered.title}</title>`
  );

  // Real <meta description>
  page = page.replace(
    /<meta name="description" id="pageDesc" content=".*?">/,
    `<meta name="description" id="pageDesc" content="${rendered.description.replace(/"/g, "&quot;")}">`
  );

  // Canonical link + OG tags, so social shares and search results show the
  // real per-extension page instead of the generic template.
  const extraHead =
    `<link rel="canonical" href="https://sri-ram-bim.github.io/hatchline/${ext.slug}.html">\n` +
    `<meta property="og:title" content="${rendered.title.replace(/"/g, "&quot;")}">\n` +
    `<meta property="og:description" content="${rendered.description.replace(/"/g, "&quot;")}">\n` +
    `<meta property="og:type" content="website">\n`;
  page = page.replace("</head>", extraHead + "</head>");

  // Pre-rendered nav CTA (still id="navCta" so detail.js can safely re-render on top of it)
  page = page.replace(
    '<div class="nav-cta" id="navCta"></div>',
    `<div class="nav-cta" id="navCta">${rendered.navCtaHtml}</div>`
  );

  // Pre-rendered body (still id="pageBody" — detail.js will hydrate/re-render
  // identically on load, so this is purely progressive enhancement for
  // crawlers and JS-disabled visitors, not a second code path to maintain)
  page = page.replace(
    /<main id="pageBody">[\s\S]*?<\/main>/,
    `<main id="pageBody">${rendered.bodyHtml}</main>`
  );

  const outPath = path.join(root, `${ext.slug}.html`);
  fs.writeFileSync(outPath, page, "utf8");
  built++;
  console.log(`Built ${ext.slug}.html`);
});

console.log(`\nDone — ${built} static extension page(s) generated.`);
console.log("Remember to update the canonical URL in this script once you know your real domain.");
