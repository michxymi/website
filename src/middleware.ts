import { defineMiddleware } from "astro/middleware";
import { htmlToMarkdown } from "@/lib/markdown";

export const onRequest = defineMiddleware(async (context, next) => {
  const accept = context.request.headers.get("accept") ?? "";

  if (accept.includes("text/markdown")) {
    const response = await next();
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return response;
    }
    const html = await response.text();
    const markdown = htmlToMarkdown(html);
    return new Response(markdown, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": "text/markdown",
      },
    });
  }

  return next();
});
