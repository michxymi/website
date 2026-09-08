import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const baseUrl = url.origin;
  const metadata = {
    authorization_endpoint: `${baseUrl}/auth/authorize`,
    claims_supported: ["sub", "name", "email", "picture"],
    code_challenge_methods_supported: ["S256"],
    grant_types_supported: ["authorization_code", "client_credentials"],
    id_token_signing_alg_values_supported: ["RS256"],
    issuer: baseUrl,
    jwks_uri: `${baseUrl}/auth/jwks`,
    op_policy_uri: `${baseUrl}/.well-known/openid-configuration`,
    op_tos_uri: `${baseUrl}`,
    registration_endpoint: `${baseUrl}/auth/register`,
    response_types_supported: ["code"],
    scopes_supported: ["openid", "profile", "email", "api:read"],
    service_documentation: `${baseUrl}/docs`,
    subject_types_supported: ["public"],
    token_endpoint: `${baseUrl}/auth/token`,
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "none",
    ],
    ui_locales_supported: ["en"],
    userinfo_endpoint: `${baseUrl}/auth/userinfo`,
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
