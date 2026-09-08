import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  schema: z.object({
    description: z.string().optional(),
    title: z.string(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
  schema: z.object({
    coverImage: z.string().optional(),
    description: z.string().min(1).max(200),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1).max(100),
    updatedAt: z.coerce.date().optional(),
  }),
});

const experiences = defineCollection({
  loader: glob({ base: "./src/content/experiences", pattern: "**/*.md" }),
  schema: z.object({
    companyId: z.string(),
    companyLogo: z.string().optional(),
    companyName: z.string(),
    employmentType: z.string().optional(),
    endDate: z.coerce.date().optional(),
    icon: z.enum(["code", "design", "business", "education"]).default("code"),
    isCurrentEmployer: z.boolean().default(false),
    isExpanded: z.boolean().default(false),
    startDate: z.coerce.date(),
    title: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    coverImage: z.string().optional(),
    description: z.string().min(1).max(300),
    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    technologies: z.array(z.string()).default([]),
    title: z.string().min(1).max(80),
  }),
});

export const collections = { experiences, pages, posts, projects } as const;
