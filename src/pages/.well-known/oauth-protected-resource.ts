import type { APIRoute } from "astro";

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href ?? "https://michxymi.com").replace(
    TRAILING_SLASH_RE,
    ""
  );

  const metadata = {
    resource: baseUrl,
    authorization_servers: [
      `${baseUrl}/.well-known/oauth-authorization-server`,
      `${baseUrl}/.well-known/openid-configuration`,
    ],
    scopes_supported: ["openid", "profile", "email", "api:read"],
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
