import { defineMiddleware } from "astro/middleware";
import {
  addHomepageDiscoveryHeaders,
  addVaryHeader,
} from "@/lib/agent-discovery";
import { htmlToMarkdown } from "@/lib/markdown";

const WHITESPACE_RE = /\s+/;

export const onRequest = defineMiddleware(async (context, next) => {
  const accept = context.request.headers.get("accept") ?? "";

  if (acceptsMarkdown(accept)) {
    const response = await next();
    const headers = new Headers(response.headers);
    addHomepageDiscoveryHeaders(context.url, headers);
    addVaryHeader(headers, "Accept");

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    if (context.request.method === "HEAD") {
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      headers.delete("Content-Length");
      return new Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const html = await response.text();
    const markdown = htmlToMarkdown(html);
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    headers.set("x-markdown-tokens", estimateMarkdownTokens(markdown));
    headers.delete("Content-Length");

    return new Response(markdown, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const response = await next();
  const headers = new Headers(response.headers);
  addHomepageDiscoveryHeaders(context.url, headers);

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    addVaryHeader(headers, "Accept");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

function acceptsMarkdown(accept: string): boolean {
  return accept.split(",").some((entry) => {
    const [mediaType, ...params] = entry.split(";").map((part) => part.trim());
    if (mediaType.toLowerCase() !== "text/markdown") {
      return false;
    }

    const q = params
      .find((param) => param.toLowerCase().startsWith("q="))
      ?.slice(2);

    return q !== "0" && q !== "0.0" && q !== "0.00";
  });
}

function estimateMarkdownTokens(markdown: string): string {
  const words = markdown.trim().split(WHITESPACE_RE).filter(Boolean).length;
  return String(Math.ceil(words * 1.33));
}
