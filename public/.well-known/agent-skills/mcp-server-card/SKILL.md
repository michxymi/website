# MCP Server Card (SEP-1649)

This site publishes an MCP (Model Context Protocol) Server Card at `/.well-known/mcp/server-card.json` enabling AI agents to discover server capabilities.

## Card Contents

- `name` — Server identifier (`com.michxymi/website`)
- `version` — Server version
- `websiteUrl` — Site URL
- `repository` — Source code repository
- `remotes` — Available transport endpoints with supported protocol versions

## Implementation

Served by `src/pages/.well-known/mcp/server-card.json.ts` as a dynamic Astro endpoint.

## Reference

- [MCP Server Card (PR #2127)](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
