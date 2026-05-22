---
title: "Why I Moved My Website From NextJS to Astro"
description: "React Server Components, security updates, bloating bundle sizes, and the agentic web. Here is why shifting to Astro, Starwind UI, and Cloudflare Workers was a breath of fresh air."
publishedAt: 2026-05-21
tags: ["nextjs", "astro", "web-performance", "tailwind", "cloudflare", "mcp"]
featured: true
---

I had my eyes on the Astro framework for quite a while. The promise of its hypermedia-first driven approach, coupled with island developer ergonomics, was incredibly compelling. Building React-style, component-driven UIs without the client-side runtime penalty, the virtual DOM overhead, the shadow DOM, and the endless saga of `useEffect` felt like a return to basic web sanity. 

When [Cloudflare acquired Astro](https://astro.build/blog/joining-cloudflare/), and its weekly npm downloads crossed the [3 million mark](https://www.npmjs.com/package/astro) , I knew that the framework is here to stay. I was keen to deploy it in a real-world project. What better way to put it through its paces than porting my existing, NextJS personal website?

While React and NextJS offer a powerful developer ecosystem, over time, that toolchain started to feel like a massive hammer for a very tiny nail. Moving to Astro wasn't just a change in dependencies. It was a refreshing architectural cleanup.

---

## Why Walk Away from NextJS?

Understandably, you might ask why anyone would go through the hassle of migrating a functioning website. My decision came down to two primary pain points: maintenance overhead, and mysterious, sluggish performance.

### 1. The Constant Security and Maintenance Tax
React and its surrounding ecosystem have recently been plagued by a series of [critical security vulnerabilities](https://nextjs.org/blog/CVE-2025-66478), many of them centered around React Server Components (RSCs). While my personal website is by no means critical infrastructure, nobody wants their portfolio to be an unpatched vector for an exploit. Keeping up with the constant stream of security updates and patches proved to be an exhausting chore just to keep a mostly static site offline-safe and secure. 

### 2. Mystery Core Web Vitals on a "Static" Site
The second pain point was seeing lackluster Core Web Vitals reported by actual visitors. The weirdest part? Some of these users were hitting the site from the exact same region where Vercel had deployed it. Roughly 90% of my website is static content, and on paper, a global CDN deployment should net perfect scores. 

[But when I posted about this on X](https://x.com/michxymi/status/2026966589942161700) and started digging the only logical conclusion was my **client-side bundle size**. It's also worth mentioning that the analytics where showing bad numbers only in mobile visits, which kinda reinforced my assumptions.

At a minimum, a standard NextJS site ships the entire React and NextJS runtimes. Combine that with client-side Radix components, [shadcn/ui](https://ui.shadcn.com/) state, my own interactivity directives, and sleek animation engines like [Framer Motion](https://motion.dev/), and the runtime tax compounds. Several hundred kilobytes of javascript were being sent to browsers just to display text and basic layouts. Initially, it does not look like much, but as you will see below, the difference in the bundle profile is night and day.

---

## Find a Better Path: The Tipping Point

Despite my issues, the React ecosystem does a lot of things exceptionally well. First, shadcn/ui is an invaluable architectural block for anything I build. It gives me highly polished, accessible, copy-pasteable core components that I can fully own and customize out-of-the-box. Second, Vercel's hosting feedback loop has defined developer ergonomics for years. Leaving React meant finding an alternative that wouldn't compromise on these details.

And that is when I stumbled upon [Starwind UI](https://starwind.dev/).

Starwind UI was the true tipping point for my migration. It delivers the exact same copy-paste, design-system ergonomics of shadcn but wrapped natively in Astro's HTML-first shell. It represents the best of both worlds: minimal javascript, accessible, lightweight components you can drop in and start building with immediately. Because Starwind UI relies on Tailwind CSS primitives and standard colors under the hood, there are no exotic utility choices or unfamiliar configurations to learn. 

Working with Starwind was surprisingly refreshing. Returning to the raw fundamentals of HTML and CSS, but with a modern component composition model, makes you think about layout structures differently and naturally urges you to design more minimally.

---

## Refining the Visuals and Content Flow

Since I was rebuilding everything anyway, I took the opportunity to clean up a lot of visual inconsistencies. My previous NextJS implementation had accumulated several rough edges when it came to font sizes, margins, and padding. I also fell out of love with the [Inter](https://fontsource.org/fonts/inter) font. My overall design aesthetic leans monochrome and minimalist, and I wanted a body font with a bit more structural personality. I ended up choosing [IBM Plex Sans](https://fontsource.org/fonts/ibm-plex-sans) for copy, pairing it with [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) for headings.

Content is another area where Astro shines brilliantly. In NextJS, rendering Markdown gracefully is a chore that involves managing custom MDX remote loaders, remark/rehype pipelines, and a suite of adjacent build-time plugins. In contrast, Astro offers first-class, built-in support for markdown and type-safe content collections out-of-the-box. I was 90% of the way there without adding a single extra library.

To make the code blocks interactive, I installed [astro-expressive-code](https://expressive-code.com/). Within minutes, I had dark-mode theme switching, interactive tabs, sheet-style titles, and integrated copy-to-clipboard actions. I ended up with more layout features than I had under NextJS, using fractionally fewer lines of code.

---

## Going Dynamic: The Edge, Cloudflare, and the Agentic Web

One feature I was extremely keen to add was making the website accessible for AI agents. We are past the classic, human-only SEO era. The modern web is accessed both by humans and by LLM-backed web-browsing agents. I wanted to treat them like first-class citizens: **humans get styled HTML, agents get clean Markdown**. 

To achieve this content segregation, I wrote an Astro middleware layer that sniffs incoming user agents. However, executing this kind of header inspection and request modification on the fly is a dynamic operation. Since Astro defaults to static-site generation (SSG) outputs, I had to flip the output switch in my configuration:

<div class="not-sw-prose">

```typescript title="astro.config.mjs"
export default defineConfig({
  output: "server", // Switch to Server-Side Rendering (SSR)
  // ...
});
```

</div>

This transition to SSR means some routing is resolved on-demand. In theory, that's a small TTFB latency hit compared to pre-rendered edge files. In practice, the performance penalty is completely imperceptible, and the sheer capability of serving dedicated, agent-ready formats dynamically at the edge makes it incredibly worth it. 

Since I was flipping the architecture to SSR and rewriting the routing layers, it made sense to re-evaluate hosting. I decided to migrate from Vercel to **Cloudflare Workers**.

While Vercel has support for Astro, Astro is now officially part of the Cloudflare family, making Cloudflare’s platform its native home. Deploying onto the global edge network using Wrangler is incredibly smooth, and Cloudflare's broader infrastructure is difficult to beat:
* Reliable serverless edge execution via Workers.
* D1 SQL databases with incredible read performance.
* R2 Object Storage with absolutely zero egress fees.
* Native email routing and workers.

Will I need every single one of these services for a portfolio site? Probably not immediately. But they are invaluable assets for future platform experiments. Whereas Vercel closes these feature gaps using third-party marketplace integrations managed via their dashboard, Cloudflare offers them as a unified, first-party web ecosystem.

---

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

By moving to Astro, my runtime footprint evaporated. I'm leveraging native Astro components with incredibly minimal client-side scripts:

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

---

## The Cold, Hard Numbers

Because NextJS and Astro build and report client modules differently, I had to normalize the outputs to make the comparison as fair and transparent as possible. NextJS’s experimental bundle analyzer measures estimated parsed/rendered sizes of route modules and framework chunks, while Astro utilizes the Rollup Visualizer plugin for Vite to expose exact rendered chunk allocations.

Let’s look at the client-side javascript that actually gets parsed and executed by your browser, broken down into standardized slices for a direct side-by-side comparison:

<div class="not-sw-prose">

| Payload Segment | NextJS | Astro | Savings |
| :--- | :---: | :---: | :---: |
| **Framework Runtime & Router** <br /> *(React, React-DOM, and Next.js Engine internals)* | ~334.2 KB | ~14.9 KB | **-95.5%** |
| **UI Components & Core Utilities** <br /> *(Radix triggers, Tailwind-merge, clsx, custom dropdowns/sidebars)* | ~111.4 KB | ~45.2 KB | **-59.4%** |
| **Animation Engine** <br /> *(Framer Motion / Motion DOM)* | ~66.7 KB | *None (Native CSS)* | **-100%** |
| **Styles, Polyfills & Helpers** <br /> *(Global CSS, polyfill-nomodule, cache layers, helpers)* | ~68.9 KB | ~16.4 KB | **-76.2%** |
| **Total JavaScript Footprint (Rendered)** | **~581.2 KB** | **~76.5 KB** | **-86.8%** |
| **Compressed Over-the-Wire Weight** | **~145.3 KB** *(Est. Gzip)* | **~16.2 KB** *(Actual Brotli)* | **-88.8%** |

</div>

By eliminating the heavy React runtime dependency and replacing complex client-side state managers with native browser behavior and unstyled, lightweight Starwind modules (modals, toasts, and tooltips), the uncompressed client-side javascript parsed by the browser dropped by **over 86%**.

---

## Conclusion

Moving my personal website from NextJS to Astro wasn't just a change in toolchain, it was a shift in philosophy. 

I no longer have to pay a steep client-side performance penalty for the luxury of a modern, component-driven DX. I don't have to worry about complex server-component vulnerabilities. And I still get to keep the design I like. 

With Starwind UI bridging the gap to the modern component-based workflow of shadcn, and Cloudflare Workers hosting the infrastructure on-demand at the edge, Astro has proven to be an exceptionally elegant, blazing-fast, and refreshing alternative. I've built something that is easier to maintain, faster to load, and perfectly optimized for both humans and agents.

Sometimes, the best way forward is simply returning to the basics.
