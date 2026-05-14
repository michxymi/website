import type { CollectionEntry } from "astro:content";
import { SEO_CONFIG } from "@/lib/seo";

export type JsonLdData = Record<string, unknown>;

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
