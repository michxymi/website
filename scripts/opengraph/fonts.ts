import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FONT_DIR = resolve("node_modules/@fontsource");

function loadFont(name: string, weight: number): ArrayBuffer {
  const path = resolve(
    FONT_DIR,
    name,
    "files",
    `${name}-latin-${weight}-normal.woff`
  );
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export interface FontSource {
  data: ArrayBuffer;
  name: string;
  style: "normal";
  weight: 400 | 500 | 600;
}

export function getFonts(): FontSource[] {
  return [
    {
      data: loadFont("ibm-plex-sans", 400),
      name: "IBM Plex Sans",
      style: "normal",
      weight: 400,
    },
    {
      data: loadFont("ibm-plex-sans", 600),
      name: "IBM Plex Sans",
      style: "normal",
      weight: 600,
    },
    {
      data: loadFont("jetbrains-mono", 400),
      name: "JetBrains Mono",
      style: "normal",
      weight: 400,
    },
    {
      data: loadFont("jetbrains-mono", 500),
      name: "JetBrains Mono",
      style: "normal",
      weight: 500,
    },
  ];
}
