import { SEO_CONFIG } from "@/lib/seo";

export const SITE_ORIGIN = SEO_CONFIG.url;

export const HOMEPAGE_DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</api/health>; rel="status"; type="application/health+json"',
  '</.well-known/oauth-protected-resource>; rel="https://www.rfc-editor.org/rfc/rfc9728"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/relations/skills"; type="application/json"',
  '</feed.xml>; rel="alternate"; type="application/rss+xml"',
  '</blog>; rel="collection"',
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export function addHomepageDiscoveryHeaders(
  requestUrl: URL,
  headers: Headers
): void {
  if (requestUrl.pathname === "/" || requestUrl.pathname === "/index.html") {
    headers.set("Link", HOMEPAGE_DISCOVERY_LINKS.join(", "));
  }
}

export function addVaryHeader(headers: Headers, value: string): void {
  const vary = headers.get("Vary");
  if (!vary) {
    headers.set("Vary", value);
    return;
  }

  const fields = vary.split(",").map((field) => field.trim());
  if (fields.includes("*")) {
    return;
  }

  if (!fields.some((field) => field.toLowerCase() === value.toLowerCase())) {
    headers.set("Vary", [...fields, value].join(", "));
  }
}
