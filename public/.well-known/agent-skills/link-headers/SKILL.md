# Link Headers for Agent Discovery

This site publishes Link response headers (RFC 8288) on the homepage to help AI agents discover useful resources. The following link relations are advertised:

- `alternate` — RSS feed at `/feed.xml`
- `collection` — Blog collection at `/blog`
- `api-catalog` — API catalog at `/.well-known/api-catalog`
- `openid-configuration` — OpenID Connect discovery at `/.well-known/openid-configuration`
- `oauth-authorization-server` — OAuth 2.0 metadata at `/.well-known/oauth-authorization-server`
- `oauth-protected-resource` — OAuth protected resource metadata at `/.well-known/oauth-protected-resource`
- `mcp-server-card` — MCP server card at `/.well-known/mcp/server-card.json`
- `agent-skills` — Agent skills index at `/.well-known/agent-skills/index.json`

## Implementation

Link headers are set in `src/pages/index.astro` using `Astro.response.headers.set("Link", ...)`.

## Reference

- [RFC 8288: Web Linking](https://www.rfc-editor.org/rfc/rfc8288)
- [IANA Link Relations](https://www.iana.org/assignments/link-relations/link-relations.xhtml)
