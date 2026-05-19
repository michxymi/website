import { defineMiddleware } from "astro/middleware";
import {
  addHomepageDiscoveryHeaders,
  addVaryHeader,
} from "@/lib/agent-discovery";
import { htmlToMarkdown } from "@/lib/markdown";

const WHITESPACE_RE = /\s+/;
const HTML_MEDIA_TYPE = "text/html";
const MARKDOWN_MEDIA_TYPE = "text/markdown";
const SUPPORTED_PAGE_MEDIA_TYPES = [
  HTML_MEDIA_TYPE,
  MARKDOWN_MEDIA_TYPE,
] as const;

type PageMediaType = (typeof SUPPORTED_PAGE_MEDIA_TYPES)[number];

interface AcceptRange {
  index: number;
  q: number;
  subtype: string;
  type: string;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const accept = context.request.headers.get("accept") ?? "";
  const negotiatedType = negotiatePageMediaType(accept);

  if (negotiatedType === MARKDOWN_MEDIA_TYPE) {
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

    if (negotiatedType === null) {
      headers.set("Content-Type", "text/plain; charset=utf-8");
      headers.delete("Content-Length");

      return new Response("Not Acceptable", {
        status: 406,
        statusText: "Not Acceptable",
        headers,
      });
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

function negotiatePageMediaType(accept: string): PageMediaType | null {
  const ranges = parseAcceptHeader(accept);
  if (ranges.length === 0) {
    return HTML_MEDIA_TYPE;
  }

  const candidates = SUPPORTED_PAGE_MEDIA_TYPES.map((mediaType) => ({
    mediaType,
    quality: qualityFor(mediaType, ranges),
  })).filter((candidate) => candidate.quality.q > 0);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    const qDelta = b.quality.q - a.quality.q;
    if (qDelta !== 0) {
      return qDelta;
    }

    const specificityDelta = b.quality.specificity - a.quality.specificity;
    if (specificityDelta !== 0) {
      return specificityDelta;
    }

    return a.quality.index - b.quality.index;
  });

  return candidates[0].mediaType;
}

function parseAcceptHeader(accept: string): AcceptRange[] {
  return accept
    .split(",")
    .map((entry, index) => {
      const [mediaRange, ...params] = entry
        .split(";")
        .map((part) => part.trim());
      const [type, subtype] = mediaRange.toLowerCase().split("/");

      if (!(type && subtype)) {
        return null;
      }

      return {
        type,
        subtype,
        q: parseQuality(params),
        index,
      };
    })
    .filter((range): range is AcceptRange => range !== null);
}

function parseQuality(params: string[]): number {
  const q = params
    .find((param) => param.toLowerCase().startsWith("q="))
    ?.slice(2);

  if (q === undefined) {
    return 1;
  }

  const value = Number(q);
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}

function qualityFor(
  mediaType: PageMediaType,
  ranges: AcceptRange[]
): { q: number; specificity: number; index: number } {
  const [type, subtype] = mediaType.split("/");
  const matches = ranges
    .map((range) => ({
      q: range.q,
      specificity: mediaRangeSpecificity(range, type, subtype),
      index: range.index,
    }))
    .filter((match) => match.specificity >= 0);

  if (matches.length === 0) {
    return { q: 0, specificity: -1, index: Number.MAX_SAFE_INTEGER };
  }

  matches.sort((a, b) => {
    const specificityDelta = b.specificity - a.specificity;
    if (specificityDelta !== 0) {
      return specificityDelta;
    }

    return a.index - b.index;
  });

  return matches[0];
}

function mediaRangeSpecificity(
  range: AcceptRange,
  type: string,
  subtype: string
): number {
  if (range.type === type && range.subtype === subtype) {
    return 2;
  }

  if (range.type === type && range.subtype === "*") {
    return 1;
  }

  if (range.type === "*" && range.subtype === "*") {
    return 0;
  }

  return -1;
}

function estimateMarkdownTokens(markdown: string): string {
  const words = markdown.trim().split(WHITESPACE_RE).filter(Boolean).length;
  return String(Math.ceil(words * 1.33));
}
