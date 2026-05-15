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

const WIDTH = 1200;
const HEIGHT = 630;
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

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function stripExt(file: string): string {
  return file.replace(MD_EXT, "");
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
      slug: stripExt(file),
      title: (data.title as string) ?? stripExt(file),
      description: data.description as string | undefined,
      tags: (data.tags as string[]) ?? [],
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt as string)
        : undefined,
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
      slug: stripExt(file),
      title: (data.title as string) ?? stripExt(file),
      description: data.description as string | undefined,
      technologies: (data.technologies as string[]) ?? [],
    };
  });
}

async function generatePNG(
  element: { type: string; props: Record<string, unknown> },
  fonts: Fonts
): Promise<Uint8Array> {
  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
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

  let generated = 0;
  let skipped = 0;
  console.log(`\nPosts: ${posts.length}`);

  for (const post of posts) {
    const outPath = join(outputDir, `${post.slug}.png`);
    if (!force && existsSync(outPath)) {
      console.log(`  ${post.slug}.png — skipped (exists)`);
      skipped++;
      continue;
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
      console.log(`  ${post.slug}.png — done`);
      generated++;
    } catch (err) {
      console.error(`  ${post.slug}.png — failed:`, err);
    }
  }

  return [generated, skipped];
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

  let generated = 0;
  let skipped = 0;
  console.log(`\nProjects: ${projects.length}`);

  for (const project of projects) {
    const outPath = join(outputDir, `${project.slug}.png`);
    if (!force && existsSync(outPath)) {
      console.log(`  ${project.slug}.png — skipped (exists)`);
      skipped++;
      continue;
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
      console.log(`  ${project.slug}.png — done`);
      generated++;
    } catch (err) {
      console.error(`  ${project.slug}.png — failed:`, err);
    }
  }

  return [generated, skipped];
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
