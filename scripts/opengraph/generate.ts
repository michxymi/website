import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import satori from "satori";
import { DefaultCard, PostCard, ProjectCard } from "./cards.ts";
import { getFonts } from "./fonts.ts";

const CONTENT_DIR = resolve("src/content");
const PUBLIC_DIR = resolve("public");
const POSTS_DIR = join(CONTENT_DIR, "posts");
const PROJECTS_DIR = join(CONTENT_DIR, "projects");

const WIDTH = 1200 as const;
const HEIGHT = 630 as const;
const MD_EXT = /\.md$/;

interface PostData {
  description?: string;
  publishedAt?: Date;
  slug: string;
  tags: string[];
  title: string;
}

interface ProjectData {
  description?: string;
  slug: string;
  technologies: string[];
  title: string;
}

type Fonts = ReturnType<typeof getFonts>;

interface GenerationResult {
  error?: unknown;
  slug: string;
  status: "generated" | "skipped" | "failed";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function stripExt(file: string): string {
  return file.replace(MD_EXT, "");
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function summarizeResults(results: GenerationResult[]): [number, number] {
  for (const result of results) {
    if (result.status === "failed") {
      console.error(`  ${result.slug}.png — failed:`, result.error);
    } else {
      const message = result.status === "skipped" ? "skipped (exists)" : "done";
      console.log(`  ${result.slug}.png — ${message}`);
    }
  }

  return [
    results.filter(({ status }) => status === "generated").length,
    results.filter(({ status }) => status === "skipped").length,
  ];
}

function readPosts(): PostData[] {
  if (!existsSync(POSTS_DIR)) {
    return [];
  }
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      description: data.description as string | undefined,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt as string)
        : undefined,
      slug: stripExt(file),
      tags: readStringArray(data.tags),
      title: readString(data.title, stripExt(file)),
    };
  });
}

function readProjects(): ProjectData[] {
  if (!existsSync(PROJECTS_DIR)) {
    return [];
  }
  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = readFileSync(join(PROJECTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      description: data.description as string | undefined,
      slug: stripExt(file),
      technologies: readStringArray(data.technologies),
      title: readString(data.title, stripExt(file)),
    };
  });
}

async function generatePNG(
  element: { type: string; props: Record<string, unknown> },
  fonts: Fonts
): Promise<Uint8Array> {
  const svg = await satori(element, {
    fonts,
    height: HEIGHT,
    width: WIDTH,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  const png = resvg.render();
  return png.asPng();
}

async function generateDefault(fonts: Fonts, force: boolean): Promise<number> {
  const defaultPath = join(PUBLIC_DIR, "opengraph-image.png");
  if (force || !existsSync(defaultPath)) {
    const label = "[default] opengraph-image.png";
    const png = await generatePNG(DefaultCard(), fonts);
    writeFileSync(defaultPath, png);
    console.log(`${label} — done`);
    return 1;
  }
  console.log("[default] opengraph-image.png — skipped (exists)");
  return 0;
}

async function generatePosts(
  fonts: Fonts,
  outputDir: string,
  force: boolean
): Promise<[number, number]> {
  const posts = readPosts();
  if (posts.length === 0) {
    return [0, 0];
  }

  console.log(`\nPosts: ${posts.length}`);

  const results = await Promise.all(
    posts.map(async (post): Promise<GenerationResult> => {
      const outPath = join(outputDir, `${post.slug}.png`);
      if (!force && existsSync(outPath)) {
        return { slug: post.slug, status: "skipped" };
      }

      try {
        const dateStr = post.publishedAt
          ? formatDate(post.publishedAt)
          : undefined;
        const png = await generatePNG(
          PostCard({
            footerLeft: dateStr,
            footerTags: post.tags,
            label: "Blog",
            subtitle: post.description,
            title: post.title,
          }),
          fonts
        );
        writeFileSync(outPath, png);
        return { slug: post.slug, status: "generated" };
      } catch (error) {
        return { error, slug: post.slug, status: "failed" };
      }
    })
  );

  return summarizeResults(results);
}

async function generateProjects(
  fonts: Fonts,
  outputDir: string,
  force: boolean
): Promise<[number, number]> {
  const projects = readProjects();
  if (projects.length === 0) {
    return [0, 0];
  }

  console.log(`\nProjects: ${projects.length}`);

  const results = await Promise.all(
    projects.map(async (project): Promise<GenerationResult> => {
      const outPath = join(outputDir, `${project.slug}.png`);
      if (!force && existsSync(outPath)) {
        return { slug: project.slug, status: "skipped" };
      }

      try {
        const png = await generatePNG(
          ProjectCard({
            footerTags: project.technologies,
            label: "Project",
            subtitle: project.description,
            title: project.title,
          }),
          fonts
        );
        writeFileSync(outPath, png);
        return { slug: project.slug, status: "generated" };
      } catch (error) {
        return { error, slug: project.slug, status: "failed" };
      }
    })
  );

  return summarizeResults(results);
}

async function main() {
  const force = process.argv.includes("--force");

  const fonts = getFonts();
  const socialDir = join(PUBLIC_DIR, "social-cards");
  const postsDir = join(socialDir, "posts");
  const projectsDir = join(socialDir, "projects");

  mkdirSync(postsDir, { recursive: true });
  mkdirSync(projectsDir, { recursive: true });

  const defaultCount = await generateDefault(fonts, force);
  const [postCount, postSkipped] = await generatePosts(fonts, postsDir, force);
  const [projectCount, projectSkipped] = await generateProjects(
    fonts,
    projectsDir,
    force
  );

  const totalGenerated = defaultCount + postCount + projectCount;
  const totalSkipped = postSkipped + projectSkipped;

  console.log(`\nDone. Generated: ${totalGenerated}, Skipped: ${totalSkipped}`);
}

main();
