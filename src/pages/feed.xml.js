import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SEO_CONFIG } from "@/lib/seo";

export async function GET(context) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: `${SEO_CONFIG.name} Blog`,
    description: SEO_CONFIG.description,
    site: context.site,
    trailingSlash: false,
    customData: `<language>${SEO_CONFIG.locale.replace("_", "-")}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}`,
    })),
  });
}
