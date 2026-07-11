import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Luméa storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Luméa Atelier — Jewelry That Moves With Your Light<\/title>/i);
  assert.match(html, /Jewelry that moves with your light/);
  assert.match(html, /The collection in motion/i);
  assert.match(html, /Solé Ring/);
  assert.match(html, /Auralis Bracelet/);
  assert.match(html, /Celeste Pendant/);
  assert.match(html, /Begin with/);
  assert.match(html, /<main>/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the finished site accessible and free of starter scaffolding", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /function Header/);
  assert.match(page, /function HeroSection/);
  assert.match(page, /function ProductFilm/);
  assert.match(page, /function ProductCard/);
  assert.match(page, /function BrandStory/);
  assert.match(page, /function CraftSection/);
  assert.match(page, /function GiftSection/);
  assert.match(page, /function Testimonials/);
  assert.match(page, /function FinalCTA/);
  assert.match(page, /function Footer/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /alt="Solé ring, Auralis bracelet, and Celeste pendant/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /scroll-behavior:\s*smooth/);
  assert.match(layout, /Luméa Atelier — Jewelry That Moves With Your Light/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /codex-preview|_sites-preview|SkeletonPreview/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});
