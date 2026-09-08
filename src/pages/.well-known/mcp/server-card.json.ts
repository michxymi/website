import type { APIRoute } from "astro";

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href ?? "https://michxymi.com").replace(
    TRAILING_SLASH_RE,
    ""
  );

  const serverCard = {
    _meta: {
      "com.michxymi": {
        contact: {
          email: "michael@xymitoulias.com",
        },
      },
    },
    $schema:
      "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    description: "Personal website of Michael Xymitoulias",
    name: "com.michxymi/website",
    remotes: [
      {
        supportedProtocolVersions: ["2025-03-12"],
        type: "streamable-http",
        url: baseUrl,
      },
    ],
    repository: {
      source: "github",
      url: "https://github.com/michxymi/website",
    },
    title: "MichXymi Website",
    version: "0.0.1",
    websiteUrl: baseUrl,
  };

  return new Response(JSON.stringify(serverCard, null, 2), {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
