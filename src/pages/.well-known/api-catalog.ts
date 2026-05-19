import type { APIRoute } from "astro";

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.href ?? "https://michxymi.com";

  const catalog = {
    linkset: [
      {
        anchor: baseUrl.replace(TRAILING_SLASH_RE, ""),
        "service-desc": [
          {
            href: new URL("/openapi.json", baseUrl).href,
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [
          {
            href: baseUrl,
            type: "text/html",
          },
        ],
        status: [
          {
            href: new URL("/api/health", baseUrl).href,
            type: "application/health+json",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
    },
  });
};
