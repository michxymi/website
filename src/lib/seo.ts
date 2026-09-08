import type { CollectionEntry } from "astro:content";
import { SOCIAL_LINKS } from "@/lib/social";

export type JsonLdData = Record<string, unknown>;

export const SITE_CONFIG = {
  author: {
    jobTitle: "Full Stack Software Engineer and Engineering Manager",
    name: "Michael Xymitoulias",
    twitter: "@michxymi",
    worksFor: "Oxford Nanopore Technologies",
  },
  description:
    "Michael Xymitoulias is a software engineer and engineering manager focused on developer tools, technical leadership, React, TypeScript, and software teams.",
  locale: "en_GB",
  name: "Michael Xymitoulias",
  ogImage: "/opengraph-image.png",
  url: "https://michxymi.com",
} as const;

const socialProfileUrls = SOCIAL_LINKS.map((link) => link.url);

export const SEO_CONFIG = {
  ...SITE_CONFIG,
  socialProfileUrls,
} as const;

export function getBlogPostingStructuredData(
  post: CollectionEntry<"posts">
): JsonLdData {
  const { data } = post;
  const canonicalUrl = new URL(`/blog/${post.id}`, SEO_CONFIG.url).toString();
  const imageUrl = new URL(
    data.coverImage ?? SEO_CONFIG.ogImage,
    SEO_CONFIG.url
  ).toString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@id": `${SEO_CONFIG.url}/#person`,
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.url,
    },
    dateModified: (data.updatedAt ?? data.publishedAt).toISOString(),
    datePublished: data.publishedAt.toISOString(),
    description: data.description,
    headline: data.title,
    image: [imageUrl],
    mainEntityOfPage: {
      "@id": canonicalUrl,
      "@type": "WebPage",
    },
    publisher: {
      "@id": `${SEO_CONFIG.url}/#person`,
      "@type": "Person",
      name: SEO_CONFIG.author.name,
    },
  };
}
