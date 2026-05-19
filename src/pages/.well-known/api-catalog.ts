import type { APIRoute } from "astro";
import { absoluteUrl } from "@/lib/agent-discovery";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const origin = url.origin;
  const catalog = {
    linkset: [
      {
        anchor: absoluteUrl("/api/health", origin),
        "service-desc": [
          {
            href: absoluteUrl("/openapi.json", origin),
            type: "application/vnd.oai.openapi+json",
          },
        ],
        status: [
          {
            href: absoluteUrl("/api/health", origin),
            type: "application/health+json",
          },
        ],
        "service-doc": [
          {
            href: origin,
            type: "text/html",
          },
        ],
        "service-meta": [
          {
            href: absoluteUrl("/.well-known/oauth-protected-resource", origin),
            type: "application/json",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      Link: '<https://www.rfc-editor.org/info/rfc9727>; rel="profile"',
    },
  });
};
