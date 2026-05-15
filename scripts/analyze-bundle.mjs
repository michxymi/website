import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const data = JSON.parse(
  readFileSync(join(root, "bundle-analysis.json"), "utf-8")
);

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function collectUids(node) {
  const uids = new Set();
  function walk(n) {
    if (n.uid) {
      uids.add(n.uid);
    }
    if (n.children) {
      n.children.forEach(walk);
    }
  }
  walk(node);
  return uids;
}

const nodeParts = data.nodeParts;
const ASTRO_PREFIX = /^_astro\//;

const chunks = data.tree.children.map((chunk) => {
  const uids = collectUids(chunk);
  let rendered = 0,
    gzip = 0,
    brotli = 0;
  for (const uid of uids) {
    const part = nodeParts[uid];
    if (part) {
      rendered += part.renderedLength;
      gzip += part.gzipLength;
      brotli += part.brotliLength;
    }
  }
  const label = chunk.name.replace(ASTRO_PREFIX, "");
  return { label, rendered, gzip, brotli };
});

chunks.sort((a, b) => b.rendered - a.rendered);

const totalRendered = chunks.reduce((s, c) => s + c.rendered, 0);
const totalGzip = chunks.reduce((s, c) => s + c.gzip, 0);
const totalBrotli = chunks.reduce((s, c) => s + c.brotli, 0);

function pad(s, len) {
  const str = typeof s === "string" ? s : formatBytes(s);
  return str.padStart(len);
}

const nameWidth = Math.max(...chunks.map((c) => c.label.length), 8);

console.log("Bundle Analysis\n");

const col = nameWidth + 4;

console.log(
  "Chunk".padEnd(col),
  pad("Rendered", 10),
  pad("Gzip", 10),
  pad("Brotli", 10)
);
console.log("─".repeat(col + 30));

for (const chunk of chunks) {
  console.log(
    chunk.label.padEnd(col),
    pad(chunk.rendered, 10),
    pad(chunk.gzip, 10),
    pad(chunk.brotli, 10)
  );
}

console.log(" ".repeat(col), "─".repeat(32));

console.log(
  `${chunks.length} chunks total`.padEnd(col),
  pad(totalRendered, 10),
  pad(totalGzip, 10),
  pad(totalBrotli, 10)
);

const NPM_PREFIX = /^\/node_modules\/\.pnpm\/[^/]+\/node_modules\//;
const ROOT_PREFIX = /^\//;

// Largest individual modules (by rendered size)
const modules = [];
for (const meta of Object.values(data.nodeMetas)) {
  let rendered = 0,
    gzip = 0,
    brotli = 0;
  for (const partUid of Object.values(meta.moduleParts)) {
    const part = nodeParts[partUid];
    if (part) {
      rendered += part.renderedLength;
      gzip += part.gzipLength;
      brotli += part.brotliLength;
    }
  }
  if (rendered > 0 && !meta.id.startsWith("\u0000")) {
    const label = meta.id
      .replace(root, "")
      .replace(NPM_PREFIX, "npm:")
      .replace(ROOT_PREFIX, "");
    modules.push({ label, rendered, gzip, brotli });
  }
}

modules.sort((a, b) => b.rendered - a.rendered);
const top = modules.slice(0, 10);

console.log("\n\nLargest modules (rendered):\n");
for (let i = 0; i < top.length; i++) {
  const m = top[i];
  console.log(
    `  ${(i + 1).toString().padStart(2)}.`,
    m.label.padEnd(70),
    pad(m.rendered, 10)
  );
}

if (chunks.some((c) => c.rendered > 50 * 1024)) {
  console.log("\n⚠️  Warning: some chunks exceed 50 KB");
}
