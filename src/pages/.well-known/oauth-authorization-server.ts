import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const baseUrl = url.origin;
  const metadata = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/auth/authorize`,
    token_endpoint: `${baseUrl}/auth/token`,
    jwks_uri: `${baseUrl}/auth/jwks`,
    registration_endpoint: `${baseUrl}/auth/register`,
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "none",
    ],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: ["openid", "profile", "email", "api:read"],
    claims_supported: ["sub", "name", "email", "picture"],
    service_documentation: `${baseUrl}/docs`,
    ui_locales_supported: ["en"],
    op_policy_uri: `${baseUrl}/.well-known/oauth-authorization-server`,
    op_tos_uri: `${baseUrl}`,
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
