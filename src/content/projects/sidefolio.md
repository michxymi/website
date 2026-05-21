---
title: "Sidefolio"
description: "Portfolio and blog in a side-navigation layout, focused on how I actually build things."
technologies: ["AstroJS", "Typescript", "Tailwind CSS", "Starwind UI", "Cloudflare"]
repoUrl: "https://github.com/michxymi/michxymi.com"
---

## Overview

This is my home on the internet: portfolio, blog, and mildly opinionated playground for how I like to build things.

It uses a "sidefolio" layout with a persistent sidebar, so you always know where you are and what else you could be clicking instead of reading this sentence. The layout idea came from [Aceternity UI's sidefolio template](https://pro.aceternity.com/products/sidefolio-portfolio-template), though I've taken it in my own direction from there.

The whole thing is built to stay out of the way and make the content and structure do the talking.

## Highlights

### Now Page

The [Now](/now) page – inspired by [nownownow.com](https://nownownow.com/about) – is a snapshot of what I'm using, consuming, and building at any given moment.

It shows the current tools I use and a GitHub contribution chart so you can see whether I've been shipping or just thinking about shipping.

Recent blog posts round it out, giving you a quick entry point if you're curious what's been on my mind lately.

### Work Experience Timeline

The [About](/) page includes an interactive timeline that shows where I've worked, what I did, and when I stopped pretending it was temporary.

It's the astro version of [chanhdai's](https://chanhdai.com/) work-experience component, minus react and motion.

Logos adapt to dark mode so they don't look like stickers from three different websites, roles expand into more detail when you actually care, and current roles get a pulsing marker so you don't have to scan dates.

Ongoing positions use an infinity symbol instead of fake end dates, because nobody believes "2025 – Present" is permanent.

### Skills Grid

Skills are grouped into sensible buckets: languages, frontend and desktop, backend, DevOps and tooling.

It’s meant to show what I reach for in real projects, not a bingo card of every framework I’ve seen once.

If it’s listed there, I’ve used it enough to have opinions about it.

### AI Ready

This site is fully optimized for LLMs, AI agents, and web crawlers, scoring a perfect 100% on [Is It Agent Ready?](https://isitagentready.com/www.michxymi.com). 

We've moved past simple responsive design—now we design for both human eyes and machine eyes. It features machine-readable `Link` headers, an OpenAPI specification, explicit OAuth resources/discovery, and automated API Catalogs in `.well-known` endpoints. If an agent wanders onto this site, it doesn't have to scrape messy DOM tree structures; it automatically knows exactly how to query content, discover skills, and check system health.

## Design Philosophy

The design is intentionally minimal: strong typography, calm layout, and a theme switch that doesn’t explode the rest of the page.

A lot of the visual decisions borrow from Vercel’s product aesthetic – clean surfaces, monochrome base, and small accents instead of shouting at you with gradients.

JetBrains Mono handles headings and code, IBM Plex Sans covers the body copy, and together they give the site that “developer who cares but not too much” feel.

The goal is to look considered without needing a design system committee meeting to change a button.

## Technical Highlights

### Content Management

All posts and projects live in standard Markdown, structured via Astro’s Content Collections.

Schemas are defined with [Zod](https://zod.dev/) and used to validate content at compile time, which means the site fails loudly if I mess up frontmatter instead of shipping silent bugs.

This keeps the content model honest and the TypeScript types automatically generated in sync with what actually exists.

### Component Architecture

The UI is built on [Starwind UI](https://starwind.dev/) components, a tailwind-powered component system for Astro that handles accessibility and basic patterns, giving me shadcn-style ergonomics without the React overhead.

From there, I customize styling with Tailwind CSS v4's unified utility setup instead of inventing a new design language every time I add a component.

It gives me a reusable set of building blocks that feel like a product, not a one-off demo.

### Performance

The site runs on Astro with an SSR-first architecture, deployed entirely to Cloudflare's edge network using Wrangler.

Fonts are optimized and served directly via `@fontsource` to eliminate layout shift, and SVG logos handle dark mode directly through CSS instead of duplicating assets.

By leveraging Astro's zero-JS-by-default philosophy combined with Cloudflare's edge compute, pages load virtually instantly without turning the codebase into a performance art piece.

### Animations

Animations and transitions are kept subtle on purpose, styled directly through Tailwind CSS v4 and enhanced by `tw-animate-css`.

The theme switcher, sidebar toggles, and collapsing accordion areas leverage slight CSS transitions and keyframe animations that stay out of the way. All of these automatically respect system preferences and back off if the user prefers reduced motion.

To tie the persistent sidebar layout together on page migrations, I've incorporated Astro's native [ClientRouter](https://docs.astro.build/en/guides/view-transitions/) (originally known as View Transitions). This lets us transition cleanly between different workspace paths without a disruptive full-page repaint, preserving state and mimicking single-page app continuity on top of a static-first core.

The point is to make the interface feel considered, not like a promo page for a new phone.

## What I Learned

Building this site forced me to adopt an architecture that delivers extreme performance without losing developer ergonomics.

Moving to Astro and Cloudflare helped me strip out tons of client-side JavaScript, while Starwind UI provided the right level of structure to construct a responsive side-navigation dashboard.

I also wired up compile-time schema validation with Zod, refined a Tailwind v4-based look-and-feel, and built theme-aware Astro components that respect system preferences while behaving properly across server and client boundaries.
