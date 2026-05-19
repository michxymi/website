# OAuth/OIDC Discovery Metadata

This site publishes both OpenID Connect discovery metadata and OAuth 2.0 Authorization Server metadata so AI agents can programmatically discover how to authenticate with protected APIs.

## Endpoints

- `/.well-known/openid-configuration` — OpenID Connect discovery (issuer, authorization/token/userinfo endpoints, JWKS URI, supported scopes/grants)
- `/.well-known/oauth-authorization-server` — OAuth 2.0 Authorization Server metadata (issuer, endpoints, supported grants)

## Implementation

Served by:
- `src/pages/.well-known/openid-configuration.ts`
- `src/pages/.well-known/oauth-authorization-server.ts`

## Reference

- [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 8414: OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414)
