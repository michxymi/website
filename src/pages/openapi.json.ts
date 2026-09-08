import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const spec = {
    info: {
      description: "Personal website of Michael Xymitoulias",
      title: "michxymi.com API",
      version: "1.0.0",
    },
    openapi: "3.1.0",
    paths: {
      "/.well-known/api-catalog": {
        get: {
          operationId: "getApiCatalog",
          responses: {
            "200": {
              content: {
                "application/linkset+json": {
                  schema: {
                    properties: {
                      linkset: { type: "array" },
                    },
                    type: "object",
                  },
                },
              },
              description: "API catalog in linkset format",
            },
          },
          summary: "API Catalog",
        },
      },
      "/.well-known/mcp/server-card.json": {
        get: {
          externalDocs: {
            url: "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127",
          },
          operationId: "getMcpServerCard",
          responses: {
            "200": {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      $schema: { type: "string" },
                      description: { type: "string" },
                      name: { type: "string" },
                      remotes: { type: "array" },
                      repository: { type: "object" },
                      title: { type: "string" },
                      version: { type: "string" },
                      websiteUrl: { type: "string" },
                    },
                    type: "object",
                  },
                },
              },
              description: "MCP Server Card for agent discovery",
            },
          },
          summary: "MCP Server Card",
        },
      },
      "/.well-known/oauth-authorization-server": {
        get: {
          externalDocs: {
            url: "https://www.rfc-editor.org/rfc/rfc8414",
          },
          operationId: "oauthAuthorizationServer",
          responses: {
            "200": {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      authorization_endpoint: { type: "string" },
                      grant_types_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      issuer: { type: "string" },
                      jwks_uri: { type: "string" },
                      token_endpoint: { type: "string" },
                    },
                    type: "object",
                  },
                },
              },
              description: "OAuth 2.0 Authorization Server metadata",
            },
          },
          summary: "OAuth 2.0 Authorization Server Metadata",
        },
      },
      "/.well-known/oauth-protected-resource": {
        get: {
          externalDocs: {
            url: "https://www.rfc-editor.org/rfc/rfc9728",
          },
          operationId: "oauthProtectedResource",
          responses: {
            "200": {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      authorization_servers: {
                        items: { type: "string" },
                        type: "array",
                      },
                      resource: { type: "string" },
                      scopes_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                    },
                    required: [
                      "resource",
                      "authorization_servers",
                      "scopes_supported",
                    ],
                    type: "object",
                  },
                },
              },
              description: "OAuth 2.0 protected resource metadata",
            },
          },
          summary: "OAuth 2.0 Protected Resource Metadata",
        },
      },
      "/.well-known/openid-configuration": {
        get: {
          externalDocs: {
            url: "http://openid.net/specs/openid-connect-discovery-1_0.html",
          },
          operationId: "openidConfiguration",
          responses: {
            "200": {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      authorization_endpoint: { type: "string" },
                      grant_types_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      id_token_signing_alg_values_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      issuer: { type: "string" },
                      jwks_uri: { type: "string" },
                      response_types_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      scopes_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      subject_types_supported: {
                        items: { type: "string" },
                        type: "array",
                      },
                      token_endpoint: { type: "string" },
                      userinfo_endpoint: { type: "string" },
                    },
                    type: "object",
                  },
                },
              },
              description: "OpenID Connect discovery metadata",
            },
          },
          summary: "OpenID Connect Discovery Metadata",
        },
      },
      "/api/health": {
        get: {
          operationId: "healthCheck",
          responses: {
            "200": {
              content: {
                "application/health+json": {
                  schema: {
                    properties: {
                      status: { example: "ok", type: "string" },
                    },
                    type: "object",
                  },
                },
              },
              description: "OK",
            },
          },
          summary: "Health check",
        },
      },
    },
    servers: [{ url: "https://michxymi.com" }],
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/vnd.oai.openapi+json",
    },
    status: 200,
  });
};
