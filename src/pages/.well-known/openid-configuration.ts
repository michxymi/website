import type { APIRoute } from "astro";

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href ?? "https://michxymi.com").replace(
    TRAILING_SLASH_RE,
    ""
  );

  const metadata = {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/auth/authorize`,
    token_endpoint: `${baseUrl}/auth/token`,
    userinfo_endpoint: `${baseUrl}/auth/userinfo`,
    jwks_uri: `${baseUrl}/auth/jwks`,
    registration_endpoint: `${baseUrl}/auth/register`,
    scopes_supported: ["openid", "profile", "email", "api:read"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "client_credentials"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "none",
    ],
    claims_supported: ["sub", "name", "email", "picture"],
    code_challenge_methods_supported: ["S256"],
    ui_locales_supported: ["en"],
    service_documentation: `${baseUrl}/docs`,
    op_policy_uri: `${baseUrl}/.well-known/openid-configuration`,
    op_tos_uri: `${baseUrl}`,
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
