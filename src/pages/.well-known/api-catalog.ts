import type { APIRoute } from "astro";
import { absoluteUrl, SITE_ORIGIN } from "@/lib/agent-discovery";

export const GET: APIRoute = () => {
  const catalog = {
    linkset: [
      {
        anchor: absoluteUrl("/api/health"),
        "service-desc": [
          {
            href: absoluteUrl("/openapi.json"),
            type: "application/vnd.oai.openapi+json",
          },
        ],
        status: [
          {
            href: absoluteUrl("/api/health"),
            type: "application/health+json",
          },
        ],
        "service-doc": [
          {
            href: SITE_ORIGIN,
            type: "text/html",
          },
        ],
        "service-meta": [
          {
            href: absoluteUrl("/.well-known/oauth-protected-resource"),
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
