---
title: "My NextJS Site Shipped 900 KB of JavaScript. Here's What Replaced It."
description: "CVEs every other day. Mystery Core Web Vitals on a static site. 891 KB of client-side JavaScript to render text and images. Here's how Astro, Starwind UI, and Cloudflare Workers cut it by 91%."
publishedAt: 2026-05-21
tags: ["nextjs", "astro", "web-performance", "tailwind", "cloudflare", "mcp"]
featured: true
---

I had my eyes on Astro for a while. Component-driven UIs without the client-side runtime penalty, the virtual DOM overhead, or the endless saga of `useEffect`. No shadow DOM. No hydration gymnastics. Just HTML that ships as HTML.

When [Cloudflare acquired Astro](https://astro.build/blog/joining-cloudflare/) and its weekly npm downloads crossed the [3 million mark](https://www.npmjs.com/package/astro), I figured the framework was here to stay. So I did the obvious thing and rewrote my entire personal website with it.

React and NextJS aren't bad. But over time, the toolchain started to feel like a massive hammer for a very tiny nail. Moving to Astro wasn't just swapping dependencies. It was an architectural cleanup I didn't know I needed.

## Why Walk Away from NextJS?

You might ask why anyone would bother migrating a website that already works. Two reasons: the maintenance overhead was relentless, and the performance was embarrassingly bad for what the site actually does.

### 1. The Constant Security and Maintenance Tax
React and its ecosystem have been getting hit with a steady stream of [critical security vulnerabilities](https://nextjs.org/blog/CVE-2025-66478), a lot of them around React Server Components. My portfolio isn't critical infrastructure and I do have [mitigations in place with pnpm](/blog/npm-dependencies-are-a-liability), but nobody wants their personal site sitting around as an unpatched exploit vector. Keeping up with the patches just to keep a mostly static site secure was exhausting.

### 2. Mystery Core Web Vitals on a "Static" Site
The other problem was genuinely confusing. Actual visitors data were reporting terrible Core Web Vitals. Some of them from the exact same region Vercel had deployed to. 90% of my site is static content. A global CDN should be giving me perfect scores. It wasn't.

[When I posted about this on X](https://x.com/michxymi/status/2026966589942161700) and started digging, the only logical culprit was the **client-side bundle size**. The analytics were only showing bad numbers on mobile, which reinforced that theory.

A standard NextJS site ships the entire React and NextJS runtimes at a minimum. Layer on client-side Radix components, [shadcn/ui](https://ui.shadcn.com/) state, custom interactivity, and [Framer Motion](https://motion.dev/) animations, and the tax compounds fast. Several hundred kilobytes of JavaScript, just to render text and layouts. As you'll see below, the difference is night and day.

## Find a Better Path: The Tipping Point

To be fair, the React ecosystem does get some things right. shadcn/ui is a genuinely good building block. Polished, accessible, copy-pasteable components I can fully own. And Vercel's hosting feedback loop has set the standard for developer ergonomics. Walking away from React meant finding replacements for both of those things.

That's when I found [Starwind UI](https://starwind.dev/).

Starwind is what made the migration viable. Same copy-paste, design-system workflow as shadcn, but built natively for Astro's HTML-first model. Minimal JavaScript, accessible, lightweight components you drop in and start using. It runs on Tailwind CSS primitives and standard color tokens under the hood, so there's nothing exotic to learn.

Working with it was a genuine surprise. Going back to raw HTML and CSS with a modern composition model makes you think about layouts differently. You end up designing more minimally, almost by accident.

## Refining the Visuals and Content Flow

Since I was rebuilding everything anyway, I cleaned up a lot of visual junk. The NextJS version had accumulated rough edges in the form of inconsistent font sizes, margins, and padding that I'd been ignoring for months. I also fell out of love with [Inter](https://fontsource.org/fonts/inter). My design leans monochrome and minimal, and I wanted a body font with more personality. I landed on [IBM Plex Sans](https://fontsource.org/fonts/ibm-plex-sans) for copy, paired with [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) for headings.

Content handling is where Astro really pulls ahead. In NextJS, rendering Markdown involves wrangling MDX remote loaders, remark/rehype pipelines, and a pile of build-time plugins. Astro just has first-class, built-in support for markdown and type-safe content collections. I was 90% done without adding a single extra library.

For code blocks, I installed [astro-expressive-code](https://expressive-code.com/). Within minutes I had dark-mode theme switching, interactive tabs, sheet-style titles, and copy-to-clipboard, more features than I had under NextJS, in fewer lines of code.

## Going Dynamic: The Edge, Cloudflare, and the Agentic Web

One thing I really wanted was making the site accessible for AI agents. The classic, human-only SEO era is over. The modern web gets hit by humans and LLM-backed browsing agents alike, and I wanted to serve both properly: **humans get styled HTML, agents get clean Markdown**. I used [Is Agent Ready?](https://isitagentready.com/www.michxymi.com) and the [Accept Markdown readiness checker](https://acceptmarkdown.com/#readiness) to validate that the implementation was conformant and actually discoverable.

To achieve this content segregation, I wrote an Astro middleware layer that sniffs incoming user agents. However, executing this kind of header inspection and request modification on the fly is a dynamic operation. Since Astro defaults to static-site generation (SSG) outputs, I had to flip the output switch in my configuration:

<div class="not-sw-prose">

```typescript title="astro.config.mjs"
export default defineConfig({
  output: "server", // Switch to Server-Side Rendering (SSR)
  // ...
});
```

</div>

This means routing is resolved on-demand. In theory, that's a TTFB hit compared to pre-rendered files. In practice, I can't measure it, and being able to serve agent-ready formats dynamically at the edge is well worth the trade-off.

Since I was already rewriting the routing layers, it made sense to reconsider hosting. I moved from Vercel to [Cloudflare Workers](https://www.cloudflare.com/products/workers/).

Vercel supports Astro, but Astro is now part of the Cloudflare family, making it the native home. Deploying with Wrangler is painless, and the broader infrastructure is hard to beat:
* Serverless edge execution via Workers.
* D1 SQL databases with strong read performance.
* R2 Object Storage with zero egress fees.
* Native email routing.

Do I need all of this for a portfolio? No. But they’re there when I do, as first-party services, not third-party integrations bolted on through a dashboard.

## Comparing the Dependencies

To really put "more for less" into perspective, look at the package dependencies.

In NextJS, my `package.json` was drowning in Radix primitives, MDX compilers, and motion runtimes:

<div class="not-sw-prose">

```json title="package.json"
{
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@radix-ui/react-use-controllable-state": "^1.2.2",
    "@shikijs/transformers": "^3.19.0",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.555.0",
    "motion": "^12.23.24",
    "next": "16.2.4",
    "next-mdx-remote": "^6.0.0",
    "next-themes": "^0.4.6",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-icons": "^5.5.0",
    "shiki": "^3.19.0",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.1.13"
  }
}
```

</div>

By moving to Astro, the runtime dependency list got a lot shorter. Native Astro components, almost no client-side scripts:

<div class="not-sw-prose">

```json title="package.json"
{
  "dependencies": {
    "@astrojs/cloudflare": "^13.5.1",
    "@astrojs/rss": "^4.0.18",
    "@astrojs/sitemap": "^3.7.2",
    "@tabler/icons": "^3.42.0",
    "@tailwindcss/forms": "^0.5.11",
    "@tailwindcss/vite": "^4.2.4",
    "astro": "^6.3.0",
    "astro-expressive-code": "^0.42.0",
    "tailwind-merge": "^3.5.0",
    "tailwind-variants": "^3.2.2",
    "tailwindcss": "^4.2.4",
    "tw-animate-css": "^1.4.0"
  }
}
```

</div>

## The Cold, Hard Numbers

NextJS and Astro build and report client modules differently, so I had to normalize the outputs. I used `next experimental-analyze` to inspect the NextJS production bundle (estimated compressed and uncompressed sizes across all route modules), and the [Rollup Visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer) plugin for Vite on the Astro side to get exact rendered, gzip, and brotli sizes for every client chunk.

Here's the client-side javascript that actually gets parsed and executed by your browser on a representative page load:

<div class="not-sw-prose">

| Payload Segment | NextJS | Astro | Savings |
| :--- | :---: | :---: | :---: |
| **Framework Runtime & Router** <br /> *(React 19, React-DOM, Next.js 16 App Router, segment cache, PPR, Turbopack runtime)* | ~513.3 KB | ~31.4 KB | **-93.9%** |
| **UI Components & Core Utilities** <br /> *(Radix primitives, Floating-UI, Tailwind-merge, clsx, Lucide, application components)* | ~133.2 KB | ~45.2 KB | **-66.1%** |
| **Animation Engine** <br /> *(Framer Motion / Motion DOM)* | ~109.5 KB | *None (Native CSS)* | **-100%** |
| **Polyfills & Helpers** <br /> *(polyfill-nomodule, module polyfills, miscellaneous utilities)* | ~135.9 KB | *None* | **-100%** |
| **Total JavaScript Footprint (Rendered)** | **~891.9 KB** | **~76.5 KB** | **-91.4%** |
| **Compressed Over-the-Wire Weight** | **~347.0 KB** *(Est. Gzip)* | **~16.2 KB** *(Actual Brotli)* | **-95.3%** |

</div>

The NextJS analyzer also reports that across *all* route modules, the total client-side javacript climbs to **1.36 MB uncompressed** and **555 KB compressed** across **564 modules**. Astro's entire client footprint? **4 chunks**, **9 modules**. Same regardless of which page the visitor lands on.

By dropping the React runtime and replacing client-side state managers with native browser behavior and lightweight Starwind components, the javascript the browser has to parse dropped by **over 91%**. That's not a rounding error.

## Conclusion

Moving from NextJS to Astro wasn't just a toolchain swap. It was a philosophical shift.

I no longer pay a client-side performance tax for the luxury of a component-driven DX. I don't have to babysit server-component CVEs. And I kept the design I wanted.

Next on the list: pairing Astro with [HTMX](https://htmx.org/) for hypermedia-driven interactivity backed by a serverless Worker API, and going deeper into Cloudflare's platform: [R2](https://developers.cloudflare.com/r2/) for object storage, [D1](https://developers.cloudflare.com/d1/) for a serverless SQL database. The infrastructure is already there. Just need to wire it up.

Sometimes the best way forward is just building less.

## Suggested Reading

- [Hypermedia Systems](https://hypermedia.systems/)
- [AHA Stack](https://ahastack.dev/)
