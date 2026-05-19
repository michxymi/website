# WebMCP Tools

This site implements the WebMCP API to expose site tools to AI agents via the browser. The tools are registered using `navigator.modelContext.provideContext()` (or the `registerTool` API) with JSON Schema input definitions.

## Available Tools

- `get_site_info` — Get structured information about the website and its author
- `get_page_content` — Get the full text content of the current page
- `get_navigation` — Get the site navigation structure
- `get_social_links` — Get social media profile links
- `navigate_to` — Navigate to a page on the website
- `get_cv` — Get the URL to download the CV/resume
- `search_blog_posts` — Search blog posts by keyword

## Implementation

Tools are defined in `src/lib/webmcp.ts` and registered on page load in `src/layouts/root.astro`.

## Reference

- [WebMCP Specification](https://webmachinelearning.github.io/webmcp/)
- [Chrome WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
