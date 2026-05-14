import { SOCIAL_LINKS } from "@/lib/social-links";

export const SITE_CONFIG = {
  name: "Michael Xymitoulias",
  description:
    "Michael Xymitoulias is a software engineer and engineering manager focused on developer tools, technical leadership, React, TypeScript, and software teams.",
  url: "https://michxymi.com",
  author: {
    name: "Michael Xymitoulias",
    twitter: "@michxymi",
    jobTitle: "Full Stack Software Engineer and Engineering Manager",
    worksFor: "Oxford Nanopore Technologies",
  },
  locale: "en_GB",
  ogImage: "/opengraph-image",
} as const;

const socialProfileUrls = SOCIAL_LINKS.map((link) => link.url);

export const SEO_CONFIG = {
  ...SITE_CONFIG,
  socialProfileUrls,
} as const;
