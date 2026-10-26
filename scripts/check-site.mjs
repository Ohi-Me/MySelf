#!/usr/bin/env node
/**
 * Crawls a running build and checks every page in the sitemap.
 *
 *   pnpm build && pnpm start --port 3002
 *   node scripts/check-site.mjs http://localhost:3002            # internal checks
 *   node scripts/check-site.mjs http://localhost:3002 --external # also request external links
 *
 * Checks: HTTP 200, one <h1>, unique <title> and meta description, canonical,
 * Open Graph image, html lang, valid JSON-LD, internal links and #anchors that
 * resolve, rel="noopener" on new-tab links, and a 404 for an unknown route.
 * Exits non-zero on any failure.
 */
const base = (process.argv[2] || "http://localhost:3002").replace(/\/$/, "");
const checkExternal = process.argv.includes("--external");

const failures = [];
const warn = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

const pageCache = new Map();
async function get(path) {
  if (pageCache.has(path)) return pageCache.get(path);
  const res = await fetch(base + path, { redirect: "manual" });
  const body = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
  const out = { status: res.status, body };
  pageCache.set(path, out);
  return out;
}

const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
console.log(`Checking ${paths.length} pages from the sitemap at ${base}`);

const titles = new Map();
const descriptions = new Map();
const internal = new Set();
const external = new Set();

for (const path of paths) {
  const { status, body } = await get(path);
  if (status !== 200) {
    fail(path, `status ${status}`);
    continue;
  }
  const h1s = body.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) fail(path, `${h1s} <h1> elements`);
  if (!/<html[^>]*lang="en"/.test(body)) fail(path, "missing html lang");

  const title = /<title>([^<]*)<\/title>/.exec(body)?.[1];
  if (!title) fail(path, "missing <title>");
  else titles.set(title, [...(titles.get(title) ?? []), path]);

  const desc = /<meta name="description" content="([^"]*)"/.exec(body)?.[1];
  if (!desc) fail(path, "missing meta description");
  else descriptions.set(desc, [...(descriptions.get(desc) ?? []), path]);

  if (!/<link rel="canonical" href="[^"]+"/.test(body)) fail(path, "missing canonical");
  if (!/<meta property="og:image" content="[^"]+"/.test(body)) fail(path, "missing og:image");

  for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(path, "invalid JSON-LD");
    }
  }

  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) fail(path, "img without alt");

  for (const m of body.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0];
    const href = attr(tag, "href");
    if (!href) continue;
    if (attr(tag, "target") === "_blank" && !/noopener/.test(attr(tag, "rel") ?? "")) fail(path, `new-tab link without noopener: ${href}`);
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (id && !body.includes(`id="${id}"`)) fail(path, `anchor #${id} has no target`);
    } else if (href.startsWith("/")) {
      internal.add(decode(href));
    } else if (/^https?:\/\//.test(href)) {
      external.add(decode(href));
    }
  }
}

for (const [t, ps] of titles) if (ps.length > 1) fail(ps.join(", "), `duplicate title "${t}"`);
for (const [d, ps] of descriptions) if (ps.length > 1) fail(ps.join(", "), `duplicate description "${d.slice(0, 50)}…"`);

console.log(`Checking ${internal.size} internal links`);
for (const href of internal) {
  const [path, hash] = href.split("#");
  const { status, body } = await get(path || "/");
  if (status !== 200) fail(href, `internal link returns ${status}`);
  if (hash && body && !body.includes(`id="${hash}"`)) fail(href, `anchor #${hash} not found on ${path}`);
}

const missing = await fetch(`${base}/this-page-does-not-exist`);
if (missing.status !== 404) fail("/this-page-does-not-exist", `expected 404, got ${missing.status}`);

for (const p of ["/robots.txt", "/sitemap.xml", "/opengraph-image", "/icon.svg", "/cv/Rohit_Kumar_Academic_CV.pdf"]) {
  const r = await fetch(base + p);
  if (r.status !== 200) fail(p, `status ${r.status}`);
}

if (checkExternal) {
  console.log(`Checking ${external.size} external links`);
  const headers = { "user-agent": "Mozilla/5.0 (link check)" };
  for (const url of external) {
    try {
      let r = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000), headers });
      if (r.status >= 400) r = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20000), headers });
      if ([403, 429, 999].includes(r.status)) warn.push(`${url}: ${r.status} (site blocks automated checks)`);
      else if (r.status >= 400) fail(url, `external link returns ${r.status}`);
    } catch (e) {
      warn.push(`${url}: ${e.name} (${e.message})`);
    }
  }
}

if (warn.length) console.log(`\nWarnings (${warn.length}):\n- ${warn.join("\n- ")}`);
if (failures.length) {
  console.error(`\nFAILED (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`\nAll checks passed: ${paths.length} pages, ${internal.size} internal links${checkExternal ? `, ${external.size} external links` : ""}.`);
