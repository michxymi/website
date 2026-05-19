import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "michxymi.com API",
      version: "1.0.0",
      description: "Personal website of Michael Xymitoulias",
    },
    servers: [{ url: "https://michxymi.com" }],
    paths: {
      "/api/health": {
        get: {
          summary: "Health check",
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/health+json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/oauth-authorization-server": {
        get: {
          summary: "OAuth 2.0 Authorization Server Metadata",
          operationId: "oauthAuthorizationServer",
          externalDocs: {
            url: "https://www.rfc-editor.org/rfc/rfc8414",
          },
          responses: {
            "200": {
              description: "OAuth 2.0 Authorization Server metadata",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      issuer: { type: "string" },
                      authorization_endpoint: { type: "string" },
                      token_endpoint: { type: "string" },
                      jwks_uri: { type: "string" },
                      grant_types_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/oauth-protected-resource": {
        get: {
          summary: "OAuth 2.0 Protected Resource Metadata",
          operationId: "oauthProtectedResource",
          externalDocs: {
            url: "https://www.rfc-editor.org/rfc/rfc9728",
          },
          responses: {
            "200": {
              description: "OAuth 2.0 protected resource metadata",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: [
                      "resource",
                      "authorization_servers",
                      "scopes_supported",
                    ],
                    properties: {
                      resource: { type: "string" },
                      authorization_servers: {
                        type: "array",
                        items: { type: "string" },
                      },
                      scopes_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/openid-configuration": {
        get: {
          summary: "OpenID Connect Discovery Metadata",
          operationId: "openidConfiguration",
          externalDocs: {
            url: "http://openid.net/specs/openid-connect-discovery-1_0.html",
          },
          responses: {
            "200": {
              description: "OpenID Connect discovery metadata",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      issuer: { type: "string" },
                      authorization_endpoint: { type: "string" },
                      token_endpoint: { type: "string" },
                      userinfo_endpoint: { type: "string" },
                      jwks_uri: { type: "string" },
                      scopes_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                      response_types_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                      grant_types_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                      subject_types_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                      id_token_signing_alg_values_supported: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          summary: "API Catalog",
          operationId: "getApiCatalog",
          responses: {
            "200": {
              description: "API catalog in linkset format",
              content: {
                "application/linkset+json": {
                  schema: {
                    type: "object",
                    properties: {
                      linkset: { type: "array" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/mcp/server-card.json": {
        get: {
          summary: "MCP Server Card",
          operationId: "getMcpServerCard",
          externalDocs: {
            url: "https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127",
          },
          responses: {
            "200": {
              description: "MCP Server Card for agent discovery",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      $schema: { type: "string" },
                      name: { type: "string" },
                      version: { type: "string" },
                      description: { type: "string" },
                      title: { type: "string" },
                      websiteUrl: { type: "string" },
                      repository: { type: "object" },
                      remotes: { type: "array" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.oai.openapi+json",
    },
  });
};
