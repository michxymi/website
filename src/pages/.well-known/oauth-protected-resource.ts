import type { APIRoute } from "astro";
import { absoluteUrl } from "@/lib/agent-discovery";
import { SEO_CONFIG } from "@/lib/seo";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const origin = url.origin;
  const metadata = {
    resource: origin,
    authorization_servers: [origin],
    scopes_supported: ["site:read"],
    bearer_methods_supported: ["header"],
    resource_name: `${SEO_CONFIG.name} Website API`,
    resource_documentation: absoluteUrl("/openapi.json", origin),
    resource_policy_uri: absoluteUrl("/privacy-policy", origin),
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
