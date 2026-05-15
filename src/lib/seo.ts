import type { CollectionEntry } from "astro:content";
import { SOCIAL_LINKS } from "@/lib/social";

export type JsonLdData = Record<string, unknown>;

export const SITE_CONFIG = {
  name: "Michael Xymitoulias",
  description:
    "Michael Xymitoulias is a software engineer and engineering manager focused on developer tools, technical leadership, React, TypeScript, and software teams.",
  url: "https://michxymi.com",
  author: {
    name: "Michael Xymitoulias",
    twitter: "@michxymi",
    jobTitle: "Full Stack Software Engineer and Engineering Manager",
    worksFor: "Oxford Nanopore Technologies",
  },
  locale: "en_GB",
  ogImage: "/opengraph-image.png",
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
    headline: data.title,
    description: data.description,
    image: [imageUrl],
    datePublished: data.publishedAt.toISOString(),
    dateModified: (data.updatedAt ?? data.publishedAt).toISOString(),
    author: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: SEO_CONFIG.author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };
}
