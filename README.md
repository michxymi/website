# michxymi.com

My personal blog and portfolio, built with AstroJS, Starwind components, Tailwind CSS, and deployed to Cloudflare Workers.

## Stack

- [Astro](https://astro.build/) 6 with server output
- [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) for Cloudflare Workers deployment
- [Tailwind CSS](https://tailwindcss.com/) 4 via the Vite plugin
- [Starwind](https://starwind.dev/) components in `src/components/starwind`
- Astro content collections for pages, posts, projects, and experience entries
- `astro-expressive-code` for code block rendering
- `satori` and `@resvg/resvg-js` for generated Open Graph images
- `ultracite`, Biome, TypeScript, commitlint, and lefthook for local quality checks

## Routes and Features

- `/` - About page assembled from `src/content/pages/about.md`, skills, and experience entries.
- `/now` - Current tools, GitHub activity, and recent posts.
- `/projects` and `/projects/[slug]` - Project index and detail pages from `src/content/projects`.
- `/blog` and `/blog/[slug]` - Blog index and post pages from `src/content/posts`.
- `/contact` - Contact form and social links.
- `/feed.xml` - RSS feed generated from published blog posts.
- `/openapi.json` - OpenAPI metadata for public API and discovery endpoints.
- `/api/health` - Health endpoint for uptime checks.
- `/.well-known/*` - Agent, OAuth, OpenID, API catalog, and MCP discovery metadata.

The root layout provides the sidebar navigation, theme switcher, social links, RSS link, CV download, SEO metadata, JSON-LD support, and WebMCP tool registration.

## Content

Content is managed with Astro content collections in `src/content.config.ts`.

- Pages: `src/content/pages/*.md`
- Blog posts: `src/content/posts/*.md`
- Projects: `src/content/projects/*.md`
- Experience entries: `src/content/experiences/*.md`

Blog posts support `draft`, `featured`, `tags`, `coverImage`, `publishedAt`, and `updatedAt` frontmatter. Draft posts are filtered out by the post utilities before rendering feeds and public pages.

Project entries support technologies, live URLs, repository URLs, and cover images. Experience entries drive the work history on the homepage.

## Requirements

- Node.js `>=24.11.0`
- pnpm `11.2.1`

Install dependencies:

```sh
pnpm install
```

## Development

```sh
pnpm dev
```

Starts the Astro dev server at `http://localhost:4321`.

Run quality checks:

```sh
pnpm check
pnpm typecheck
```

Apply automated formatting and fixes:

```sh
pnpm fix
```

## Open Graph Images

Open Graph images are generated before production builds:

```sh
pnpm build:og
```

The generator reads blog posts and projects from `src/content`, then writes PNG cards to `public/opengraph-image.png` and `public/social-cards`.

To regenerate existing cards, pass `--force` directly to the script:

```sh
node scripts/opengraph/generate.ts --force
```

## Build and Preview

```sh
pnpm build
pnpm preview
```

`pnpm build` runs the Open Graph generator first, then builds the Astro site using the Cloudflare adapter.

For bundle inspection:

```sh
pnpm analyze
```

## Deployment

The site is configured for Cloudflare Workers with static assets in `wrangler.jsonc`.

Deploy with Wrangler:

```sh
pnpm deploy
```

This runs a production build and then publishes via:

```sh
wrangler deploy
```

Cloudflare observability is enabled, and the Worker is configured to run before assets so Astro server routes, middleware, and well-known endpoints are handled correctly.
