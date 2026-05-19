# OAuth Protected Resource Metadata (RFC 9728)

This site publishes OAuth Protected Resource Metadata at `/.well-known/oauth-protected-resource` describing how AI agents can obtain access tokens for protected APIs.

## Metadata

- `resource` — The resource server identifier
- `authorization_servers` — List of OAuth/OIDC issuer URLs that can issue tokens
- `scopes_supported` — Supported OAuth scopes

## Implementation

Served by `src/pages/.well-known/oauth-protected-resource.ts` as a dynamic Astro endpoint returning `application/json`.

## Reference

- [RFC 9728: OAuth 2.0 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728)
