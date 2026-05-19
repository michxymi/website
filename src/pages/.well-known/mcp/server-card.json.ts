import type { APIRoute } from "astro";

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href ?? "https://michxymi.com").replace(
    TRAILING_SLASH_RE,
    ""
  );

  const serverCard = {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: "com.michxymi/website",
    version: "0.0.1",
    description: "Personal website of Michael Xymitoulias",
    title: "MichXymi Website",
    websiteUrl: baseUrl,
    repository: {
      url: "https://github.com/michxymi/website",
      source: "github",
    },
    remotes: [
      {
        type: "streamable-http",
        url: baseUrl,
        supportedProtocolVersions: ["2025-03-12"],
      },
    ],
    _meta: {
      "com.michxymi": {
        contact: {
          email: "michael@xymitoulias.com",
        },
      },
    },
  };

  return new Response(JSON.stringify(serverCard, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
