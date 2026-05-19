import type { APIRoute } from "astro";
import { absoluteUrl, SITE_ORIGIN } from "@/lib/agent-discovery";
import { SEO_CONFIG } from "@/lib/seo";

export const GET: APIRoute = () => {
  const metadata = {
    resource: SITE_ORIGIN,
    authorization_servers: [SITE_ORIGIN],
    scopes_supported: ["site:read"],
    bearer_methods_supported: ["header"],
    resource_name: `${SEO_CONFIG.name} Website API`,
    resource_documentation: absoluteUrl("/openapi.json"),
    resource_policy_uri: absoluteUrl("/privacy-policy"),
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
