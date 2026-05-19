# Markdown for Agents

This site supports content negotiation for AI agents via the `Accept: text/markdown` header. When an agent sends a request with `Accept: text/markdown`, the server returns a markdown version of the HTML response using `Content-Type: text/markdown`.

## Implementation

A middleware at `src/middleware.ts` intercepts requests with `Accept: text/markdown`, renders the normal HTML page, and converts it to markdown using the local converter in `src/lib/markdown.ts`. Non-HTML responses pass through unchanged.

## Reference

- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
