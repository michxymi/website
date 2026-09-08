import rss from "@astrojs/rss";
import { SEO_CONFIG } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/utils/posts";

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    customData: `<language>${SEO_CONFIG.locale.replace("_", "-")}</language>`,
    description: SEO_CONFIG.description,
    items: posts.map((post) => ({
      description: post.data.description,
      link: `/blog/${post.id}`,
      pubDate: post.data.publishedAt,
      title: post.data.title,
    })),
    site: context.site,
    title: `${SEO_CONFIG.name} Blog`,
    trailingSlash: false,
  });
}
