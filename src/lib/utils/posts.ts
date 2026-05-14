import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

const wordsPerMinute = 200;
const whitespacePattern = /\s+/;

const byPublishedDateDesc = (a: PostEntry, b: PostEntry) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime();

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts.sort(byPublishedDateDesc);
}

export async function getRecentPosts(limit: number) {
  const posts = await getPublishedPosts();

  return posts.slice(0, limit);
}

export async function getPostStaticPaths() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export function getReadingTime(content = "") {
  const wordCount = content
    .trim()
    .split(whitespacePattern)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
