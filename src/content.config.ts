import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experiences" }),
  schema: z.object({
    companyId: z.string(),
    companyName: z.string(),
    companyLogo: z.string().optional(),
    isCurrentEmployer: z.boolean().default(false),
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    employmentType: z.string().optional(),
    icon: z.enum(["code", "design", "business", "education"]).default("code"),
    isExpanded: z.boolean().default(false),
  }),
});

export const collections = { experiences, pages };
