// Loads seed/seed.json content into a deployed EmDash site over its REST API.
// `emdash seed` only writes to a local SQLite file, so this covers remote D1 deployments.
// Auth: run `emdash login --url <site>` first; the token is read from ~/.config/emdash/auth.json.
// Usage: node scripts/load-remote.mjs <siteUrl> [--limit=N]   (--limit loads N entries per collection)
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const site = (process.argv[2] ?? "").replace(/\/$/, "");
if (!site) throw new Error("Usage: node scripts/load-remote.mjs <siteUrl> [--limit=N]");
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? Infinity);

const auth = JSON.parse(readFileSync(join(homedir(), ".config", "emdash", "auth.json"), "utf8"))[site];
if (!auth?.accessToken) throw new Error(`No saved login for ${site}. Run: npx emdash login --url ${site}`);

const headers = { Authorization: `Bearer ${auth.accessToken}`, "X-EmDash-Request": "1" };
const api = async (method, path, body) => {
  const res = await fetch(`${site}/_emdash/api${path}`, {
    method,
    headers: body && !(body instanceof FormData) ? { ...headers, "Content-Type": "application/json" } : headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(`${method} ${path} -> ${res.status} ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
  return json.data;
};

const seed = JSON.parse(readFileSync("seed/seed.json", "utf8"));

// --- media: download each $media URL once, upload, and reuse the resulting value --------------
const mediaCache = new Map();
async function uploadMedia({ url, filename, alt }) {
  if (mediaCache.has(url)) return mediaCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const bytes = await res.blob();
  const form = new FormData();
  form.set("file", new File([bytes], filename ?? basename(new URL(url).pathname), { type: bytes.type || "image/webp" }));
  form.set("deduplicate", "true");
  if (alt) form.set("alt", alt);
  const { item } = await api("POST", "/media", form);
  const value = {
    provider: "local",
    id: item.id,
    alt: alt ?? item.alt ?? "",
    width: item.width,
    height: item.height,
    mimeType: item.mimeType,
    filename: item.filename,
    meta: { storageKey: item.storageKey },
  };
  mediaCache.set(url, value);
  return value;
}

/** Recursively replaces { $media: {...} } objects with uploaded media values. */
async function resolveMedia(node) {
  if (Array.isArray(node)) return Promise.all(node.map(resolveMedia));
  if (node && typeof node === "object") {
    if (node.$media) return uploadMedia(node.$media);
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = await resolveMedia(v);
    return out;
  }
  return node;
}

// --- taxonomy terms ---------------------------------------------------------------------------
const termIds = {};
for (const tax of seed.taxonomies ?? []) {
  const existing = await api("GET", `/taxonomies/${tax.name}/terms`).catch(() => ({ terms: [] }));
  const byslug = new Map((existing.terms ?? existing.items ?? []).map((t) => [t.slug, t.id]));
  for (const term of tax.terms ?? []) {
    let id = byslug.get(term.slug);
    if (!id) {
      const created = await api("POST", `/taxonomies/${tax.name}/terms`, { slug: term.slug, label: term.label });
      id = (created.term ?? created.item ?? created).id;
      console.log(`term ${tax.name}/${term.slug}`);
    }
    termIds[`${tax.name}:${term.slug}`] = id;
  }
}

// --- content ----------------------------------------------------------------------------------
for (const [collection, entries] of Object.entries(seed.content ?? {})) {
  const existing = await api("GET", `/content/${collection}?limit=1`);
  if ((existing.items ?? []).length > 0) {
    console.log(`skip ${collection}: already has entries`);
    continue;
  }
  let n = 0;
  for (const entry of entries.slice(0, limit)) {
    const data = await resolveMedia(entry.data);
    const created = await api("POST", `/content/${collection}`, { ...(entry.slug && { slug: entry.slug }), data });
    const item = created.item ?? created;
    for (const [taxonomy, slugs] of Object.entries(entry.taxonomies ?? {})) {
      await api("POST", `/content/${collection}/${item.id}/terms/${taxonomy}`, {
        termIds: slugs.map((s) => termIds[`${taxonomy}:${s}`]).filter(Boolean),
      });
    }
    if ((entry.status ?? "published") === "published") await api("POST", `/content/${collection}/${item.id}/publish`, {});
    n++;
    console.log(`${collection} ${n}/${Math.min(entries.length, limit)} ${entry.status ?? "published"} ${entry.id}`);
  }
}
console.log("done; media uploaded:", mediaCache.size);
