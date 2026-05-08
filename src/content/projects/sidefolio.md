---
title: "Sidefolio"
description: "Portfolio and blog in a Vercel-inspired shell, focused on how I actually build things."
publishedAt: 2026-05-08
technologies: ["NextJS", "Typescript", "Tailwind CSS", "MDX", "shadcn/ui", "Motion", "Vercel"]
repoUrl: "https://github.com/michxymi/michxymi.com"
---

## Overview

This is my home on the internet: portfolio, blog, and mildly opinionated playground for how I like to build things.

It uses a "sidefolio" layout with a persistent sidebar, so you always know where you are and what else you could be clicking instead of reading this sentence. The layout idea came from [Aceternity UI's sidefolio template](https://pro.aceternity.com/products/sidefolio-portfolio-template), though I've taken it in my own direction from there.

The whole thing is built to stay out of the way and make the content and structure do the talking.

## Key Features

### Now Page

The Now page – inspired by [nownownow.com](https://nownownow.com/about) – is a snapshot of what I'm using, consuming, and building at any given moment.

It shows my current tools (editor, terminal, notes app), what I'm reading or listening to, and a GitHub contribution chart so you can see whether I've been shipping or just thinking about shipping.

Recent blog posts round it out, giving you a quick entry point if you're curious what's been on my mind lately.

### Work Experience Timeline

The About page includes an interactive timeline that shows where I've worked, what I did, and when I stopped pretending it was temporary.

Logos adapt to dark mode so they don't look like stickers from three different websites, roles expand into more detail when you actually care, and current roles get a pulsing marker so you don't have to scan dates.

Ongoing positions use an infinity symbol instead of fake end dates, because nobody believes "2025 – Present" is permanent.

### Skills Grid

Skills are grouped into sensible buckets: languages, frontend and desktop, backend, DevOps and tooling.

It’s meant to show what I reach for in real projects, not a bingo card of every framework I’ve seen once.

If it’s listed there, I’ve used it enough to have opinions about it.

## Design Philosophy

The design is intentionally minimal: strong typography, calm layout, and a theme switch that doesn’t explode the rest of the page.

A lot of the visual decisions borrow from Vercel’s product aesthetic – clean surfaces, monochrome base, and small accents instead of shouting at you with gradients.

JetBrains Mono handles headings and code, Inter covers the body copy, and together they give the site that “developer who cares but not too much” feel.

The goal is to look considered without needing a design system committee meeting to change a button.

## Technical Highlights

### Content Management

All posts and projects live in [MDX](https://mdxjs.com/), so I get Markdown for writing and React components when I need something smarter than text.

Schemas are defined with [Zod](https://zod.dev/) and used to validate content at build time, which means the site fails loudly if I mess up frontmatter instead of shipping silent bugs.

This keeps the content model honest and the Typescript types in sync with reality.

### Component Architecture

The UI is built on [shadcn/ui](https://ui.shadcn.com/) components, so accessibility and behavior are handled in a consistent way.

I also pulled several components from [chanhdai.com/components](https://chanhdai.com/components) – specifically the work experience timeline, theme switcher, and flip sentences – and drew overall inspiration from the website's polished aesthetics.

From there, I customize styling with Tailwind instead of inventing a new design language every time I add a component.

It gives me a reusable set of building blocks that feel like a product, not a one-off demo.

### Performance

The site runs on the [NextJS](https://nextjs.org/) App Router with a bias toward static generation wherever it makes sense.

Fonts are loaded through next/font to avoid layout shifts, and SVG logos handle dark mode through CSS instead of duplicate assets.

Most pages resolve to simple, cacheable output, which keeps things fast without turning the codebase into a performance art piece.

### Animations

Animations are handled with [Motion](https://motion.dev/) and kept subtle on purpose.

The theme switcher, collapsible sections, and a few interface transitions use small hints of movement. They automatically back off if the user prefers reduced motion.

The point is to make the interface feel considered, not like a promo page for a new phone.

## What I Learned

Building this site forced me to design a content structure that can grow without becoming a pile of one-off pages.

I wired MDX into a type-safe pipeline with Zod so the content model, types, and UI are all tied together instead of drifting apart over time.

I also refined a Tailwind-based design system, built theme-aware components that behave properly in both light and dark mode, and sharpened how I present my experience to people who care about both code and how it ships.
